import { NextResponse } from "next/server";
import { getPublicServiceById } from "@/lib/service-repository";

export async function GET(_request: Request, { params }: RouteContext<"/api/services/[id]">) {
  const { id } = await params;

  try {
    const service = await getPublicServiceById(id);
    if (!service) {
      return NextResponse.json({ error: "Service not found." }, { status: 404 });
    }

    return NextResponse.json({ data: service });
  } catch (error) {
    console.error(`Failed to load public service "${id}".`, error);
    return NextResponse.json({ error: "Service details are temporarily unavailable." }, { status: 500 });
  }
}
