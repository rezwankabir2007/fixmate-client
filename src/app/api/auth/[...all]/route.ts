import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;

export async function POST(request: Request) {
  const path = new URL(request.url).pathname.replace(/\/+$/, "");

  if (path.endsWith("/sign-up/email") || path.endsWith("/update-user")) {
    const body: unknown = await request.clone().json().catch(() => null);
    if (body && typeof body === "object" && "role" in body) {
      const requestedRole = body.role;
      if (path.endsWith("/update-user")) {
        return Response.json({ error: "Account roles cannot be changed through public profile updates." }, { status: 403 });
      }
      if (requestedRole !== "customer" && requestedRole !== "technician") {
        return Response.json({ error: "Public registration is limited to customer and technician accounts." }, { status: 403 });
      }
    }
  }

  return handlers.POST(request);
}
