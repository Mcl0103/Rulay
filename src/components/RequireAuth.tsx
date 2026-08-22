import { CircleHelp } from "lucide-react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../lib/auth"
import { useLanguage } from "../lib/i18n"
import { GuardedLink } from "../lib/unsavedGuard"
import { Loader } from "./Loader"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const { t } = useLanguage()

  if (!loading && !session) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <div className={`t-skel h-screen ${loading ? "" : "is-revealed"}`}>
        <div className="t-skel-skeleton is-pulsing h-screen bg-(--color-base)">
          <Loader show={loading} fullscreen={false} />
        </div>
        <div className="t-skel-content h-screen overflow-y-auto">
          {!loading && children}
        </div>
      </div>

      {!loading && (
        <GuardedLink
          to="/app/ayuda"
          title={t("sidebar.centroAyuda")}
          className="fixed right-4 bottom-24 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-(--color-panel-2) text-(--color-muted) shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)] transition hover:text-white md:right-6 md:bottom-6"
        >
          <CircleHelp className="h-5 w-5" />
        </GuardedLink>
      )}
    </>
  )
}
