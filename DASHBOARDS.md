# FixMate Dashboards

## Protected routes

Every dashboard page resolves the BetterAuth session on the server. A missing session is redirected to `/sign-in`; a role mismatch is redirected to that user's role dashboard. Mutation APIs repeat the role/session check and do not accept user or technician ownership IDs from the request body.

| Role | Routes |
| --- | --- |
| Customer | `/dashboard/customer`, `/dashboard/customer/bookings`, `/dashboard/customer/payments` |
| Technician | `/dashboard/technician`, `/dashboard/technician/add-service`, `/dashboard/technician/my-services`, `/dashboard/technician/requests` |
| Admin | `/dashboard/admin`, `/dashboard/admin/users`, `/dashboard/admin/services`, `/dashboard/admin/bookings`, `/dashboard/admin/transactions` |
| Any authenticated role | `/dashboard/profile` |

The shared workspace navigation is role-specific. User profile name changes are submitted to BetterAuth; email and role changes are not enabled.

## Implemented service/account features

- Technicians can submit service listings through `POST /api/technician/services`. The server sets `technicianId` from the session and saves the listing as `pending` and unavailable.
- `/dashboard/technician/my-services` filters MongoDB records by that authenticated `technicianId`.
- Admins can read the BetterAuth `user` collection and review services.
- `PATCH /api/admin/services/[id]` is admin-only and accepts `approved` or `rejected` for pending service records. Approval sets `available: true`; rejection sets it to `false`.
- `PATCH /api/dashboard/profile` updates only the authenticated user's display name through BetterAuth.

Mutation APIs require a same-origin request and validate input server-side. Service review does not accept a replacement owner or arbitrary status.

## Backend-dependent areas

The current project has no booking/request collection, customer booking API, payment provider, or transaction collection. Therefore:

- Customer booking and payment pages show empty table states and identify the missing integration.
- Technician booking requests do not show jobs or expose accept/complete actions.
- Admin booking management and transactions do not show invented totals, records, or refund controls.

To enable those areas, implement the booking and payment data model/provider first. Read operations must always filter customer records by the authenticated customer ID, technician requests by the authenticated technician ID/assignment, and allow unfiltered management access only after an admin role check. No dashboard page currently reads another user's booking/payment data.

## APIs

| Method and path | Access | Behavior |
| --- | --- | --- |
| `POST /api/technician/services` | Technician | Validates and creates a pending, unavailable service owned by the session technician. |
| `PATCH /api/admin/services/[id]` | Admin | Approves or rejects a pending service; approval makes it publicly available. |
| `PATCH /api/dashboard/profile` | Authenticated user | Updates only the current user's name. |

The service catalog endpoints are documented in [SERVICES_API.md](./SERVICES_API.md).
