import Link from "next/link"
import { ArrowRight, Clock3, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-card/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-sm font-bold text-white shadow-lg shadow-blue-500/20">
                F
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground">FixMate</p>
                <p className="text-sm font-semibold text-foreground">Repair expertise on demand</p>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              Premium home and device support designed for fast resolution, transparent pricing, and dependable workmanship.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href="/services">
                <Button className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white">
                  Schedule service
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Quick links</h3>
            <ul className="mt-5 space-y-3 text-sm text-foreground">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li><Link href="/services" className="hover:text-primary">Services</Link></li>
              <li><Link href="/about" className="hover:text-primary">About us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm text-foreground">
              <li className="flex items-start gap-3"><MapPin className="mt-0.5 size-4 text-blue-600" /> 18 Harbour Plaza, Downtown</li>
              <li className="flex items-center gap-3"><Phone className="size-4 text-blue-600" /> +1 (415) 234-8890</li>
              <li className="flex items-center gap-3"><Mail className="size-4 text-blue-600" /> hello@fixmate.com</li>
              <li className="flex items-center gap-3"><Clock3 className="size-4 text-blue-600" /> 24/7 support for urgent repairs</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FixMate. All rights reserved.</p>
          <p>Licensed technicians • Transparent quotes • Quality assurance</p>
        </div>
      </div>
    </footer>
  )
}
