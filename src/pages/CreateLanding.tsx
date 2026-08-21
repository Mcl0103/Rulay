import { useRef, useState } from "react"
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
import { StaggerHeader } from "../components/StaggerHeader"
import { useTheme } from "../lib/theme"
import { useLanguage, type TranslationKey } from "../lib/i18n"

type SectionType =
  | "hero"
  | "oferta"
  | "beneficios"
  | "antes-despues"
  | "testimonios"
  | "logistica"
  | "faq"

const sections: { id: SectionType; labelKey: TranslationKey }[] = [
  { id: "hero", labelKey: "createLanding.section.hero" },
  { id: "oferta", labelKey: "createLanding.section.oferta" },
  { id: "beneficios", labelKey: "createLanding.section.beneficios" },
  { id: "antes-despues", labelKey: "createLanding.section.antesDespues" },
  { id: "testimonios", labelKey: "createLanding.section.testimonios" },
  { id: "logistica", labelKey: "createLanding.section.logistica" },
  { id: "faq", labelKey: "createLanding.section.faq" },
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
const languages = ["Español", "English"]
const countries = Object.keys(countryCurrency)

export function CreateLanding() {
  const { theme } = useTheme()
  const { t } = useLanguage()

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
  const [idioma, setIdioma] = useState("")
  const divisa = countryCurrency[pais]

  function handlePaisChange(value: string) {
    setPais(value)
    if (value) setIdioma(countryLanguage[value])
  }

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
      <main data-theme={theme} className="flex flex-1 flex-col overflow-y-auto bg-(--color-panel)/40 p-6">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-sm text-(--color-muted) transition hover:text-(--color-text)"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("sidebar.dashboard")}
        </Link>

        <div className="mx-auto w-full max-w-3xl py-10">
          <StaggerHeader
            title={t("createLanding.titulo")}
            subtitle={t("createLanding.subtitulo")}
          />

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
            <div className="flex flex-col gap-6">
              {/* Fotos del producto — primero, la IA los necesita antes que nada */}
              <div>
                <label className="mb-2 block text-sm text-(--color-muted)">
                  {t("createLanding.fotosProducto")} <span className="text-(--color-muted-2)">· {t("createLanding.obligatorio")}</span>
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
                          className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-(--color-border) bg-(--color-panel) text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-(--color-text)"
                        >
                          <Upload className="h-4 w-4" />
                          <span className="text-xs">{t("createLanding.fotoN", { n: i + 1 })}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ángulo de venta */}
              <div>
                <label className="mb-2 block text-sm text-(--color-muted)">
                  {t("createLanding.nombreAngulo")}
                </label>
                <input
                  value={anguloName}
                  onChange={(e) => setAnguloName(e.target.value)}
                  placeholder={t("createLanding.placeholderAngulo")}
                  className="w-full rounded-xl border border-(--color-border) bg-(--color-panel) px-4 py-2.5 text-[15px] text-(--color-text) placeholder:text-(--color-muted-2) focus:border-(--color-border-hover) focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-(--color-muted-2)">
                  Todas las secciones que generes bajo este nombre quedan agrupadas.
                </p>
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-y-2">
                  <label className="text-sm text-(--color-muted)">
                    {t("createLanding.describeProducto")}
                  </label>
                  <button
                    type="button"
                    onClick={toggleAiAngle}
                    className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition ${
                      aiAngle
                        ? "border-(--color-accent) bg-(--color-accent)/15 text-(--color-text)"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-(--color-text)"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span>{t("createLanding.iaEscribe")}</span>
                    <span className="text-(--color-muted-2)">· {AI_ANGLE_COST}cr</span>
                    <span
                      role="switch"
                      aria-checked={aiAngle}
                      data-on={aiAngle}
                      className={`t-toggle t-toggle--sm relative inline-flex h-4 w-[26px] shrink-0 items-center rounded-full transition-colors ${
                        aiAngleToggleInit ? "is-init" : ""
                      } ${aiAngle ? "bg-(--color-accent)" : "bg-(--color-muted-2)/35"}`}
                    >
                      <span className="t-toggle-thumb ml-0.5 block h-3 w-3 rounded-full bg-white" />
                    </span>
                  </button>
                </div>

                {aiAngle ? (
                  <p className="rounded-xl border border-dashed border-(--color-border) bg-(--color-panel) px-4 py-3 text-sm text-(--color-muted)">
                    {t("createLanding.iaEscribeNota")}
                  </p>
                ) : (
                  <BorderBeam size="md" colorVariant="mono" strength={0.92}>
                    <textarea
                      rows={3}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={t("createLanding.placeholderProducto")}
                      className="w-full resize-none rounded-xl border border-(--color-border) bg-(--color-panel) px-4 py-3 text-[15px] text-(--color-text) placeholder:text-(--color-muted-2) transition focus:border-(--color-border-hover) focus:outline-none"
                    />
                  </BorderBeam>
                )}

                <button
                  type="button"
                  onClick={() => setAdvancedOpen((v) => !v)}
                  className="mt-2 flex items-center gap-1 text-xs text-(--color-muted) transition hover:text-(--color-text)"
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${advancedOpen ? "rotate-180" : ""}`}
                  />
                  {t("createLanding.detallesAvanzados")}
                </button>

                {advancedOpen && (
                  <div className="mt-3 flex flex-col gap-3 rounded-xl border border-(--color-border) bg-(--color-panel) p-4">
                    <div>
                      <label className="mb-1.5 block text-xs text-(--color-muted)">
                        {t("createLanding.publicoObjetivo")}
                      </label>
                      <input
                        value={publico}
                        onChange={(e) => setPublico(e.target.value)}
                        placeholder={t("createLanding.publicoPlaceholder")}
                        className="w-full rounded-lg border border-(--color-border) bg-(--color-panel-2) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-muted-2) focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-xs text-(--color-muted)">
                          {t("createLanding.pais")}
                        </label>
                        <select
                          value={pais}
                          onChange={(e) => handlePaisChange(e.target.value)}
                          className="w-full rounded-lg border border-(--color-border) bg-(--color-panel-2) px-3 py-2 text-sm text-(--color-text) focus:outline-none"
                        >
                          <option value="">{t("config.selecciona")}</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        {divisa && (
                          <p className="mt-1 text-[11px] text-(--color-muted-2)">
                            {t("createLanding.divisaIdiomaDetectados")}{" "}
                            <span className="text-(--color-accent-2)">
                              {divisa} · {idioma}
                            </span>
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-(--color-muted)">
                          {t("createLanding.precio")} {divisa && <span className="text-(--color-muted-2)">({divisa})</span>}
                        </label>
                        <input
                          value={precio}
                          onChange={(e) => setPrecio(e.target.value)}
                          placeholder="79.900"
                          className="w-full rounded-lg border border-(--color-border) bg-(--color-panel-2) px-3 py-2 text-sm text-(--color-text) placeholder:text-(--color-muted-2) focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-(--color-muted)">
                        {t("createLanding.idiomaSalida")}
                      </label>
                      <select
                        value={idioma}
                        onChange={(e) => setIdioma(e.target.value)}
                        className="w-full rounded-lg border border-(--color-border) bg-(--color-panel-2) px-3 py-2 text-sm text-(--color-text) focus:outline-none"
                      >
                        <option value="">{t("config.selecciona")}</option>
                        {languages.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-[11px] text-(--color-muted-2)">
                        {t("createLanding.idiomaAutoNota")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Secciones a generar — multi-selección + página completa */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm text-(--color-muted)">
                    {t("createLanding.seccionesGenerar")} <span className="text-(--color-muted-2)">· {t("createLanding.eligeUnaOVarias")}</span>
                  </label>
                  <button
                    type="button"
                    onClick={toggleFullPage}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                      isFullPage
                        ? "border-(--color-accent) bg-(--color-accent)/15 text-(--color-text)"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-(--color-text)"
                    }`}
                  >
                    {t("createLanding.paginaCompleta")}
                    <span
                      role="switch"
                      aria-checked={isFullPage}
                      data-on={isFullPage}
                      className={`t-toggle t-toggle--sm is-init relative inline-flex h-4 w-[26px] shrink-0 items-center rounded-full transition-colors ${
                        isFullPage ? "bg-(--color-accent)" : "bg-(--color-muted-2)/35"
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
                            ? "border-(--color-accent) bg-(--color-accent)/15 text-(--color-text)"
                            : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-(--color-text)"
                        }`}
                      >
                        {t(s.labelKey)}
                      </button>
                    )
                  })}
                </div>
                {!selectedSections.includes("oferta") && (
                  <p className="mt-2 text-xs text-(--color-muted-2)">
                    {t("createLanding.ofertaNota")}
                  </p>
                )}
                {isFullPage && (
                  <p className="mt-2 text-xs text-(--color-accent-2)">
                    {t("createLanding.ahorras", {
                      full: FULL_PAGE_COST,
                      sum: sections.length * SECTION_COST,
                      savings: sections.length * SECTION_COST - FULL_PAGE_COST,
                    })}
                  </p>
                )}
              </div>

              {/* Referencia */}
              <div>
                <label className="mb-2 block text-sm text-(--color-muted)">
                  {t("createLanding.referenciaVisual")} <span className="text-(--color-muted-2)">· {t("createLanding.opcional")}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setReferenceMode("ninguna")}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                      referenceMode === "ninguna"
                        ? "border-(--color-accent) bg-(--color-accent)/15 text-(--color-text)"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-(--color-text)"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {t("createLanding.referenciaNinguna")}
                  </button>
                  <button
                    onClick={() => setReferenceMode("galeria")}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                      referenceMode === "galeria"
                        ? "border-(--color-accent) bg-(--color-accent)/15 text-(--color-text)"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-(--color-text)"
                    }`}
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    {t("createLanding.miGaleria")}
                  </button>
                  <button
                    onClick={() => {
                      setReferenceMode("subir")
                      referenceFileRef.current?.click()
                    }}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                      referenceMode === "subir"
                        ? "border-(--color-accent) bg-(--color-accent)/15 text-(--color-text)"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-(--color-text)"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {t("createLanding.subirReferencia")}
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
                    <p className="text-sm text-(--color-text)">{t("createLanding.galeriaVacia")}</p>
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
                      <p className="text-sm text-(--color-text)">{t("createLanding.referenciaCargada")}</p>
                      <p className="text-xs text-(--color-muted-2)">
                        {t("createLanding.iaIgualaEstilo")}
                      </p>
                    </div>
                    <button
                      onClick={() => setReferenceImage(null)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-(--color-muted) transition hover:bg-black/10 hover:text-(--color-text)"
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
                  <p className="text-sm text-(--color-text)">{t("createLanding.formatoTitulo")}</p>
                  <p className="text-xs text-(--color-muted-2)">
                    {t("createLanding.formatoNota")}
                  </p>
                </div>
              </div>

              <button
                disabled={!hasPhoto || (!prompt && !aiAngle) || selectedSections.length === 0}
                className="flex w-fit items-center gap-2 rounded-full bg-(--color-primary) px-5 py-2.5 text-sm font-medium text-(--color-on-primary) transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ImageIcon className="h-4 w-4" />
                {isFullPage
                  ? t("createLanding.generarPaginaCompleta")
                  : selectedSections.length > 1
                    ? t("createLanding.generarNSecciones", { n: selectedSections.length })
                    : t("createLanding.generarSeccion")}
              </button>
            </div>

            {/* Cost summary */}
            <aside className="h-fit rounded-2xl border border-(--color-border) bg-(--color-panel) p-4">
              <p className="text-sm font-medium text-(--color-text)">{t("createPage.costoEstimado")}</p>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                {isFullPage ? (
                  <div className="flex justify-between text-(--color-muted)">
                    <span>{t("createLanding.paginaCompletaResumen")}</span>
                    <span>{FULL_PAGE_COST} créditos</span>
                  </div>
                ) : (
                  selectedSections.map((id) => (
                    <div key={id} className="flex justify-between text-(--color-muted)">
                      <span>{t(sections.find((s) => s.id === id)!.labelKey)}</span>
                      <span>{SECTION_COST} créditos</span>
                    </div>
                  ))
                )}
                {aiAngle && (
                  <div className="flex justify-between text-(--color-muted)">
                    <span>{t("createLanding.anguloConIA")}</span>
                    <span>{AI_ANGLE_COST} crédito</span>
                  </div>
                )}
                <div className="mt-1 flex justify-between border-t border-(--color-border) pt-2 font-medium text-(--color-text)">
                  <span>{t("createPage.total")}</span>
                  <span>{total} créditos</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-(--color-muted-2)">
                {t("createPage.teQuedaran", { n: remaining })}
              </p>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
