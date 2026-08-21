import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Languages,
  MousePointerClick,
  Tag,
  Upload,
  User,
  Wand2,
} from "lucide-react"
import { Sidebar } from "../components/Sidebar"
import { StaggerHeader } from "../components/StaggerHeader"
import { BorderBeam } from "border-beam"
import sparkleIcon from "../assets/sparkle-icon.webp"
import { useTheme } from "../lib/theme"
import { useLanguage } from "../lib/i18n"

const productStyles = ["Estudio", "Lifestyle", "Minimal", "Exterior"]
const languages = ["Español", "English"]
const mentions = [
  { label: "Producto", tag: "product" },
  { label: "Estilo", tag: "style" },
  { label: "Avatar", tag: "avatar" },
]

const IMAGE_COST = 5
const BALANCE = 180

export function CreateImages() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("Estudio")
  const [withAvatar, setWithAvatar] = useState(false)
  const [avatarToggleInit, setAvatarToggleInit] = useState(false)
  const [language, setLanguage] = useState("Español")
  const [openMenu, setOpenMenu] = useState<"producto" | "style" | "lang" | null>(
    null,
  )
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

  const remaining = BALANCE - IMAGE_COST

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

        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center">
            <img
              src={sparkleIcon}
              alt=""
              className="h-14 w-14"
              style={{
                filter:
                  "drop-shadow(0 0 10px rgba(59,130,246,0.55)) drop-shadow(0 0 24px rgba(59,130,246,0.35))",
              }}
            />
          </div>
          <StaggerHeader title={t("createImages.titulo")} className="mt-4" />

          <BorderBeam size="md" colorVariant="mono" strength={0.92}>
          <div className="relative mt-6 rounded-2xl border border-(--color-border) bg-(--color-panel) p-4 text-left transition focus-within:border-(--color-border-hover)">
            <textarea
              ref={textareaRef}
              rows={3}
              value={prompt}
              onChange={handlePromptChange}
              onBlur={() => setTimeout(() => setMentionOpen(false), 150)}
              placeholder={t("createImages.promptPlaceholder")}
              className="w-full resize-none bg-transparent text-[15px] text-(--color-text) placeholder:text-(--color-muted-2) focus:outline-none"
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
                    <p className="text-sm text-(--color-text)">{m.label}</p>
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
                      : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-(--color-text)"
                  }`}
                >
                  <Tag className="h-3.5 w-3.5" />
                  {productSource ?? t("createImages.producto")}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {openMenu === "producto" && (
                  <div className="absolute bottom-full left-0 z-10 mb-2 flex w-44 flex-col gap-0.5 rounded-xl border border-(--color-border) bg-(--color-panel-2) p-1 shadow-xl">
                    <button
                      onClick={() => {
                        setProductSource("Imagen subida")
                        setOpenMenu(null)
                      }}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-(--color-muted) transition hover:bg-black/30 hover:text-(--color-text)"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {t("dashboard.subirImagen")}
                    </button>
                    <button
                      onClick={() => {
                        setProductSource("Producto seleccionado")
                        setOpenMenu(null)
                      }}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-(--color-muted) transition hover:bg-black/30 hover:text-(--color-text)"
                    >
                      <MousePointerClick className="h-3.5 w-3.5" />
                      {t("dashboard.seleccionarProducto")}
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setAvatarToggleInit(true)
                  setWithAvatar((v) => !v)
                }}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                  withAvatar
                    ? "border-(--color-accent) bg-(--color-accent)/15 text-(--color-accent-2)"
                    : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-(--color-text)"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                {t("createImages.conAvatar")}
                <span
                  role="switch"
                  aria-checked={withAvatar}
                  data-on={withAvatar}
                  className={`t-toggle t-toggle--sm relative inline-flex h-4 w-[26px] shrink-0 items-center rounded-full transition-colors ${
                    avatarToggleInit ? "is-init" : ""
                  } ${withAvatar ? "bg-(--color-accent)" : "bg-(--color-muted-2)/35"}`}
                >
                  <span className="t-toggle-thumb ml-0.5 block h-3 w-3 rounded-full bg-white" />
                </span>
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
                className="flex items-center gap-1.5 rounded-full bg-(--color-primary) px-4 py-1.5 text-sm font-medium text-(--color-on-primary) transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t("createImages.crear")}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          </BorderBeam>

          <p className="mt-3 text-xs text-(--color-muted-2)">
            {t("createImages.costoLinea", { n: IMAGE_COST })}{" "}
            <span className="text-(--color-muted)">{remaining}</span> ·{" "}
            <Link
              to="/app"
              className="text-(--color-accent-2) hover:underline"
            >
              {t("sidebar.comprarCreditos")}
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
        className="flex items-center gap-1.5 rounded-full border border-(--color-border) px-3 py-1.5 text-xs text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-(--color-text)"
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
                  : "text-(--color-muted) hover:bg-black/30 hover:text-(--color-text)"
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
