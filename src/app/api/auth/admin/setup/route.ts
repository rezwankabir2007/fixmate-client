import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const expectedSecret = process.env.ADMIN_SETUP_KEY;

  if (!expectedSecret || expectedSecret.length < 32) {
    return NextResponse.json({ error: "Admin setup is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Admin account details are required." }, { status: 400 });
  }

  const fields = body as Record<string, unknown>;
  const secret = typeof fields.secret === "string" ? fields.secret : request.headers.get("x-admin-setup-key");
  if (!secret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized admin bootstrap request." }, { status: 401 });
  }

  const email = typeof fields.email === "string" ? fields.email.trim() : "";
  const password = typeof fields.password === "string" ? fields.password : "";
  const name = typeof fields.name === "string" ? fields.name.trim() : "";

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Email, password, and name are required." }, { status: 400 });
  }

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role: "admin",
      },
    });

    return NextResponse.json({ success: true, user: result.user }, { status: 200 });
  } catch (error) {
    console.error("Admin bootstrap failed.", error);
    const message = error instanceof Error ? error.message : "Admin account could not be created.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
