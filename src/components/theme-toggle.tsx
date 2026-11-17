"use client"

import { Button } from "@/components/ui/button"
import { MoonStar, SunMedium, LaptopMinimal } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const options = [
  { value: "light", label: "Light", icon: SunMedium },
  { value: "dark", label: "Dark", icon: MoonStar },
  { value: "system", label: "System", icon: LaptopMinimal },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card/80 p-1 shadow-sm backdrop-blur-sm">
      {options.map(({ value, label, icon: Icon }) => {
        const selected = theme === value

        return (
          <Button
            key={value}
            type="button"
            variant={selected ? "default" : "ghost"}
            size="sm"
            className={selected ? "rounded-full" : "rounded-full text-muted-foreground hover:text-foreground"}
            onClick={() => setTheme(value)}
            aria-label={`Switch to ${label} mode`}
          >
            <Icon className="size-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        )
      })}
    </div>
  )
}
