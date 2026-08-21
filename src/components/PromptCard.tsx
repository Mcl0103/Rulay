import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  Plus,
  ArrowUp,
  Upload,
  MousePointerClick,
  FileText,
  ImagePlus,
  LayoutTemplate,
} from "lucide-react"
import { useLanguage, type TranslationKey } from "../lib/i18n"

type Mode = "pagina" | "imagen" | "landing"

const modes: { id: Mode; labelKey: TranslationKey; icon: typeof FileText; to: string }[] = [
  { id: "pagina", labelKey: "dashboard.modoProductPage", icon: FileText, to: "/app/generar" },
  { id: "imagen", labelKey: "dashboard.modoImagen", icon: ImagePlus, to: "/app/imagenes" },
  { id: "landing", labelKey: "dashboard.modoLanding", icon: LayoutTemplate, to: "/app/landing" },
]

export function PromptCard({ name = "Marlon" }: { name?: string }) {
  const { t } = useLanguage()
  const [shown, setShown] = useState(false)
  const [attachOpen, setAttachOpen] = useState(false)
  const morphRef = useRef<HTMLDivElement>(null)

  const [mode, setMode] = useState<Mode>("pagina")
  const pillRef = useRef<HTMLSpanElement>(null)
  const tabRefs = useRef<Record<Mode, HTMLButtonElement | null>>({
    pagina: null,
    imagen: null,
    landing: null,
  })
  const firstTabRender = useRef(true)
  const activeMode = modes.find((m) => m.id === mode)!
  const welcomeMessage =
    (typeof window !== "undefined" && localStorage.getItem("rulay_welcome_message")) ||
    t("dashboard.bienvenidaDefault")

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!attachOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (morphRef.current && !morphRef.current.contains(e.target as Node)) {
        setAttachOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [attachOpen])

  useEffect(() => {
    const pill = pillRef.current
    const el = tabRefs.current[mode]
    if (!pill || !el) return

    if (firstTabRender.current) {
      pill.style.transition = "none"
      pill.style.transform = `translateX(${el.offsetLeft}px)`
      pill.style.width = `${el.offsetWidth}px`
      pill.getBoundingClientRect()
      pill.style.transition = ""
      firstTabRender.current = false
    } else {
      pill.style.transform = `translateX(${el.offsetLeft}px)`
      pill.style.width = `${el.offsetWidth}px`
    }
  }, [mode])

  return (
    <div>
      <div className={`t-stagger ${shown ? "is-shown" : ""}`}>
        <p className="t-stagger-line t-stagger-line--1 text-lg text-(--color-muted)">
          {t("dashboard.hola", { name })}
        </p>
        <h1 className="t-stagger-line t-stagger-line--2 mt-1 text-3xl font-medium text-(--color-text) sm:text-4xl">
          {welcomeMessage}
        </h1>
      </div>

      <div role="tablist" className="t-tabs mt-6 border border-(--color-border)">
        <span ref={pillRef} className="t-tabs-pill" aria-hidden="true" />
        {modes.map((m) => (
          <button
            key={m.id}
            ref={(el) => {
              tabRefs.current[m.id] = el
            }}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => setMode(m.id)}
            className="t-tab flex items-center gap-1.5 text-sm"
          >
            <m.icon className="h-3.5 w-3.5" />
            {t(m.labelKey)}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-2xl border border-(--color-border) bg-(--color-panel) p-4 transition focus-within:border-(--color-border-hover)">
        <textarea
          rows={2}
          placeholder={t("dashboard.promptPlaceholder")}
          className="w-full resize-none bg-transparent text-[15px] text-(--color-text) placeholder:text-(--color-muted-2) focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="relative h-10 w-10">
            <div
              ref={morphRef}
              data-open={attachOpen}
              className="t-morph t-morph--anchor-bl border border-(--color-border) bg-(--color-panel-2) shadow-xl"
            >
              <div className="t-morph-menu flex flex-col gap-0.5 p-2 pt-3">
                <button
                  onClick={() => setAttachOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-(--color-muted) transition hover:bg-black/30 hover:text-(--color-text)"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {t("dashboard.subirImagen")}
                </button>
                <button
                  onClick={() => setAttachOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-(--color-muted) transition hover:bg-black/30 hover:text-(--color-text)"
                >
                  <MousePointerClick className="h-3.5 w-3.5" />
                  {t("dashboard.seleccionarProducto")}
                </button>
              </div>
              <button
                type="button"
                aria-expanded={attachOpen}
                onClick={() => setAttachOpen((o) => !o)}
                className="t-morph-plus text-(--color-muted) hover:text-(--color-text)"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <Link
            to={activeMode.to}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-(--color-primary) text-(--color-on-primary) transition hover:opacity-90"
          >
            <ArrowUp className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
