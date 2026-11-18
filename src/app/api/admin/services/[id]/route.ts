import { proxyApiRequest } from "@/lib/api-proxy";

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/services/[id]">) {
  const { id } = await params;
  return proxyApiRequest(request, ["admin", "services", id]);
}
