"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, UserCircle2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { authClient } from "@/lib/auth-client";

const roleOptions = [
  { value: "customer", label: "Customer", description: "Book repairs and manage service history.", icon: UserCircle2 },
  { value: "technician", label: "Technician", description: "Accept assignments and manage jobs.", icon: Wrench },
];

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        role,
      } as Parameters<typeof authClient.signUp.email>[0]);

      if (result && typeof result === "object" && "error" in result && result.error) {
        throw new Error((result as { error?: { message?: string } }).error?.message ?? "Sign-up failed.");
      }

      const sessionResponse = await authClient.getSession();
      const userRole = ((sessionResponse?.data?.user as { role?: string } | undefined)?.role ?? role) as "customer" | "technician" | "admin";
      const path = userRole === "technician" ? "/dashboard/technician" : "/dashboard/customer";
      router.replace(path);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to create your FixMate account.";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/8 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-200">
              <ShieldCheck className="size-4" />
              Secure account setup
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Create your account</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">Join FixMate as a customer or technician.</h1>
            </div>

            <div className="grid gap-4">
              {roleOptions.map(({ value, label, description, icon: Icon }) => {
                const selected = role === value;

                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setRole(value as "customer" | "technician")}
                    className={`rounded-[24px] border p-4 text-left transition-all ${
                      selected
                        ? "border-blue-500/40 bg-blue-500/8 shadow-[0_14px_40px_rgba(52,120,246,0.12)]"
                        : "border-border bg-card/80"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(52,120,246,0.14),rgba(54,185,154,0.12))] text-blue-600 dark:text-blue-300">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">{label}</p>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Card className="border-border bg-card/80 shadow-[0_22px_60px_rgba(23,36,59,0.08)]">
            <CardHeader className="space-y-2 px-6 pt-6">
              <CardTitle className="text-2xl">Sign up</CardTitle>
              <CardDescription>Choose your role and start managing repairs faster.</CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a secure password" required />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-600 dark:text-red-300">
                    {error}
                  </div>
                ) : null}

                <Button type="submit" disabled={busy} className="w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20">
                  {busy ? "Creating account..." : "Create account"}
                  <ArrowRight className="size-4" />
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account? <Link href="/sign-in" className="font-semibold text-blue-600 dark:text-blue-300">Sign in</Link>
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
