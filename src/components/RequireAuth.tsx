import { Navigate } from "react-router-dom"
import { useAuth } from "../lib/auth"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (!loading && !session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className={`t-skel h-screen ${loading ? "" : "is-revealed"}`}>
      <div className="t-skel-skeleton is-pulsing flex h-screen items-center justify-center bg-(--color-base)">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--color-border) border-t-(--color-accent)" />
      </div>
      <div className="t-skel-content h-screen overflow-y-auto">
        {!loading && children}
      </div>
    </div>
  )
}
