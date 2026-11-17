"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [value, setValue] = useState(name);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: value }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Your profile could not be updated.");
      setSuccess("Profile updated.");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Your profile could not be updated.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-[24px] border border-border bg-card/80 p-5 shadow-[0_18px_40px_rgba(23,36,59,0.05)] sm:p-6">
      <label className="block space-y-2 text-sm font-medium">
        Full name
        <Input name="name" minLength={2} maxLength={80} required value={value} onChange={(event) => setValue(event.target.value)} />
      </label>
      <label className="block space-y-2 text-sm font-medium">
        Email
        <Input value={email} readOnly aria-describedby="email-note" />
        <span id="email-note" className="block text-xs font-normal text-muted-foreground">Email changes are not enabled in this workspace.</span>
      </label>
      {error ? <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-300">{error}</p> : null}
      {success ? <p role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-300">{success}</p> : null}
      <Button type="submit" disabled={pending} className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white">
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
