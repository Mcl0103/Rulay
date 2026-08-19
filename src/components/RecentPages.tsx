import { ExternalLink, FileText, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

// Cuenta nueva: sin páginas creadas todavía.
const pages: {
  name: string
  source: string
  status: string
  credits: number
  gradient: string
}[] = []

export function RecentPages() {
  return (
    <div className="mt-10">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-white">Páginas recientes</h2>
        <Link
          to="/app/paginas"
          className="text-xs text-(--color-muted) hover:text-white"
        >
          Ver todas
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--color-border) bg-(--color-panel) px-6 py-14 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-panel-2) text-(--color-muted)">
            <FileText className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-medium text-white">
            Aún no has creado páginas
          </p>
          <p className="mt-1 max-w-xs text-xs text-(--color-muted-2)">
            Crea tu primera página con IA y aparecerá aquí.
          </p>
          <Link
            to="/app/generar"
            className="mt-4 flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-black transition hover:bg-white/90"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Crear primera página con IA
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
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
                <p className="text-sm font-medium text-white">{page.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-(--color-muted-2)">
                    {page.source} · {page.credits} créditos
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      page.status === "Publicada"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-white/5 text-(--color-muted)"
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
    </div>
  )
}
