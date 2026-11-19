import { getJwtToken } from "@/lib/auth-client";

export async function fetchWithJwt(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const jwtToken = await getJwtToken();
  const headers = new Headers(init.headers);

  if (jwtToken) {
    headers.set("Authorization", `Bearer ${jwtToken}`);
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });
}