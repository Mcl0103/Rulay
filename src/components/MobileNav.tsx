import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { LayoutGrid, FileText, ImagePlus, UserRound, X } from "lucide-react"
import { GuardedLink } from "../lib/unsavedGuard"
import { paginasItems, imagenesItems, cuentaItems } from "./Sidebar"
import { useAuth } from "../lib/auth"
import { useLanguage } from "../lib/i18n"

type SheetGroup = "paginas" | "imagenes" | "cuenta" | null

/**
 * Bottom tab bar para mobile — reemplaza al Sidebar (oculto por debajo de
 * md). Los 3 grupos con más de un destino abren un sheet inferior con los
 * mismos items que el Sidebar (misma fuente de datos), así la navegación
 * mobile tiene exactamente la misma cobertura que la de escritorio.
 */
export function MobileNav() {
  const { pathname } = useLocation()
  const { t } = useLanguage()
  const { user } = useAuth()

  // El sheet queda montado mientras `sheetGroup` no es null — is-open/
  // is-closing controlan la animación .t-modal (index.css), y solo se
  // desmonta después de --modal-close-dur para que la salida se vea.
  const [sheetGroup, setSheetGroup] = useState<SheetGroup>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalClosing, setModalClosing] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  function openGroup(group: Exclude<SheetGroup, null>) {
    window.clearTimeout(closeTimer.current)
    setModalClosing(false)
    setSheetGroup(group)
    requestAnimationFrame(() => requestAnimationFrame(() => setModalOpen(true)))
  }

  function closeSheet() {
    setModalOpen(false)
    setModalClosing(true)
    closeTimer.current = window.setTimeout(() => {
      setModalClosing(false)
      setSheetGroup(null)
    }, 150)
  }

  function groupActive(items: { to: string }[]) {
    return items.some((i) => i.to === pathname)
  }

  const sheetItems =
    sheetGroup === "paginas" ? paginasItems : sheetGroup === "imagenes" ? imagenesItems : cuentaItems
  const sheetTitle =
    sheetGroup === "paginas"
      ? t("sidebar.paginas")
      : sheetGroup === "imagenes"
        ? t("sidebar.imagenesGrupo")
        : t("sidebar.cuenta")

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-(--color-border) bg-(--color-panel)/95 px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <TabLink to="/app" icon={LayoutGrid} label={t("sidebar.inicio")} active={pathname === "/app"} />
        <TabButton
          icon={FileText}
          label={t("sidebar.paginas")}
          active={groupActive(paginasItems)}
          onClick={() => openGroup("paginas")}
        />
        <TabButton
          icon={ImagePlus}
          label={t("sidebar.imagenesGrupo")}
          active={groupActive(imagenesItems)}
          onClick={() => openGroup("imagenes")}
        />
        <TabButton
          icon={UserRound}
          label={t("sidebar.cuenta")}
          active={groupActive(cuentaItems) || pathname === "/app/perfil"}
          onClick={() => openGroup("cuenta")}
        />
      </nav>

      {sheetGroup && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={closeSheet}>
          <div className={`t-modal absolute inset-0 bg-black/50 ${modalOpen ? "is-open" : ""} ${modalClosing ? "is-closing" : ""}`} />
          <div
            onClick={(e) => e.stopPropagation()}
            className={`t-modal absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-(--color-border) bg-(--color-panel) p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] ${modalOpen ? "is-open" : ""} ${modalClosing ? "is-closing" : ""}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-(--color-text)">{sheetTitle}</p>
              <button
                onClick={closeSheet}
                className="flex h-7 w-7 items-center justify-center rounded-full text-(--color-muted) transition hover:bg-black/10 hover:text-(--color-text)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-0.5">
              {sheetGroup === "cuenta" && (
                <GuardedLink
                  to="/app/perfil"
                  onClick={closeSheet}
                  className="flex min-h-11 items-center gap-2.5 rounded-lg px-3 py-3 text-sm text-(--color-muted) transition hover:bg-(--color-panel-2) hover:text-(--color-text)"
                >
                  <UserRound className="h-4 w-4" strokeWidth={1.75} />
                  {user?.user_metadata?.full_name || user?.user_metadata?.name || t("perfil.titulo")}
                </GuardedLink>
              )}
              {sheetItems.map((item) => (
                <GuardedLink
                  key={item.labelKey}
                  to={item.to}
                  onClick={closeSheet}
                  className="flex min-h-11 items-center gap-2.5 rounded-lg px-3 py-3 text-sm text-(--color-muted) transition hover:bg-(--color-panel-2) hover:text-(--color-text)"
                >
                  <item.icon className="h-4 w-4" strokeWidth={1.75} />
                  {t(item.labelKey)}
                </GuardedLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function TabLink({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string
  icon: typeof LayoutGrid
  label: string
  active: boolean
}) {
  return (
    <GuardedLink
      to={to}
      className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-[11px] transition ${
        active ? "text-(--color-accent-2)" : "text-(--color-muted)"
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
      {label}
    </GuardedLink>
  )
}

function TabButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof LayoutGrid
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-[11px] transition ${
        active ? "text-(--color-accent-2)" : "text-(--color-muted)"
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
      {label}
    </button>
  )
}
