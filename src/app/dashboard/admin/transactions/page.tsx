import { BackendFeatureNotice, EmptyTable } from "@/components/dashboard-states";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireDashboardUser } from "@/lib/dashboard-auth";

export default async function AdminTransactionsPage() {
  const user = await requireDashboardUser("admin");

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/admin/transactions"
      title="Transactions"
      description="Financial records should come from a verified payment integration."
    >
      <BackendFeatureNotice
        title="Payment integration required"
        description="No payment provider, webhook verification, transaction collection, or refund API is configured. Financial actions are unavailable."
      />
      <div className="mt-5">
        <EmptyTable
          title="Transaction records are not connected"
          description="No financial data or sample transactions are displayed."
          columns={5}
          headers={["Transaction", "Booking", "Customer", "Amount", "Status"]}
        />
      </div>
    </DashboardShell>
  );
}
