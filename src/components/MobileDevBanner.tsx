import { useEffect, useState } from "react"
import { TriangleAlert, X } from "lucide-react"
import { useLanguage } from "../lib/i18n"

const DISMISS_KEY = "rulay_mobile_wip_dismissed"

/**
 * Aviso "mobile en desarrollo" — dismissible, se acuerda por dispositivo
 * vía localStorage. Se renderiza en cada pantalla (no fijo/sticky, es
 * contenido normal) porque Rulay todavía no tiene un shell/layout
 * compartido entre páginas de /app/*.
 */
export function MobileDevBanner() {
  const { t } = useLanguage()
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "true")
  }, [])

  if (dismissed) return null

  return (
    <div className="mb-4 flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-panel-2) px-3.5 py-2.5 text-xs text-(--color-muted) md:hidden">
      <TriangleAlert className="h-3.5 w-3.5 shrink-0 text-(--color-accent-2)" />
      <p className="flex-1">{t("mobileBanner.texto")}</p>
      <button
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, "true")
          setDismissed(true)
        }}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-(--color-muted) transition hover:bg-black/10 hover:text-(--color-text)"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
