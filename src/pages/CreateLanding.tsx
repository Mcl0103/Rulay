import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Smartphone,
  Sparkles,
  Upload,
  X,
  ChevronDown,
  Image as ImageIcon,
  Layers,
  FolderOpen,
} from "lucide-react"
import { BorderBeam } from "border-beam"
import { Sidebar } from "../components/Sidebar"

type SectionType =
  | "hero"
  | "oferta"
  | "beneficios"
  | "antes-despues"
  | "testimonios"
  | "logistica"
  | "faq"

const sections: { id: SectionType; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "oferta", label: "Oferta" },
  { id: "beneficios", label: "Beneficios" },
  { id: "antes-despues", label: "Antes / Después" },
  { id: "testimonios", label: "Testimonios" },
  { id: "logistica", label: "Logística" },
  { id: "faq", label: "FAQ" },
]

type ReferenceMode = "ninguna" | "galeria" | "subir"

const SECTION_COST = 5
const FULL_PAGE_COST = 30 // bundle: 7 secciones sueltas = 35cr, la página completa sale con descuento
const AI_ANGLE_COST = 1 // es texto, no imagen — mucho más barato
const BALANCE = 180

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
const countries = Object.keys(countryCurrency)

export function CreateLanding() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null])
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  const [anguloName, setAnguloName] = useState("")
  const [prompt, setPrompt] = useState("")
  const [aiAngle, setAiAngle] = useState(false)
  const [aiAngleToggleInit, setAiAngleToggleInit] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [publico, setPublico] = useState("")
  const [precio, setPrecio] = useState("")
  const [pais, setPais] = useState("")
  const divisa = countryCurrency[pais]

  const [selectedSections, setSelectedSections] = useState<SectionType[]>(["hero"])
  const isFullPage = selectedSections.length === sections.length

  const [referenceMode, setReferenceMode] = useState<ReferenceMode>("ninguna")
  const referenceFileRef = useRef<HTMLInputElement>(null)
  const [referenceImage, setReferenceImage] = useState<string | null>(null)

  const sectionsCost = isFullPage ? FULL_PAGE_COST : selectedSections.length * SECTION_COST
  const total = sectionsCost + (aiAngle ? AI_ANGLE_COST : 0)
  const remaining = BALANCE - total
  const hasPhoto = photos.some((p) => p)

  function toggleAiAngle() {
    setAiAngleToggleInit(true)
    setAiAngle((v) => !v)
  }

  function toggleSection(id: SectionType) {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
  }

  function toggleFullPage() {
    setSelectedSections(isFullPage ? ["hero"] : sections.map((s) => s.id))
  }

  function handlePhotoChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotos((prev) => {
      const next = [...prev]
      next[index] = URL.createObjectURL(file)
      return next
    })
  }

  function handleReferenceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setReferenceImage(URL.createObjectURL(file))
  }

  return (
    <div className="flex h-screen bg-(--color-base)">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-y-auto bg-(--color-panel)/40 p-6">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-sm text-(--color-muted) transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>

        <div className="mx-auto w-full max-w-3xl py-10">
          <div className={`t-stagger ${shown ? "is-shown" : ""}`}>
            <h1 className="t-stagger-line t-stagger-line--1 text-2xl font-medium text-white">
              Landing con Imágenes
            </h1>
            <p className="t-stagger-line t-stagger-line--2 mt-1 text-sm text-(--color-muted)">
              Genera secciones de landing listas para pegar en tu página de Shopify.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
            <div className="flex flex-col gap-6">
              {/* Fotos del producto — primero, la IA los necesita antes que nada */}
              <div>
                <label className="mb-2 block text-sm text-(--color-muted)">
                  Fotos del producto <span className="text-(--color-muted-2)">· 1 a 3, obligatorio</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo, i) => (
                    <div key={i}>
                      <input
                        ref={fileInputRefs[i]}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoChange(i, e)}
                        className="hidden"
                      />
                      {photo ? (
                        <div className="relative">
                          <img
                            src={photo}
                            alt={`Imagen ${i + 1}`}
                            className="aspect-square w-full rounded-xl object-cover"
                          />
                          <button
                            onClick={() =>
                              setPhotos((prev) => {
                                const next = [...prev]
                                next[i] = null
                                return next
                              })
                            }
                            className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRefs[i].current?.click()}
                          className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-(--color-border) bg-(--color-panel) text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-white"
                        >
                          <Upload className="h-4 w-4" />
                          <span className="text-xs">Imagen {i + 1}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ángulo de venta */}
              <div>
                <label className="mb-2 block text-sm text-(--color-muted)">
                  Nombre del ángulo de venta
                </label>
                <input
                  value={anguloName}
                  onChange={(e) => setAnguloName(e.target.value)}
                  placeholder="Ej. Dolor de espalda, Energía natural…"
                  className="w-full rounded-xl border border-(--color-border) bg-(--color-panel) px-4 py-2.5 text-[15px] text-white placeholder:text-(--color-muted-2) focus:border-(--color-border-hover) focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-(--color-muted-2)">
                  Todas las secciones que generes bajo este nombre quedan agrupadas.
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm text-(--color-muted)">
                    Describe tu producto y el ángulo de venta
                  </label>
                  <button
                    type="button"
                    onClick={toggleAiAngle}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                      aiAngle
                        ? "border-(--color-accent) bg-(--color-accent)/15 text-white"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-white"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Que lo escriba la IA
                    <span className="text-(--color-muted-2)">· {AI_ANGLE_COST}cr</span>
                    <span
                      role="switch"
                      aria-checked={aiAngle}
                      data-on={aiAngle}
                      className={`t-toggle t-toggle--sm relative inline-flex h-4 w-[26px] shrink-0 items-center rounded-full transition-colors ${
                        aiAngleToggleInit ? "is-init" : ""
                      } ${aiAngle ? "bg-(--color-accent)" : "bg-white/15"}`}
                    >
                      <span className="t-toggle-thumb ml-0.5 block h-3 w-3 rounded-full bg-white" />
                    </span>
                  </button>
                </div>

                {aiAngle ? (
                  <p className="rounded-xl border border-dashed border-(--color-border) bg-(--color-panel) px-4 py-3 text-sm text-(--color-muted)">
                    La IA va a inferir el ángulo de venta a partir de las fotos del producto. No hace falta que escribas nada acá.
                  </p>
                ) : (
                  <BorderBeam size="md" colorVariant="mono" strength={0.92}>
                    <textarea
                      rows={3}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ej. Suplemento de colágeno para mujeres de 35+ que quieren piel más firme sin procedimientos caros…"
                      className="w-full resize-none rounded-xl border border-(--color-border) bg-(--color-panel) px-4 py-3 text-[15px] text-white placeholder:text-(--color-muted-2) transition focus:border-(--color-border-hover) focus:outline-none"
                    />
                  </BorderBeam>
                )}

                <button
                  type="button"
                  onClick={() => setAdvancedOpen((v) => !v)}
                  className="mt-2 flex items-center gap-1 text-xs text-(--color-muted) transition hover:text-white"
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${advancedOpen ? "rotate-180" : ""}`}
                  />
                  Detalles avanzados (opcional)
                </button>

                {advancedOpen && (
                  <div className="mt-3 flex flex-col gap-3 rounded-xl border border-(--color-border) bg-(--color-panel) p-4">
                    <div>
                      <label className="mb-1.5 block text-xs text-(--color-muted)">
                        Público objetivo
                      </label>
                      <input
                        value={publico}
                        onChange={(e) => setPublico(e.target.value)}
                        placeholder="Ej. Mujeres 35-50 años, LATAM"
                        className="w-full rounded-lg border border-(--color-border) bg-(--color-panel-2) px-3 py-2 text-sm text-white placeholder:text-(--color-muted-2) focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-xs text-(--color-muted)">
                          País
                        </label>
                        <select
                          value={pais}
                          onChange={(e) => setPais(e.target.value)}
                          className="w-full rounded-lg border border-(--color-border) bg-(--color-panel-2) px-3 py-2 text-sm text-white focus:outline-none"
                        >
                          <option value="">Selecciona…</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        {divisa && (
                          <p className="mt-1 text-[11px] text-(--color-muted-2)">
                            Divisa detectada: <span className="text-(--color-accent-2)">{divisa}</span>
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-(--color-muted)">
                          Precio {divisa && <span className="text-(--color-muted-2)">({divisa})</span>}
                        </label>
                        <input
                          value={precio}
                          onChange={(e) => setPrecio(e.target.value)}
                          placeholder="79.900"
                          className="w-full rounded-lg border border-(--color-border) bg-(--color-panel-2) px-3 py-2 text-sm text-white placeholder:text-(--color-muted-2) focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Secciones a generar — multi-selección + página completa */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm text-(--color-muted)">
                    Secciones a generar <span className="text-(--color-muted-2)">· elige una o varias</span>
                  </label>
                  <button
                    type="button"
                    onClick={toggleFullPage}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                      isFullPage
                        ? "border-(--color-accent) bg-(--color-accent)/15 text-white"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-white"
                    }`}
                  >
                    Página completa
                    <span
                      role="switch"
                      aria-checked={isFullPage}
                      data-on={isFullPage}
                      className={`t-toggle t-toggle--sm is-init relative inline-flex h-4 w-[26px] shrink-0 items-center rounded-full transition-colors ${
                        isFullPage ? "bg-(--color-accent)" : "bg-white/15"
                      }`}
                    >
                      <span className="t-toggle-thumb ml-0.5 block h-3 w-3 rounded-full bg-white" />
                    </span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sections.map((s) => {
                    const active = selectedSections.includes(s.id)
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleSection(s.id)}
                        className={`rounded-full border px-3 py-1.5 text-xs transition ${
                          active
                            ? "border-(--color-accent) bg-(--color-accent)/15 text-white"
                            : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-white"
                        }`}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>
                {!selectedSections.includes("oferta") && (
                  <p className="mt-2 text-xs text-(--color-muted-2)">
                    Sin la sección Oferta, tu página igual muestra el bloque real de precios/cantidad de tu tienda.
                  </p>
                )}
                {isFullPage && (
                  <p className="mt-2 text-xs text-(--color-accent-2)">
                    Página completa: {FULL_PAGE_COST} créditos en vez de {sections.length * SECTION_COST} — ahorras{" "}
                    {sections.length * SECTION_COST - FULL_PAGE_COST} créditos generando todo junto.
                  </p>
                )}
              </div>

              {/* Referencia */}
              <div>
                <label className="mb-2 block text-sm text-(--color-muted)">
                  Referencia visual <span className="text-(--color-muted-2)">· opcional</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setReferenceMode("ninguna")}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                      referenceMode === "ninguna"
                        ? "border-(--color-accent) bg-(--color-accent)/15 text-white"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-white"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Ninguna — libre
                  </button>
                  <button
                    onClick={() => setReferenceMode("galeria")}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                      referenceMode === "galeria"
                        ? "border-(--color-accent) bg-(--color-accent)/15 text-white"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-white"
                    }`}
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    Mi galería
                  </button>
                  <button
                    onClick={() => {
                      setReferenceMode("subir")
                      referenceFileRef.current?.click()
                    }}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                      referenceMode === "subir"
                        ? "border-(--color-accent) bg-(--color-accent)/15 text-white"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-white"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Subir referencia
                  </button>
                  <input
                    ref={referenceFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleReferenceChange}
                    className="hidden"
                  />
                </div>

                {referenceMode === "galeria" && (
                  <div className="mt-3 flex flex-col items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-panel) px-4 py-8 text-center">
                    <Layers className="h-5 w-5 text-(--color-muted-2)" />
                    <p className="text-sm text-white">Todavía no tienes secciones generadas</p>
                    <p className="text-xs text-(--color-muted-2)">
                      Cada sección que generes queda guardada acá como referencia para las siguientes.
                    </p>
                  </div>
                )}
                {referenceMode === "subir" && referenceImage && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-panel) p-3">
                    <img
                      src={referenceImage}
                      alt="Referencia"
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white">Referencia cargada</p>
                      <p className="text-xs text-(--color-muted-2)">
                        La IA va a igualar este estilo con tu producto.
                      </p>
                    </div>
                    <button
                      onClick={() => setReferenceImage(null)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-(--color-muted) transition hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Formato — fijo, no configurable */}
              <div className="flex items-center gap-2.5 rounded-xl border border-(--color-border) bg-(--color-panel) px-4 py-3">
                <Smartphone className="h-4 w-4 shrink-0 text-(--color-accent-2)" />
                <div>
                  <p className="text-sm text-white">Formato vertical · móvil</p>
                  <p className="text-xs text-(--color-muted-2)">
                    Rulay genera todas las secciones en formato celular — así es como llega el 90%+ del tráfico de ads.
                  </p>
                </div>
              </div>

              <button
                disabled={!hasPhoto || (!prompt && !aiAngle) || selectedSections.length === 0}
                className="flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ImageIcon className="h-4 w-4" />
                {isFullPage
                  ? "Generar página completa"
                  : `Generar ${selectedSections.length > 1 ? `${selectedSections.length} secciones` : "sección"}`}
              </button>
            </div>

            {/* Cost summary */}
            <aside className="h-fit rounded-2xl border border-(--color-border) bg-(--color-panel) p-4">
              <p className="text-sm font-medium text-white">Costo estimado</p>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                {isFullPage ? (
                  <div className="flex justify-between text-(--color-muted)">
                    <span>Página completa (7 secciones)</span>
                    <span>{FULL_PAGE_COST} créditos</span>
                  </div>
                ) : (
                  selectedSections.map((id) => (
                    <div key={id} className="flex justify-between text-(--color-muted)">
                      <span>{sections.find((s) => s.id === id)?.label}</span>
                      <span>{SECTION_COST} créditos</span>
                    </div>
                  ))
                )}
                {aiAngle && (
                  <div className="flex justify-between text-(--color-muted)">
                    <span>Ángulo de venta con IA</span>
                    <span>{AI_ANGLE_COST} crédito</span>
                  </div>
                )}
                <div className="mt-1 flex justify-between border-t border-(--color-border) pt-2 font-medium text-white">
                  <span>Total</span>
                  <span>{total} créditos</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-(--color-muted-2)">
                Te quedarán{" "}
                <span className="text-(--color-muted)">{remaining} créditos</span>{" "}
                después de generar.
              </p>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
