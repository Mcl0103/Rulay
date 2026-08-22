import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Globe,
  MessageSquare,
  User,
  Coins,
  RefreshCw,
  ShieldCheck,
  Languages,
  Download,
  Trash2,
  Upload,
  X,
  Moon,
  Sun,
} from "lucide-react"
import { Sidebar } from "../components/Sidebar"
import { MobileDevBanner } from "../components/MobileDevBanner"
import { StaggerHeader } from "../components/StaggerHeader"
import { useAuth } from "../lib/auth"
import { useTheme, type Theme } from "../lib/theme"
import { useLanguage, type Lang } from "../lib/i18n"
import { GuardedLink, useUnsavedGuard } from "../lib/unsavedGuard"

const countryCurrency: Record<string, string> = {
  Colombia: "COP",
  México: "MXN",
  Perú: "PEN",
  Chile: "CLP",
  Argentina: "ARS",
  Ecuador: "USD",
  "Estados Unidos": "USD",
  España: "EUR",
}
const countryLanguage: Record<string, string> = {
  Colombia: "Español",
  México: "Español",
  Perú: "Español",
  Chile: "Español",
  Argentina: "Español",
  Ecuador: "Español",
  "Estados Unidos": "English",
  España: "Español",
}
const countries = Object.keys(countryCurrency)
const packages = ["Starter", "Growth", "Pro"]

export function Configuracion() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()

  const [pais, setPais] = useState("")
  const [idioma, setIdioma] = useState("")
  const [welcomeMessage, setWelcomeMessage] = useState("")
  const divisa = countryCurrency[pais]

  const [lowCreditsAlert, setLowCreditsAlert] = useState(false)
  const [lowCreditsThreshold, setLowCreditsThreshold] = useState("50")

  const [autoRecarga, setAutoRecarga] = useState(false)
  const [autoRecargaThreshold, setAutoRecargaThreshold] = useState("20")
  const [autoRecargaPaquete, setAutoRecargaPaquete] = useState("Starter")

  const [watermarkOn, setWatermarkOn] = useState(false)
  const [watermarkImg, setWatermarkImg] = useState<string | null>(null)
  const watermarkInputRef = useRef<HTMLInputElement>(null)

  // Tema e idioma de interfaz solo se aplican al pulsar "Guardar cambios",
  // no en cuanto se hace clic — así el usuario no queda con un cambio a
  // medias si navega a otra página antes de guardar.
  const [pendingTheme, setPendingTheme] = useState<Theme>(theme)
  const [pendingLang, setPendingLang] = useState<Lang>(lang)

  const [saved, setSaved] = useState(false)
  const hasUnsavedAppearance = pendingTheme !== theme || pendingLang !== lang

  const [loaded, setLoaded] = useState(false)
  const savedSnapshotRef = useRef("")
  const { setDirty, registerSave } = useUnsavedGuard()

  useEffect(() => {
    setPais(localStorage.getItem("rulay_pais") ?? "")
    setIdioma(localStorage.getItem("rulay_idioma") ?? "")
    setWelcomeMessage(localStorage.getItem("rulay_welcome_message") ?? "")
    setLowCreditsAlert(localStorage.getItem("rulay_low_credits_alert") === "true")
    setLowCreditsThreshold(localStorage.getItem("rulay_low_credits_threshold") ?? "50")
    setAutoRecarga(localStorage.getItem("rulay_auto_recarga") === "true")
    setAutoRecargaThreshold(localStorage.getItem("rulay_auto_recarga_threshold") ?? "20")
    setAutoRecargaPaquete(localStorage.getItem("rulay_auto_recarga_paquete") ?? "Starter")
    setWatermarkOn(localStorage.getItem("rulay_watermark_on") === "true")
    setWatermarkImg(localStorage.getItem("rulay_watermark_img"))
    setLoaded(true)
  }, [])

  const currentSnapshot = JSON.stringify({
    pais,
    welcomeMessage,
    lowCreditsAlert,
    lowCreditsThreshold,
    autoRecarga,
    autoRecargaThreshold,
    autoRecargaPaquete,
    watermarkOn,
    watermarkImg,
    pendingTheme,
    pendingLang,
  })

  useEffect(() => {
    if (!loaded) return
    if (!savedSnapshotRef.current) savedSnapshotRef.current = currentSnapshot
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  const dirty = loaded && currentSnapshot !== savedSnapshotRef.current

  useEffect(() => {
    setDirty(dirty)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  useEffect(() => {
    return () => setDirty(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handlePaisChange(value: string) {
    setPais(value)
    if (value) setIdioma(countryLanguage[value])
  }

  function handleWatermarkChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setWatermarkImg(URL.createObjectURL(file))
  }

  function handleSave() {
    localStorage.setItem("rulay_pais", pais)
    localStorage.setItem("rulay_idioma", idioma)
    localStorage.setItem("rulay_moneda", divisa ?? "")
    localStorage.setItem("rulay_welcome_message", welcomeMessage)
    localStorage.setItem("rulay_low_credits_alert", String(lowCreditsAlert))
    localStorage.setItem("rulay_low_credits_threshold", lowCreditsThreshold)
    localStorage.setItem("rulay_auto_recarga", String(autoRecarga))
    localStorage.setItem("rulay_auto_recarga_threshold", autoRecargaThreshold)
    localStorage.setItem("rulay_auto_recarga_paquete", autoRecargaPaquete)
    localStorage.setItem("rulay_watermark_on", String(watermarkOn))
    if (watermarkImg) localStorage.setItem("rulay_watermark_img", watermarkImg)
    if (pendingTheme !== theme) setTheme(pendingTheme)
    if (pendingLang !== lang) setLang(pendingLang)
    savedSnapshotRef.current = currentSnapshot
    setDirty(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  useEffect(() => {
    registerSave(handleSave)
    return () => registerSave(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSnapshot, theme, lang])

  function handleExportData() {
    const data: Record<string, string | null> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("rulay_")) data[key] = localStorage.getItem(key)
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "rulay-mis-datos.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDeleteData() {
    const ok = window.confirm(
      "Esto borra tus preferencias guardadas en este navegador y cierra tu sesión. ¿Continuar?",
    )
    if (!ok) return
    Object.keys(localStorage)
      .filter((k) => k.startsWith("rulay_"))
      .forEach((k) => localStorage.removeItem(k))
    await signOut()
    navigate("/login")
  }

  return (
    <div className="flex h-screen bg-(--color-base)">
      <Sidebar />
      <main data-theme={theme} className="flex-1 overflow-y-auto bg-(--color-panel)/40 p-4 pb-24 md:p-6">
        <MobileDevBanner />
        <GuardedLink
          to="/app"
          className="inline-flex items-center gap-2 text-sm text-(--color-muted) transition hover:text-(--color-text)"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("sidebar.dashboard")}
        </GuardedLink>

        <div className="mx-auto mt-6 max-w-2xl pb-10">
          <StaggerHeader title={t("config.titulo")} subtitle={t("config.subtitulo")} />

          {/* Apariencia */}
          <div className="mt-8 rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-(--color-text)">
              <Moon className="h-4 w-4 text-(--color-accent-2)" />
              {t("config.apariencia")}
            </div>
            <p className="mt-1 text-xs text-(--color-muted-2)">{t("config.apparienciaDesc")}</p>
            <button
              type="button"
              onClick={() => setPendingTheme(pendingTheme === "dark" ? "light" : "dark")}
              className="mt-3 flex items-center gap-2 rounded-full border border-(--color-accent) bg-(--color-accent)/15 px-3.5 py-1.5 text-xs text-(--color-text) transition hover:border-(--color-border-hover)"
            >
              <span className="t-icon-swap h-3.5 w-3.5" data-state={pendingTheme === "dark" ? "a" : "b"}>
                <Moon className="t-icon h-3.5 w-3.5" data-icon="a" />
                <Sun className="t-icon h-3.5 w-3.5" data-icon="b" />
              </span>
              {pendingTheme === "dark" ? t("config.oscuro") : t("config.claro")}
            </button>
          </div>

          {/* País / moneda / idioma de contenido */}
          <div className="mt-4 rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-(--color-text)">
              <Globe className="h-4 w-4 text-(--color-accent-2)" />
              {t("config.pais")}
            </div>
            <p className="mt-1 text-xs text-(--color-muted-2)">{t("config.paisDesc")}</p>
            <select
              value={pais}
              onChange={(e) => handlePaisChange(e.target.value)}
              className="mt-3 w-full rounded-xl border border-(--color-border) bg-(--color-panel-2) px-4 py-2.5 text-[15px] text-(--color-text) focus:border-(--color-border-hover) focus:outline-none"
            >
              <option value="">{t("config.selecciona")}</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {pais && (
              <div className="mt-3 flex gap-2">
                <span className="rounded-full border border-(--color-border) bg-(--color-panel-2) px-3 py-1 text-xs text-(--color-muted)">
                  {t("config.moneda")}: <span className="text-(--color-accent-2)">{divisa}</span>
                </span>
                <span className="rounded-full border border-(--color-border) bg-(--color-panel-2) px-3 py-1 text-xs text-(--color-muted)">
                  {t("config.idiomaContenido")}: <span className="text-(--color-accent-2)">{idioma}</span>
                </span>
              </div>
            )}
          </div>

          {/* Mensaje de bienvenida */}
          <div className="mt-4 rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-(--color-text)">
              <MessageSquare className="h-4 w-4 text-(--color-accent-2)" />
              {t("config.mensajeBienvenida")}
            </div>
            <p className="mt-1 text-xs text-(--color-muted-2)">{t("config.mensajeBienvenidaDesc")}</p>
            <input
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder={t("dashboard.bienvenidaDefault")}
              className="mt-3 w-full rounded-xl border border-(--color-border) bg-(--color-panel-2) px-4 py-2.5 text-[15px] text-(--color-text) placeholder:text-(--color-muted-2) focus:border-(--color-border-hover) focus:outline-none"
            />
          </div>

          {/* Créditos: alerta de saldo bajo + auto-recarga */}
          <div className="mt-4 rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-(--color-text)">
              <Coins className="h-4 w-4 text-(--color-accent-2)" />
              {t("config.creditos")}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-(--color-text)">{t("config.avisarSaldoBajo")}</p>
                <p className="text-xs text-(--color-muted-2)">{t("config.avisarSaldoBajoDesc")}</p>
              </div>
              <button
                type="button"
                onClick={() => setLowCreditsAlert((v) => !v)}
                role="switch"
                aria-checked={lowCreditsAlert}
                data-on={lowCreditsAlert}
                className={`t-toggle is-init relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  lowCreditsAlert ? "bg-(--color-accent)" : "bg-(--color-muted-2)/35"
                }`}
              >
                <span className="t-toggle-thumb ml-0.5 block h-4 w-4 rounded-full bg-white" />
              </button>
            </div>
            {lowCreditsAlert && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-(--color-muted)">{t("config.avisarMenosDe")}</span>
                <input
                  type="number"
                  min={1}
                  value={lowCreditsThreshold}
                  onChange={(e) => setLowCreditsThreshold(e.target.value)}
                  className="w-20 rounded-lg border border-(--color-border) bg-(--color-panel-2) px-2 py-1 text-sm text-(--color-text) focus:outline-none"
                />
                <span className="text-xs text-(--color-muted)">{t("config.creditosPalabra")}</span>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-(--color-border) pt-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 text-(--color-muted-2)" />
                <div>
                  <p className="text-sm text-(--color-text)">{t("config.autoRecarga")}</p>
                  <p className="text-xs text-(--color-muted-2)">{t("config.autoRecargaDesc")}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoRecarga((v) => !v)}
                role="switch"
                aria-checked={autoRecarga}
                data-on={autoRecarga}
                className={`t-toggle is-init relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  autoRecarga ? "bg-(--color-accent)" : "bg-(--color-muted-2)/35"
                }`}
              >
                <span className="t-toggle-thumb ml-0.5 block h-4 w-4 rounded-full bg-white" />
              </button>
            </div>
            {autoRecarga && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-(--color-muted)">{t("config.recargarCon")}</span>
                <input
                  type="number"
                  min={1}
                  value={autoRecargaThreshold}
                  onChange={(e) => setAutoRecargaThreshold(e.target.value)}
                  className="w-20 rounded-lg border border-(--color-border) bg-(--color-panel-2) px-2 py-1 text-sm text-(--color-text) focus:outline-none"
                />
                <span className="text-xs text-(--color-muted)">{t("config.comprando")}</span>
                <select
                  value={autoRecargaPaquete}
                  onChange={(e) => setAutoRecargaPaquete(e.target.value)}
                  className="rounded-lg border border-(--color-border) bg-(--color-panel-2) px-2 py-1 text-sm text-(--color-text) focus:outline-none"
                >
                  {packages.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Marca de agua propia */}
          <div className="mt-4 rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-(--color-text)">
                <ShieldCheck className="h-4 w-4 text-(--color-accent-2)" />
                {t("config.marcaAgua")}
              </div>
              <button
                type="button"
                onClick={() => setWatermarkOn((v) => !v)}
                role="switch"
                aria-checked={watermarkOn}
                data-on={watermarkOn}
                className={`t-toggle is-init relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  watermarkOn ? "bg-(--color-accent)" : "bg-(--color-muted-2)/35"
                }`}
              >
                <span className="t-toggle-thumb ml-0.5 block h-4 w-4 rounded-full bg-white" />
              </button>
            </div>
            <p className="mt-1 text-xs text-(--color-muted-2)">{t("config.marcaAguaDesc")}</p>

            {watermarkOn && (
              <div className="mt-3">
                <input
                  ref={watermarkInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleWatermarkChange}
                  className="hidden"
                />
                {watermarkImg ? (
                  <div className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-panel-2) p-3">
                    <img
                      src={watermarkImg}
                      alt={t("config.marcaCargada")}
                      className="h-12 w-12 rounded-lg bg-black/40 object-contain"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-(--color-text)">{t("config.marcaCargada")}</p>
                      <p className="text-xs text-(--color-muted-2)">{t("config.marcaCargadaDesc")}</p>
                    </div>
                    <button
                      onClick={() => setWatermarkImg(null)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-(--color-muted) transition hover:bg-black/10 hover:text-(--color-text)"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => watermarkInputRef.current?.click()}
                    className="flex w-full items-center gap-2 rounded-xl border border-dashed border-(--color-border) bg-(--color-panel-2) px-4 py-3 text-sm text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-(--color-text)"
                  >
                    <Upload className="h-4 w-4 shrink-0" />
                    {t("config.subirMarca")}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Idioma de la interfaz */}
          <div className="mt-4 rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-(--color-text)">
              <Languages className="h-4 w-4 text-(--color-accent-2)" />
              {t("config.idiomaInterfaz")}
            </div>
            <p className="mt-1 text-xs text-(--color-muted-2)">{t("config.idiomaInterfazDesc")}</p>
            <select
              value={pendingLang}
              onChange={(e) => setPendingLang(e.target.value as Lang)}
              className="mt-3 w-full rounded-xl border border-(--color-border) bg-(--color-panel-2) px-4 py-2.5 text-[15px] text-(--color-text) focus:border-(--color-border-hover) focus:outline-none"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Nombre y avatar */}
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-panel-2) text-(--color-muted)">
                <User className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-medium text-(--color-text)">{t("config.nombreAvatar")}</p>
                <p className="text-xs text-(--color-muted-2)">{t("config.nombreAvatarDesc")}</p>
              </div>
            </div>
            <GuardedLink
              to="/app/perfil"
              className="shrink-0 rounded-full border border-(--color-border) px-4 py-1.5 text-xs font-medium text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-(--color-text)"
            >
              {t("config.irAPerfil")}
            </GuardedLink>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSave}
              className="rounded-full bg-(--color-primary) px-5 py-2 text-sm font-medium text-(--color-on-primary) transition hover:opacity-90"
            >
              {saved ? `${t("config.guardado")} ✓` : t("config.guardarCambios")}
            </button>
            {hasUnsavedAppearance && !saved && (
              <span className="text-xs text-(--color-muted-2)">{t("config.cambiosSinGuardar")}</span>
            )}
          </div>

          {/* Privacidad */}
          <div className="mt-10 border-t border-(--color-border) pt-6">
            <p className="text-sm font-medium text-(--color-text)">{t("config.privacidad")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={handleExportData}
                className="flex items-center gap-1.5 rounded-full border border-(--color-border) px-4 py-1.5 text-xs text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-(--color-text)"
              >
                <Download className="h-3.5 w-3.5" />
                {t("config.exportarDatos")}
              </button>
              <button
                onClick={handleDeleteData}
                className="flex items-center gap-1.5 rounded-full border border-red-500/20 px-4 py-1.5 text-xs text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t("config.borrarDatos")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
