import { useState } from "react"
import { ArrowLeft, MessageCircle, Sheet, Zap, Check } from "lucide-react"
import { Link } from "react-router-dom"
import { Sidebar } from "../components/Sidebar"
import shopifyLogo from "../assets/shopify-logo-white-bg.png"

const proximamente = [
  { icon: MessageCircle, name: "WhatsApp Business", desc: "Envía tus páginas generadas por chat automáticamente." },
  { icon: Sheet, name: "Google Sheets", desc: "Sincroniza tus productos y páginas con una hoja de cálculo." },
  { icon: Zap, name: "Zapier", desc: "Conecta Rulay con miles de apps sin código." },
]

export function Integraciones() {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)

  function handleConnect() {
    setConnecting(true)
    setTimeout(() => {
      setConnecting(false)
      setConnected(true)
    }, 900)
  }

  return (
    <div className="flex h-screen bg-(--color-base)">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-(--color-panel)/40 p-6">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-sm text-(--color-muted) transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>

        <div className="mx-auto mt-6 max-w-3xl">
          <h1 className="text-2xl font-medium text-white">Integraciones</h1>
          <p className="mt-1 text-sm text-(--color-muted)">
            Conecta tus herramientas para publicar y automatizar directo desde Rulay.
          </p>

          {/* Shopify — integración principal */}
          <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black p-6">
            <div
              className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-3xl"
              style={{ background: "#95BF47" }}
            />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 p-2">
                  <img src={shopifyLogo} alt="Shopify" className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-medium text-white">Shopify</p>
                    {connected && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-400">
                        <Check className="h-3 w-3" />
                        Conectada
                      </span>
                    )}
                  </div>
                  <p className="mt-1 max-w-md text-sm text-(--color-muted)">
                    Publica tus páginas generadas directo a tu tienda en un
                    clic, sin exportar ni copiar código.
                  </p>
                </div>
              </div>

              {connected ? (
                <button className="shrink-0 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-(--color-muted) transition hover:border-white/30 hover:text-white">
                  Desconectar
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {connecting ? (
                    <span className="t-shimmer t-shimmer--on-light" data-text="Conectando…">
                      Conectando…
                    </span>
                  ) : (
                    "Conectar Shopify"
                  )}
                </button>
              )}
            </div>

            {connected && (
              <div className="relative mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                <p className="text-xs text-(--color-muted)">
                  mi-tienda.myshopify.com
                </p>
              </div>
            )}
          </div>

          {/* Próximamente */}
          <div className="mt-10">
            <p className="mb-3 text-sm font-medium text-white">Próximamente</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {proximamente.map(({ icon: Icon, name, desc }) => (
                <div
                  key={name}
                  className="relative overflow-hidden rounded-2xl border border-dashed border-(--color-border) bg-(--color-panel) p-4"
                >
                  <div className="pointer-events-none blur-[3px]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-panel-2) text-(--color-muted)">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                    <p className="mt-3 text-sm font-medium text-white">{name}</p>
                    <p className="mt-1 text-xs text-(--color-muted-2)">{desc}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="rounded-full border border-(--color-border) bg-(--color-panel) px-3 py-1 text-[11px] text-(--color-muted)">
                      Próximamente
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
