export async function proxyApiRequest(request: Request, pathSegments: string[]) {
  const configuredOrigin = process.env.FIXMATE_API_URL;
  if (!configuredOrigin) {
    return Response.json({ error: "FIXMATE_API_URL is not configured." }, { status: 503 });
  }

  let backendOrigin: URL;
  try {
    backendOrigin = new URL(configuredOrigin);
  } catch {
    return Response.json({ error: "FIXMATE_API_URL must be a valid HTTP(S) URL." }, { status: 500 });
  }
  if (backendOrigin.protocol !== "http:" && backendOrigin.protocol !== "https:") {
    return Response.json({ error: "FIXMATE_API_URL must be a valid HTTP(S) URL." }, { status: 500 });
  }

  const path = pathSegments.map((segment) => encodeURIComponent(segment)).join("/");
  const target = new URL(`/api/${path}`, backendOrigin);
  target.search = new URL(request.url).search;

  const incomingUrl = new URL(request.url);
  const headers = new Headers(request.headers);
  for (const header of [
    "host",
    "content-length",
    "connection",
    "expect",
    "keep-alive",
    "proxy-authorization",
    "proxy-connection",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
  ]) {
    headers.delete(header);
  }
  headers.set("x-forwarded-host", incomingUrl.host);
  headers.set("x-forwarded-proto", incomingUrl.protocol.slice(0, -1));

  const method = request.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();
  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });
  } catch (error) {
    console.error("API proxy request failed.", error);
    return Response.json({ error: "Backend API is unavailable." }, { status: 502 });
  }

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("content-length");
  responseHeaders.delete("connection");
  const setCookies = upstream.headers.getSetCookie();
  if (setCookies.length > 0) {
    responseHeaders.delete("set-cookie");
    for (const cookie of setCookies) responseHeaders.append("set-cookie", cookie);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
