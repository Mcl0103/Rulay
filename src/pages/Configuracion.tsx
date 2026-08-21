import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Globe, MessageSquare, User } from "lucide-react"
import { Sidebar } from "../components/Sidebar"

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

const DEFAULT_WELCOME = "¿Qué producto vamos a lanzar?"

export function Configuracion() {
  const [pais, setPais] = useState("")
  const [idioma, setIdioma] = useState("")
  const [welcomeMessage, setWelcomeMessage] = useState("")
  const [saved, setSaved] = useState(false)
  const divisa = countryCurrency[pais]

  useEffect(() => {
    setPais(localStorage.getItem("rulay_pais") ?? "")
    setIdioma(localStorage.getItem("rulay_idioma") ?? "")
    setWelcomeMessage(localStorage.getItem("rulay_welcome_message") ?? "")
  }, [])

  function handlePaisChange(value: string) {
    setPais(value)
    if (value) setIdioma(countryLanguage[value])
  }

  function handleSave() {
    localStorage.setItem("rulay_pais", pais)
    localStorage.setItem("rulay_idioma", idioma)
    localStorage.setItem("rulay_moneda", divisa ?? "")
    localStorage.setItem("rulay_welcome_message", welcomeMessage)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
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

        <div className="mx-auto mt-6 max-w-2xl">
          <h1 className="text-2xl font-medium text-white">Configuración</h1>
          <p className="mt-1 text-sm text-(--color-muted)">
            Preferencias generales de tu cuenta — moneda, idioma y el saludo de tu Dashboard.
          </p>

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
                  Idioma: <span className="text-(--color-accent-2)">{idioma}</span>
                </span>
              </div>
            )}
          </div>

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
        </div>
      </main>
    </div>
  )
}
