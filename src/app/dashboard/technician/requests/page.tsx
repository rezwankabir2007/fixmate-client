import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardDataError } from "@/components/dashboard-states";
import { TechnicianRequestsBoard } from "@/components/technician-requests-board";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import type { BookingRecord } from "@/lib/bookings";
import { serverApi } from "@/lib/server-api";

export default async function TechnicianRequestsPage() {
  const user = await requireDashboardUser("technician");

  let bookings: BookingRecord[] = [];
  let loadError = false;

  try {
    const response = await serverApi<{ data: BookingRecord[] }>("/api/bookings/assigned");
    bookings = response.data ?? [];
  } catch {
    loadError = true;
  }

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/technician/requests"
      title="Booking requests"
      description="Requests for your services. Accept, start, and complete work — only you can advance your own requests."
    >
      {loadError ? (
        <DashboardDataError feature="Booking requests" />
      ) : (
        <TechnicianRequestsBoard bookings={bookings} />
      )}
    </DashboardShell>
  );
}
