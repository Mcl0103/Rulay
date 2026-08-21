import { useEffect, useState } from "react"
import { ArrowLeft, MessageCircle, Sheet, Zap, Check } from "lucide-react"
import { Link } from "react-router-dom"
import { Sidebar } from "../components/Sidebar"
import { StaggerHeader } from "../components/StaggerHeader"
import shopifyLogo from "../assets/shopify-logo-white-bg.webp"
import { useTheme } from "../lib/theme"
import { useLanguage, type TranslationKey } from "../lib/i18n"

const proximamente: { icon: typeof MessageCircle; name: string; descKey: TranslationKey }[] = [
  { icon: MessageCircle, name: "WhatsApp Business", descKey: "integraciones.proximamente.whatsapp" },
  { icon: Sheet, name: "Google Sheets", descKey: "integraciones.proximamente.sheets" },
  { icon: Zap, name: "Zapier", descKey: "integraciones.proximamente.zapier" },
]

export function Integraciones() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [domain, setDomain] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setDomain(localStorage.getItem("rulay_store_domain"))
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    if (domain) localStorage.setItem("rulay_store_domain", domain)
    else localStorage.removeItem("rulay_store_domain")
  }, [domain, loaded])

  function handleConnect() {
    setConnecting(true)
    setTimeout(() => {
      setConnecting(false)
      setDomain("mi-tienda.myshopify.com")
    }, 900)
  }

  function handleDisconnect() {
    setDomain(null)
  }

  return (
    <div className="flex h-screen bg-(--color-base)">
      <Sidebar />
      <main data-theme={theme} className="flex-1 overflow-y-auto bg-(--color-panel)/40 p-6">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-sm text-(--color-muted) transition hover:text-(--color-text)"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("sidebar.dashboard")}
        </Link>

        <div className="mx-auto mt-6 max-w-3xl">
          <StaggerHeader
            title={t("integraciones.titulo")}
            subtitle={t("integraciones.subtitulo")}
          />

          {/* Shopify — integración principal */}
          <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black p-6">
            <div
              className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-3xl"
              style={{ background: "#95BF47" }}
            />

            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 p-2">
                  <img src={shopifyLogo} alt="Shopify" className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-medium text-white">Shopify</p>
                    {domain && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-400">
                        <Check className="h-3 w-3" />
                        {t("integraciones.conectada")}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 max-w-md text-sm text-white/60">
                    Publica tus páginas generadas directo a tu tienda en un
                    clic, sin exportar ni copiar código.
                  </p>
                </div>
              </div>

              {domain ? (
                <button
                  onClick={handleDisconnect}
                  className="shrink-0 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  {t("integraciones.desconectar")}
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {connecting ? (
                    <span className="t-shimmer t-shimmer--on-light" data-text={t("integraciones.conectando")}>
                      {t("integraciones.conectando")}
                    </span>
                  ) : (
                    t("integraciones.conectar")
                  )}
                </button>
              )}
            </div>

            {domain && (
              <div className="relative mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                <p className="flex-1 text-xs text-white/60">{domain}</p>
              </div>
            )}
            <p className="relative mt-3 text-xs text-white/40">
              {t("integraciones.unaTiendaNota")}
            </p>
          </div>

          {/* Próximamente */}
          <div className="mt-10">
            <p className="mb-3 text-sm font-medium text-(--color-text)">{t("integraciones.proximamente")}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {proximamente.map(({ icon: Icon, name, descKey }) => (
                <div
                  key={name}
                  className="relative overflow-hidden rounded-2xl border border-dashed border-(--color-border) bg-(--color-panel) p-4"
                >
                  <div className="pointer-events-none opacity-40">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-panel-2) text-(--color-muted)">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                    <p className="mt-3 text-sm font-medium text-(--color-text)">{name}</p>
                    <p className="mt-1 text-xs text-(--color-muted-2)">{t(descKey)}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-full border border-(--color-border) bg-(--color-panel) px-3 py-1 text-[11px] font-medium text-(--color-muted) shadow-sm">
                      {t("integraciones.proximamente")}
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
