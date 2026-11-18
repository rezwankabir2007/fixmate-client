
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { authClient, type AuthSessionUser } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { dashboardPathForRole, isUserRole } from "@/lib/user-role";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setBusy(true);

    try {
      // Step 1: Sign in using Better Auth
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        toast.error(
          getAuthErrorMessage(
            result.error,
            "Unable to sign in to FixMate."
          )
        );
        return;
      }

      // Step 2: Verify the user's session
      const sessionResponse = await authClient.getSession();

      const sessionUser = sessionResponse.data?.user as
        | AuthSessionUser
        | undefined;

      if (
        sessionResponse.error ||
        !sessionUser ||
        !isUserRole(sessionUser.role)
      ) {
        toast.error(
          "We couldn't verify your account role. Please try again or contact support."
        );
        return;
      }

      // Step 3: Show success notification
      toast.success("Welcome back! You signed in successfully.");

      // Step 4: Redirect according to the user's role
      router.replace(dashboardPathForRole(sessionUser.role));
      router.refresh();

    } catch (submitError) {
      toast.error(
        getAuthErrorMessage(
          submitError,
          "Unable to sign in to FixMate."
        )
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">

          {/* Left Side */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1.5 text-sm text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="size-4" />
              Protected access
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                Welcome back
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                Sign in to your workspace.
              </h1>
            </div>

            <div className="rounded-[28px] border border-border bg-card/80 p-5 shadow-[0_18px_45px_rgba(23,36,59,0.06)]">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(52,120,246,0.14),rgba(54,185,154,0.12))] text-emerald-600 dark:text-emerald-300">
                  <LockKeyhole className="size-4" />
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    Secure session
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Fast access to your assigned dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Sign In Form */}
          <Card className="border-border bg-card/80 shadow-[0_22px_60px_rgba(23,36,59,0.08)]">
            <CardHeader className="space-y-2 px-6 pt-6">
              <CardTitle className="text-2xl">Sign in</CardTitle>

              <CardDescription>
                Use your FixMate email and password to continue.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <form className="space-y-4" onSubmit={handleSubmit}>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>

                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    disabled={busy}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>

                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={busy}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20"
                >
                  {busy ? "Signing in..." : "Sign in"}

                  <ArrowRight className="size-4" />
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Need an account?{" "}
                  <Link
                    href="/sign-up"
                    className="font-semibold text-blue-600 dark:text-blue-300"
                  >
                    Create one
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
