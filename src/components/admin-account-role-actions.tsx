
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  accountId: string;
  currentRole: string;
};

export function AdminAccountRoleActions({
  accountId,
  currentRole,
}: Props) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isAdmin = currentRole === "admin";

  async function handleSave() {
    if (isAdmin || role === currentRole) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/accounts/${encodeURIComponent(accountId)}/role`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Role update failed.",
        );
      }

      setMessage("Role updated successfully.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (isAdmin) {
    return <span className="text-muted-foreground">Protected</span>;
  }

  return (
    <div className="flex min-w-52 flex-wrap items-center gap-2">
      <select
        value={role}
        onChange={(event) => {
          setRole(event.target.value);
          setMessage("");
        }}
        disabled={loading}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
      >
        <option value="customer">Customer</option>
        <option value="technician">Technician</option>
      </select>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading || role === currentRole}
        className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>

      {message ? (
        <p className="w-full text-xs text-muted-foreground">
          {message}
        </p>
      ) : null}
    </div>
  );
}

