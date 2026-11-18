import { headers } from "next/headers";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function messageFromPayload(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  if ("error" in payload && typeof payload.error === "string" && payload.error.trim()) {
    return payload.error;
  }
  if ("message" in payload && typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }
  return null;
}

/**
 * Server-side fetch helper for the FixMate backend API.
 *
 * - Forwards the browser cookies so Better Auth sessions authenticate.
 * - Sets Origin / x-forwarded-host / x-forwarded-proto exactly like the
 *   /api proxy does, which the backend's requireSameOrigin middleware expects.
 * - Never caches, and converts non-2xx responses into typed ApiError objects
 *   with safe JSON messages.
 */
export async function serverApi<T>(path: string): Promise<T> {
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie");

  const backendOrigin = process.env.FIXMATE_API_URL;
  if (!backendOrigin) {
    throw new ApiError("FIXMATE_API_URL is not configured.", 503);
  }

  let target: URL;
  try {
    target = new URL(path, backendOrigin);
  } catch {
    throw new ApiError("FIXMATE_API_URL must be a valid HTTP(S) URL.", 503);
  }

  const response = await fetch(target, {
    cache: "no-store",
    headers: {
      ...(cookie ? { cookie } : {}),
      origin: target.origin,
      "x-forwarded-host": target.host,
      "x-forwarded-proto": target.protocol.slice(0, -1),
    },
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new ApiError(
      messageFromPayload(payload) ?? `Request failed with status ${response.status}.`,
      response.status,
    );
  }

  return payload as T;
}
