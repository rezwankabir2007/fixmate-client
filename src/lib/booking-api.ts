
import { fetchWithJwt } from "@/lib/fetch-with-jwt";
import type { BookingRecord, BookingStatus } from "@/lib/bookings";

export class BookingApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BookingApiError";
    this.status = status;
  }
}

function messageFromPayload(
  payload: unknown,
  fallback: string,
): string {
  if (typeof payload !== "object" || payload === null) {
    return fallback;
  }

  if (
    "error" in payload &&
    typeof payload.error === "string" &&
    payload.error.trim()
  ) {
    return payload.error;
  }

  if (
    "message" in payload &&
    typeof payload.message === "string" &&
    payload.message.trim()
  ) {
    return payload.message;
  }

  return fallback;
}

/**
 * PATCH /api/bookings/:id/status
 * Updates booking status through the Next.js API proxy.
 */
export async function patchBookingStatus(
  bookingId: string,
  body: { status: BookingStatus; finalAmount?: number },
): Promise<BookingRecord> {
  const response = await fetchWithJwt(
    `/api/bookings/${encodeURIComponent(bookingId)}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new BookingApiError(
      messageFromPayload(
        payload,
        "The booking could not be updated.",
      ),
      response.status,
    );
  }

  const data =
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload
      ? (payload as { data: BookingRecord }).data
      : null;

  if (!data) {
    throw new BookingApiError(
      "The server returned an unexpected response.",
      500,
    );
  }

  return data;
}

/**
 * POST /api/payments/checkout
 * Creates a Stripe Checkout Session for a completed booking.
 */
export async function createCheckoutSession(
  bookingId: string,
): Promise<string> {
  const response = await fetchWithJwt(
    "/api/payments/checkout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    },
  );

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new BookingApiError(
      messageFromPayload(
        payload,
        "Could not start Stripe checkout.",
      ),
      response.status,
    );
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("data" in payload)
  ) {
    throw new BookingApiError(
      "The server returned an invalid checkout response.",
      500,
    );
  }

  const data = payload.data;

  if (
    typeof data !== "object" ||
    data === null ||
    !("checkoutUrl" in data) ||
    typeof data.checkoutUrl !== "string" ||
    !data.checkoutUrl.trim()
  ) {
    throw new BookingApiError(
      "The server returned an invalid checkout URL.",
      500,
    );
  }

  return data.checkoutUrl;
}

/**
 * Human-readable message for any booking API failure.
 */
export function bookingErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof BookingApiError) {
    return error.message;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
