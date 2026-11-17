import { NextResponse } from "next/server";
import { moderatePendingService } from "@/lib/dashboard-data";
import { isSameOriginRequest, requireDashboardApiUser } from "@/lib/dashboard-auth";

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/services/[id]">) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  const authResult = await requireDashboardApiUser(request, "admin");
  if (!authResult.user) {
    return NextResponse.json({ error: "Admin access is required." }, { status: authResult.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || !("status" in body)) {
    return NextResponse.json({ error: "A moderation status is required." }, { status: 400 });
  }
  const status = body.status;
  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json({ error: "Status must be approved or rejected." }, { status: 400 });
  }

  const { id } = await params;
  try {
    const updated = await moderatePendingService(id, status, authResult.user.id);
    if (!updated) {
      return NextResponse.json({ error: "Pending service not found or already reviewed." }, { status: 404 });
    }
    return NextResponse.json({ data: { id, status, available: status === "approved" } });
  } catch (error) {
    console.error(`Failed to moderate service "${id}".`, error);
    return NextResponse.json({ error: "Service moderation is temporarily unavailable." }, { status: 500 });
  }
}
