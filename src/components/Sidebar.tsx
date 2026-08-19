import { Link, useLocation } from "react-router-dom"
import {
  LayoutGrid,
  FileText,
  ImagePlus,
  Plug,
  CircleHelp,
  Coins,
  ChevronsUpDown,
  Sparkles,
} from "lucide-react"
import { Logo } from "./Logo"
import { useAuth } from "../lib/auth"

const topItems = [{ icon: LayoutGrid, label: "Dashboard", to: "/app" }]

const paginasItems = [
  { icon: Sparkles, label: "Crear Product Page", to: "/app/generar" },
  { icon: FileText, label: "Tus páginas", to: "/app/paginas" },
]

const midItems = [{ icon: ImagePlus, label: "Imágenes IA", to: "/app/imagenes" }]

const bottomItems = [
  { icon: Plug, label: "Integraciones", to: "/app/integraciones" },
]

const supportItems = [
  { icon: CircleHelp, label: "Centro de ayuda", to: "/app/ayuda" },
]

export function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="relative flex h-full w-64 shrink-0 flex-col border-r border-dashed border-(--color-border) bg-(--color-panel) p-4">
      <span className="corner-dot" style={{ left: "100%", top: 0 }} />
      <span className="corner-dot" style={{ left: "100%", bottom: 0 }} />
      <Logo className="mb-4" />

      <div className="flex flex-col gap-0.5">
        <p className="px-3 pb-1.5 text-[11px] font-medium tracking-wide text-(--color-muted-2) uppercase">
          Flujo
        </p>

        {topItems.map((item) => (
          <NavItem key={item.label} {...item} active={pathname === item.to} />
        ))}

        {midItems.map((item) => (
          <NavItem key={item.label} {...item} active={pathname === item.to} />
        ))}

        {bottomItems.map((item) => (
          <NavItem key={item.label} {...item} active={pathname === item.to} />
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-0.5">
        <p className="px-3 pb-1.5 text-[11px] font-medium tracking-wide text-(--color-muted-2) uppercase">
          Páginas
        </p>
        {paginasItems.map((item) => (
          <NavItem key={item.label} {...item} active={pathname === item.to} />
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-0.5">
        <p className="px-3 pb-1.5 text-[11px] font-medium tracking-wide text-(--color-muted-2) uppercase">
          Soporte
        </p>
        {supportItems.map((item) => (
          <NavItem key={item.label} {...item} active={pathname === item.to} />
        ))}
      </div>

      <div className="flex-1" />

      <CreditsCard />
      <ProfileCard />
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
    <Link
      to={to}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition ${
        active
          ? "bg-(--color-panel-2) text-white"
          : "text-(--color-muted) hover:bg-(--color-panel-2)/60 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
      {label}
    </Link>
  )
}

function CreditsCard() {
  const used = 0
  const total = 500
  const pct = Math.round((used / total) * 100)

  return (
    <div className="relative rounded-xl border border-(--color-border) bg-(--color-panel-2) p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--color-accent)/15 text-(--color-accent-2)">
          <Coins className="h-3.5 w-3.5" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            {total - used} créditos
          </p>
          <p className="text-xs text-(--color-muted-2)">
            de {total} este mes
          </p>
        </div>
      </div>
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <button className="w-full rounded-lg bg-white py-2 text-sm font-medium text-black transition hover:bg-white/90">
        Comprar créditos
      </button>
    </div>
  )
}

function ProfileCard() {
  const { user } = useAuth()
  const name =
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Usuario"
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

  return (
    <Link
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
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-medium text-white">
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
    </Link>
  )
}
