# Requirements

## Product and session boundary

DriveGo will serve customers through the existing Next.js website and staff through a
separate Electron admin application. Both clients will share a FastAPI API backed by
PostgreSQL. The first release requires a working online connection. Offline storage,
conflict resolution and synchronization are outside the initial scope.

This foundation provides repository structure, an admin shell, API liveness/readiness,
database plumbing, migration tooling, local database configuration and setup guidance.
It does not implement authentication, business CRUD, bookings, uploads, PDFs or finance.
The existing website's appearance and demo behavior must remain unchanged.

## Planned modules

| Module | Intended responsibility |
| --- | --- |
| Fleet | Cars, public car images, category, location, pricing, maintenance and blocks |
| Clients | Contact details and separately protected identity documents |
| Reservations and rentals | Quotes, date availability, confirmation, pickup, extensions, inspections, physical return |
| Contracts | Versioned terms, agreed pricing snapshots, signatures and generated PDFs |
| Disputes | Cases, evidence, resolution and authorized access |
| Finance | Charges, invoices, received payments, deposits, refunds and expenses |
| Staff and audit | Authentication, permission enforcement and accountable change history |
| Settings | Agency configuration and business policies, subject to permissions |

## Business invariants for future implementation

1. Availability depends on reservations, active rentals, maintenance, explicit blocking
   periods and preparation time. Confirmed commitments must include all relevant blockers.
2. Concurrent requests must not create overlapping confirmed bookings for one car.
   A UI availability check alone is insufficient; the database must enforce the invariant
   within the confirmation transaction, including competing edits and extensions.
3. Passing a scheduled return time does not mean a vehicle was physically returned.
   Actual pickup/return events and inspections must be recorded separately. An overdue
   active rental must remain a blocker until staff confirms physical return and preparation.
4. Rental charges, received payments and refundable deposits are separate concepts and
   must have separate records and lifecycle states. A deposit is not rental revenue.
5. Monetary values use fixed-precision decimal amounts or integer minor units with a
   recorded currency. Do not use floating-point values for persisted financial amounts.
6. A signed contract preserves the agreed prices, terms and versions even when the
   vehicle's current price or agency template changes. Amendments require explicit history.
7. Car images and private identity/dispute documents have different access policies.
   Public image delivery must never expose private client files. Private access needs
   server authorization, limited delivery links, retention rules and audit history.
8. The backend remains authoritative. Neither the desktop shell nor website may connect
   directly to PostgreSQL or decide staff permissions by itself.

## Foundation acceptance

- The website remains independently runnable with its existing checks.
- Electron launches separately, uses a sandboxed renderer and narrow typed preload API,
  and displays loading, connected and unavailable states without invented metrics.
- Every navigation item other than Dashboard shows an honest unfinished state.
- Liveness returns 200 without PostgreSQL; readiness checks PostgreSQL and returns 503
  when missing or unavailable. Responses do not expose connection details.
- No real credentials, environments, local uploads or build products are tracked.
- Development setup and packaging commands are documented and reproducible.
- The installer connects to a configured backend without bundling Python or PostgreSQL.

## Decisions required before schema and booking work

- Single agency or multiple tenants/branches; staff access across branches.
- Roles and permissions, first administrator bootstrap, session expiration, MFA, recovery,
  audit retention and deletion permissions.
- Agency timezone, opening hours, booking precision, half-open interval semantics,
  preparation buffers, grace periods, overdue handling and extension conflicts.
- Reservation holds versus confirmations; payment requirements; hold expiry; cancellation,
  no-show, vehicle replacement and partial pickup/return policies.
- Daily/hourly billing, minimum duration, extension/late fees, mileage, fuel, insurance,
  discounts, rounding and tax rules. MAD is shown in the demo but currency policy is undecided.
- Deposit capture/hold/refund rules, payment providers, cash reconciliation and invoice numbering.
- Contract language, signing method, amendments, retention and applicable legal requirements.
- Identity verification, required documents, consent, document retention, access reviews,
  storage provider and disaster recovery.
- Maintenance planning versus emergency blocking, inspection evidence and dispute workflow.

Record decisions before implementing assumptions as permanent schema or financial logic.
