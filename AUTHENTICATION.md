# FixMate Authentication

## Source of truth

The app uses one Better Auth instance configured in `fixmate-server/config/auth.js`, backed by the MongoDB adapter and the `fixmate` database selected by `MONGODB_URI`. The browser-only client in `src/lib/auth-client.ts` calls the same-origin API proxy in `src/app/api/[...proxy]/route.ts`; the proxy forwards requests to Express without creating another auth instance.

The API is exposed at `/api/auth/*` by Express and keeps its existing frontend-facing path through the proxy. The auth middleware blocks public admin registration and role changes through profile updates. Dashboard server rendering checks sessions against the Express Better Auth endpoint.

## Roles and registration

The `user.role` additional field supports `customer`, `technician`, and `admin`; new users default to `customer`. Public registration accepts only customer and technician roles. Admin account creation is restricted to the configured admin setup endpoint:

- `POST /api/auth/admin/setup`
- Requires a matching `secret` body value or `x-admin-setup-key` header.
- `ADMIN_SETUP_KEY` must be at least 32 characters. The endpoint returns `503` if it is missing or too short.

Existing MongoDB user records must contain the correct `role` value for role-based dashboard access. Before deployment, migrate any existing users with missing or invalid roles.

## Frontend flows

- `/sign-up` sends the chosen customer or technician role to BetterAuth, validates name and password, and displays registration/session errors.
- `/sign-in` authenticates by email and password, then reads the authenticated session role before routing to the matching dashboard.
- The site header and dashboard use the BetterAuth session for the user's real name, role-specific navigation, and logout.
- Dashboard pages and protected mutation endpoints verify the server-side BetterAuth session and role. Client-supplied role values are never used for authorization.
- Public pages do not require a session. Missing dashboard sessions redirect to `/sign-in`; a user with a different valid role is redirected to their own dashboard.

## Required environment

Configure these values in the Express backend environment:

```text
MONGODB_URI=<MongoDB connection string>
BETTER_AUTH_SECRET=<at least 32 random characters>
ADMIN_SETUP_KEY=<at least 32 random characters>
CLIENT_URL=<frontend origin>
```

Configure this frontend server-side variable to the Express origin:

```text
FIXMATE_API_URL=http://localhost:5000
```

In production, set `FIXMATE_API_URL` to the reachable Express origin and `CLIENT_URL` to the frontend origin. The proxy forwards the frontend host and protocol to Better Auth. Do not expose server secrets through `NEXT_PUBLIC_*` variables.
