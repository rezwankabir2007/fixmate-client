import { BackendFeatureNotice, EmptyTable } from "@/components/dashboard-states";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireDashboardUser } from "@/lib/dashboard-auth";

export default async function CustomerPaymentsPage() {
  const user = await requireDashboardUser("customer");

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/customer/payments"
      title="Payments"
      description="Payment history is private to your customer account."
    >
      <BackendFeatureNotice
        title="Payment history is not connected"
        description="No payment provider or transaction collection exists in the current project. Payment methods, receipts, and refunds are not simulated."
      />
      <div className="mt-5">
        <EmptyTable
          title="No payment data is connected"
          description="A payment provider and customer-scoped transaction API are required to populate this table."
          columns={5}
          headers={["Transaction", "Booking", "Amount", "Date", "Status"]}
        />
      </div>
    </DashboardShell>
  );
}
