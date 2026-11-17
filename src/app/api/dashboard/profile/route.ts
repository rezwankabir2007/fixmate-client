import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDashboardUserFromHeaders, isSameOriginRequest } from "@/lib/dashboard-auth";

export async function PATCH(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  const user = await getDashboardUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: "Sign in to update your profile." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || !("name" in body) || typeof body.name !== "string") {
    return NextResponse.json({ error: "A profile name is required." }, { status: 400 });
  }

  const name = body.name.trim();
  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "Name must be between 2 and 80 characters." }, { status: 400 });
  }

  try {
    await auth.api.updateUser({
      headers: request.headers,
      body: { name },
    });
    return NextResponse.json({ data: { id: user.id, name } });
  } catch (error) {
    console.error(`Failed to update profile for "${user.id}".`, error);
    return NextResponse.json({ error: "Profile update is temporarily unavailable." }, { status: 500 });
  }
}
