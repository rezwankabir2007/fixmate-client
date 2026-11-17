import { NextResponse, type NextRequest } from "next/server";
import { getPublicServices, parseServiceListParams } from "@/lib/service-repository";

export async function GET(request: NextRequest) {
  const searchParams: Record<string, string | string[]> = {};
  for (const key of new Set(request.nextUrl.searchParams.keys())) {
    const values = request.nextUrl.searchParams.getAll(key);
    searchParams[key] = values.length > 1 ? values : values[0] ?? "";
  }
  const parsed = parseServiceListParams(searchParams);

  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const result = await getPublicServices(parsed.params);
    return NextResponse.json({
      data: result.services,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
      filters: { serviceModes: result.serviceModes },
    });
  } catch (error) {
    console.error("Failed to query public services.", error);
    return NextResponse.json({ error: "Service catalog is temporarily unavailable." }, { status: 500 });
  }
}
