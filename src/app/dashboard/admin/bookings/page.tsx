import { DashboardShell } from "@/components/dashboard-shell";
import { BookingsTable } from "@/components/bookings-table";
import { DashboardDataError } from "@/components/dashboard-states";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import type { BookingRecord } from "@/lib/bookings";
import { serverApi } from "@/lib/server-api";

export default async function AdminBookingsPage() {
  const user = await requireDashboardUser("admin");

  let bookings: BookingRecord[] = [];
  let loadError = false;

  try {
    const response = await serverApi<{ data: BookingRecord[] }>("/api/bookings");
    bookings = response.data ?? [];
  } catch {
    loadError = true;
  }

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/admin/bookings"
      title="Booking management"
      description="Read-only overview of every repair request. Only the assigned technician or the owning customer can change a status."
    >
      {loadError ? (
        <DashboardDataError feature="Booking records" />
      ) : (
        <BookingsTable bookings={bookings} />
      )}
    </DashboardShell>
  );
}
