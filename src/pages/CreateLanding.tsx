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
const BALANCE = 180

export function CreateLanding() {
  const [anguloName, setAnguloName] = useState("")
  const [prompt, setPrompt] = useState("")
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [publico, setPublico] = useState("")
  const [precio, setPrecio] = useState("")
  const [pais, setPais] = useState("")

  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null])
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  const [section, setSection] = useState<SectionType>("hero")
  const [referenceMode, setReferenceMode] = useState<ReferenceMode>("ninguna")
  const referenceFileRef = useRef<HTMLInputElement>(null)
  const [referenceImage, setReferenceImage] = useState<string | null>(null)

  const total = SECTION_COST
  const remaining = BALANCE - total

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
          <h1 className="text-2xl font-medium text-white">Landing con Imágenes</h1>
          <p className="mt-1 text-sm text-(--color-muted)">
            Genera secciones de landing listas para pegar en tu página de Shopify.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
            <div className="flex flex-col gap-6">
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
                <label className="mb-2 block text-sm text-(--color-muted)">
                  Describe tu producto y el ángulo de venta
                </label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ej. Suplemento de colágeno para mujeres de 35+ que quieren piel más firme sin procedimientos caros…"
                  className="w-full resize-none rounded-xl border border-(--color-border) bg-(--color-panel) px-4 py-3 text-[15px] text-white placeholder:text-(--color-muted-2) transition focus:border-(--color-border-hover) focus:outline-none"
                />

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
                          Precio
                        </label>
                        <input
                          value={precio}
                          onChange={(e) => setPrecio(e.target.value)}
                          placeholder="$79.900"
                          className="w-full rounded-lg border border-(--color-border) bg-(--color-panel-2) px-3 py-2 text-sm text-white placeholder:text-(--color-muted-2) focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-(--color-muted)">
                          País
                        </label>
                        <input
                          value={pais}
                          onChange={(e) => setPais(e.target.value)}
                          placeholder="Colombia"
                          className="w-full rounded-lg border border-(--color-border) bg-(--color-panel-2) px-3 py-2 text-sm text-white placeholder:text-(--color-muted-2) focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fotos del producto */}
              <div>
                <label className="mb-2 block text-sm text-(--color-muted)">
                  Fotos del producto <span className="text-(--color-muted-2)">· 1 a 3</span>
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

              {/* Sección a generar */}
              <div>
                <label className="mb-2 block text-sm text-(--color-muted)">
                  Sección a generar
                </label>
                <div className="flex flex-wrap gap-2">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSection(s.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${
                        section === s.id
                          ? "border-(--color-accent) bg-(--color-accent)/15 text-white"
                          : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                {section === "oferta" && (
                  <p className="mt-2 text-xs text-(--color-muted-2)">
                    Si no generas esta sección, tu página igual muestra el bloque real de precios/cantidad de tu tienda.
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
                disabled={!prompt || photos.every((p) => !p)}
                className="flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ImageIcon className="h-4 w-4" />
                Generar sección
              </button>
            </div>

            {/* Cost summary */}
            <aside className="h-fit rounded-2xl border border-(--color-border) bg-(--color-panel) p-4">
              <p className="text-sm font-medium text-white">Costo estimado</p>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-(--color-muted)">
                  <span>Sección ({sections.find((s) => s.id === section)?.label})</span>
                  <span>{SECTION_COST} créditos</span>
                </div>
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
