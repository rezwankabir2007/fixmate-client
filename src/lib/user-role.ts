export const userRoles = ["customer", "technician", "admin"] as const;

export type UserRole = (typeof userRoles)[number];

export function isUserRole(value: unknown): value is UserRole {
  return userRoles.some((role) => role === value);
}

export function dashboardPathForRole(role: UserRole) {
  return `/dashboard/${role}`;
}
