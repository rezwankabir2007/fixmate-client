import { createAuthClient } from "better-auth/react";
// Better Auth-এর ক্লায়েন্ট সাইড JWT প্লাগিন ইম্পোর্ট করা হয়েছে (ফ্রন্টএন্ডে auth.ts না থাকায় এখানেই ক্লায়েন্ট JWT প্লাগিন রাখা হয়)[cite: 5, 6]
import { jwtClient } from "better-auth/client/plugins";

// ক্লায়েন্ট auth instance তৈরি করা হয়েছে এবং plugins অ্যারেতে jwtClient() যুক্ত করা হয়েছে
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [jwtClient()],
});

// আপনার আগের সব এক্সপোর্ট অক্ষত রাখা হয়েছে
export const { signIn, signUp, signOut, getSession, useSession } = authClient;

// সেশন ইউজারের টাইপ ডেফিনিশন (আগের মতোই রাখা হয়েছে)
export type AuthSessionUser = {
  id: string;
  email: string;
  name?: string;
  image?: string | null;
  role?: string;
};

// প্রয়োজনে ক্লায়েন্ট থেকে JWT টোকেন নেওয়ার হেল্পার ফাংশন (ব্যাকএন্ড API-তে Bearer token পাঠানোর জন্য)
export async function getJwtToken(): Promise<string | null> {
  try {
    const { data, error } = await authClient.token();
    if (error || !data?.token) {
      return null;
    }
    return data.token;
  } catch {
    return null;
  }
}