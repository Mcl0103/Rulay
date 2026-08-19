import { FileText, Coins, TrendingUp } from "lucide-react"

const stats = [
  { icon: FileText, label: "Páginas generadas", value: "0" },
  { icon: Coins, label: "Créditos usados", value: "0" },
  { icon: TrendingUp, label: "Conversión promedio", value: "—" },
]

export function StatCards() {
  return (
    <div className="relative mt-8 grid grid-cols-1 rounded-2xl border border-dashed border-(--color-border) bg-(--color-panel) sm:grid-cols-3">
      {stats.map(({ icon: Icon, label, value }, i) => (
        <div
          key={label}
          className={`p-5 ${
            i !== 0
              ? "border-t border-dashed border-(--color-border) sm:border-t-0 sm:border-l"
              : ""
          }`}
        >
          <div className="mb-6 flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-panel-2) text-(--color-muted)">
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <p className="text-2xl font-medium text-white">{value}</p>
          <p className="text-sm text-(--color-muted-2)">{label}</p>
        </div>
      ))}

      {[1, 2].map((i) => (
        <span key={`t-${i}`} className="corner-dot hidden sm:block" style={{ left: `${(i / 3) * 100}%`, top: 0 }} />
      ))}
      {[1, 2].map((i) => (
        <span key={`b-${i}`} className="corner-dot hidden sm:block" style={{ left: `${(i / 3) * 100}%`, bottom: 0 }} />
      ))}
      {[0, 1].map((i) => (
        <span key={`l-${i}`} className="corner-dot sm:hidden" style={{ top: `${((i + 1) / 3) * 100}%`, left: 0 }} />
      ))}
      {[0, 1].map((i) => (
        <span key={`r-${i}`} className="corner-dot sm:hidden" style={{ top: `${((i + 1) / 3) * 100}%`, right: 0 }} />
      ))}
    </div>
  )
}
