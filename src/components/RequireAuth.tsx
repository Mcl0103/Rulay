import { Navigate } from "react-router-dom"
import { useAuth } from "../lib/auth"
import { Loader } from "./Loader"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (!loading && !session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className={`t-skel h-screen ${loading ? "" : "is-revealed"}`}>
      <div className="t-skel-skeleton is-pulsing h-screen bg-(--color-base)">
        <Loader show={loading} fullscreen={false} />
      </div>
      <div className="t-skel-content h-screen overflow-y-auto">
        {!loading && children}
      </div>
    </div>
  )
}
