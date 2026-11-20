
import { DashboardShell } from "@/components/dashboard-shell";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { serverApi } from "@/lib/server-api";

export const instant = false;

type AdminTransaction = {
  id: string;
  transactionId: string;
  bookingId: string;
  bookingTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  amount: number;
  currency: string;
  date: string | null;
  status: string;
};

type TransactionSummary = {
  totalTransactions: number;
  successfulTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  expiredTransactions: number;
  totalRevenue: number;
  currency: string;
};

type AdminTransactionsResponse = {
  success: boolean;
  data: {
    transactions: AdminTransaction[];
    total: number;
    summary: TransactionSummary;
  };
};

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount || 0);
}

function formatDate(date: string | null) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "succeeded":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "failed":
      return "bg-red-100 text-red-700";
    case "expired":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default async function AdminTransactionsPage() {
  const user = await requireDashboardUser("admin");

  let transactions: AdminTransaction[] = [];
  let summary: TransactionSummary | null = null;
  let errorMessage = "";

  try {
    const response =
      await serverApi<AdminTransactionsResponse>(
        "/api/admin/transactions",
      );

    transactions = response.data?.transactions ?? [];
    summary = response.data?.summary ?? null;
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to load transaction records.";
  }

  const stats = [
    {
      title: "Total Transactions",
      value: summary?.totalTransactions ?? 0,
      description: "All recorded payment attempts",
    },
    {
      title: "Successful Payments",
      value: summary?.successfulTransactions ?? 0,
      description: "Successfully completed payments",
    },
    {
      title: "Pending Payments",
      value: summary?.pendingTransactions ?? 0,
      description: "Payments awaiting confirmation",
    },
    {
      title: "Failed Payments",
      value: summary?.failedTransactions ?? 0,
      description: "Failed payment attempts",
    },
  ];

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/admin/transactions"
      title="Transactions & Revenue"
      description="Monitor payment transactions and track platform revenue."
    >
      <div className="space-y-6">
        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">
              Unable to load transactions
            </p>
            <p className="mt-1">{errorMessage}</p>
          </div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {stat.value.toLocaleString("en-US")}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {stat.description}
                  </p>
                </div>
              ))}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Revenue
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-green-700">
                {formatCurrency(
                  summary?.totalRevenue ?? 0,
                  summary?.currency ?? "USD",
                )}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Revenue from successful payments only
              </p>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Transaction History
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Review all recorded payment attempts.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {transactions.length} records
                </span>
              </div>

              {transactions.length === 0 ? (
                <div className="p-10 text-center">
                  <h3 className="font-semibold text-slate-800">
                    No transactions found
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Payment records will appear here when customers make payments.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Transaction</th>
                        <th className="px-5 py-4 font-semibold">Booking</th>
                        <th className="px-5 py-4 font-semibold">Customer</th>
                        <th className="px-5 py-4 font-semibold">Technician</th>
                        <th className="px-5 py-4 font-semibold">Amount</th>
                        <th className="px-5 py-4 font-semibold">Date</th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="transition-colors hover:bg-slate-50"
                        >
                          <td className="max-w-[190px] px-5 py-4">
                            <p
                              className="truncate font-medium text-slate-900"
                              title={transaction.transactionId}
                            >
                              {transaction.transactionId || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-800">
                              {transaction.bookingTitle || "Repair Service"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              ID: {transaction.bookingId || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-800">
                              {transaction.customerName || "Unknown"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {transaction.customerEmail || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-slate-700">
                            {transaction.technicianName || "—"}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                            {formatCurrency(
                              transaction.amount,
                              transaction.currency || "USD",
                            )}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                            {formatDate(transaction.date)}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(transaction.status)}`}
                            >
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
