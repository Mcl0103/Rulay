import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLanguage } from "./i18n"

type UnsavedGuardContextValue = {
  dirty: boolean
  setDirty: (d: boolean) => void
  registerSave: (fn: (() => void) | null) => void
  requestNavigation: (path: string) => boolean
}

const UnsavedGuardContext = createContext<UnsavedGuardContextValue | null>(null)

export function UnsavedGuardProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [dirty, setDirty] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)
  const saveRef = useRef<(() => void) | null>(null)

  const registerSave = useCallback((fn: (() => void) | null) => {
    saveRef.current = fn
  }, [])

  const requestNavigation = useCallback(
    (path: string) => {
      if (!dirty) return true
      setPendingPath(path)
      return false
    },
    [dirty],
  )

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!dirty) return
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [dirty])

  function handleDiscard() {
    if (!pendingPath) return
    setDirty(false)
    const path = pendingPath
    setPendingPath(null)
    navigate(path)
  }

  function handleSaveAndLeave() {
    if (!pendingPath) return
    saveRef.current?.()
    setDirty(false)
    const path = pendingPath
    setPendingPath(null)
    navigate(path)
  }

  return (
    <UnsavedGuardContext.Provider value={{ dirty, setDirty, registerSave, requestNavigation }}>
      {children}
      {pendingPath && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="t-toast pointer-events-auto flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-panel-2) px-4 py-3 shadow-xl">
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-(--color-accent-2)" />
            <p className="text-sm text-(--color-text)">{t("guard.cambiosSinGuardar")}</p>
            <div className="ml-1 flex items-center gap-2">
              <button
                onClick={() => setPendingPath(null)}
                className="rounded-full px-2.5 py-1 text-xs text-(--color-muted) transition hover:text-(--color-text)"
              >
                {t("guard.seguirEditando")}
              </button>
              <button
                onClick={handleDiscard}
                className="rounded-full px-2.5 py-1 text-xs text-(--color-muted) transition hover:text-(--color-text)"
              >
                {t("guard.descartar")}
              </button>
              <button
                onClick={handleSaveAndLeave}
                className="rounded-full bg-(--color-primary) px-3 py-1 text-xs font-medium text-(--color-on-primary) transition hover:opacity-90"
              >
                {t("guard.guardarYSalir")}
              </button>
            </div>
          </div>
        </div>
      )}
    </UnsavedGuardContext.Provider>
  )
}

export function useUnsavedGuard() {
  const ctx = useContext(UnsavedGuardContext)
  if (!ctx) throw new Error("useUnsavedGuard debe usarse dentro de <UnsavedGuardProvider>")
  return ctx
}

export function GuardedLink({ to, onClick, ...rest }: ComponentProps<typeof Link>) {
  const { requestNavigation } = useUnsavedGuard()

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (e.defaultPrevented) return
    const path = typeof to === "string" ? to : (to.pathname ?? "")
    if (!requestNavigation(path)) e.preventDefault()
  }

  return <Link to={to} onClick={handleClick} {...rest} />
}
