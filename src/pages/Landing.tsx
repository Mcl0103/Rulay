import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, Image as ImageIcon, Link2, LayoutTemplate, Sparkles, ShoppingBag, Target } from "lucide-react"
import { Logo } from "../components/Logo"
import { Loader } from "../components/Loader"
import { BorderBeam } from "border-beam"
import vitaliaPageSkeleton from "../assets/vitalia-page-skeleton.png"
import vitaliaPageFinished from "../assets/vitalia-page-finished.png"

// Reemplazar cada "img" por la URL real de la página/imagen generada cuando estén listas.
const EXAMPLES = [
  { label: "Belleza y cuidado personal", img: null },
  { label: "Hogar y organización", img: null },
  { label: "Tecnología y accesorios", img: null },
  { label: "Fitness y bienestar", img: null },
  { label: "Mascotas", img: null },
]

const ROTATING_WORDS = ["testear", "escalar", "vender", "publicar"]

// Reemplazar cada "img" por la captura real cuando esté lista.
const FEATURES = [
  {
    icon: Link2,
    tag: "Pega y listo",
    title: "Página desde un link",
    desc: "Pega la URL del producto (AliExpress, Amazon, Shopify, Dropi, Aliclik, TikTok Shop) y en segundos tienes la página armada.",
    span: "large" as const,
    linkDemo: true,
    img: null,
  },
  {
    icon: LayoutTemplate,
    tag: "Sin código",
    title: "Editor por secciones",
    desc: "Reordena, edita textos y bloques, o arma la página desde cero. Todo se puede tocar, nada queda fijo.",
    span: "large" as const,
    img: null,
  },
  {
    icon: Target,
    tag: "Ángulo automático",
    title: "IA encuentra el gancho",
    desc: "Analiza el producto y te da el ángulo de venta, no solo una plantilla genérica con el texto cambiado.",
    span: "small" as const,
    img: null,
  },
  {
    icon: Sparkles,
    tag: "Imágenes IA",
    title: "Fotos de producto sin cámara",
    desc: "Genera imágenes de producto listas para vender, sin sesión de fotos ni editor externo.",
    span: "small" as const,
    img: null,
  },
  {
    icon: ShoppingBag,
    tag: "Shopify nativo",
    title: "Conectada a tu tienda",
    desc: "El botón de compra usa el checkout real de tu Shopify, no una simulación aparte.",
    span: "small" as const,
    img: null,
  },
]

function RotatingWord() {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState("")
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing")

  useEffect(() => {
    const word = ROTATING_WORDS[wordIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (phase === "typing") {
      if (text.length < word.length) {
        timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), 90)
      } else {
        timeout = setTimeout(() => setPhase("pausing"), 1000)
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 700)
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), 45)
      } else {
        setWordIndex((i) => (i + 1) % ROTATING_WORDS.length)
        setPhase("typing")
        return
      }
    }

    return () => clearTimeout(timeout)
  }, [text, phase, wordIndex])

  return (
    <span className="relative inline-flex items-baseline font-serif text-(--color-accent) italic font-medium">
      <span>{text}</span>
      <span className="t-cursor-blink ml-0.5 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] bg-(--color-accent)" />
    </span>
  )
}


/** Fades + slides a section in once it enters the viewport. Mirrors the
 * .t-stagger pattern already used in the app, applied at section scope. */
function Reveal({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.unobserve(el)
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      id={id}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  )
}

function GlowBlob({
  className = "",
  opacity = 0.7,
  size = 900,
}: {
  className?: string
  opacity?: number
  size?: number
}) {
  return (
    <div
      className={`pointer-events-none absolute -translate-x-1/2 ${className}`}
      style={{
        width: size,
        height: size * 0.72,
        opacity,
        background:
          "radial-gradient(closest-side, rgba(59,130,246,0.30), rgba(59,130,246,0.10) 50%, transparent 72%)",
        filter: "blur(70px)",
      }}
    />
  )
}

/** Carrusel infinito con efecto "coverflow": las tarjetas cercanas al centro
 * del viewport crecen y se traen al frente en tiempo real mientras la fila
 * se desplaza sola vía CSS. La animación de escala corre en un rAF propio
 * porque depende de la posición en vivo de cada tarjeta, no de scroll. */
function ExamplesCarousel({ items }: { items: { label: string }[] }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let raf = 0
    const viewport = viewportRef.current
    if (!viewport) return

    function tick() {
      const vRect = viewport!.getBoundingClientRect()
      const centerX = vRect.left + vRect.width / 2
      const half = vRect.width / 2

      for (const card of cardRefs.current) {
        if (!card) continue
        const r = card.getBoundingClientRect()
        const dist = Math.abs(r.left + r.width / 2 - centerX)
        const closeness = Math.max(0, 1 - dist / half)
        const scale = 0.85 + closeness * 0.22
        card.style.transform = `scale(${scale.toFixed(3)}) translateY(${(-closeness * 10).toFixed(1)}px)`
        card.style.zIndex = String(Math.round(closeness * 100))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const doubled = [...items, ...items]

  return (
    <div
      ref={viewportRef}
      className="py-10 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]"
    >
      <div className="flex w-max animate-[scrollx_38s_linear_infinite] gap-9">
        {doubled.map((ex, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el }}
            className="flex aspect-[9/16] w-[190px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-(--color-border) bg-(--color-panel-2)/60 px-4 text-center text-(--color-muted-2) shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)] transition-shadow duration-200 sm:w-[220px]"
          >
            <ImageIcon className="h-7 w-7" />
            <span className="text-xs">{ex.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const NAV_LINKS = [
  { href: "#producto", label: "Producto" },
  { href: "#diferencia", label: "Por qué Rulay" },
  { href: "#plata", label: "Sin cuentas raras" },
  { href: "#precios", label: "Precios" },
]

export function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 550)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* La landing es blanca a propósito (data-theme="light" fijo, no ligado al
          toggle de la app). El footer se queda oscuro — vive fuera de este scope
          y usa sus propios colores literales — y la última sección antes de él
          hace el degradado de blanco a negro. */}
      <div data-theme="light" className="bg-(--color-base) text-(--color-text)">
        <Loader show={!ready} variant="dark" />
      {/* ---------- Nav ---------- */}
      <header data-theme="light" className="fixed inset-x-0 top-3.5 z-50 px-6">
        <div className="mx-auto max-w-5xl">
        <div
          className={`flex items-center justify-between gap-4 rounded-full border px-4 py-2.5 backdrop-blur-xl transition-all duration-500 ease-out ${
            scrolled
              ? "border-(--color-border) bg-(--color-panel)/75 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.6)] md:border-(--color-border) md:bg-(--color-panel)/75 md:px-4 md:shadow-[0_12px_30px_-14px_rgba(0,0,0,0.6)]"
              : "border-(--color-border) bg-(--color-panel)/75 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.6)] md:border-transparent md:bg-transparent md:px-1.5 md:py-1.5 md:shadow-none md:backdrop-blur-none"
          }`}
        >
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-[15px] font-extrabold tracking-tight"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black">
              <Logo className="h-4.5 w-4.5" />
            </span>
            <span className="whitespace-nowrap">Rulay.AI</span>
          </Link>
          <nav className="hidden items-center gap-1 rounded-full bg-(--color-panel-2) p-1 text-sm text-(--color-muted) md:flex">
            <a
              href="#producto"
              className="rounded-full bg-(--color-text) px-3.5 py-1.5 font-semibold text-(--color-panel) transition"
            >
              Producto
            </a>
            <a
              href="#diferencia"
              className="rounded-full px-3.5 py-1.5 transition hover:bg-(--color-panel) hover:text-(--color-text)"
            >
              Por qué Rulay
            </a>
            <a
              href="#plata"
              className="rounded-full px-3.5 py-1.5 transition hover:bg-(--color-panel) hover:text-(--color-text)"
            >
              Sin cuentas raras
            </a>
            <a
              href="#precios"
              className="rounded-full px-3.5 py-1.5 transition hover:bg-(--color-panel) hover:text-(--color-text)"
            >
              Precios
            </a>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/login"
              className="hidden rounded-full px-3.5 py-2 text-sm whitespace-nowrap text-(--color-muted) transition hover:text-(--color-text) xs:inline-block"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/login"
              className="rounded-xl bg-gradient-to-b from-(--color-accent-2) to-(--color-accent) px-4 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-[0_8px_20px_-8px_rgba(59,130,246,0.6)] transition hover:brightness-110 active:scale-[0.98]"
            >
              Comenzar ahora
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-(--color-text) transition hover:bg-(--color-panel-2) md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ---- mobile dropdown ---- */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
            menuOpen ? "mt-2 max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-1 rounded-2xl border border-(--color-border) bg-(--color-panel)/95 p-2 text-sm text-(--color-muted) backdrop-blur-xl shadow-[0_12px_30px_-14px_rgba(0,0,0,0.6)]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3.5 py-2.5 transition hover:bg-(--color-panel-2) hover:text-(--color-text)"
              >
                {link.label}
              </a>
            ))}
            <div className="my-1 border-t border-(--color-border)" />
            <Link
              to="/login"
              className="rounded-xl px-3.5 py-2.5 transition hover:bg-(--color-panel-2) hover:text-(--color-text)"
            >
              Iniciar sesión
            </Link>
          </nav>
        </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative px-6 pt-36 pb-12 sm:pt-40">
        <GlowBlob className="left-1/2 -top-24" opacity={0.7} size={1400} />
        <div className={`t-stagger hero-stagger relative mx-auto max-w-3xl text-center ${ready ? "is-shown" : ""}`}>

          <h1 className="t-stagger-line t-stagger-line--1 mx-auto max-w-[16ch] text-[2.15rem] leading-[1.04] font-black tracking-tight sm:text-6xl">
            No te falta buen ojo. Te falta{" "}
            <span className="font-serif text-(--color-accent) italic font-medium">tiempo</span> para testearlo todo.
          </h1>

          <p className="t-stagger-line t-stagger-line--2 mx-auto mt-5 max-w-md text-(--color-muted) sm:text-lg">
            Testea diez productos en lo que antes te tomaba armar uno.
          </p>

          <div className="t-stagger-line t-stagger-line--3 mt-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/login"
                className="rounded-xl bg-gradient-to-b from-(--color-accent-2) to-(--color-accent) px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(59,130,246,0.6)] transition hover:brightness-110 active:scale-[0.98]"
              >
                Comenzar ahora
              </Link>
              <a
                href="#producto"
                className="rounded-xl border border-(--color-border) bg-(--color-panel) px-6 py-3 text-sm font-semibold transition hover:border-(--color-accent)/40"
              >
                Ver cómo funciona
              </a>
            </div>
          </div>
          <p className="t-stagger-line t-stagger-line--4 mt-3 text-xs text-(--color-muted-2)">Sin suscripción · sin letra chica · sin compromiso mensual</p>

        </div>
      </section>

      {/* ---------- Ejemplos ---------- */}
      <section id="producto" className="px-6 pt-2 pb-16">
        <Reveal>
          <ExamplesCarousel items={EXAMPLES} />
        </Reveal>
      </section>

      {/* ---------- Por qué Rulay ---------- */}
      <section id="diferencia" className="px-6 pb-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-[2.15rem] leading-[1.04] font-black tracking-tight sm:text-6xl">
            Todo lo que necesitas para
            <br />
            <RotatingWord /> tu tienda
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-6">
          {FEATURES.map((f) => (
            <Reveal
              key={f.title}
              className={`overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-panel) text-center ${
                f.span === "large" ? "sm:col-span-3" : "sm:col-span-2"
              }`}
            >
              {f.linkDemo ? (
                <div>
                  <div className="bg-white px-5 pt-4 pb-1">
                    <BorderBeam size="pulse-inner" colorVariant="ocean" strength={0.7} theme="light">
                      <div className="flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-panel) px-4 py-2.5 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.3)]">
                        <span className="flex-1 truncate text-left text-xs text-(--color-muted)">
                          http://aliexpress.us/item/1005008406212693.html
                        </span>
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white">
                          <Sparkles className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </BorderBeam>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold text-(--color-muted-2)">
                      <span>AliExpress</span>
                      <span>Amazon</span>
                      <span>Shopify</span>
                      <span>Dropi</span>
                      <span>Aliclik</span>
                    </div>
                  </div>
                  <div className="relative" style={{ aspectRatio: "1024 / 1100" }}>
                    <div className="absolute inset-0 overflow-hidden bg-white">
                      <img
                        src={vitaliaPageSkeleton}
                        alt=""
                        className="absolute inset-0 h-full w-full scale-[0.97] object-cover object-top [mask-image:linear-gradient(to_bottom,#000_78%,transparent_98%)]"
                      />
                      <img
                        src={vitaliaPageFinished}
                        alt=""
                        className="t-scan-reveal absolute inset-0 h-full w-full object-cover object-top [mask-image:linear-gradient(to_bottom,#000_78%,transparent_98%)]"
                      />
                    </div>
                    <div
                      className="t-scan-bar pointer-events-none absolute h-[3px] rounded-full bg-(--color-accent)"
                      style={{
                        left: "-20px",
                        right: "-20px",
                        boxShadow:
                          "0 0 8px 2px rgba(59,130,246,0.9), 0 0 24px 8px rgba(59,130,246,0.55), 0 0 44px 16px rgba(59,130,246,0.28)",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="relative flex aspect-[4/3] items-center justify-center bg-(--color-panel-2)/60 text-(--color-muted-2) [mask-image:linear-gradient(to_bottom,#000_55%,transparent_95%)]">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
              <div className="relative px-5 pt-4 pb-5">
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-(--color-accent)">
                  <f.icon className="h-3.5 w-3.5" />
                  {f.tag}
                </div>
                <h3 className="mt-1.5 font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-(--color-muted)">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      </div>

      {/* ---------- Footer ---------- */}
      <footer
        className="relative px-6 pt-24 sm:px-10 sm:pt-32"
        style={{ background: "#0A0B0D" }}
      >
        <div
          className="relative -mx-6 overflow-hidden sm:-mx-10"
          style={{ background: "#0A0B0D" }}
        >
          {/* azul, extremadamente sutil */}
          <div
            className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[700px] max-w-full -translate-x-1/2"
            style={{
              background: "radial-gradient(ellipse, rgba(37,99,235,0.9), transparent 70%)",
              opacity: 0.045,
            }}
          />

          {/* newsletter */}
          <Reveal className="relative mx-auto max-w-lg px-6 pt-16 pb-10 text-center sm:pt-20 sm:pb-12">
            <h2 className="text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-[#F5F7FA] sm:text-[42px]">
              Entérate primero de las
              <br />
              <span className="font-bold">novedades de Rulay.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[300px] text-[11px] leading-[1.5] text-[#777C84]">
              Te avisamos cuando sale una función nueva, cambia algo del pricing, o hay algo que sí vale la pena
              saber.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="Tu correo"
                className="h-8 w-full rounded-full border border-white/[0.06] bg-[#222427] px-4 text-[13px] text-[#F5F7FA] placeholder:text-white/40 focus:border-[#3B82F6]/55 focus:outline-none sm:w-[170px]"
              />
              <button
                type="submit"
                className="h-8 w-full shrink-0 rounded-full bg-[#3B82F6] px-5 text-[13px] font-semibold text-white transition hover:bg-[#2563EB] sm:w-auto"
              >
                Suscribirme
              </button>
            </form>
          </Reveal>

          {/* divider */}
          <div className="relative mx-6 sm:mx-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

          {/* brand + columnas */}
          <Reveal className="relative grid grid-cols-2 gap-x-8 gap-y-10 px-6 py-11 sm:grid-cols-[2fr_1fr_1fr_1fr] sm:gap-10 sm:px-8">
            <div className="col-span-2 sm:col-span-1">
              <Link to="/" className="flex items-center gap-2 text-[15px] font-bold tracking-tight text-[#F5F7FA]">
                <Logo className="h-6 w-6" />
                <span>Rulay.AI</span>
              </Link>
              <p className="mt-2 max-w-[24ch] text-[12px] leading-[1.5] text-[#777C84]">
                Páginas de producto con IA.
                <br />
                Pagás por lo que generás, no por mes.
              </p>
            </div>
            <div>
              <h5 className="mb-3 text-[12px] font-semibold text-[#F5F7FA]">Producto</h5>
              <a href="#precios" className="mb-2 block text-[12px] text-[#686D75] transition hover:text-white">
                Precios
              </a>
              <a href="#producto" className="mb-2 block text-[12px] text-[#686D75] transition hover:text-white">
                Cómo funciona
              </a>
              <a href="#diferencia" className="block text-[12px] text-[#686D75] transition hover:text-white">
                Por qué Rulay
              </a>
            </div>
            <div>
              <h5 className="mb-3 text-[12px] font-semibold text-[#F5F7FA]">Cuenta</h5>
              <Link to="/login" className="mb-2 block text-[12px] text-[#686D75] transition hover:text-white">
                Iniciar sesión
              </Link>
              <Link to="/login" className="block text-[12px] text-[#686D75] transition hover:text-white">
                Crear cuenta
              </Link>
            </div>
            <div>
              <h5 className="mb-3 text-[12px] font-semibold text-[#F5F7FA]">Legal</h5>
              <a href="#" className="mb-2 block text-[12px] text-[#686D75] transition hover:text-white">
                Privacidad
              </a>
              <a href="#" className="block text-[12px] text-[#686D75] transition hover:text-white">
                Términos
              </a>
            </div>
          </Reveal>

          {/* RULAY gigante, recortado por el borde inferior de la caja */}
          <div className="relative h-[clamp(180px,21vw,326px)] overflow-hidden">
            <span
              className="pointer-events-none absolute left-1/2 text-[clamp(80px,24vw,200px)] leading-none font-bold whitespace-nowrap text-white/[0.06] select-none sm:text-[clamp(220px,31vw,480px)]"
              style={{
                top: 0,
                transform: "translateX(-50%) scaleX(1.15)",
                letterSpacing: "-0.03em",
                textBoxTrim: "trim-both",
                textBoxEdge: "cap alphabetic",
              } as React.CSSProperties}
            >
              RULAY
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
