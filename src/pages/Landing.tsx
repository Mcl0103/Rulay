import { Link } from "react-router-dom"
import { Logo } from "../components/Logo"

export function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-(--color-base)">
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.35) 0%, rgba(148,163,184,0.10) 40%, transparent 70%)",
        }}
      />

      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-medium text-white">Rulay</span>
        </div>
        <div className="hidden items-center gap-8 text-sm text-(--color-muted) sm:flex">
          <a href="#como-funciona" className="hover:text-white">
            Cómo funciona
          </a>
          <a href="#precios" className="hover:text-white">
            Precios
          </a>
          <a href="#faq" className="hover:text-white">
            FAQ
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-full border border-(--color-border) px-4 py-2 text-sm text-white transition hover:border-(--color-border-hover)"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/login"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Probar gratis
          </Link>
        </div>
      </nav>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pt-28 pb-32 text-center">
        <span className="mb-6 rounded-full border border-(--color-border) bg-(--color-panel) px-3 py-1 text-xs text-(--color-muted)">
          Páginas de producto con IA · pagas solo por lo que usas
        </span>
        <h1 className="font-serif text-5xl leading-[1.05] text-white sm:text-6xl">
          Del link
          <br />
          al <em className="italic">lanzamiento.</em>
        </h1>
        <p className="mt-6 max-w-md text-(--color-muted)">
          Pega el link de tu producto y Rulay genera una página lista para
          vender — copy, secciones e imágenes con IA. Sin suscripción, pagas
          por créditos.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Crear mi primera página
          </Link>
          <a
            href="#como-funciona"
            className="rounded-full border border-(--color-border) px-5 py-2.5 text-sm text-white transition hover:border-(--color-border-hover)"
          >
            Ver cómo funciona
          </a>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl border-t border-(--color-border) px-6 py-6">
        <div className="flex flex-col justify-between gap-2 text-xs text-(--color-muted-2) sm:flex-row">
          <span>Hecho para dropshippers LATAM</span>
          <span>Rulay · 2026</span>
        </div>
      </div>
    </div>
  )
}
