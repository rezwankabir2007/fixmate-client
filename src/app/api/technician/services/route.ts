import { NextResponse } from "next/server";
import { serviceCategories } from "@/lib/services";
import { addTechnicianService } from "@/lib/dashboard-data";
import { isSameOriginRequest, requireDashboardApiUser } from "@/lib/dashboard-auth";

type ServiceRequestBody = Record<string, unknown>;

function isRecord(value: unknown): value is ServiceRequestBody {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  const authResult = await requireDashboardApiUser(request, "technician");
  if (!authResult.user) {
    return NextResponse.json({ error: "Sign in as a technician to submit a service." }, { status: authResult.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  if (!isRecord(body)) {
    return NextResponse.json({ error: "A service object is required." }, { status: 400 });
  }

  const title = text(body.title);
  const category = text(body.category);
  const shortDescription = text(body.shortDescription);
  const description = text(body.description);
  const duration = text(body.duration);
  const image = text(body.image);
  const serviceMode = text(body.serviceMode);
  const price = typeof body.price === "string" || typeof body.price === "number" ? Number(body.price) : Number.NaN;

  if (title.length < 2 || title.length > 100) {
    return NextResponse.json({ error: "Title must be between 2 and 100 characters." }, { status: 400 });
  }
  if (!serviceCategories.includes(category as (typeof serviceCategories)[number])) {
    return NextResponse.json({ error: "Choose a valid service category." }, { status: 400 });
  }
  if (shortDescription.length < 10 || shortDescription.length > 200) {
    return NextResponse.json({ error: "Short description must be between 10 and 200 characters." }, { status: 400 });
  }
  if (description.length < 10 || description.length > 3000) {
    return NextResponse.json({ error: "Description must be between 10 and 3000 characters." }, { status: 400 });
  }
  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "Price must be a positive number." }, { status: 400 });
  }
  if (duration.length < 2 || duration.length > 80) {
    return NextResponse.json({ error: "Duration must be between 2 and 80 characters." }, { status: 400 });
  }
  if (serviceMode.length > 60) {
    return NextResponse.json({ error: "Service mode must be 60 characters or fewer." }, { status: 400 });
  }

  let imageUrl: URL;
  try {
    imageUrl = new URL(image);
  } catch {
    return NextResponse.json({ error: "Provide a valid image URL." }, { status: 400 });
  }
  if (!["http:", "https:"].includes(imageUrl.protocol) || image.length > 2048) {
    return NextResponse.json({ error: "Image URL must use HTTP or HTTPS and be under 2048 characters." }, { status: 400 });
  }

  try {
    const id = await addTechnicianService(
      {
        title,
        category,
        shortDescription,
        description,
        price,
        duration,
        image: imageUrl.toString(),
        ...(serviceMode ? { serviceMode } : {}),
      },
      authResult.user.id,
    );
    return NextResponse.json({ data: { id, status: "pending" } }, { status: 201 });
  } catch (error) {
    console.error("Failed to create technician service.", error);
    return NextResponse.json({ error: "Service submission is temporarily unavailable." }, { status: 500 });
  }
}
