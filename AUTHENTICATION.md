# FixMate Authentication

## Authentication stack

- BetterAuth powers the app-wide session management and email/password flows.
- MongoDB is the default production data store when `MONGODB_URI` is provided.
- Local development falls back to a SQLite in-memory database so the app can still boot without a running MongoDB instance.

## Role model

The app supports the required roles:

- `customer`
- `technician`
- `admin`

The `user.role` field is added as a BetterAuth user additional field in `src/lib/auth.ts`.

## Secure admin bootstrap

Admin accounts are never created through the public sign-up route. The secure setup path is:

- `POST /api/auth/admin/setup`
- Requires a matching `secret` body value or `x-admin-setup-key` header.
- `ADMIN_SETUP_KEY` must be configured with at least 32 characters; the endpoint returns `503` when it is missing or too short. There is no built-in bootstrap secret.
- Public BetterAuth sign-up accepts only the `customer` and `technician` roles.

## Frontend and backend integration

The frontend uses BetterAuth client helpers from `src/lib/auth-client.ts`:

- `/sign-up` allows customer and technician registration.
- `/sign-in` authenticates existing users.
- `/dashboard` redirects users to the correct role dashboard.
- Dashboard pages and mutation endpoints verify the BetterAuth session and role on the server.

The backend route is exposed through:

- `src/app/api/auth/[...all]/route.ts`

This forwards requests to the BetterAuth Next.js handler, enabling the standard sign-in and sign-up endpoints.

## Environment requirements

Set the following variables in the environment before production use:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-this-with-a-strong-secret
MONGODB_URI=mongodb://localhost:27017/fixmate
ADMIN_SETUP_KEY=replace-this-with-a-secure-bootstrap-secret
```

## Notes

- `customer` and `technician` are public registration flows.
- `admin` creation is intentionally restricted and only available through the secure admin bootstrap endpoint.
- Session-aware navigation and protected dashboards restrict unauthorized access to each user's role-specific workspace.
