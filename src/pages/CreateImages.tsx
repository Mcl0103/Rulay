import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Languages,
  Megaphone,
  MousePointerClick,
  Sparkles,
  Tag,
  Type,
  Upload,
  User,
  Wand2,
} from "lucide-react"
import { Sidebar } from "../components/Sidebar"

const productStyles = ["Estudio", "Lifestyle", "Minimal", "Exterior"]
const adFormats = ["Oferta / descuento", "Testimonio", "Antes y después", "Lanzamiento"]
const languages = ["Español", "English"]
const mentions = [
  { label: "Producto", tag: "product" },
  { label: "Estilo", tag: "style" },
  { label: "Avatar", tag: "avatar" },
]

const IMAGE_COST = 5
const AD_COST = 8
const BALANCE = 180

export function CreateImages() {
  const [mode, setMode] = useState<"producto" | "anuncio">("producto")
  const [prompt, setPrompt] = useState("")
  const [adText, setAdText] = useState("")
  const [style, setStyle] = useState("Estudio")
  const [format, setFormat] = useState("Oferta / descuento")
  const [withAvatar, setWithAvatar] = useState(false)
  const [language, setLanguage] = useState("Español")
  const [openMenu, setOpenMenu] = useState<
    "producto" | "style" | "format" | "lang" | null
  >(null)
  const [productSource, setProductSource] = useState<string | null>(null)
  const [mentionOpen, setMentionOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handlePromptChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    const pos = e.target.selectionStart
    setPrompt(value)
    const justTypedAt =
      value[pos - 1] === "@" && (pos === 1 || /\s/.test(value[pos - 2]))
    setMentionOpen(justTypedAt)
  }

  function insertMention(tag: string) {
    const el = textareaRef.current
    if (!el) return
    const pos = el.selectionStart
    const before = prompt.slice(0, pos)
    const after = prompt.slice(pos)
    const atIndex = before.lastIndexOf("@")
    const newValue = `${before.slice(0, atIndex)}@${tag} ${after}`
    setPrompt(newValue)
    setMentionOpen(false)
    requestAnimationFrame(() => {
      const newPos = atIndex + tag.length + 2
      el.focus()
      el.setSelectionRange(newPos, newPos)
    })
  }

  const total = mode === "producto" ? IMAGE_COST : AD_COST
  const remaining = BALANCE - total

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

        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-10 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-accent)/15 text-(--color-accent-2)">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="mt-4 text-2xl font-medium text-white">
            Crear imágenes con IA
          </h1>

          {/* Mode switch */}
          <div className="mt-6 inline-flex self-center rounded-full border border-(--color-border) bg-(--color-panel) p-1">
            <button
              onClick={() => setMode("producto")}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition ${
                mode === "producto"
                  ? "bg-white text-black"
                  : "text-(--color-muted) hover:text-white"
              }`}
            >
              <Tag className="h-3.5 w-3.5" />
              Imágenes de producto
            </button>
            <button
              onClick={() => setMode("anuncio")}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition ${
                mode === "anuncio"
                  ? "bg-white text-black"
                  : "text-(--color-muted) hover:text-white"
              }`}
            >
              <Megaphone className="h-3.5 w-3.5" />
              Anuncio estático
            </button>
          </div>

          {mode === "anuncio" && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-panel) px-4 py-3 text-left transition focus-within:border-(--color-border-hover)">
              <Type className="h-4 w-4 shrink-0 text-(--color-muted-2)" />
              <input
                value={adText}
                onChange={(e) => setAdText(e.target.value)}
                placeholder="Texto del anuncio (ej: 15% OFF hoy)"
                className="w-full bg-transparent text-[15px] text-white placeholder:text-(--color-muted-2) focus:outline-none"
              />
            </div>
          )}

          <div className="relative mt-4 rounded-2xl border border-(--color-border) bg-(--color-panel) p-4 text-left transition focus-within:border-(--color-border-hover)">
            <textarea
              ref={textareaRef}
              rows={mode === "producto" ? 3 : 2}
              value={prompt}
              onChange={handlePromptChange}
              onBlur={() => setTimeout(() => setMentionOpen(false), 150)}
              placeholder={
                mode === "producto"
                  ? "Menciona tu producto para colocarlo en la escena… (usa @)"
                  : "Describe el gancho o la escena del anuncio… (usa @)"
              }
              className="w-full resize-none bg-transparent text-[15px] text-white placeholder:text-(--color-muted-2) focus:outline-none"
            />

            {mentionOpen && (
              <div className="absolute top-11 left-4 z-20 flex w-48 flex-col gap-0.5 rounded-xl border border-(--color-border) bg-(--color-panel-2) p-1.5 shadow-xl">
                {mentions.map((m) => (
                  <button
                    key={m.tag}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => insertMention(m.tag)}
                    className="rounded-lg px-2.5 py-1.5 text-left transition hover:bg-black/30"
                  >
                    <p className="text-sm text-white">{m.label}</p>
                    <p className="text-xs text-(--color-muted-2)">
                      @{m.tag}
                    </p>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-(--color-border) pt-3">
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenu((m) => (m === "producto" ? null : "producto"))
                  }
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                    productSource
                      ? "border-(--color-accent) bg-(--color-accent)/15 text-(--color-accent-2)"
                      : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-white"
                  }`}
                >
                  <Tag className="h-3.5 w-3.5" />
                  {productSource ?? "Producto"}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {openMenu === "producto" && (
                  <div className="absolute bottom-full left-0 z-10 mb-2 flex w-44 flex-col gap-0.5 rounded-xl border border-(--color-border) bg-(--color-panel-2) p-1 shadow-xl">
                    <button
                      onClick={() => {
                        setProductSource("Imagen subida")
                        setOpenMenu(null)
                      }}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-(--color-muted) transition hover:bg-black/30 hover:text-white"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Subir imagen
                    </button>
                    <button
                      onClick={() => {
                        setProductSource("Producto seleccionado")
                        setOpenMenu(null)
                      }}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-(--color-muted) transition hover:bg-black/30 hover:text-white"
                    >
                      <MousePointerClick className="h-3.5 w-3.5" />
                      Seleccionar producto
                    </button>
                  </div>
                )}
              </div>

              {mode === "producto" && (
                <>
                  <button
                    onClick={() => setWithAvatar((v) => !v)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                      withAvatar
                        ? "border-(--color-accent) bg-(--color-accent)/15 text-(--color-accent-2)"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-white"
                    }`}
                  >
                    <User className="h-3.5 w-3.5" />
                    Con avatar
                  </button>

                  <Dropdown
                    icon={Wand2}
                    value={style}
                    options={productStyles}
                    isOpen={openMenu === "style"}
                    onToggle={() =>
                      setOpenMenu((m) => (m === "style" ? null : "style"))
                    }
                    onSelect={(v) => {
                      setStyle(v)
                      setOpenMenu(null)
                    }}
                  />
                </>
              )}

              {mode === "anuncio" && (
                <Dropdown
                  icon={Megaphone}
                  value={format}
                  options={adFormats}
                  isOpen={openMenu === "format"}
                  onToggle={() =>
                    setOpenMenu((m) => (m === "format" ? null : "format"))
                  }
                  onSelect={(v) => {
                    setFormat(v)
                    setOpenMenu(null)
                  }}
                />
              )}

              <Dropdown
                icon={Languages}
                value={language}
                options={languages}
                isOpen={openMenu === "lang"}
                onToggle={() =>
                  setOpenMenu((m) => (m === "lang" ? null : "lang"))
                }
                onSelect={(v) => {
                  setLanguage(v)
                  setOpenMenu(null)
                }}
              />

              <div className="flex-1" />

              <button
                disabled={!prompt}
                className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Crear
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-(--color-muted-2)">
            {mode === "producto" ? "Esta imagen" : "Este anuncio"} cuesta{" "}
            {total} créditos · te quedarán{" "}
            <span className="text-(--color-muted)">{remaining}</span> ·{" "}
            <Link
              to="/app"
              className="text-(--color-accent-2) hover:underline"
            >
              Comprar créditos
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

function Dropdown({
  icon: Icon,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}: {
  icon: typeof Wand2
  value: string
  options: string[]
  isOpen: boolean
  onToggle: () => void
  onSelect: (v: string) => void
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 rounded-full border border-(--color-border) px-3 py-1.5 text-xs text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-white"
      >
        <Icon className="h-3.5 w-3.5" />
        {value}
        <ChevronDown className="h-3 w-3" />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 z-10 mb-2 flex w-44 flex-col gap-0.5 rounded-xl border border-(--color-border) bg-(--color-panel-2) p-1 shadow-xl">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => onSelect(o)}
              className={`rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                value === o
                  ? "bg-(--color-accent)/15 text-(--color-accent-2)"
                  : "text-(--color-muted) hover:bg-black/30 hover:text-white"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
