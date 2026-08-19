import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Link2, Image as ImageIcon, Sparkles, Upload, X } from "lucide-react"
import { Sidebar } from "../components/Sidebar"

const imageCounts = [0, 1, 2, 3, 4, 5, 6]

const PAGE_COST = 10
const IMAGE_COST = 5
const BALANCE = 180

export function CreatePage() {
  const [url, setUrl] = useState("")
  const [images, setImages] = useState(0)
  const [photo, setPhoto] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const total = PAGE_COST + images * IMAGE_COST
  const remaining = BALANCE - total

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(URL.createObjectURL(file))
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

        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-10">
          <h1 className="text-2xl font-medium text-white">
            Crea tu Product Page
          </h1>
          <p className="mt-1 text-sm text-(--color-muted)">
            Pega el link del producto y Rulay arma la página por ti.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
            <div className="flex flex-col gap-6">
              {/* URL input */}
              <div>
                <label className="mb-2 block text-sm text-(--color-muted)">
                  Link del producto
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-panel) px-4 py-3 transition focus-within:border-(--color-border-hover)">
                  <Link2 className="h-4 w-4 shrink-0 text-(--color-muted-2)" />
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://aliexpress.com/item/…"
                    className="w-full bg-transparent text-[15px] text-white placeholder:text-(--color-muted-2) focus:outline-none"
                  />
                </div>
              </div>

              {/* Optional product photo */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="text-sm text-(--color-muted)">
                    Foto de tu producto
                  </label>
                  <span className="text-xs text-(--color-muted-2)">
                    · opcional, ayuda a la IA a acertar mejor
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                {photo ? (
                  <div className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-panel) p-3">
                    <img
                      src={photo}
                      alt="Producto"
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white">Foto cargada</p>
                      <p className="text-xs text-(--color-muted-2)">
                        Se usará como referencia para la IA
                      </p>
                    </div>
                    <button
                      onClick={() => setPhoto(null)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-(--color-muted) transition hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center gap-2 rounded-xl border border-dashed border-(--color-border) bg-(--color-panel) px-4 py-3 text-sm text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-white"
                  >
                    <Upload className="h-4 w-4 shrink-0" />
                    Subir foto del producto
                  </button>
                )}
              </div>

              {/* AI images */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-(--color-muted)" />
                  <label className="text-sm text-(--color-muted)">
                    Imágenes generadas con IA
                  </label>
                  <span className="text-xs text-(--color-muted-2)">
                    · {IMAGE_COST} créditos c/u
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {imageCounts.map((n) => (
                    <button
                      key={n}
                      onClick={() => setImages(n)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition ${
                        images === n
                          ? "border-(--color-accent) bg-(--color-accent)/15 text-white"
                          : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-white"
                      }`}
                    >
                      {n === 0 ? "—" : n}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!url}
                className="flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4" />
                Generar página
              </button>
            </div>

            {/* Cost summary */}
            <aside className="h-fit rounded-2xl border border-(--color-border) bg-(--color-panel) p-4">
              <p className="text-sm font-medium text-white">Costo estimado</p>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-(--color-muted)">
                  <span>Página con IA</span>
                  <span>{PAGE_COST} créditos</span>
                </div>
                <div className="flex justify-between text-(--color-muted)">
                  <span>Imágenes IA ({images})</span>
                  <span>{images * IMAGE_COST} créditos</span>
                </div>
                <div className="mt-1 flex justify-between border-t border-(--color-border) pt-2 font-medium text-white">
                  <span>Total</span>
                  <span>{total} créditos</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-(--color-muted-2)">
                Te quedarán{" "}
                <span className="text-(--color-muted)">
                  {remaining} créditos
                </span>{" "}
                después de generar.
              </p>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
