
"use client";

import { useEffect, useState } from "react";
import {
  getCustomerPaymentHistory,
  type CustomerPayment,
} from "@/lib/payment-api";

export function CustomerPaymentHistory() {
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      try {
        setLoading(true);
        setError("");

        const data = await getCustomerPaymentHistory();

        if (active) {
          setPayments(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load payment history."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPayments();

    return () => {
      active = false;
    };
  }, []);

  function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  }

  function formatDate(date: string | null) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(parsedDate);
  }

  function getStatusStyle(status: string) {
    switch (status.toLowerCase()) {
      case "succeeded":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "failed":
      case "expired":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Payment History
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Your recent booking payment transactions.
        </p>
      </div>

      {loading && (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-sm text-gray-500">
            Loading payment history...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-700">
            Unable to load payments
          </p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && payments.length === 0 && (
        <div className="rounded-xl border bg-white p-10 text-center">
          <h3 className="font-semibold text-gray-900">
            No payments yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Your payment transactions will appear here after you make a payment.
          </p>
        </div>
      )}

      {!loading && !error && payments.length > 0 && (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Transaction
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Service
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Technician
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Amount
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Payment Date
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <span
                        className="font-medium text-gray-800"
                        title={payment.transactionId}
                      >
                        {payment.transactionId.length > 18
                          ? `${payment.transactionId.slice(0, 18)}...`
                          : payment.transactionId}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {payment.bookingTitle}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        ID: {payment.bookingId}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800">
                      {payment.technicianName || "—"}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatAmount(payment.amount, payment.currency)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(payment.date)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(payment.status)}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
