import { DashboardShell } from "@/components/dashboard-shell";
import { CustomerBookingsList } from "@/components/customer-bookings-list";
import { DashboardDataError } from "@/components/dashboard-states";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { serverApi } from "@/lib/server-api";
import type { BookingRecord } from "@/lib/bookings";

export const instant = false;


export default async function CustomerBookingsPage() {
  const user = await requireDashboardUser("customer");

  let bookings: BookingRecord[] = [];
  let loadError: string | null = null;

  try {
    const response = await serverApi<{ data: BookingRecord[] }>("/api/bookings/mine");
    bookings = response.data ?? [];
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Could not load your bookings.";
  }

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/customer/bookings"
      title="Your bookings"
      description="Repair requests you have submitted, with live status and payment state."
    >
      {loadError ? (
        <DashboardDataError feature="Your bookings" />
      ) : (
        <CustomerBookingsList bookings={bookings} />
      )}
    </DashboardShell>
  );
}
