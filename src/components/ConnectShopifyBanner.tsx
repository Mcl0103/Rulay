import { useState } from "react"
import { Link } from "react-router-dom"
import { X } from "lucide-react"
import shopifyLogo from "../assets/shopify-logo-white-bg.png"

export function ConnectShopifyBanner() {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (connected || dismissed) return null

  function handleConnect() {
    setConnecting(true)
    setTimeout(() => {
      setConnecting(false)
      setConnected(true)
    }, 900)
  }

  return (
    <div className="relative mb-6 flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-white/10 bg-black px-5 py-4">
      <div
        className="pointer-events-none absolute -left-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "#95BF47" }}
      />

      <div className="relative flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 p-1.5">
          <img src={shopifyLogo} alt="Shopify" className="h-full w-full object-contain" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            Conecta tu tienda Shopify
          </p>
          <p className="text-xs text-(--color-muted)">
            Publica tus páginas generadas directo a tu tienda en un clic.
          </p>
        </div>
      </div>
      <div className="relative flex shrink-0 items-center gap-2">
        {connected ? null : (
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {connecting ? "Conectando…" : "Conectar Shopify"}
          </button>
        )}
        <Link
          to="/app/integraciones"
          className="hidden text-xs text-(--color-muted) transition hover:text-white sm:block"
        >
          Ver integraciones
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="flex h-7 w-7 items-center justify-center rounded-full text-(--color-muted) transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
