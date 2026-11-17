"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
]

export function SiteHeader() {
  const [open, setOpen] = React.useState(false)

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
