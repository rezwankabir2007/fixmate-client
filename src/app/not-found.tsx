
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Home,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#071225] px-4 py-16 text-white sm:px-6">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-[420px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute -bottom-48 -right-32 size-[500px] rounded-full bg-cyan-500/15 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
        <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,#071225_80%)]" />
      </div>

      {/* Decorative grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />

      <section className="mx-auto w-full max-w-4xl text-center">
        {/* Brand */}
        <Link
          href="/"
          className="group mb-12 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 shadow-2xl shadow-black/10 backdrop-blur-xl transition hover:border-blue-400/40 hover:bg-white/[0.07]"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30">
            <Wrench className="size-5" />
          </span>
          <span className="text-sm font-bold tracking-[0.2em]">
            FIX<span className="text-cyan-400">MATE</span>
          </span>
        </Link>

        {/* Illustration */}
        <div className="relative mx-auto mb-8 flex h-52 max-w-xl items-center justify-center sm:h-64">
          <div className="absolute size-44 animate-pulse rounded-full bg-blue-500/10 blur-3xl sm:size-64" />

          <div className="absolute size-44 rounded-full border border-dashed border-blue-300/20 sm:size-60" />
          <div className="absolute size-32 rounded-full border border-cyan-300/20 sm:size-44" />

          <div className="absolute left-[17%] top-[20%] animate-bounce text-blue-300/70">
            <Sparkles className="size-5" />
          </div>

          <div className="absolute right-[18%] top-[25%] text-cyan-300/70">
            <Compass className="size-7" />
          </div>

          <div className="relative flex size-24 items-center justify-center rounded-[2rem] border border-white/15 bg-gradient-to-br from-blue-500/20 to-cyan-400/10 shadow-[0_0_80px_rgba(59,130,246,0.25)] backdrop-blur-xl sm:size-32">
            <div className="absolute inset-2 rounded-[1.5rem] border border-white/10" />
            <Wrench className="size-12 rotate-[-35deg] text-cyan-300 drop-shadow-[0_0_15px_rgba(103,232,249,0.5)] sm:size-16" />
          </div>

          <span className="absolute bottom-[12%] left-[24%] size-2 rounded-full bg-cyan-300 shadow-[0_0_15px_#67e8f9]" />
          <span className="absolute right-[25%] top-[15%] size-1.5 rounded-full bg-blue-300 shadow-[0_0_15px_#93c5fd]" />
        </div>

        {/* 404 */}
        <div className="relative">
          <h1
            aria-label="404 - Page not found"
            className="select-none bg-gradient-to-b from-white via-blue-100 to-blue-400 bg-clip-text text-[clamp(7rem,25vw,15rem)] font-black leading-[0.8] tracking-[-0.09em] text-transparent drop-shadow-[0_15px_45px_rgba(59,130,246,0.15)]"
          >
            404
          </h1>
          <div className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200 sm:text-xs">
            <span className="size-1.5 animate-pulse rounded-full bg-cyan-300" />
            Lost in the wrong direction
          </div>
        </div>

        {/* Message */}
        <div className="mx-auto mt-7 max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
            Oops! This page is
            <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              off the map.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-blue-100/60 sm:text-base">
            Looks like this page needs a little repair. The link may be
            broken, or the page may have moved to a new location.
            Let&apos;s get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 text-sm font-semibold text-white shadow-xl shadow-blue-600/25 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/30 sm:w-auto"
          >
            <Home className="size-4" />
            Back to Home
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/services"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-7 text-sm font-semibold text-white/90 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/10 sm:w-auto"
          >
            <Search className="size-4" />
            Explore Services
          </Link>
        </div>

        {/* Bottom note */}
        <div className="mx-auto mt-14 flex max-w-sm items-center justify-center gap-3 border-t border-white/10 pt-6 text-xs text-blue-100/40">
          <span className="flex size-7 items-center justify-center rounded-lg bg-white/[0.05]">
            <Wrench className="size-3.5" />
          </span>
          <span>
            Need a hand? <span className="text-cyan-200">FixMate</span> is
            always here to help.
          </span>
        </div>

        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-2 text-xs text-blue-200/50 transition hover:text-cyan-200"
        >
          <ArrowLeft className="size-3.5" />
          Return to safety
        </Link>
      </section>
    </main>
  );
}
