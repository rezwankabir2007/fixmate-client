
export type CustomerPayment = {
  id: string;
  transactionId: string;
  bookingId: string;
  bookingTitle: string;
  amount: number;
  currency: string;
  date: string | null;
  status: string;
};

export async function getCustomerPaymentHistory(): Promise<CustomerPayment[]> {
  const response = await fetch("/api/payments/history", {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      payload?.message ||
      payload?.error ||
      "Could not load payment history."
    );
  }

  return payload?.data?.payments ?? [];
}

