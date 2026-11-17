"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSignOut() {
    const result = await authClient.signOut();
    if (result.error) {
      console.error("Could not sign out.", result.error);
      setError("Sign out failed. Please try again.");
      return;
    }

    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {error ? <span role="alert" className="text-xs text-red-600 dark:text-red-300">{error}</span> : null}
      <Button type="button" onClick={handleSignOut} variant="outline" className="rounded-full">
        Sign out
      </Button>
    </div>
  );
}
