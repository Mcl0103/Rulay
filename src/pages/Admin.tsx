import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import {
  Users,
  ImageIcon,
  Coins,
  Sparkles,
  Receipt,
  ShieldAlert,
  Globe2,
  Trophy,
  ArrowUp,
  ArrowDown,
  Activity,
  CalendarDays,
  Wallet,
  ArrowDownToLine,
} from "lucide-react"
import { useAuth } from "../lib/auth"
import { supabase } from "../lib/supabase"
import { AreaChart, Donut, SegmentedBar, CalendarHeatmap, WorldMap } from "../components/MiniCharts"

type Stats = {
  usuarios_totales: number
  usuarios_activos_7d: number
  usuarios_activos_30d: number
  usuarios_pagos: number
  usuarios_sin_pago: number
  imagenes_generadas_total: number
  assets_generados_total: number
  creditos_comprados_total: number
  creditos_consumidos_total: number
  creditos_disponibles_total: number
  creditos_expirados_sin_usar: number
  compras_total: number
  assets_7d: number
  assets_7d_prev: number
  creditos_consumidos_7d: number
  creditos_consumidos_7d_prev: number
  compras_7d: number
  compras_7d_prev: number
}

type CountryStat = {
  pais: string
  usuarios: number
  usuarios_pagos: number
  usuarios_sin_pago: number
  activos_30d: number
  assets_generados: number
}

type TopUser = {
  user_id: string
  user_name: string
  pais: string | null
  creditos_gastados: number
  assets_generados: number
  ultima_actividad: string | null
}

type Purchase = {
  user_id: string
  user_name: string
  credits_total: number
  credits_remaining: number
  source: string
  payment_id: string | null
  purchased_at: string
  expires_at: string
}

type DailyActivity = {
  dia: string
  assets_generados: number
  creditos_gastados: number
}

type Tone = "accent" | "green" | "amber"
type Tab = "resumen" | "facturacion" | "usuarios"

const toneClasses: Record<Tone, string> = {
  accent: "bg-(--color-accent)/15 text-(--color-accent-2)",
  green: "bg-(--color-green)/15 text-(--color-green)",
  amber: "bg-(--color-amber)/15 text-(--color-amber)",
}

// Glow suave del color del tone, detrás del ícono de cada tarjeta.
const toneGlow: Record<Tone, string> = {
  accent: "rgba(59,130,246,0.18)",
  green: "rgba(52,211,153,0.18)",
  amber: "rgba(245,167,66,0.18)",
}

function initials(name: string) {
  const clean = name.trim()
  if (!clean) return "?"
  const parts = clean.split(/\s+/)
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })
}

function pct(cur: number, prev: number): number | null {
  if (prev <= 0) return null
  return ((cur - prev) / prev) * 100
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-panel-2) text-xs font-medium text-(--color-text)">
      {initials(name)}
    </div>
  )
}

function SectionLabel({ icon: Icon, children }: { icon: typeof Users; children: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-(--color-muted-2) uppercase">
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      {children}
    </div>
  )
}

function TrendPill({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-xs text-(--color-muted-2)">nuevo</span>
  }
  const up = value >= 0
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium ${
        up ? "bg-(--color-green)/15 text-(--color-green)" : "bg-(--color-amber)/15 text-(--color-amber)"
      }`}
    >
      {up ? <ArrowUp className="h-2.5 w-2.5" strokeWidth={2.5} /> : <ArrowDown className="h-2.5 w-2.5" strokeWidth={2.5} />}
      {Math.abs(value).toFixed(1)}%
    </span>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone = "accent",
  trend,
}: {
  icon: typeof Users
  label: string
  value: string | number
  tone?: Tone
  trend?: number | null
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-panel) p-4 transition hover:border-(--color-border-hover)">
      <div
        className="pointer-events-none absolute -top-10 -left-10 h-24 w-24 rounded-full blur-2xl"
        style={{ background: toneGlow[tone] }}
      />
      <div className="relative mb-4 flex items-center justify-between">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
        {trend !== undefined && <TrendPill value={trend} />}
      </div>
      <p className="relative text-2xl font-medium tabular-nums text-(--color-text)">{value}</p>
      <p className="relative mt-0.5 text-[13px] text-(--color-muted-2)">{label}</p>
    </div>
  )
}

function EmptyRow({ children }: { children: string }) {
  return <p className="p-5 text-center text-sm text-(--color-muted-2)">{children}</p>
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? "bg-(--color-text) text-(--color-on-primary)" : "text-(--color-muted) hover:text-(--color-text)"
      }`}
    >
      {children}
    </button>
  )
}

export function Admin() {
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [byCountry, setByCountry] = useState<CountryStat[]>([])
  const [topUsers, setTopUsers] = useState<TopUser[]>([])
  const [daily, setDaily] = useState<DailyActivity[]>([])
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>("resumen")

  useEffect(() => {
    if (authLoading || !user) return

    async function load() {
      const { data: adminCheck, error: adminError } = await supabase.rpc("is_current_user_admin")
      if (adminError || !adminCheck) {
        setIsAdmin(false)
        return
      }
      setIsAdmin(true)

      const [statsRes, purchasesRes, countryRes, topUsersRes, dailyRes] = await Promise.all([
        supabase.rpc("admin_dashboard_stats"),
        supabase.rpc("admin_recent_purchases", { p_limit: 20 }),
        supabase.rpc("admin_stats_by_country"),
        supabase.rpc("admin_top_users", { p_limit: 10 }),
        supabase.rpc("admin_activity_daily", { p_days: 84 }),
      ])

      if (statsRes.error) setError(statsRes.error.message)
      else setStats(statsRes.data as Stats)

      if (purchasesRes.error) setError(purchasesRes.error.message)
      else setPurchases((purchasesRes.data as Purchase[]) ?? [])

      if (countryRes.error) setError(countryRes.error.message)
      else setByCountry((countryRes.data as CountryStat[]) ?? [])

      if (topUsersRes.error) setError(topUsersRes.error.message)
      else setTopUsers((topUsersRes.data as TopUser[]) ?? [])

      if (dailyRes.error) setError(dailyRes.error.message)
      else setDaily((dailyRes.data as DailyActivity[]) ?? [])
    }

    load()
  }, [authLoading, user])

  if (!authLoading && !user) return <Navigate to="/login" replace />

  if (isAdmin === false) {
    return (
      <div className="flex h-screen items-center justify-center bg-(--color-base) px-4 text-center">
        <div>
          <ShieldAlert className="mx-auto mb-3 h-6 w-6 text-(--color-muted)" strokeWidth={1.75} />
          <p className="text-(--color-text)">No tienes acceso a esta página.</p>
        </div>
      </div>
    )
  }

  const maxCountryUsers = Math.max(1, ...byCountry.map((c) => c.usuarios))
  const maxCredsGastados = Math.max(1, ...topUsers.map((u) => u.creditos_gastados))
  const last14 = daily.slice(-14)
  const firstName = (user?.user_metadata?.full_name || user?.user_metadata?.name || "").split(" ")[0]

  return (
    <div className="min-h-screen bg-(--color-base) pb-28 md:pb-12">
      {/* Header con glow — mismo lenguaje visual que ConnectShopifyBanner */}
      <div className="relative overflow-hidden border-b border-(--color-border) px-4 py-6 md:px-8 md:py-8">
        <div
          className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full opacity-25 blur-3xl"
          style={{ background: "#3b82f6" }}
        />
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-medium tracking-wide text-(--color-muted-2) uppercase">
            <ShieldAlert className="h-3.5 w-3.5" strokeWidth={1.75} />
            Panel interno
          </div>
          <h1 className="text-xl font-medium text-(--color-text) md:text-2xl">
            {firstName ? `Hola, ${firstName}` : "Métricas y facturación"}
          </h1>
          <p className="mt-1 text-sm text-(--color-muted)">Solo visible para admin — datos en vivo de Supabase.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 border-b border-(--color-border) bg-(--color-base)/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-2 md:px-8">
          <TabButton active={tab === "resumen"} onClick={() => setTab("resumen")}>
            Resumen
          </TabButton>
          <TabButton active={tab === "facturacion"} onClick={() => setTab("facturacion")}>
            Facturación
          </TabButton>
          <TabButton active={tab === "usuarios"} onClick={() => setTab("usuarios")}>
            Usuarios
          </TabButton>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        {error && (
          <p className="mb-6 rounded-xl border border-(--color-border) bg-(--color-panel) p-4 text-sm text-red-400">
            {error}
          </p>
        )}

        {!stats && !error && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl border border-(--color-border) bg-(--color-panel-2)/50" />
            ))}
          </div>
        )}

        {stats && tab === "resumen" && (
          <div className="flex flex-col gap-10">
            {/* Hero: el dato más importante de esta pestaña — usuarios totales,
                gigante arriba, todo lo demás es contexto debajo. */}
            <section className="rounded-2xl border border-(--color-border) bg-(--color-panel) p-5">
              <div className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-(--color-muted-2) uppercase">
                <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
                Usuarios totales
              </div>
              <div className="mb-1 flex items-baseline gap-3">
                <p className="text-5xl font-medium tabular-nums text-(--color-text) sm:text-6xl">
                  {stats.usuarios_totales}
                </p>
              </div>
              <div className="mb-4 flex items-center gap-2 text-sm">
                <TrendPill value={pct(stats.assets_7d, stats.assets_7d_prev)} />
                <span className="text-(--color-muted-2)">actividad vs. semana pasada</span>
              </div>
              <div className="flex items-center justify-between text-xs text-(--color-muted-2)">
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3 w-3" strokeWidth={1.75} />
                  {stats.assets_7d} assets generados (7d)
                </span>
                <span>{stats.usuarios_activos_7d} activos esta semana</span>
              </div>
              <div className="mt-3">
                <AreaChart values={last14.map((d) => d.assets_generados)} />
              </div>
            </section>

            {/* Heatmap de actividad */}
            <section>
              <SectionLabel icon={CalendarDays}>Actividad — últimas 12 semanas</SectionLabel>
              <div className="rounded-2xl border border-(--color-border) bg-(--color-panel) p-4">
                <CalendarHeatmap values={daily.map((d) => ({ dia: d.dia, valor: d.assets_generados }))} />
              </div>
            </section>

            {/* Usuarios */}
            <section>
              <SectionLabel icon={Users}>Usuarios</SectionLabel>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <MetricCard icon={Users} label="Total" value={stats.usuarios_totales} />
                <MetricCard icon={Sparkles} label="Activos 7 días" value={stats.usuarios_activos_7d} tone="green" />
                <MetricCard icon={Sparkles} label="Activos 30 días" value={stats.usuarios_activos_30d} tone="green" />
              </div>
            </section>

            {/* Generación */}
            <section>
              <SectionLabel icon={ImageIcon}>Generación</SectionLabel>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <MetricCard icon={ImageIcon} label="Imágenes generadas" value={stats.imagenes_generadas_total} />
                <MetricCard icon={Sparkles} label="Assets totales" value={stats.assets_generados_total} />
              </div>
            </section>
          </div>
        )}

        {stats && tab === "facturacion" && (
          <div className="flex flex-col gap-8">
            {/* Balance — estilo wallet cripto (ember/gold sobre negro), el hero
                de esta pestaña y el número más importante de toda la página. */}
            <section className="relative overflow-hidden rounded-3xl border border-(--color-border) p-6">
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(120% 100% at 85% 100%, rgba(245,167,66,0.35) 0%, rgba(245,167,66,0.08) 35%, #0a0a0a 70%)",
                }}
              />
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-white/70 uppercase">
                  <Wallet className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Balance de créditos
                </div>
                <span className="flex items-center gap-1.5 text-[11px] text-white/50">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--color-green)" />
                  en vivo
                </span>
              </div>

              <p className="text-5xl font-medium tabular-nums text-white sm:text-6xl">
                {stats.creditos_disponibles_total}
                <span className="ml-1 text-lg font-normal text-white/40">créd.</span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <TrendPill value={pct(stats.creditos_consumidos_7d, stats.creditos_consumidos_7d_prev)} />
                <span className="text-sm text-white/50">consumo vs. semana pasada</span>
              </div>

              <div className="mt-5 -mx-2">
                <AreaChart
                  values={last14.map((d) => d.creditos_gastados)}
                  color="var(--color-amber)"
                  height={90}
                />
              </div>

              <div className="mt-5 flex gap-6 border-t border-white/10 pt-4 text-sm">
                <div>
                  <p className="text-white/50">Comprados</p>
                  <p className="font-medium text-white">{stats.creditos_comprados_total}</p>
                </div>
                <div>
                  <p className="text-white/50">Consumidos</p>
                  <p className="font-medium text-white">{stats.creditos_consumidos_total}</p>
                </div>
                <div>
                  <p className="text-white/50">Expirados</p>
                  <p className="font-medium text-(--color-amber)">{stats.creditos_expirados_sin_usar}</p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-3 rounded-2xl border border-(--color-border) bg-(--color-panel) p-4">
                <SegmentedBar
                  segments={[
                    { value: stats.creditos_disponibles_total, color: "var(--color-green)" },
                    { value: stats.creditos_consumidos_total, color: "var(--color-accent-2)" },
                    { value: stats.creditos_expirados_sin_usar, color: "var(--color-amber)" },
                  ]}
                />
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-(--color-muted-2)">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-(--color-green)" /> Disponibles
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-(--color-accent-2)" /> Consumidos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-(--color-amber)" /> Expirados sin usar
                  </span>
                </div>
              </div>
            </section>

            {/* Monetización */}
            <section>
              <SectionLabel icon={Receipt}>Monetización</SectionLabel>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr]">
                <div className="flex items-center gap-4 rounded-2xl border border-(--color-border) bg-(--color-panel) p-4">
                  <Donut
                    segments={[
                      { value: stats.usuarios_pagos, color: "var(--color-green)" },
                      { value: stats.usuarios_sin_pago, color: "var(--color-panel-2)" },
                    ]}
                    centerLabel={`${Math.round((stats.usuarios_pagos / Math.max(1, stats.usuarios_totales)) * 100)}%`}
                  />
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-(--color-green)" />
                      <span className="text-(--color-text)">{stats.usuarios_pagos} pagaron alguna vez</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-(--color-panel-2)" />
                      <span className="text-(--color-muted-2)">{stats.usuarios_sin_pago} nunca pagaron</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <MetricCard
                    icon={Receipt}
                    label="Compras (7 días)"
                    value={stats.compras_7d}
                    trend={pct(stats.compras_7d, stats.compras_7d_prev)}
                  />
                  <MetricCard
                    icon={Coins}
                    label="Créditos consumidos (7d)"
                    value={stats.creditos_consumidos_7d}
                    trend={pct(stats.creditos_consumidos_7d, stats.creditos_consumidos_7d_prev)}
                  />
                </div>
              </div>
            </section>

            {/* Transacciones — estilo wallet */}
            <section>
              <SectionLabel icon={ArrowDownToLine}>Transacciones recientes</SectionLabel>
              <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-panel)">
                {purchases.length === 0 && <EmptyRow>Sin compras todavía.</EmptyRow>}
                {purchases.map((p, i) => (
                  <div
                    key={`${p.user_id}-${p.purchased_at}-${i}`}
                    className="flex items-center gap-3 border-b border-(--color-border) p-4 last:border-0"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-green)/15 text-(--color-green)">
                      <ArrowDownToLine className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-(--color-text)">
                          {p.user_name || p.user_id.slice(0, 8)}
                        </p>
                        <p className="shrink-0 text-sm font-medium tabular-nums text-(--color-green)">
                          +{p.credits_total}
                        </p>
                      </div>
                      <p className="mt-0.5 text-xs text-(--color-muted-2)">
                        {p.source} · {fmtDate(p.purchased_at)} · quedan {p.credits_remaining} · vence{" "}
                        {fmtDate(p.expires_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Top wallets */}
            <section>
              <SectionLabel icon={Trophy}>Top 10 usuarios (más gasto)</SectionLabel>
              <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-panel)">
                {topUsers.length === 0 && <EmptyRow>Sin datos todavía.</EmptyRow>}
                {topUsers.map((u, i) => (
                  <div key={u.user_id} className="flex items-center gap-3 border-b border-(--color-border) p-4 last:border-0">
                    <span className="w-5 shrink-0 text-center text-xs font-medium text-(--color-muted-2)">{i + 1}</span>
                    <Avatar name={u.user_name || "?"} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-(--color-text)">
                          {u.user_name || u.user_id.slice(0, 8)}
                        </p>
                        <p className="shrink-0 text-sm font-medium tabular-nums text-(--color-text)">
                          {u.creditos_gastados} <span className="text-(--color-muted-2)">créd.</span>
                        </p>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-(--color-panel-2)">
                        <div
                          className="h-full rounded-full bg-(--color-accent)"
                          style={{ width: `${(u.creditos_gastados / maxCredsGastados) * 100}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-(--color-muted-2)">
                        {u.pais ?? "Sin país"} · {u.assets_generados} assets
                        {u.ultima_actividad ? ` · última ${fmtDate(u.ultima_actividad)}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {stats && tab === "usuarios" && (
          <div className="flex flex-col gap-8">
            {/* Hero de esta pestaña: cuántos están realmente usando la app. */}
            <section className="relative overflow-hidden rounded-3xl border border-(--color-border) p-6">
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(120% 100% at 15% 0%, rgba(52,211,153,0.28) 0%, rgba(52,211,153,0.06) 40%, #0a0a0a 70%)",
                }}
              />
              <div className="mb-5 flex items-center gap-2 text-xs font-medium tracking-wide text-white/70 uppercase">
                <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
                Usuarios activos (30 días)
              </div>
              <p className="text-5xl font-medium tabular-nums text-white sm:text-6xl">
                {stats.usuarios_activos_30d}
                <span className="ml-2 text-lg font-normal text-white/40">de {stats.usuarios_totales}</span>
              </p>
              <div className="mt-5 flex gap-6 border-t border-white/10 pt-4 text-sm">
                <div>
                  <p className="text-white/50">Activos 7d</p>
                  <p className="font-medium text-white">{stats.usuarios_activos_7d}</p>
                </div>
                <div>
                  <p className="text-white/50">Pagaron</p>
                  <p className="font-medium text-(--color-green)">{stats.usuarios_pagos}</p>
                </div>
                <div>
                  <p className="text-white/50">Sin pagar</p>
                  <p className="font-medium text-(--color-amber)">{stats.usuarios_sin_pago}</p>
                </div>
              </div>
            </section>

            <section>
              <SectionLabel icon={Globe2}>Usuarios en el mapa</SectionLabel>
              <div className="rounded-2xl border border-(--color-border) bg-(--color-panel) p-4">
                <WorldMap dataByCountry={byCountry.map((c) => ({ pais: c.pais, usuarios: c.usuarios }))} />
              </div>
            </section>

            <section>
              <SectionLabel icon={Globe2}>Usuarios y actividad por país</SectionLabel>
              <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-panel)">
                {byCountry.length === 0 && <EmptyRow>Sin datos todavía.</EmptyRow>}
                {byCountry.map((c) => (
                  <div key={c.pais} className="border-b border-(--color-border) p-4 last:border-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-(--color-text)">{c.pais}</p>
                      <p className="text-sm font-medium tabular-nums text-(--color-text)">{c.usuarios}</p>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-(--color-panel-2)">
                      <div
                        className="h-full rounded-full bg-(--color-accent-2)"
                        style={{ width: `${(c.usuarios / maxCountryUsers) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-(--color-muted-2)">
                      {c.usuarios_pagos} pagos · {c.usuarios_sin_pago} sin pagar · {c.activos_30d} activos (30d) ·{" "}
                      {c.assets_generados} assets
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
