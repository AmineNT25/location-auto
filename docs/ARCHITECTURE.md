# Architecture

## Applications and boundaries

```text
frontend/  Next.js customer website (existing demo, independent)
    | future HTTPS requests
    v
backend/   FastAPI /api/v1 -> services (future) -> SQLAlchemy -> PostgreSQL
    ^
    | two fixed health requests now; authenticated API requests later
desktop/   Electron main <- validated IPC <- isolated React renderer

compose.yaml  local PostgreSQL 17 and a persistent named volume
docs/         requirements, architecture, roadmap and handoff
```

The website is not embedded in Electron. There is no root JavaScript workspace migration;
each independently runnable JS application uses npm and its own `package-lock.json`.
The user's pre-existing frontend dependency changes remain intact. Desktop dependencies
are independently installed in `desktop/`. Python dependencies use `pyproject.toml` and
an exact development snapshot in `backend/requirements-dev.lock`.

## Desktop security and runtime

- `electron/main.cts` owns the window, backend configuration and health requests.
- `electron/preload.cts` exposes only `window.drivego.getSystemStatus()` through
  `contextBridge`. It exposes no generic IPC, fetch, filesystem, shell or SQL capability.
- The only IPC handler rejects arguments, foreign webContents, subframes and unexpected
  renderer URLs. Concurrent status calls share one in-flight probe pair.
- BrowserWindow uses `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`,
  `webSecurity: true` and no webviews. Permissions are denied. Navigations, redirects,
  attached webviews and new windows are blocked; untrusted links do not open a browser.
- Development loads the exact loopback Vite URL. Packaged builds load `dist/index.html`
  through `file://` with relative assets. Main/preload are compiled CommonJS `.cjs` files;
  the sandboxed preload has no runtime local imports.
- Development CSP allows the inline React refresh preamble and loopback Vite WebSocket.
  Build-time HTML transformation removes inline allowances and sets `connect-src 'none'`.
  A packaged response-header policy also applies where supported. Bundled external scripts
  and styles remain self-only. No remote fonts, scripts or business network requests load
  in the renderer. A custom application protocol can replace `file://` in a later release.
- HTTP health requests run in main, have five-second timeouts, reject redirects and validate
  the expected JSON response. Only connection states and a timestamp reach the renderer.
- Main reads `DRIVEGO_API_BASE_URL` or `userData/config.json`; URLs contain no credentials
  and remote backends require HTTPS. Development `.env` is never packaged. There is no
  database client or secret in the renderer. Future tokens need OS-protected storage and
  backend authorization; the current health bridge is not an authentication mechanism.

The app polls every 15 seconds, avoids overlapping renderer polls, cancels state updates
after unmount and reports bridge failures separately. No business metrics are fabricated.
The NSIS configuration packages only the desktop. Signing, updates and installer rollout
remain release tasks; the backend/database must run separately.

## Backend lifecycle

`app/core/config.py` validates settings from environment and `backend/.env`. Database
URLs use `SecretStr` and validation errors hide input values. The SQLAlchemy engine is
created without connecting. Request sessions use a context manager, roll back unfinished
transactions on close and return pooled connections. Lifespan shutdown disposes the engine.

`GET /api/v1/health` is liveness only. `GET /api/v1/health/ready` performs `SELECT 1`,
returns a typed success or 503 response, and suppresses database exception details.
Connection, pool and statement timeouts bound normal database waits. Liveness does not
check schema revision or create tables. Alembic owns schema changes; startup never calls
`create_all`. The initial migration is intentionally empty except for migration history.

CORS explicitly permits `http://127.0.0.1:5173` and `http://localhost:5173` in development.
The desktop's main-process requests do not depend on browser CORS. `null`/file origins and
wildcards are rejected. Production requires an explicit HTTPS origin list or `[]` for a
desktop-only service. Add the customer site's precise origin when API integration begins.
CORS is not authorization. The unauthenticated foundation exposes health endpoints only.

## Local data and future transaction design

Compose pins PostgreSQL major 17, binds port 5432 to loopback, uses environment credentials,
checks server readiness and stores data in `postgres_data`. No database is created remotely.
Production provisioning, TLS database access, least-privilege application/migration roles,
backups and restore drills remain later work.

Before reservation code, choose one authoritative occupancy representation spanning booked,
active, maintenance, blocked and preparation intervals. Evaluate PostgreSQL range/exclusion
constraints (with appropriate status predicates and `btree_gist`) or an equivalent serialized
per-car transaction design. A transaction must lock/check/confirm atomically and handle
constraint conflicts as explicit API conflicts. Test two concurrent confirmations, extensions,
overdue active rentals and adjacent periods against PostgreSQL. Do not rely on application
checks alone. Business decisions in REQUIREMENTS.md remain unresolved.

Signed contracts need immutable snapshots. Financial records need explicit currency and
decimal/minor-unit arithmetic. Public images and private client/dispute documents need
separate storage access paths, authorization and retention rules. These are design requirements,
not modules implemented by this foundation.

## Reference guidance

- [Electron security](https://www.electronjs.org/docs/latest/tutorial/security)
- [Vite guide](https://vite.dev/guide/)
- [PostgreSQL version policy](https://www.postgresql.org/support/versioning/)
- [FastAPI database dependencies](https://fastapi.tiangolo.com/tutorial/sql-databases/)
