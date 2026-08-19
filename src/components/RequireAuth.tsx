import { Navigate } from "react-router-dom"
import { useAuth } from "../lib/auth"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-(--color-base)">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--color-border) border-t-(--color-accent)" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
