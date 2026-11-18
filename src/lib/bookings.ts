export type BookingStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "completed"
  | "cancelled";

export type BookingScope = "customer" | "technician" | "admin";

export type BookingRecord = {
  id: string;
  serviceId: string | null;
  serviceTitle: string;
  serviceCategory: string | null;
  price: number | null;
  technicianId: string | null;
  technicianName: string;
  customerId: string | null;
  customerName: string;
  customerEmail: string;
  scheduledFor: string | null;
  address: string;
  notes: string | null;
  status: BookingStatus;
  createdAt: string | null;
  updatedAt: string | null;
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusBadgeClasses: Record<BookingStatus, string> = {
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  accepted: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  declined: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
  completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  cancelled: "border-border bg-muted/60 text-muted-foreground",
};

export function isBookingStatus(value: unknown): value is BookingStatus {
  return typeof value === "string" && value in bookingStatusLabels;
}

export function bookingStatusBadge(status: BookingStatus): string {
  return statusBadgeClasses[status];
}

export function formatSchedule(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function shortBookingId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export function isActiveBooking(status: BookingStatus): boolean {
  return status === "pending" || status === "accepted";
}
