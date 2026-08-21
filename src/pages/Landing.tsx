import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Logo } from "../components/Logo"
import { Loader } from "../components/Loader"

const SOURCES = ["AliExpress", "Amazon", "Shopify", "Dropi", "Aliclik", "TikTok Shop"]

const LOGO_ASCII = ` ;-l\`.              ....
 "fo%apZCcr|[~!:'               ..
   :Y$$$$$$$$$@8#hp0Yx\\{_i:\`.              ..
     >Q$$%BBB@$$$$$$$$$$$@%Mhp0Yn/{_i;\`.          .
       ]b$$B@@@@@@BBBBBB@@$$$$$$$$$$@%Mhp0Yn/{_!^
        .\\#$$B@@@@@@@@@@@@@@@BBBBBB@@$$$$$$$$$$BMpc]\`
          "v%$@BBBB@@@@@@@@@@@@@@@@@@@@@BBBBBB@$$$$$*vI
            !L$$$$$$$$$@BBBBBB@@@@@@@@@@@@@@@@@@@BB@$$8r
              ~jcCmb*&B$$$$$$$$$$$@@BBBBBB@@@@@@@@@@@B$$0'
                    '"l<])fvJZdaW%$$$$$$$$$$@@@@@@@@@@@B$J
               ..              .^I>-1tuY0paW$@@@@@@@@@@@B$-
                         ...              '"j@@@@@@@@@@@B@X
                                   ...'..   IB@@@@@@@@@@@$Z
                                .        \`![J@@@@@@@@@@@B@C
                         ..        'l?tYq#B$$@@@@@@@@@@@B\${
                   ..        ^i[jUq#B$$$$$$BB@@@@@@@@@BB$Q
                      .:~)uQbW@$$$$$$@BBB@@@@@@@@@@@B@$$J'
                  </zma8$$$$$$@BBBB@@@@@@@@@@@BBB@$$$$p{
                 _$$$$$$@BBB@@@@@@@@@@@BBBB@$$$$$$&dv+
                 {$BBB@@@@@@@@@@@@@@@@$$$$$@WbQu)~,
                 [$@@@@@@@@@@@@@@@@@@@awJj}i"       .
                 }$@@@@@@@@$$B@@@@@@@@U'       ..
                 }$@@@@@@@$ok$@@@@@@@@$a]  .
                 }@B@@@@@B$m'X$$B@@@@@B$$z^
                 {$$$BBB@B$p  ]o$B@@@@@@@$a?
                 iOaB$$$$@@w . "J$$B@@@@@B$$c\` .
                   .l[x0a%$b     )W$B@@@@@@@$h-
                        .I}}      IZ$@@@@@@@B$@c\`
                      .          .  jB$B@@@@@@@$k_
                                     ~k$@BBB@@@B$@v'
                                      'X$$$$$$@@BB$k+
                                        -rUwa&$$$$$$$c'
                                            ."i]\\vQp*$h].
                                         .          \`I]\\: \``

const SPARKLE_ASCII = `                  <umkkqY[
                 v$$$$$$$$p;
              . 1$BBBBBBBB$q
              . b@B@@@@@@@B$- .
            .  ($B@@@@@@@@B@p  .
      ..     ./B@@@@@@@@@@@B$O;      .
          ^<fk$@@@@@@@@@@@@@B$&Y];.
     <\\c0bW$$$B@@@@@@@@@@@@@@B$$$%oqCx]^
   }k$$$$$$@BB@@@@@@@@@@@@@@@@@BB$$$$$$Mj
  ]$$BBBBB@@@@@@@@@@@@@@@@@@@@@@@@BBBBB@$( .
. {$$@BBBBB@@@@@@@@@@@@@@@@@@@@@@BBBBB@$$) .
   |h@$$$$$$BB@@@@@@@@@@@@@@@@BB$$$$$$@h|
     i{jz0k&$$@B@@@@@@@@@@@@B@$$8kQcf{i
           :[J%$B@@@@@@@@@@B$@L[:
      ...     !q$B@@@@@@@@B$o+     ...
             . 'h@B@@@@@@@B8l .
              . -$BB@@@@@%$x .
                 C$$@BB@$$k\`
                 .n#$$$$WY"
                   '<][~^\``

const CONSOLE_LINES = [
  { color: "text-(--color-muted-2)", prefix: "$", text: "pegaste el link de tu producto" },
  { color: "text-(--color-accent-2)", prefix: "→", text: "buscando tu ángulo de venta…" },
  { color: "text-(--color-green)", prefix: "✓", text: "ángulo encontrado: \"duerme mejor en 20 min\"" },
  { color: "text-(--color-accent-2)", prefix: "→", text: "generando imágenes de producto…" },
  { color: "text-(--color-green)", prefix: "✓", text: "página lista para publicar" },
  { color: "text-(--color-amber)", prefix: "↗", text: "publicando a tu tienda Shopify…" },
]


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

const NAV_LINKS = [
  { href: "#producto", label: "Producto" },
  { href: "#diferencia", label: "Por qué Rulay" },
  { href: "#plata", label: "Sin cuentas raras" },
  { href: "#precios", label: "Precios" },
]

export function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 550)
    return () => clearTimeout(t)
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
      <header className="sticky top-3.5 z-50 px-6">
        <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4 rounded-full border border-(--color-border) bg-(--color-panel)/75 px-4 py-2.5 backdrop-blur-xl shadow-[0_12px_30px_-14px_rgba(0,0,0,0.6)]">
          <Link to="/" className="flex shrink-0 items-center gap-2 text-[15px] font-extrabold tracking-tight">
            <Logo className="h-6.5 w-6.5" variant="dark" />
            <span>Rulay.AI</span>
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
              className="hidden rounded-full px-3.5 py-2 text-sm text-(--color-muted) transition hover:text-(--color-text) xs:inline-block"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/login"
              className="rounded-xl bg-gradient-to-b from-(--color-accent-2) to-(--color-accent) px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(59,130,246,0.6)] transition hover:brightness-110 active:scale-[0.98]"
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
      <section className="relative overflow-hidden px-6 pt-20 pb-12">
        <GlowBlob className="left-1/2 -top-24" opacity={0.55} />
        <pre
          aria-hidden="true"
          className="t-float-x-a pointer-events-none absolute top-4 right-[6%] select-none font-mono text-[6px] leading-[6px] text-(--color-accent)/20 sm:top-6 sm:right-[16%] sm:text-[9px] sm:leading-[9px]"
        >
          {LOGO_ASCII}
        </pre>
        <pre
          aria-hidden="true"
          className="t-float-x-b pointer-events-none absolute top-24 left-[4%] select-none font-mono text-[6px] leading-[6px] text-(--color-accent)/20 sm:top-32 sm:left-[14%] sm:text-[9px] sm:leading-[9px]"
        >
          {SPARKLE_ASCII}
        </pre>
        <div className={`t-stagger hero-stagger relative mx-auto max-w-3xl text-center ${ready ? "is-shown" : ""}`}>

          <h1 className="t-stagger-line t-stagger-line--1 mx-auto max-w-[16ch] text-[2.15rem] leading-[1.04] font-black tracking-tight sm:text-6xl">
            No te falta buen ojo. Te falta{" "}
            <span className="font-serif text-(--color-accent) italic font-medium">tiempo</span> para testearlo todo.
          </h1>

          <p className="t-stagger-line t-stagger-line--2 mx-auto mt-5 max-w-md text-(--color-muted) sm:text-lg">
            Testea diez productos en lo que antes te tomaba armar uno.
          </p>

          <div className="t-stagger-line t-stagger-line--3 mt-8 flex flex-wrap items-center justify-center gap-3">
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
          <p className="t-stagger-line t-stagger-line--4 mt-3 text-xs text-(--color-muted-2)">Sin suscripción · sin letra chica · sin compromiso mensual</p>

          {/* ---- floating console + chips ---- */}
          <div className="t-stagger-line t-stagger-line--5 relative mx-auto mt-12 max-w-[600px]">
            <div className="pointer-events-none absolute -top-6 -left-10 hidden rotate-[-6deg] items-center gap-2 rounded-full border border-(--color-border) bg-(--color-panel-2) px-3.5 py-2 text-xs font-semibold text-(--color-muted) shadow-lg lg:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-accent-2)" />
              Página de producto
            </div>
            <div className="pointer-events-none absolute top-6 -right-11 hidden rotate-[5deg] items-center gap-2 rounded-full border border-(--color-border) bg-(--color-panel-2) px-3.5 py-2 text-xs font-semibold text-(--color-muted) shadow-lg lg:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-green)" />
              Imágenes IA
            </div>
            <div className="pointer-events-none absolute -bottom-5 left-7 hidden rotate-[-3deg] items-center gap-2 rounded-full border border-(--color-border) bg-(--color-panel-2) px-3.5 py-2 text-xs font-semibold text-(--color-muted) shadow-lg lg:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-amber)" />
              Landing por secciones
            </div>

            <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-[#0d1016] text-left shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)]">
              <div className="flex items-center gap-1.5 border-b border-(--color-border) bg-(--color-panel) px-4 py-2.5">
                <span className="h-2 w-2 rounded-full bg-(--color-border)" />
                <span className="h-2 w-2 rounded-full bg-(--color-border)" />
                <span className="h-2 w-2 rounded-full bg-(--color-border)" />
                <span className="ml-2 font-mono text-xs text-(--color-muted-2)">rulay — generar página</span>
              </div>
              <div className="space-y-2 px-5 py-4 font-mono text-[13px] leading-relaxed">
                {CONSOLE_LINES.map((line, i) => (
                  <div
                    key={i}
                    className="animate-[fadein_.4s_ease_forwards] opacity-0"
                    style={{ animationDelay: `${0.1 + i * 0.4}s` }}
                  >
                    <span className={line.color}>{line.prefix}</span>{" "}
                    <span className="text-(--color-muted)">{line.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---- source marquee ---- */}
          <div className="t-stagger-line t-stagger-line--6 mt-14 pt-7">
            <p className="mb-4 text-center font-mono text-[11px] tracking-wide text-(--color-muted-2)">
              GENERA PÁGINAS DESDE
            </p>
            <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
              <div className="flex w-max animate-[scrollx_22s_linear_infinite] gap-10">
                {[...SOURCES, ...SOURCES].map((s, i) => (
                  <span key={i} className="text-sm font-bold whitespace-nowrap text-(--color-muted-2)">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>

      {/* ---------- Footer ----------
          Fondo exterior: degradado blanco -> negro, muy suave, ocupa toda la
          sección. La caja negra con borde flota encima, como pieza física. */}
      <footer
        className="relative px-6 pt-24 pb-16 sm:px-10 sm:pt-32 sm:pb-24"
        style={{
          background:
            "linear-gradient(to bottom, #FFFFFF 0%, #F7F8F8 15%, #E6E8E9 28%, #C7CBCE 40%, #8D9297 53%, #4A4E53 68%, #181A1D 84%, #0A0B0D 100%)",
        }}
      >
        <div
          className="relative mx-auto overflow-hidden border-[6px] border-[#F3F4F4]"
          style={{ width: "min(1200px, calc(100% - 60px))", borderRadius: "10px", background: "#0A0B0D" }}
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
          <div className="relative h-[clamp(150px,19vw,300px)] overflow-hidden">
            <span
              className="pointer-events-none absolute left-1/2 text-[42vw] leading-none font-bold whitespace-nowrap text-white/[0.06] select-none sm:text-[clamp(220px,31vw,480px)]"
              style={{
                bottom: "-0.1em",
                transform: "translateX(-50%) scaleX(1.15)",
                letterSpacing: "-0.03em",
              }}
            >
              RULAY
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
