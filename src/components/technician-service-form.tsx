"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { serviceCategories } from "@/lib/services";

export function TechnicianServiceForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/technician/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "The service could not be submitted.");
      }

      setSuccess("Service submitted for admin review. It will not be public until approved.");
      form.reset();
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "The service could not be submitted.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-[24px] border border-border bg-card/80 p-5 shadow-[0_18px_40px_rgba(23,36,59,0.05)] sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          Service title
          <Input name="title" minLength={2} maxLength={100} required placeholder="e.g. Smartphone screen replacement" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Category
          <select name="category" required defaultValue="" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
            <option value="" disabled>Select a category</option>
            {serviceCategories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          Price
          <Input name="price" type="number" min="0.01" step="0.01" required placeholder="0.00" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Estimated duration
          <Input name="duration" minLength={2} maxLength={80} required placeholder="e.g. 1-2 hours" />
        </label>
        <label className="space-y-2 text-sm font-medium sm:col-span-2">
          Image URL
          <Input name="image" type="url" maxLength={2048} required placeholder="https://..." />
        </label>
        <label className="space-y-2 text-sm font-medium sm:col-span-2">
          Service mode <span className="font-normal text-muted-foreground">(optional)</span>
          <Input name="serviceMode" maxLength={60} placeholder="Enter your supported mode" />
        </label>
      </div>
      <label className="block space-y-2 text-sm font-medium">
        Short description
        <Textarea name="shortDescription" minLength={10} maxLength={200} required rows={2} placeholder="Summarize what the repair covers." />
      </label>
      <label className="block space-y-2 text-sm font-medium">
        Full service description
        <Textarea name="description" minLength={10} maxLength={3000} required rows={5} placeholder="Describe the service and its scope." />
      </label>

      {error ? <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-300">{error}</p> : null}
      {success ? <p role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-300">{success}</p> : null}

      <Button type="submit" disabled={pending} className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white">
        {pending ? "Submitting…" : "Submit for review"}
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
