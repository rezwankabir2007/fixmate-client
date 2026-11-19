
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { CustomerPaymentHistory } from "./payment-history";

function PaymentsLoading() {
  return (
    <div className="rounded-xl border bg-white p-10 text-center">
      Loading payments...
    </div>
  );
}

async function CustomerPaymentsContent() {
  const user = await requireDashboardUser("customer");

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/customer/payments"
      title="Payments"
      description="View your completed transactions and payment history."
    >
      <Suspense fallback={<PaymentsLoading />}>
        <CustomerPaymentHistory />
      </Suspense>
    </DashboardShell>
  );
}

export default function CustomerPaymentsPage() {
  return (
    <Suspense fallback={<PaymentsLoading />}>
      <CustomerPaymentsContent />
    </Suspense>
  );
}
