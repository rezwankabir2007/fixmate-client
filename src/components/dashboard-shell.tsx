import Link from "next/link";
import {
  CreditCard,
  FilePlus2,
  LayoutDashboard,
  ListChecks,
  ReceiptText,
  ShieldCheck,
  Users,
  Wrench,
  ClipboardList,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DashboardUser } from "@/lib/dashboard-auth";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SignOutButton } from "@/components/sign-out-button";

type DashboardLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const dashboardLinks: Record<DashboardUser["role"], DashboardLink[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "Bookings", href: "/dashboard/customer/bookings", icon: ClipboardList },
    { label: "Payments", href: "/dashboard/customer/payments", icon: CreditCard },
    { label: "Profile", href: "/dashboard/profile", icon: UserRound },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
    { label: "Add service", href: "/dashboard/technician/add-service", icon: FilePlus2 },
    { label: "My services", href: "/dashboard/technician/my-services", icon: Wrench },
    { label: "Requests", href: "/dashboard/technician/requests", icon: ListChecks },
    { label: "Profile", href: "/dashboard/profile", icon: UserRound },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Services", href: "/dashboard/admin/services", icon: Wrench },
    { label: "Bookings", href: "/dashboard/admin/bookings", icon: ClipboardList },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: ReceiptText },
    { label: "Profile", href: "/dashboard/profile", icon: UserRound },
  ],
};

export function DashboardShell({
  user,
  activeHref,
  title,
  description,
  children,
}: {
  user: DashboardUser;
  activeHref: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const links = dashboardLinks[user.role];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-border bg-card/80 p-5 shadow-[0_18px_45px_rgba(23,36,59,0.06)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white">
              <ShieldCheck className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {user.role} workspace
              </p>
              <p className="truncate font-semibold text-foreground">{user.name || user.email}</p>
            </div>
          </div>
          <SignOutButton />
        </div>

        <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[24px] border border-border bg-card/80 p-3 shadow-[0_16px_40px_rgba(23,36,59,0.05)] lg:sticky lg:top-24">
            <nav aria-label={`${user.role} dashboard`} className="flex gap-2 overflow-x-auto lg:flex-col">
              {links.map(({ label, href, icon: Icon }) => {
                const active = href === activeHref;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-500/10 text-blue-700 dark:text-blue-200"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0">
            <header className="mb-6">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                FixMate dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">{title}</h1>
              <p className="mt-2 text-muted-foreground">{description}</p>
            </header>
            {children}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
