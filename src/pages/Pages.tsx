import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  PlayCircle,
  Search,
  Sparkles,
} from "lucide-react"
import { Sidebar } from "../components/Sidebar"
import { MobileNav } from "../components/MobileNav"
import { StaggerHeader } from "../components/StaggerHeader"
import { useTheme } from "../lib/theme"
import { useLanguage } from "../lib/i18n"

// Cuenta nueva: sin páginas creadas todavía. Se llenará con datos reales
// una vez el usuario genere su primera página.
const pages: {
  name: string
  source: string
  status: string
  credits: number
  gradient: string
}[] = []

export function Pages() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [query, setQuery] = useState("")
  const filtered = pages.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-(--color-base)">
      <Sidebar />
      <MobileNav />
      <main data-theme={theme} className="flex-1 overflow-y-auto bg-(--color-panel)/40 p-4 pb-24 md:p-6">
        <div className="flex items-center justify-between">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-sm text-(--color-muted) transition hover:text-(--color-text)"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("sidebar.dashboard")}
          </Link>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-full border border-(--color-border) px-3.5 py-1.5 text-xs text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-(--color-text)">
              <PlayCircle className="h-3.5 w-3.5" />
              {t("pages.verTutorial")}
            </button>
            <Link
              to="/app/generar"
              className="flex items-center gap-1.5 rounded-full bg-(--color-primary) px-3.5 py-1.5 text-xs font-medium text-(--color-on-primary) transition hover:opacity-90"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t("pages.crearConIA")}
            </Link>
          </div>
        </div>

        <StaggerHeader title={t("pages.titulo")} className="mt-6" />

        <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-(--color-border) bg-(--color-panel) px-4 py-2.5 focus-within:border-(--color-border-hover)">
          <Search className="h-4 w-4 text-(--color-muted-2)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("pages.buscar")}
            className="w-full bg-transparent text-sm text-(--color-text) placeholder:text-(--color-muted-2) focus:outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--color-border) bg-(--color-panel) px-6 py-20 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--color-panel-2) text-(--color-muted)">
              <FileText className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-(--color-text)">
              {query ? t("pages.noEncontradas") : t("recent.vacioTitulo")}
            </p>
            <p className="mt-1 max-w-xs text-xs text-(--color-muted-2)">
              {query ? t("pages.pruebaOtroNombre") : t("pages.empiezaAhora")}
            </p>
            <Link
              to="/app/generar"
              className="mt-5 flex items-center gap-1.5 rounded-full bg-(--color-primary) px-4 py-1.5 text-xs font-medium text-(--color-on-primary) transition hover:opacity-90"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t("pages.crearPrimera")}
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((page) => (
              <div
                key={page.name}
                className="group overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-panel) transition hover:border-(--color-border-hover)"
              >
                <div
                  className={`flex h-28 items-end justify-end bg-gradient-to-br p-3 ${page.gradient}`}
                >
                  <a
                    href="#"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition group-hover:opacity-100"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-(--color-text)">{page.name}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-(--color-muted-2)">
                      {page.source} · {page.credits} créditos
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        page.status === "Publicada"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-(--color-panel-2) text-(--color-muted)"
                      }`}
                    >
                      {page.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
