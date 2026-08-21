import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, ArrowUp, Upload, MousePointerClick } from "lucide-react"

const quickActions = [
  "Pegar link de AliExpress",
  "Pegar link de Amazon",
  "Empezar desde cero",
]

export function PromptCard({ name = "Marlon" }: { name?: string }) {
  const [shown, setShown] = useState(false)
  const [attachOpen, setAttachOpen] = useState(false)
  const morphRef = useRef<HTMLDivElement>(null)

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

  return (
    <div>
      <div className={`t-stagger ${shown ? "is-shown" : ""}`}>
        <p className="t-stagger-line t-stagger-line--1 text-lg text-(--color-muted)">
          Hola, {name} 👋
        </p>
        <h1 className="t-stagger-line t-stagger-line--2 mt-1 text-3xl font-medium text-white sm:text-4xl">
          ¿Qué producto vamos a lanzar?
        </h1>
      </div>

      <div className="mt-6 rounded-2xl border border-(--color-border) bg-(--color-panel) p-4 transition focus-within:border-(--color-border-hover)">
        <textarea
          rows={2}
          placeholder="Pega el link de tu producto (AliExpress, Amazon, Shopify)…"
          className="w-full resize-none bg-transparent text-[15px] text-white placeholder:text-(--color-muted-2) focus:outline-none"
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
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-(--color-muted) transition hover:bg-black/30 hover:text-white"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Subir imagen
                </button>
                <button
                  onClick={() => setAttachOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-(--color-muted) transition hover:bg-black/30 hover:text-white"
                >
                  <MousePointerClick className="h-3.5 w-3.5" />
                  Seleccionar producto
                </button>
              </div>
              <button
                type="button"
                aria-expanded={attachOpen}
                onClick={() => setAttachOpen((o) => !o)}
                className="t-morph-plus text-(--color-muted) hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <Link
            to="/app/generar"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition hover:bg-white/90"
          >
            <ArrowUp className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <Link
            key={action}
            to="/app/generar"
            className="rounded-full border border-(--color-border) px-3 py-1.5 text-xs text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-white"
          >
            {action}
          </Link>
        ))}
      </div>
    </div>
  )
}
