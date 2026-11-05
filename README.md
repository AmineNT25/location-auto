# DriveGo / location-auto

An online-first car rental system foundation. The existing customer website is in `frontend/`.
The separate admin app is in `desktop/`; both will eventually use `backend/`.
Only the admin shell and API health checks are implemented in this session.

Read [requirements](docs/REQUIREMENTS.md), [architecture](docs/ARCHITECTURE.md),
[roadmap](docs/ROADMAP.md), and [current handoff](docs/HANDOFF.md) before extending it.

## Prerequisites

- Windows 10/11 for building and testing the Windows installer.
- Node.js 24 LTS and npm (no Yarn/pnpm lockfiles).
- Python 3.13 (the code requires 3.12+; the dependency snapshot is verified on 3.13).
- Docker Desktop with Compose v2, running Linux containers, for local PostgreSQL.
- Internet access for dependency installation and the first Electron packaging run.

Commands below are PowerShell. Use `npm.cmd` to avoid PowerShell script-policy issues.
Python commands use the virtual environment directly; activation is optional.
Do not overwrite existing `.env` files when repeating setup.

## One-time setup

```powershell
Set-Location 'C:\Users\hp\Desktop\Location Auto'
if (!(Test-Path .env)) { Copy-Item .env.example .env }
if (!(Test-Path backend/.env)) { Copy-Item backend/.env.example backend/.env }
if (!(Test-Path desktop/.env)) { Copy-Item desktop/.env.example desktop/.env }

# Edit root .env and backend/.env before starting PostgreSQL.
# Choose local development credentials; keep DATABASE_URL consistent with root .env.
# URL-encode reserved characters in the password portion of DATABASE_URL.
notepad .env
notepad backend/.env

py -3.13 -m venv backend/.venv
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements-dev.lock
backend/.venv/Scripts/python.exe -m pip install --no-deps -e backend

Push-Location desktop
npm.cmd ci
Pop-Location
Push-Location frontend
npm.cmd ci
Pop-Location
```

## Start the database and apply migrations

From the repository root:

```powershell
docker compose up -d --wait postgres
docker compose ps
Push-Location backend
.venv/Scripts/python.exe -m alembic upgrade head
.venv/Scripts/python.exe -m alembic current
Pop-Location
```

The baseline only establishes Alembic revision `0001_foundation`; there are no business
tables yet. Credentials are read from untracked environment files, never from source code.
`docker compose down` stops containers and preserves data. Changing `.env` does not change
credentials inside an existing initialized volume; update that database deliberately.
Do not delete the named volume to fix a connection problem if it contains needed data.

## Start the backend (terminal 1)

```powershell
Set-Location 'C:\Users\hp\Desktop\Location Auto\backend'
.venv/Scripts/python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API loads `backend/.env` regardless of the working directory. Environment variables
override that file. `GET http://127.0.0.1:8000/api/v1/health` returns `{"status":"ok"}`
without a database. `/api/v1/health/ready` returns 200 with database `connected`, or 503
with database `unavailable`. Missing `DATABASE_URL` also means not ready. A liveness
success does not imply that migrations are current. API docs: `http://127.0.0.1:8000/docs`.

## Start the desktop (terminal 2)

```powershell
Set-Location 'C:\Users\hp\Desktop\Location Auto\desktop'
npm.cmd run dev
```

This compiles Electron main/preload, starts Vite at `http://127.0.0.1:5173`, waits for it,
then launches Electron. Main/preload edits require restarting this command; renderer
edits use Vite refresh. Quit Electron or press Ctrl+C to stop the development pair.
The Dashboard polls health every 15 seconds and has a manual connection check. Other
sections explicitly say they are not implemented. Opening Vite in a regular browser
shows a bridge-unavailable message because the privileged API only exists in Electron.

## Start the customer website independently (terminal 3)

```powershell
Set-Location 'C:\Users\hp\Desktop\Location Auto\frontend'
npm.cmd run dev
```

Open `http://localhost:3000`. The customer website still uses its existing demo data,
local favorites and demo-only booking/account flows. It is not connected to the new API.

## Build and package the desktop

```powershell
Set-Location 'C:\Users\hp\Desktop\Location Auto\desktop'
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run pack:win   # Unpacked Windows application under release/win-unpacked/
npm.cmd run dist:win   # NSIS installer under release/
```

The installer contains Electron and the renderer, not Python, PostgreSQL, `.env`, uploads,
or backend secrets. The current installer is unsigned; signing and distribution are later
release work. No deployment or automatic upload/publish is configured.

If Electron's archive downloader times out but the verified runtime is already installed
in `desktop/node_modules/electron/dist`, this command reuses that local distribution:

```powershell
# From desktop/; verified on Windows in this session:
npm.cmd exec electron-builder -- --win nsis --config.electronDist=node_modules/electron/dist
```

See HANDOFF.md for the checksum-verified download workaround used on this machine.

For an installed app, configure a reachable backend before launching. Configuration
precedence: `DRIVEGO_API_BASE_URL` environment variable, then
`%APPDATA%\DriveGo Admin\config.json`, then `http://127.0.0.1:8000`.
The URL must be an HTTPS origin; HTTP is accepted only on loopback for local development.
Usernames, passwords, query strings, fragments, and URL paths are rejected. No secrets
belong in this file. Close the app and reopen after changing configuration.

Example configuration file:

```json
{"backendUrl":"https://api.example.com"}
```

To run the unpacked build against the local backend:

```powershell
Set-Location 'C:\Users\hp\Desktop\Location Auto\desktop'
$env:DRIVEGO_API_BASE_URL = 'http://127.0.0.1:8000'
& '.\release\win-unpacked\DriveGo Admin.exe'
```

## Verification

```powershell
Set-Location 'C:\Users\hp\Desktop\Location Auto'
Push-Location frontend
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
node --experimental-strip-types --test tests/rental.test.mjs
Pop-Location

Push-Location desktop
npm.cmd run build
npm.cmd test
Pop-Location

Push-Location backend
.venv/Scripts/python.exe -m ruff check .
.venv/Scripts/python.exe -m pytest -q
.venv/Scripts/python.exe -m alembic history
.venv/Scripts/python.exe -m alembic upgrade head --sql
# Optional real database check, after PostgreSQL is healthy:
$env:TEST_DATABASE_URL = (Get-Content .env | Where-Object { $_ -match '^DATABASE_URL=' }) -replace '^DATABASE_URL=', ''
.venv/Scripts/python.exe -m pytest -q -m integration
Remove-Item Env:TEST_DATABASE_URL
Pop-Location
```

In PowerShell, inspect `$LASTEXITCODE` after each native command (PowerShell 5 does not
automatically stop a block on a failed executable). Live PostgreSQL tests are skipped
unless `TEST_DATABASE_URL` is supplied; a mock success is not a real database verification.
See the handoff for this session's actual results and limitations.

### Electron integration smoke

With the backend running on port 8000 and Vite running on port 5173, the smoke test launches
and closes its own Electron instance, verifies the real status bridge, navigates every section,
and checks renderer isolation, blocked navigation, and CSP. By default it expects a reachable
backend and unavailable database (the no-database foundation scenario).

```powershell
Set-Location 'C:\Users\hp\Desktop\Location Auto\desktop'
# Terminal A, for the development smoke test only:
npm.cmd exec vite -- --host 127.0.0.1 --port 5173 --strictPort
# Terminal B:
npm.cmd run test:electron
# After npm.cmd run pack:win, no Vite server is needed for the packaged smoke:
$env:DRIVEGO_SMOKE_PACKAGED = '1'
npm.cmd run test:electron
Remove-Item Env:DRIVEGO_SMOKE_PACKAGED
```

Set `DRIVEGO_SMOKE_EXPECT_DATABASE=connected` when testing against healthy PostgreSQL.
Set `DRIVEGO_SMOKE_EXPECT_BACKEND=unavailable` when testing with the backend stopped.
Screenshots are saved in ignored `desktop/test-results/`. These tests do not install the
NSIS installer or provision a database. Electron's first launch may download its runtime;
network failures during that step must be resolved before a window can be tested.
