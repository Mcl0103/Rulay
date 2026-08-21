import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Theme = "dark" | "light"

type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark"
  return localStorage.getItem("rulay_theme") === "light" ? "light" : "dark"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    setThemeState(readStoredTheme())
  }, [])

  function setTheme(t: Theme) {
    setThemeState(t)
    localStorage.setItem("rulay_theme", t)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>")
  return ctx
}
