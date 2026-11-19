export type BookingStatus =
  | "requested"
  | "accepted"
  | "in-progress"
  | "completed"
  | "rejected"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid";

export type BookingScope = "customer" | "technician" | "admin";

// Mirrors the serialized booking shape returned by the Express API
// (fixmate-server/controllers/booking.controller.js).
export type BookingRecord = {
  id: string;
  _id?: string;
  serviceId: string | null;
  serviceTitle: string;
  serviceImage: string;
  category: string | null;
  basePrice: number | null;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string | null;
  problemDescription: string | null;
  status: BookingStatus;
  finalAmount: number | null;
  paymentStatus: PaymentStatus;
  createdAt: string | null;
  updatedAt: string | null;
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  paid: "Paid",
};

const statusBadgeClasses: Record<BookingStatus, string> = {
  requested: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  accepted: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "in-progress": "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  rejected: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
  cancelled: "border-border bg-muted/60 text-muted-foreground",
};

const paymentBadgeClasses: Record<PaymentStatus, string> = {
  unpaid: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  paid: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

export function isBookingStatus(value: unknown): value is BookingStatus {
  return typeof value === "string" && value in bookingStatusLabels;
}

export function isPaymentStatus(value: unknown): value is PaymentStatus {
  return typeof value === "string" && value in paymentStatusLabels;
}

export function bookingStatusBadge(status: BookingStatus): string {
  return statusBadgeClasses[status];
}

export function paymentStatusBadge(status: PaymentStatus): string {
  return paymentBadgeClasses[status];
}

// Statuses that still block a duplicate active request for the same service.
export function isActiveBooking(status: BookingStatus): boolean {
  return status === "requested" || status === "accepted" || status === "in-progress";
}

// "YYYY-MM-DD" stored by the backend → readable local date. Never renders an
// invalid date: missing or malformed values become an em dash.
export function formatPreferredDate(value: string | null): string {
  if (!value) return "—";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { dateStyle: "medium" });
}

// ISO timestamp (booking creation) → readable date only. The assignment
// collects no booking time, so no time is invented for display.
export function formatBookingDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { dateStyle: "medium" });
}

// Project currency convention: whole dollars as "$129", otherwise two
// decimals ("$79.50"). Matches the "$" prefix used across the service pages.
export function formatMoney(amount: number | null): string {
  if (amount === null || !Number.isFinite(amount)) return "—";
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `$${formatted}`;
}

// Final amount is only real after the technician completes the work.
export function formatFinalAmount(finalAmount: number | null): string {
  return finalAmount === null ? "Not finalized" : formatMoney(finalAmount);
}

export function shortBookingId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export function getStatusBadgeClass(status: BookingStatus): string {
  return statusBadgeClasses[status] ?? "border-border bg-muted/60 text-muted-foreground";
}

export function getStatusLabel(status: BookingStatus): string {
  return bookingStatusLabels[status] ?? status;
}

// Allowed status transitions per actor. Mirrors the server rules in
// fixmate-server (booking.model.js / booking.controller.js): only the
// assigned technician advances accepted work, only the owning customer can
// cancel a pending request, and admins have no transition rights at all.
const allowedTransitions: Record<BookingStatus, Partial<Record<BookingStatus, BookingScope[]>>> = {
  requested: {
    accepted: ["technician"],
    rejected: ["technician"],
    cancelled: ["customer"],
  },
  accepted: {
    "in-progress": ["technician"],
  },
  "in-progress": {
    completed: ["technician"],
  },
  completed: {},
  rejected: {},
  cancelled: {},
};

export function canTransition(
  from: BookingStatus,
  to: BookingStatus,
  actor: BookingScope,
): boolean {
  const actors = allowedTransitions[from]?.[to];
  if (!actors) return false;
  // `paid` is a paymentStatus change handled by a future payment flow, never
  // a status transition, and admins are intentionally excluded everywhere.
  return actor !== "admin" && actors.includes(actor);
}

const transitionLabels: Record<string, string> = {
  "requested->accepted": "Accept Request",
  "requested->rejected": "Reject Request",
  "requested->cancelled": "Cancel Request",
  "accepted->in-progress": "Start Work",
  "in-progress->completed": "Mark Completed",
};

export function getTransitionLabel(from: BookingStatus, to: BookingStatus): string {
  return transitionLabels[`${from}->${to}`] ?? `Move to ${bookingStatusLabels[to]}`;
}
