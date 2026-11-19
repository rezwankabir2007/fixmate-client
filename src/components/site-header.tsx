"use client"

import Link from "next/link"
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  Wrench,
  X,
} from "lucide-react"
import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { authClient, type AuthSessionUser } from "@/lib/auth-client"
import { getAuthErrorMessage } from "@/lib/auth-errors"
import { dashboardPathForRole, isUserRole } from "@/lib/user-role"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
]

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  if (href === "/services") return pathname === href || pathname.startsWith(`${href}/`)
  return pathname === href
}

function NavigationLinks({
  pathname,
  mobile = false,
  onNavigate,
}: {
  pathname: string
  mobile?: boolean
  onNavigate?: () => void
}) {
  return (
    <>
      {navItems.map((item) => {
        const active = isActiveRoute(pathname, item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={mobile
              ? `min-h-11 rounded-xl px-3 py-3 text-sm transition-colors ${
                  active
                    ? "bg-blue-500/10 font-medium text-blue-700 dark:text-blue-200"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              : `rounded-full px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-blue-500/10 font-medium text-blue-700 dark:text-blue-200"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
          >
            {item.label}
          </Link>
        )
      })}
    </>
  )
}

function ActiveNavigationLinks({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  return <NavigationLinks pathname={pathname} mobile={mobile} onNavigate={onNavigate} />
}

function getDisplayName(user: AuthSessionUser) {
  return user.name?.trim() || user.email || "Account"
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")
}

function RoleBadge({ role }: { role?: string }) {
  const label = isUserRole(role)
    ? role[0].toUpperCase() + role.slice(1)
    : "Role unavailable"
  const colorClass = role === "technician"
    ? "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300"
    : role === "admin"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-200"

  return (
    <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-[10px] ${colorClass}`}>
      {label}
    </Badge>
  )
}

function ProfileAvatar({ user, name, size = "default" }: {
  user: AuthSessionUser
  name: string
  size?: "default" | "sm" | "lg"
}) {
  return (
    <Avatar size={size} className="border border-border">
      {user.image ? <AvatarImage src={user.image} alt="" /> : null}
      <AvatarFallback>{getInitials(name) || "U"}</AvatarFallback>
    </Avatar>
  )
}

export function SiteHeader() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [signOutError, setSignOutError] = React.useState("")
  const { data: session, isPending } = authClient.useSession()

  const sessionUser = session?.user as AuthSessionUser | undefined
  const displayName = sessionUser ? getDisplayName(sessionUser) : ""
  const dashboardHref = isUserRole(sessionUser?.role)
    ? dashboardPathForRole(sessionUser.role)
    : null

  const handleSignOut = async () => {
    setSignOutError("")
    setOpen(false)
    try {
      const result = await authClient.signOut()
      if (result.error) throw result.error
      router.replace("/")
      router.refresh()
    } catch (error) {
      setSignOutError(getAuthErrorMessage(error, "Sign out failed. Please try again."))
    }
  }

  return (
    <header className="sticky top-0 z-50 mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-8">
      <div className="rounded-full border border-border/80 bg-card/90 px-3 py-2 shadow-[0_18px_45px_rgba(23,36,59,0.08)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="FixMate home" onClick={() => setOpen(false)} className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/25">
              <Wrench className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-muted-foreground">FixMate</p>
              <p className="hidden truncate text-sm font-semibold text-foreground sm:block">Premium repair care</p>
            </div>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
            <React.Suspense
              fallback={<NavigationLinks pathname="" />}
            >
              <ActiveNavigationLinks />
            </React.Suspense>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isPending ? null : session ? (
              <>
                {sessionUser ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={`Open ${displayName}'s profile menu`}
                      className="hidden min-h-11 items-center gap-2 rounded-full border border-border bg-background/70 py-1 pl-1 pr-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:flex"
                    >
                      <ProfileAvatar user={sessionUser} name={displayName} />
                      <span className="max-w-28 truncate text-sm font-medium text-foreground">{displayName}</span>
                      <RoleBadge role={sessionUser.role} />
                      <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={8}
                      className="w-72 rounded-2xl border border-border bg-popover p-2 shadow-[0_20px_55px_rgba(23,36,59,0.16)]"
                    >
                      <div className="flex items-center gap-3 px-2 py-2">
                        <ProfileAvatar user={sessionUser} name={displayName} size="lg" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                          {sessionUser.email ? (
                            <p className="truncate text-xs text-muted-foreground">{sessionUser.email}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="px-2 pb-2">
                        <RoleBadge role={sessionUser.role} />
                      </div>
                      <DropdownMenuSeparator />
                      {dashboardHref ? (
                        <DropdownMenuItem
                          render={<Link href={dashboardHref} />}
                          className="min-h-10 cursor-pointer rounded-xl px-2.5"
                        >
                          <LayoutDashboard className="size-4 text-muted-foreground" />
                          Dashboard
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem
                        render={<Link href="/dashboard/profile" />}
                        className="min-h-10 cursor-pointer rounded-xl px-2.5"
                      >
                        <UserRound className="size-4 text-muted-foreground" />
                        Update profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="min-h-10 cursor-pointer rounded-xl px-2.5"
                      >
                        <LogOut className="size-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </>
            ) : (
              <>
                <Link href="/sign-in" className="hidden lg:block">
                  <Button variant="outline" className="rounded-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up" className="hidden lg:block">
                  <Button className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20">
                    Sign up
                  </Button>
                </Link>
              </>
            )}

            {/* <Link href="/services" className="hidden lg:block">
              <Button className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20">
                Book now
              </Button>
            </Link> */}
            <button
              type="button"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {signOutError ? (
          <p role="alert" className="px-3 pt-2 text-right text-xs text-red-600 dark:text-red-300">
            {signOutError}
          </p>
        ) : null}

        {open ? (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="mt-3 grid max-h-[calc(100vh-6rem)] gap-1 overflow-y-auto border-t border-border pt-3 lg:hidden"
          >
            <React.Suspense
              fallback={<NavigationLinks pathname="" mobile onNavigate={() => setOpen(false)} />}
            >
              <ActiveNavigationLinks mobile onNavigate={() => setOpen(false)} />
            </React.Suspense>

            {isPending ? null : session ? (
              <>
                {sessionUser ? (
                  <div className="mt-2 flex min-w-0 items-center gap-3 border-t border-border px-3 pt-4">
                    <ProfileAvatar user={sessionUser} name={displayName} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                      {sessionUser.email ? (
                        <p className="truncate text-xs text-muted-foreground">{sessionUser.email}</p>
                      ) : null}
                    </div>
                    <RoleBadge role={sessionUser.role} />
                  </div>
                ) : null}
                {dashboardHref ? (
                  <Link
                    href={dashboardHref}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                ) : null}
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <UserRound className="size-4" />
                  Update profile
                </Link>
                <Button
                  type="button"
                  onClick={handleSignOut}
                  variant="ghost"
                  className="min-h-11 w-full justify-start gap-3 rounded-xl px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setOpen(false)} className="mt-2">
                  <Button variant="outline" className="min-h-11 w-full rounded-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setOpen(false)}>
                  <Button className="min-h-11 w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        ) : null}
      </div>
    </header>
  )
}
