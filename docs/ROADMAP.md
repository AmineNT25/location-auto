# Roadmap

| Phase | Deliverable | Completion gate |
| --- | --- | --- |
| 0 — Foundation (this session) | Independent desktop, health API, DB/migrations setup, docs | Checks and limitations recorded in HANDOFF.md |
| 1 — Schema and authentication | Agreed agency/branch model, initial business schema, staff identity, sessions, permissions, audit foundation | Reversible migrations and real PostgreSQL/auth tests; no default admin password |
| 2 — Fleet and clients | Car records, price policies, maintenance/blocks, client records | Server permissions, validation, pagination; separate public/private storage policy before uploads |
| 3 — Availability and rentals | Availability API, quote/confirmation, pickup, extensions, inspections, physical return | Database-enforced non-overlap; concurrent request tests; explicit overdue and preparation behavior |
| 4 — Contracts and evidence | Versioned contract snapshots, PDFs/signing, private files and disputes | Authorized file access, retention, audit history, agreed signing process |
| 5 — Finance | Charges, invoices, payments, deposits, refunds and expenses | Fixed precision, reconciliation, reversals and permissions tested separately |
| 6 — Customer integration and release | Website uses shared API, deployment operations, signed desktop distribution | Full customer/staff flows, backup restore, monitoring, security review and supported update strategy |

Phases may be split into smaller sessions. Confirm dependencies and business decisions first.
Do not expand phase 0 into business features to make the dashboard appear complete.

## Next session: schema and authentication

1. Read REQUIREMENTS.md and resolve tenant/branch boundaries, roles, identity/session strategy,
   agency timezone, booking states and initial schema scope with the owner.
2. Propose entities, keys, lifecycle states, audit fields, monetary representations and occupancy
   constraints. Keep physical return separate from scheduled dates and finance ledgers separate.
3. Use local PostgreSQL and Alembic for reviewed migrations. Establish least-privilege database
   roles. Test upgrade/downgrade and constraints against PostgreSQL, not only SQLite or mocks.
4. Implement backend authentication and server-side permissions without committed bootstrap
   passwords. Define secure desktop token storage and customer session behavior.
5. Add login/logout and protected desktop navigation only after the backend contract is tested.
6. Update requirements, API docs, setup and handoff with verified results and unresolved decisions.

## Deferred beyond the initial version

Offline mode/synchronization, automatic conflict merging, bundling a database/backend into the
installer, multi-device local replicas and fabricated dashboard analytics. Automatic updates,
code signing, full monitoring, data import/export and backup automation need explicit release work.
