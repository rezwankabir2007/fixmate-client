import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

export async function POST(request: Request) {
  const path = new URL(request.url).pathname.replace(/\/+$/, "");

  if (path.endsWith("/sign-up/email") || path.endsWith("/update-user")) {
    const body: unknown = await request.clone().json().catch(() => null);

    if (typeof body === "object" && body !== null && !Array.isArray(body)) {
      const fields = body as Record<string, unknown>;

      if (path.endsWith("/update-user") && "role" in fields) {
        return Response.json(
          { message: "Account roles cannot be changed through public profile updates." },
          { status: 403 },
        );
      }

      if (
        path.endsWith("/sign-up/email") &&
        "role" in fields &&
        fields.role !== "customer" &&
        fields.role !== "technician"
      ) {
        return Response.json(
          { message: "Public registration is limited to customer and technician accounts." },
          { status: 403 },
        );
      }
    }
  }

  return handlers.POST(request);
}