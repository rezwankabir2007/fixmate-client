import Link from "next/link"
import { ArrowRight, Clock3, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/rezwa_n_08/",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.88 2.25a1.12 1.12 0 1 1 0 2.25 1.12 1.12 0 0 1 0-2.25ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/md-razoan-kabir2007/",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
        <path d="M6.94 8.5H3.56V19.5h3.38V8.5ZM5.25 3.5a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94ZM20.44 12.82c0-2.83-1.51-4.15-3.53-4.15-1.63 0-2.36.9-2.77 1.53V8.5h-3.38c.04.96 0 11 0 11h3.38v-6.14c0-.33.02-.66.12-.89.27-.66.87-1.35 1.89-1.35 1.33 0 1.86 1.02 1.86 2.51v5.86h3.38v-6.63h-.07Z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/mohammad.rezwan.977145",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
        <path d="M13.5 22v-8.2h2.76l.41-3.2H13.5V8.56c0-.93.26-1.56 1.59-1.56h1.7V4.14c-.29-.04-1.3-.13-2.48-.13-2.45 0-4.13 1.5-4.13 4.24v2.35H7.4v3.2h2.78V22h3.32Z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/rezwankabir2007",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
        />
      </svg>
    ),
  },
]

export function SiteFooter() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-border bg-card/60 backdrop-blur-xl">
      {/* Subtle top gradient accent line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3478F6]/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.75fr_0.95fr]">
          {/* Brand & Socials Column */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-base font-bold text-white shadow-lg shadow-blue-500/25">
                  F
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                    FixMate
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    Repair expertise on demand
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                Premium home and device support designed for fast resolution, transparent pricing, and dependable workmanship.
              </p>

             

            {/* Social Media Links */}
            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Connect with us
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    className="flex size-9 items-center justify-center rounded-xl border border-border bg-background/60 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-blue-600/10 hover:text-blue-600"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

           <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="/services">
                  <Button className="group rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] px-6 text-white shadow-md shadow-blue-500/20 transition-all duration-300 hover:opacity-95 hover:shadow-lg hover:shadow-blue-500/30">
                    Schedule service
                    <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Quick links
            </h3>
            <ul className="mt-5 space-y-3.5 text-sm font-medium text-foreground">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center transition-colors duration-200 hover:text-blue-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="inline-flex items-center transition-colors duration-200 hover:text-blue-600"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="inline-flex items-center transition-colors duration-200 hover:text-blue-600"
                >
                  About us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Contact
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                  <MapPin className="size-3.5" />
                </span>
                <span className="leading-6">Nakaihat, Gobindoganj, Gaibandha</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                  <Phone className="size-3.5" />
                </span>
                <a href="tel:01948248347" className="transition-colors hover:text-blue-600">
                  01948248347
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                  <Mail className="size-3.5" />
                </span>
                <a href="mailto:rezwan9923@gmail.com" className="transition-colors hover:text-blue-600">
                  rezwan9923@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                  <Clock3 className="size-3.5" />
                </span>
                <span>24/7 support for urgent repairs</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-border/80 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>© 2026 FixMate. All rights reserved.</p>
          <p className="flex flex-wrap items-center gap-2">
            <span>Licensed technicians</span>
            <span className="text-blue-600">•</span>
            <span>Transparent quotes</span>
            <span className="text-blue-600">•</span>
            <span>Quality assurance</span>
          </p>
        </div>
      </div>
    </footer>
  )
}