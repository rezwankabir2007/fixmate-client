import { proxyApiRequest } from "@/lib/api-proxy";

type ProxyContext = {
  params: Promise<{ proxy: string[] }>;
};

async function proxyRequest(request: Request, context: ProxyContext) {
  const { proxy } = await context.params;
  return proxyApiRequest(request, proxy);
}

export function GET(request: Request, context: ProxyContext) {
  return proxyRequest(request, context);
}

export function HEAD(request: Request, context: ProxyContext) {
  return proxyRequest(request, context);
}

export function POST(request: Request, context: ProxyContext) {
  return proxyRequest(request, context);
}

export function PUT(request: Request, context: ProxyContext) {
  return proxyRequest(request, context);
}

export function PATCH(request: Request, context: ProxyContext) {
  return proxyRequest(request, context);
}

export function DELETE(request: Request, context: ProxyContext) {
  return proxyRequest(request, context);
}

export function OPTIONS(request: Request, context: ProxyContext) {
  return proxyRequest(request, context);
}
