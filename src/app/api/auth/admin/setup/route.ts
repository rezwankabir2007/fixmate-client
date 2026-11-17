import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const secret = body.secret ?? request.headers.get("x-admin-setup-key");
  const expectedSecret = process.env.ADMIN_SETUP_KEY ?? "fixmate-admin-bootstrap";

  if (!secret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized admin bootstrap request." }, { status: 401 });
  }

  const email = body.email as string | undefined;
  const password = body.password as string | undefined;
  const name = body.name as string | undefined;

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
    const message = error instanceof Error ? error.message : "Admin account could not be created.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
