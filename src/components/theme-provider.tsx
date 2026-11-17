"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("system")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const savedTheme = window.localStorage.getItem("fixmate-theme") as Theme | null
    setTheme(savedTheme ?? "system")
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const resolvedTheme = theme === "system" ? getSystemTheme() : theme

    root.setAttribute("data-theme", resolvedTheme)
    root.classList.toggle("dark", resolvedTheme === "dark")
    root.style.colorScheme = resolvedTheme
    window.localStorage.setItem("fixmate-theme", theme)
  }, [mounted, theme])

  React.useEffect(() => {
    if (theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      const root = document.documentElement
      const resolvedTheme = getSystemTheme()
      root.setAttribute("data-theme", resolvedTheme)
      root.classList.toggle("dark", resolvedTheme === "dark")
      root.style.colorScheme = resolvedTheme
    }

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [theme])

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme: theme === "system" ? getSystemTheme() : theme,
      setTheme,
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}
