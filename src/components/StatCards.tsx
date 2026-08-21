import { FileText, Coins, TrendingUp } from "lucide-react"
import { useLanguage, type TranslationKey } from "../lib/i18n"

const stats = [
  { icon: FileText, labelKey: "stats.paginasGeneradas" as TranslationKey, value: "0" },
  { icon: Coins, labelKey: "stats.creditosUsados" as TranslationKey, value: "0" },
  { icon: TrendingUp, labelKey: "stats.conversionPromedio" as TranslationKey, value: "—" },
]

export function StatCards() {
  const { t } = useLanguage()
  return (
    <div className="relative mt-8 grid grid-cols-1 rounded-2xl border border-dashed border-(--color-border) bg-(--color-panel) sm:grid-cols-3">
      {stats.map(({ icon: Icon, labelKey, value }, i) => (
        <div
          key={labelKey}
          className={`p-5 ${
            i !== 0
              ? "border-t border-dashed border-(--color-border) sm:border-t-0 sm:border-l"
              : ""
          }`}
        >
          <div className="mb-6 flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-panel-2) text-(--color-muted)">
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <p className="text-2xl font-medium text-(--color-text)">{value}</p>
          <p className="text-sm text-(--color-muted-2)">{t(labelKey)}</p>
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
