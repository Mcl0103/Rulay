import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
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
} from "lucide-react"
import { Sidebar } from "../components/Sidebar"
import { useAuth } from "../lib/auth"

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
const uiLanguages = ["Español", "English"]
const packages = ["Starter", "Growth", "Pro"]

const DEFAULT_WELCOME = "¿Qué producto vamos a lanzar?"

export function Configuracion() {
  const navigate = useNavigate()
  const { signOut } = useAuth()

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

  const [uiLanguage, setUiLanguage] = useState("Español")

  const [saved, setSaved] = useState(false)

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
    setUiLanguage(localStorage.getItem("rulay_ui_language") ?? "Español")
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
    localStorage.setItem("rulay_ui_language", uiLanguage)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

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
      <main className="flex-1 overflow-y-auto bg-(--color-panel)/40 p-6">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-sm text-(--color-muted) transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>

        <div className="mx-auto mt-6 max-w-2xl pb-10">
          <h1 className="text-2xl font-medium text-white">Configuración</h1>
          <p className="mt-1 text-sm text-(--color-muted)">
            Preferencias generales de tu cuenta.
          </p>

          {/* País / moneda / idioma de contenido */}
          <div className="mt-8 rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Globe className="h-4 w-4 text-(--color-accent-2)" />
              País donde operas
            </div>
            <p className="mt-1 text-xs text-(--color-muted-2)">
              Precarga el idioma y la moneda por defecto en tus páginas y landings.
            </p>
            <select
              value={pais}
              onChange={(e) => handlePaisChange(e.target.value)}
              className="mt-3 w-full rounded-xl border border-(--color-border) bg-(--color-panel-2) px-4 py-2.5 text-[15px] text-white focus:border-(--color-border-hover) focus:outline-none"
            >
              <option value="">Selecciona un país…</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {pais && (
              <div className="mt-3 flex gap-2">
                <span className="rounded-full border border-(--color-border) bg-(--color-panel-2) px-3 py-1 text-xs text-(--color-muted)">
                  Moneda: <span className="text-(--color-accent-2)">{divisa}</span>
                </span>
                <span className="rounded-full border border-(--color-border) bg-(--color-panel-2) px-3 py-1 text-xs text-(--color-muted)">
                  Idioma de contenido: <span className="text-(--color-accent-2)">{idioma}</span>
                </span>
              </div>
            )}
          </div>

          {/* Mensaje de bienvenida */}
          <div className="mt-4 rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <MessageSquare className="h-4 w-4 text-(--color-accent-2)" />
              Mensaje de bienvenida
            </div>
            <p className="mt-1 text-xs text-(--color-muted-2)">
              Reemplaza "¿Qué producto vamos a lanzar?" en tu Dashboard.
            </p>
            <input
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder={DEFAULT_WELCOME}
              className="mt-3 w-full rounded-xl border border-(--color-border) bg-(--color-panel-2) px-4 py-2.5 text-[15px] text-white placeholder:text-(--color-muted-2) focus:border-(--color-border-hover) focus:outline-none"
            />
          </div>

          {/* Créditos: alerta de saldo bajo + auto-recarga */}
          <div className="mt-4 rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Coins className="h-4 w-4 text-(--color-accent-2)" />
              Créditos
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-white">Avisarme cuando queden pocos créditos</p>
                <p className="text-xs text-(--color-muted-2)">Te llega un correo cuando bajas del umbral.</p>
              </div>
              <button
                type="button"
                onClick={() => setLowCreditsAlert((v) => !v)}
                role="switch"
                aria-checked={lowCreditsAlert}
                data-on={lowCreditsAlert}
                className={`t-toggle is-init relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  lowCreditsAlert ? "bg-(--color-accent)" : "bg-white/15"
                }`}
              >
                <span className="t-toggle-thumb ml-0.5 block h-4 w-4 rounded-full bg-white" />
              </button>
            </div>
            {lowCreditsAlert && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-(--color-muted)">Avisarme con menos de</span>
                <input
                  type="number"
                  min={1}
                  value={lowCreditsThreshold}
                  onChange={(e) => setLowCreditsThreshold(e.target.value)}
                  className="w-20 rounded-lg border border-(--color-border) bg-(--color-panel-2) px-2 py-1 text-sm text-white focus:outline-none"
                />
                <span className="text-xs text-(--color-muted)">créditos</span>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-(--color-border) pt-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 text-(--color-muted-2)" />
                <div>
                  <p className="text-sm text-white">Auto-recarga de créditos</p>
                  <p className="text-xs text-(--color-muted-2)">
                    Se compra el paquete elegido apenas bajes del umbral.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoRecarga((v) => !v)}
                role="switch"
                aria-checked={autoRecarga}
                data-on={autoRecarga}
                className={`t-toggle is-init relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  autoRecarga ? "bg-(--color-accent)" : "bg-white/15"
                }`}
              >
                <span className="t-toggle-thumb ml-0.5 block h-4 w-4 rounded-full bg-white" />
              </button>
            </div>
            {autoRecarga && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-(--color-muted)">Recargar con menos de</span>
                <input
                  type="number"
                  min={1}
                  value={autoRecargaThreshold}
                  onChange={(e) => setAutoRecargaThreshold(e.target.value)}
                  className="w-20 rounded-lg border border-(--color-border) bg-(--color-panel-2) px-2 py-1 text-sm text-white focus:outline-none"
                />
                <span className="text-xs text-(--color-muted)">créditos, comprando</span>
                <select
                  value={autoRecargaPaquete}
                  onChange={(e) => setAutoRecargaPaquete(e.target.value)}
                  className="rounded-lg border border-(--color-border) bg-(--color-panel-2) px-2 py-1 text-sm text-white focus:outline-none"
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
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <ShieldCheck className="h-4 w-4 text-(--color-accent-2)" />
                Marca de agua en mis imágenes
              </div>
              <button
                type="button"
                onClick={() => setWatermarkOn((v) => !v)}
                role="switch"
                aria-checked={watermarkOn}
                data-on={watermarkOn}
                className={`t-toggle is-init relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  watermarkOn ? "bg-(--color-accent)" : "bg-white/15"
                }`}
              >
                <span className="t-toggle-thumb ml-0.5 block h-4 w-4 rounded-full bg-white" />
              </button>
            </div>
            <p className="mt-1 text-xs text-(--color-muted-2)">
              Sube tu propia marca (no la de Rulay) — se superpone sobre cada imagen generada antes de enviarla a Shopify, para que no te roben las fotos. Es un procesamiento de imagen aparte, no lo hace la IA.
            </p>

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
                      alt="Marca de agua"
                      className="h-12 w-12 rounded-lg bg-black/40 object-contain"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white">Marca cargada</p>
                      <p className="text-xs text-(--color-muted-2)">Se aplica a todas tus imágenes.</p>
                    </div>
                    <button
                      onClick={() => setWatermarkImg(null)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-(--color-muted) transition hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => watermarkInputRef.current?.click()}
                    className="flex w-full items-center gap-2 rounded-xl border border-dashed border-(--color-border) bg-(--color-panel-2) px-4 py-3 text-sm text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-white"
                  >
                    <Upload className="h-4 w-4 shrink-0" />
                    Subir mi marca de agua
                  </button>
                )}
              </div>
            )}
          </div>


          {/* Idioma de la interfaz */}
          <div className="mt-4 rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Languages className="h-4 w-4 text-(--color-accent-2)" />
              Idioma de la interfaz
            </div>
            <p className="mt-1 text-xs text-(--color-muted-2)">
              En qué idioma ves tú los botones y menús de Rulay — distinto del idioma en el que se generan tus páginas.
            </p>
            <select
              value={uiLanguage}
              onChange={(e) => setUiLanguage(e.target.value)}
              className="mt-3 w-full rounded-xl border border-(--color-border) bg-(--color-panel-2) px-4 py-2.5 text-[15px] text-white focus:border-(--color-border-hover) focus:outline-none"
            >
              {uiLanguages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre y avatar */}
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-panel-2) text-(--color-muted)">
                <User className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Nombre y avatar</p>
                <p className="text-xs text-(--color-muted-2)">
                  Se editan desde tu perfil, no acá.
                </p>
              </div>
            </div>
            <Link
              to="/app/perfil"
              className="shrink-0 rounded-full border border-(--color-border) px-4 py-1.5 text-xs font-medium text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-white"
            >
              Ir a Perfil
            </Link>
          </div>

          <button
            onClick={handleSave}
            className="mt-6 rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-white/90"
          >
            {saved ? "Guardado ✓" : "Guardar cambios"}
          </button>

          {/* Privacidad */}
          <div className="mt-10 border-t border-(--color-border) pt-6">
            <p className="text-sm font-medium text-white">Privacidad</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={handleExportData}
                className="flex items-center gap-1.5 rounded-full border border-(--color-border) px-4 py-1.5 text-xs text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-white"
              >
                <Download className="h-3.5 w-3.5" />
                Exportar mis datos
              </button>
              <button
                onClick={handleDeleteData}
                className="flex items-center gap-1.5 rounded-full border border-red-500/20 px-4 py-1.5 text-xs text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Borrar mis datos y cerrar cuenta
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
