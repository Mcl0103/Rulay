import { Link } from "react-router-dom"
import { Plus, ArrowUp } from "lucide-react"

const quickActions = [
  "Pegar link de AliExpress",
  "Pegar link de Amazon",
  "Empezar desde cero",
]

export function PromptCard({ name = "Marlon" }: { name?: string }) {
  return (
    <div>
      <p className="text-lg text-(--color-muted)">Hola, {name} 👋</p>
      <h1 className="mt-1 text-3xl font-medium text-white sm:text-4xl">
        ¿Qué producto vamos a lanzar?
      </h1>

      <div className="mt-6 rounded-2xl border border-(--color-border) bg-(--color-panel) p-4 transition focus-within:border-(--color-border-hover)">
        <textarea
          rows={2}
          placeholder="Pega el link de tu producto (AliExpress, Amazon, Shopify)…"
          className="w-full resize-none bg-transparent text-[15px] text-white placeholder:text-(--color-muted-2) focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between">
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-(--color-border) text-(--color-muted) transition hover:text-white">
            <Plus className="h-4 w-4" />
          </button>
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
