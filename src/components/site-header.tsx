"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { authClient, type AuthSessionUser } from "@/lib/auth-client"
import { getAuthErrorMessage } from "@/lib/auth-errors"
import { dashboardPathForRole, isUserRole } from "@/lib/user-role"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
]

export function SiteHeader() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false)
  const [signOutError, setSignOutError] = React.useState("")
  const { data: session, isPending } = authClient.useSession();

  const sessionUser = session?.user as AuthSessionUser | undefined;
  const dashboardHref = isUserRole(sessionUser?.role) ? dashboardPathForRole(sessionUser.role) : null;

  const handleSignOut = async () => {
    setSignOutError("");
    try {
      const result = await authClient.signOut();
      if (result.error) throw result.error;
      router.replace("/");
      router.refresh();
    } catch (error) {
      setSignOutError(getAuthErrorMessage(error, "Sign out failed. Please try again."));
    }
  };

  return (
    <header className="sticky top-4 z-40 mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <div className="rounded-full border border-border/80 bg-card/75 px-3 py-2 shadow-[0_18px_45px_rgba(23,36,59,0.08)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-sm font-bold text-white shadow-lg shadow-blue-500/25">
              F
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-muted-foreground">FixMate</p>
              <p className="text-sm font-semibold text-foreground">Premium repair care</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {!isPending && session ? (
              <>
                <span className="hidden max-w-36 truncate text-sm text-muted-foreground lg:block" title={sessionUser?.name || sessionUser?.email}>
                  {sessionUser?.name || sessionUser?.email}
                </span>
                {dashboardHref ? (
                  <Link href={dashboardHref} className="hidden sm:block">
                    <Button variant="outline" className="rounded-full">
                      My dashboard
                    </Button>
                  </Link>
                ) : null}
                <Button onClick={handleSignOut} variant="ghost" className="hidden rounded-full sm:inline-flex">
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="hidden sm:block">
                  <Button variant="outline" className="rounded-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up" className="hidden sm:block">
                  <Button className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20">
                    Create account
                  </Button>
                </Link>
              </>
            )}

            <Link href="/services" className="hidden sm:block">
              <Button className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20">
                Book now
              </Button>
            </Link>
            <button
              type="button"
              aria-label="Toggle menu"
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background md:hidden"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {signOutError ? (
          <p role="alert" className="px-3 pt-2 text-right text-xs text-red-600 dark:text-red-300">
            {signOutError}
          </p>
        ) : null}

        {open && (
          <nav className="mt-3 grid gap-2 border-t border-border pt-3 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}

            {!isPending && session ? (
              <>
                <p className="px-3 pt-2 text-sm text-muted-foreground">{sessionUser?.name || sessionUser?.email}</p>
                {dashboardHref ? (
                  <Link href={dashboardHref} onClick={() => setOpen(false)} className="mt-1">
                    <Button variant="outline" className="w-full rounded-full">
                      My dashboard
                    </Button>
                  </Link>
                ) : null}
                <Button onClick={handleSignOut} className="w-full rounded-full">
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setOpen(false)} className="mt-1">
                  <Button variant="outline" className="w-full rounded-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setOpen(false)}>
                  <Button className="w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white">
                    Create account
                  </Button>
                </Link>
              </>
            )}

            <Link href="/services" onClick={() => setOpen(false)} className="mt-1">
              <Button className="w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white">
                Book now
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
