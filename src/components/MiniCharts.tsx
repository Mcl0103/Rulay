import { useState } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import worldData from "world-atlas/countries-110m.json"

// Gráficos livianos en SVG puro (sin librería externa) para el panel admin.
// Reciben CSS vars como color, así heredan el tema del sitio automáticamente.

// Código numérico ISO 3166-1 de cada país que soporta la app (mismos nombres
// que countryCurrency en Configuracion.tsx) — así se puede iluminar el mapa
// mundial con los datos de admin_stats_by_country.
const countryIso: Record<string, string> = {
  Colombia: "170",
  México: "484",
  Perú: "604",
  Chile: "152",
  Argentina: "032",
  Ecuador: "218",
  "Estados Unidos": "840",
  España: "724",
}

export function WorldMap({ dataByCountry }: { dataByCountry: { pais: string; usuarios: number }[] }) {
  const [tooltip, setTooltip] = useState<{ pais: string; usuarios: number; x: number; y: number } | null>(null)

  const usuariosByIso: Record<string, { pais: string; usuarios: number }> = {}
  for (const row of dataByCountry) {
    const iso = countryIso[row.pais]
    if (iso) usuariosByIso[iso] = row
  }

  const max = Math.max(1, ...dataByCountry.map((d) => d.usuarios))
  // d3 no puede interpolar entre `var()`/`color-mix()` — necesita colores
  // reales, así que la escala va de un azul apagado al accent (#60a5fa) en hex.
  const colorScale = scaleLinear<string>().domain([0, max]).range(["#1e3a5f", "#60a5fa"])

  return (
    <div className="relative">
      <div className="h-56 w-full overflow-hidden rounded-xl sm:h-72">
        <ComposableMap
          width={800}
          height={450}
          projectionConfig={{ scale: 130 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup center={[-60, 5]} zoom={1.6} minZoom={1} maxZoom={8}>
            <Geographies geography={worldData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const match = usuariosByIso[geo.id as string]
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={match ? colorScale(match.usuarios) : "color-mix(in srgb, var(--color-text) 14%, var(--color-panel))"}
                      stroke="var(--color-border-hover)"
                      strokeWidth={0.5}
                    onMouseEnter={(e) => {
                      if (match) setTooltip({ pais: match.pais, usuarios: match.usuarios, x: e.clientX, y: e.clientY })
                    }}
                    onMouseMove={(e) => {
                      if (match) setTooltip({ pais: match.pais, usuarios: match.usuarios, x: e.clientX, y: e.clientY })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: { outline: "none", transition: "fill 0.15s" },
                      hover: { outline: "none", filter: match ? "brightness(1.25)" : "none", cursor: match ? "pointer" : "default" },
                      pressed: { outline: "none" },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
        </ComposableMap>
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-(--color-border) bg-(--color-panel) px-2.5 py-1.5 text-xs shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
        >
          <p className="font-medium text-(--color-text)">{tooltip.pais}</p>
          <p className="text-(--color-muted-2)">{tooltip.usuarios} usuarios</p>
        </div>
      )}

      <p className="mt-2 text-center text-[11px] text-(--color-muted-2)">Arrastra para mover · rueda o pellizca para zoom</p>
    </div>
  )
}

let areaChartUid = 0

export function AreaChart({
  values,
  height = 110,
  color = "var(--color-accent-2)",
}: {
  values: number[]
  height?: number
  color?: string
}) {
  const [gradId] = useState(() => `admin-area-fill-${areaChartUid++}`)
  const w = 600
  const h = height
  if (values.length < 2) return <div style={{ height: h }} />

  const max = Math.max(...values, 1)
  const stepX = w / (values.length - 1)
  const points = values.map((v, i) => [i * stepX, h - (v / max) * (h - 8) - 4] as const)
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ")
  const area = `${line} L${w},${h} L0,${h} Z`
  const [lastX, lastY] = points[points.length - 1]

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-28 w-full overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <circle cx={lastX} cy={lastY} r={4} fill={color} />
    </svg>
  )
}

export function Donut({
  segments,
  size = 96,
  strokeWidth = 12,
  centerLabel,
}: {
  segments: { value: number; color: string }[]
  size?: number
  strokeWidth?: number
  centerLabel?: string
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const dashes = segments.map((s) => (s.value / total) * c)
  const offsets = dashes.map((_, i) => dashes.slice(0, i).reduce((a, b) => a + b, 0))

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-panel-2)" strokeWidth={strokeWidth} />
        {segments.map((s, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashes[i]} ${c - dashes[i]}`}
            strokeDashoffset={-offsets[i]}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        ))}
      </svg>
      {centerLabel && (
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-(--color-text)">
          {centerLabel}
        </div>
      )}
    </div>
  )
}

// Heatmap tipo calendario (estilo GitHub contributions) — cada columna es una
// semana, cada cuadrito un día, la intensidad del color = actividad ese día.
export function CalendarHeatmap({ values }: { values: { dia: string; valor: number }[] }) {
  const max = Math.max(...values.map((v) => v.valor), 1)

  // Rellena hacia atrás hasta empezar en domingo, así las columnas quedan
  // alineadas como semanas reales (igual que GitHub).
  const first = values[0] ? new Date(values[0].dia + "T00:00:00") : new Date()
  const leadingBlanks = first.getDay()
  const cells: ({ dia: string; valor: number } | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...values,
  ]
  const weeks: ({ dia: string; valor: number } | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  function intensity(valor: number) {
    if (valor <= 0) return "var(--color-panel-2)"
    const frac = valor / max
    if (frac < 0.25) return "color-mix(in srgb, var(--color-accent-2) 35%, var(--color-panel-2))"
    if (frac < 0.5) return "color-mix(in srgb, var(--color-accent-2) 60%, var(--color-panel-2))"
    if (frac < 0.75) return "color-mix(in srgb, var(--color-accent-2) 85%, var(--color-panel-2))"
    return "var(--color-accent-2)"
  }

  return (
    <div className="flex gap-[5px] overflow-x-auto pb-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[5px]">
          {week.map((cell, di) =>
            cell ? (
              <div
                key={di}
                title={`${cell.dia}: ${cell.valor}`}
                className="h-[15px] w-[15px] shrink-0 rounded-[5px] transition-transform hover:scale-125"
                style={{
                  background: intensity(cell.valor),
                  boxShadow: cell.valor > 0 ? `0 0 8px 0 color-mix(in srgb, var(--color-accent-2) 50%, transparent)` : "none",
                }}
              />
            ) : (
              <div key={di} className="h-[15px] w-[15px] shrink-0" />
            ),
          )}
        </div>
      ))}
    </div>
  )
}

export function SegmentedBar({ segments }: { segments: { value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-(--color-panel-2)">
      {segments.map((s, i) => (
        <div key={i} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
      ))}
    </div>
  )
}
