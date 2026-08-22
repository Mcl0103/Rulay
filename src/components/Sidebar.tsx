import { useRef } from "react"
import { useLocation } from "react-router-dom"
import { GuardedLink } from "../lib/unsavedGuard"
import {
  LayoutGrid,
  FileText,
  ImagePlus,
  Plug,
  Coins,
  ChevronsUpDown,
  Sparkles,
  LayoutTemplate,
  Settings,
  UserRound,
} from "lucide-react"
import { Logo } from "./Logo"
import { useAuth } from "../lib/auth"
import { useLanguage, type TranslationKey } from "../lib/i18n"

const inicioItems = [{ icon: LayoutGrid, labelKey: "sidebar.dashboard" as TranslationKey, to: "/app" }]

const paginasItems = [
  { icon: Sparkles, labelKey: "sidebar.crearProductPage" as TranslationKey, to: "/app/generar" },
  { icon: LayoutTemplate, labelKey: "sidebar.landingImagenes" as TranslationKey, to: "/app/landing" },
  { icon: FileText, labelKey: "sidebar.tusPaginas" as TranslationKey, to: "/app/paginas" },
]

const imagenesItems = [
  { icon: ImagePlus, labelKey: "sidebar.imagenesIA" as TranslationKey, to: "/app/imagenes" },
  { icon: UserRound, labelKey: "sidebar.avatares" as TranslationKey, to: "/app/avatares" },
]

const cuentaItems = [
  { icon: Plug, labelKey: "sidebar.integraciones" as TranslationKey, to: "/app/integraciones" },
  { icon: Settings, labelKey: "sidebar.configuracion" as TranslationKey, to: "/app/configuracion" },
]

export function Sidebar() {
  const { pathname } = useLocation()
  const { t } = useLanguage()

  return (
    <aside className="relative flex h-full w-64 shrink-0 flex-col border-r border-dashed border-(--color-border) bg-(--color-panel) p-4">
      <span className="corner-dot" style={{ left: "100%", top: 0 }} />
      <span className="corner-dot" style={{ left: "100%", bottom: 0 }} />
      <div className="mb-4 flex shrink-0 items-center gap-2">
        <Logo />
        <span className="font-serif text-[17px] text-white">Rulay.AI</span>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-0.5">
          <p className="px-3 pb-1.5 text-[11px] font-medium tracking-wide text-(--color-muted-2) uppercase">
            {t("sidebar.inicio")}
          </p>
          {inicioItems.map((item) => (
            <NavItem key={item.labelKey} icon={item.icon} label={t(item.labelKey)} to={item.to} active={pathname === item.to} />
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-0.5">
          <p className="px-3 pb-1.5 text-[11px] font-medium tracking-wide text-(--color-muted-2) uppercase">
            {t("sidebar.paginas")}
          </p>
          {paginasItems.map((item) => (
            <NavItem key={item.labelKey} icon={item.icon} label={t(item.labelKey)} to={item.to} active={pathname === item.to} />
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-0.5">
          <p className="px-3 pb-1.5 text-[11px] font-medium tracking-wide text-(--color-muted-2) uppercase">
            {t("sidebar.imagenesGrupo")}
          </p>
          {imagenesItems.map((item) => (
            <NavItem key={item.labelKey} icon={item.icon} label={t(item.labelKey)} to={item.to} active={pathname === item.to} />
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-0.5">
          <p className="px-3 pb-1.5 text-[11px] font-medium tracking-wide text-(--color-muted-2) uppercase">
            {t("sidebar.cuenta")}
          </p>
          {cuentaItems.map((item) => (
            <NavItem key={item.labelKey} icon={item.icon} label={t(item.labelKey)} to={item.to} active={pathname === item.to} />
          ))}
        </div>
      </nav>

      <div className="shrink-0">
        <CreditsCard />
        <ProfileCard />
      </div>
    </aside>
  )
}

function NavItem({
  icon: Icon,
  label,
  to,
  active,
}: {
  icon: typeof LayoutGrid
  label: string
  to: string
  active?: boolean
}) {
  return (
    <GuardedLink
      to={to}
      className={`relative flex items-center gap-2.5 overflow-hidden rounded-lg px-3 py-1.5 text-sm transition ${
        active
          ? "bg-gradient-to-r from-(--color-panel-2) via-(--color-panel-2) to-(--color-accent)/12 text-white"
          : "text-(--color-muted) hover:bg-(--color-panel-2)/60 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
      {label}
      {active && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-[3px] animate-[nav-glow-pulse_2.4s_ease-in-out_infinite]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--color-accent-2) 50%, transparent 100%)",
            boxShadow: "0 0 8px 1px rgba(59,130,246,0.55)",
          }}
        />
      )}
    </GuardedLink>
  )
}

function CreditsCard() {
  const { t } = useLanguage()
  const used = 0
  const total = 500
  const pct = Math.round((used / total) * 100)
  const tiltRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = tiltRef.current
    const card = cardRef.current
    if (!el || !card) return

    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const maxDeg = 8
    const ry = (px - 0.5) * maxDeg * 2
    const rx = -(py - 0.5) * maxDeg * 2

    card.style.setProperty("--tilt-rx", `${rx}deg`)
    card.style.setProperty("--tilt-ry", `${ry}deg`)
    card.style.setProperty("--tilt-gx", `${px * 100}%`)
    card.style.setProperty("--tilt-gy", `${py * 100}%`)
    card.classList.add("is-tilting")
    el.classList.add("is-hover")
  }

  function handlePointerLeave() {
    const card = cardRef.current
    const el = tiltRef.current
    if (!card || !el) return

    card.classList.remove("is-tilting")
    el.classList.remove("is-hover")
    card.style.setProperty("--tilt-rx", "0deg")
    card.style.setProperty("--tilt-ry", "0deg")
  }

  return (
    <div
      ref={tiltRef}
      className="t-tilt"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        ref={cardRef}
        className="t-tilt-card border border-(--color-border) bg-(--color-panel-2) p-4"
      >
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--color-accent)/15 text-(--color-accent-2)">
            <Coins className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {total - used} {t("sidebar.creditos")}
            </p>
            <p className="text-xs text-(--color-muted-2)">
              {t("sidebar.deEsteMes", { total })}
            </p>
          </div>
        </div>
        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-slate-300 to-blue-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <button className="w-full rounded-lg bg-white py-2 text-sm font-medium text-black transition hover:bg-white/90">
          {t("sidebar.comprarCreditos")}
        </button>
        <div className="t-tilt-glare" />
      </div>
    </div>
  )
}

function ProfileCard() {
  const { user } = useAuth()
  const name =
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Usuario"
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

  return (
    <GuardedLink
      to="/app/perfil"
      className="mt-2 flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition hover:bg-(--color-panel-2)"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-blue-500 text-xs font-medium text-white">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{name}</p>
        <p className="truncate text-xs text-(--color-muted-2)">
          {user?.email}
        </p>
      </div>
      <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-(--color-muted-2)" />
    </GuardedLink>
  )
}
