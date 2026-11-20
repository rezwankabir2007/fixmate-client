
import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  plugins: [jwtClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  getSession,
  useSession,
} = authClient;

export type AuthSessionUser = {
  id: string;
  email: string;
  name?: string;
  image?: string | null;
  role?: string;
};

export async function getJwtToken(): Promise<string | null> {
  try {
    const { data, error } = await authClient.token();

    const jwtToken = data?.token;

    if (error || !jwtToken) {
      return null;
    }

    return jwtToken;
  } catch {
    return null;
  }
}
