import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { signIn, signUp, signOut, getSession, useSession } = authClient;

export type AuthSessionUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};