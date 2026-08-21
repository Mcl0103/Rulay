import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Logo } from "../components/Logo"

const SOURCES = ["AliExpress", "Amazon", "Shopify", "Dropi", "Aliclik", "TikTok Shop"]

const CONSOLE_LINES = [
  { color: "text-(--color-muted-2)", prefix: "$", text: "pegaste el link de tu producto" },
  { color: "text-(--color-accent-2)", prefix: "→", text: "buscando tu ángulo de venta…" },
  { color: "text-(--color-green)", prefix: "✓", text: "ángulo encontrado: \"duerme mejor en 20 min\"" },
  { color: "text-(--color-accent-2)", prefix: "→", text: "generando imágenes de producto…" },
  { color: "text-(--color-green)", prefix: "✓", text: "página lista para publicar" },
  { color: "text-(--color-amber)", prefix: "↗", text: "publicando a tu tienda Shopify…" },
]

const TABS = [
  {
    id: "pagina",
    eyebrow: "Función 1 · Desde un link",
    label: "Página de producto",
    field: "🔗 pega el link de tu producto (AliExpress, Dropi, Shopify…)",
    pills: [
      { label: "3 imágenes IA", on: true },
      { label: "5 imágenes IA", on: false },
    ],
    outcome: "✓ Lista en minutos, no en días",
    title: "Página de producto",
    body: "Pegas el link, la IA investiga el producto y te arma una página completa lista para tu tienda.",
    bullets: [
      "Funciona con AliExpress, Amazon, Shopify, Dropi, Aliclik y TikTok Shop",
      "Incluye precio, variantes y botón de compra real",
      "Publicas directo a tu tienda Shopify conectada",
    ],
  },
  {
    id: "imagenes",
    eyebrow: "Función 2 · Desde una descripción",
    label: "Imágenes IA",
    field: "✎ describe la imagen que quieres generar",
    pills: [
      { label: "Foto de producto", on: true },
      { label: "Con modelo", on: true },
    ],
    outcome: "✓ Un solo precio, sin categorías raras",
    title: "Imágenes IA",
    body: "Fotos de producto, con modelo, o piezas para anuncio — sin \"esto cuesta más\" escondido en letra chica.",
    bullets: [
      "Mismo costo sin importar el tipo de imagen",
      "Sirven tanto para tu página como para tus anuncios",
      "Marca de agua propia opcional antes de publicar",
    ],
  },
  {
    id: "landing",
    eyebrow: "Función 3 · Desde unas fotos",
    label: "Landing por secciones",
    field: "📸 sube 1–3 fotos del producto",
    pills: [
      { label: "Hero", on: true },
      { label: "Oferta", on: true },
      { label: "Testimonios", on: false },
    ],
    outcome: "✓ Todas las secciones combinan entre sí",
    title: "Landing por secciones",
    body: "Solo con fotos, sin link de producto. Cada sección sale con el mismo color y estilo que las demás — no calzan a medias como cuando las armás vos mismo a mano.",
    bullets: [
      "Formato vertical siempre — así entra el tráfico de anuncios",
      "La sección de Oferta funciona de verdad, no es una imagen estática",
      "Página completa con descuento sobre generarlas sueltas",
    ],
  },
]

const PRICING = [
  {
    name: "Starter",
    price: "$10",
    outcome: "Para probar 1 o 2 productos",
    features: ["Todas las funciones incluidas", "Sin vencimiento por 3 meses", "Sirve para página, imágenes o landing"],
    popular: false,
  },
  {
    name: "Growth",
    price: "$27",
    outcome: "Para cuando ya estás lanzando seguido",
    features: ["Todas las funciones incluidas", "Sin vencimiento por 3 meses", "Precio por crédito más bajo que Starter"],
    popular: true,
  },
  {
    name: "Pro",
    price: "$60",
    outcome: "Para probar productos a volumen",
    features: ["Todas las funciones incluidas", "Sin vencimiento por 3 meses", "El precio por crédito más bajo de los tres"],
    popular: false,
  },
]

const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
const FIXED_PLAN = 39

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

function GlowBlob({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute h-[640px] w-[900px] -translate-x-1/2 opacity-70 ${className}`}
      style={{
        background:
          "radial-gradient(closest-side, rgba(59,130,246,0.28), rgba(59,130,246,0.08) 55%, transparent 75%)",
        filter: "blur(10px)",
      }}
    />
  )
}

export function Landing() {
  const [activeMonths, setActiveMonths] = useState<Set<number>>(new Set([2, 5, 8]))

  const idleMonths = 12 - activeMonths.size
  const burned = idleMonths * FIXED_PLAN

  function toggleMonth(i: number) {
    setActiveMonths((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-(--color-base) text-(--color-text)">
      {/* ---------- Nav ---------- */}
      <header className="sticky top-3.5 z-50 px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-(--color-border) bg-(--color-panel)/75 px-4 py-2.5 backdrop-blur-xl shadow-[0_12px_30px_-14px_rgba(0,0,0,0.6)]">
          <Link to="/" className="flex shrink-0 items-center gap-2 text-[15px] font-extrabold tracking-tight">
            <Logo className="h-6.5 w-6.5" />
            <span>Rulay.AI</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-(--color-muted) md:flex">
            <a href="#producto" className="transition hover:text-(--color-text)">Producto</a>
            <a href="#diferencia" className="transition hover:text-(--color-text)">Por qué Rulay</a>
            <a href="#plata" className="transition hover:text-(--color-text)">Sin cuentas raras</a>
            <a href="#precios" className="transition hover:text-(--color-text)">Precios</a>
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
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden px-6 pt-20 pb-12">
        <GlowBlob className="left-1/2 -top-24" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-(--color-accent)/30 bg-(--color-accent)/10 px-3.5 py-1.5 text-xs text-(--color-accent-2)">
            <span className="rounded-full bg-(--color-accent) px-2 py-0.5 text-[11px] font-bold text-white">Nuevo</span>
            Landing por secciones ya disponible
          </span>

          <h1 className="mx-auto max-w-[16ch] text-[2.15rem] leading-[1.04] font-extrabold tracking-tight sm:text-6xl">
            Tu página se ve igual a la de medio nicho. Por eso dejó de vender.
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base text-(--color-muted) sm:text-lg">
            El algoritmo ya vio ese layout — con otro nombre, ayer. Rulay te arma una página de producto real, con
            precio, variantes y botón de compra, no una landing bonita que tu cliente ya conoce de memoria.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
          <p className="mt-3 text-xs text-(--color-muted-2)">Sin suscripción · sin letra chica · sin compromiso mensual</p>

          {/* ---- floating console + chips ---- */}
          <div className="relative mx-auto mt-12 max-w-[600px]">
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
          <div className="mt-14 border-t border-(--color-border) pt-7">
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

      {/* ---------- Landings genéricas vs. página de producto ---------- */}
      <section id="producto" className="border-t border-(--color-border) px-6 py-18">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-10 max-w-2xl">
            <span className="mb-3 block font-mono text-xs tracking-widest text-(--color-accent-2) uppercase">
              El algoritmo se aburre de tu anuncio
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Mientras tu landing genérica se quema, la página de producto real sigue vendiendo.
            </h2>
            <p className="mt-3 text-(--color-muted)">
              Meta y TikTok detectan patrones repetidos: mismo layout, mismo golpe visual, mismo texto en el mismo
              lugar. Cuando medio nicho usa la misma IA para armar su landing, el algoritmo lo nota antes que el
              cliente — y tu CTR cae aunque el producto sea bueno. La página de producto no depende de sorprender a
              nadie: depende de que el cliente pueda comprar apenas llega. Por eso sigue vendiendo cuando la landing
              bonita ya se quemó.
            </p>
          </Reveal>

          <Reveal className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-2 row-span-2 flex aspect-[9/13] items-end justify-center rounded-lg border border-(--color-accent)/50 bg-gradient-to-br from-(--color-accent)/20 to-(--color-panel-2) p-2.5">
                  <span className="rounded-full bg-black/50 px-2.5 py-1 font-mono text-[10px] tracking-wide text-(--color-accent-2)">
                    TU PÁGINA
                  </span>
                </div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[9/13] rounded-lg border border-(--color-border) bg-gradient-to-br from-(--color-panel-2) to-(--color-panel) opacity-55"
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-xl font-extrabold tracking-tight">
                Rulay no arma una landing más. Arma tu página de producto.
              </h3>
              <p className="text-(--color-muted)">
                Con precio real, selector de variantes, botón de compra funcionando y las secciones que necesitás
                para convencer — no una imagen bonita esperando que el cliente adivine cómo pagar. Lo que hace únicas
                a tus secciones no es el diseño: es que nadie más las tiene (más abajo te muestro por qué).
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Las 3 funciones, cada una por separado ---------- */}
      <section id="producto-funciones" className="border-t border-(--color-border) px-6 py-18">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-14 max-w-xl">
            <span className="mb-3 block font-mono text-xs tracking-widest text-(--color-accent-2) uppercase">
              Tres formas de generar
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              De un link o una foto a una página publicable
            </h2>
            <p className="mt-3 text-(--color-muted)">
              No son variantes de lo mismo — son tres herramientas distintas, cada una con su propio trabajo.
            </p>
          </Reveal>

          <div className="flex flex-col gap-14">
            {TABS.map((t, i) => (
              <Reveal
                key={t.id}
                id={t.id}
                className={`grid grid-cols-1 items-center gap-8 rounded-2xl border border-(--color-border) bg-(--color-panel) p-7 lg:grid-cols-[1.1fr_1fr] ${
                  i % 2 === 1 ? "lg:grid-cols-[1fr_1.1fr]" : ""
                }`}
              >
                <div className={`rounded-xl border border-(--color-border) bg-(--color-base) p-4.5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="mb-3.5 flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-(--color-border)" />
                    <span className="h-2 w-2 rounded-full bg-(--color-border)" />
                    <span className="h-2 w-2 rounded-full bg-(--color-border)" />
                  </div>
                  <div className="mb-2.5 rounded-lg border border-(--color-border) bg-(--color-panel-2) px-4 py-3.5 text-sm text-(--color-muted-2)">
                    {t.field}
                  </div>
                  <div className="mb-2.5 flex gap-2">
                    {t.pills.map((p, j) => (
                      <div
                        key={j}
                        className={`flex-1 rounded-lg border px-2 py-2 text-center text-xs ${
                          p.on
                            ? "border-(--color-accent)/40 bg-(--color-accent)/10 text-(--color-accent-2)"
                            : "border-(--color-border) bg-(--color-panel-2) text-(--color-muted-2)"
                        }`}
                      >
                        {p.label}
                      </div>
                    ))}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-(--color-green)/35 bg-(--color-green)/10 px-3 py-1.5 text-xs text-(--color-green)">
                    {t.outcome}
                  </div>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <span className="mb-2 block font-mono text-[11px] tracking-widest text-(--color-muted-2) uppercase">
                    {t.eyebrow}
                  </span>
                  <h3 className="mb-2.5 text-xl font-extrabold tracking-tight">{t.title}</h3>
                  <p className="text-(--color-muted)">{t.body}</p>
                  <ul className="mt-4 space-y-2.5">
                    {t.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2.5 text-sm text-(--color-muted)">
                        <span className="text-(--color-accent-2)">—</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Diferenciador: galería privada ---------- */}
      <section id="diferencia" className="border-t border-(--color-border) px-6 py-18">
        <Reveal className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="mb-3 block font-mono text-xs tracking-widest text-(--color-accent-2) uppercase">
              Lo que nadie más hace acá
            </span>
            <h2 className="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl">Tu galería es tuya. Punto.</h2>
            <p className="text-(--color-muted)">
              Las herramientas de página con IA más usadas tienen una galería pública — lo que genera cualquiera
              queda visible para todos como "inspiración". El resultado: todo el nicho copia los mismos diseños
              ganadores y termina anunciando con la misma cara. En Rulay, lo que generás solo lo ves vos.
            </p>
          </div>
          <div className="rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="-ml-2 h-6 w-6 rounded-full border-2 border-(--color-panel) bg-gradient-to-br from-(--color-panel-2) to-(--color-panel) first:ml-0"
                  />
                ))}
              </div>
              <span className="text-sm text-(--color-muted-2)">Galería pública típica</span>
              <span className="ml-auto text-(--color-muted-2)">👁</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[9/12] rounded-lg border border-(--color-border) bg-gradient-to-br from-(--color-panel-2) to-(--color-panel)"
                />
              ))}
            </div>
            <div className="mt-5 mb-3 flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-(--color-panel-2) to-(--color-panel)" />
              <span className="text-sm text-(--color-accent-2)">Tu galería en Rulay</span>
              <span className="ml-auto text-(--color-muted-2)">🔒</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="relative flex aspect-[9/12] items-center justify-center rounded-lg border border-(--color-border) bg-gradient-to-br from-(--color-panel-2) to-(--color-panel) text-sm opacity-45"
                >
                  🔒
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- Meses quemados ---------- */}
      <section id="plata" className="border-t border-(--color-border) px-6 py-18">
        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-8 text-center">
            <span className="mb-3 block font-mono text-xs tracking-widest text-(--color-accent-2) uppercase">
              Sin hacer cuentas de créditos
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              ¿Cuánto pagaste este año por meses en los que no lanzaste nada?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-(--color-muted)">
              Marca los meses en que sí generaste algo. El resto ya sabes lo que es: plata que se fue igual.
            </p>
          </Reveal>

          <Reveal className="rounded-3xl border border-(--color-border) bg-(--color-panel) p-6 sm:p-8">
            <div className="mb-6 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  onClick={() => toggleMonth(i)}
                  className={`rounded-lg border px-1 py-3 text-xs font-bold tracking-wide transition ${
                    activeMonths.has(i)
                      ? "border-(--color-accent)/50 bg-(--color-accent)/10 text-(--color-accent-2)"
                      : "border-(--color-border) bg-(--color-panel-2) text-(--color-muted-2)"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-(--color-amber)/40 bg-(--color-amber)/10 p-5">
                <span className="mb-1.5 block text-sm text-(--color-muted)">
                  Con una suscripción fija ($39/mes)
                </span>
                <span className="font-mono text-3xl font-bold text-(--color-amber) tabular-nums">
                  ${burned.toLocaleString("en-US")}
                </span>
              </div>
              <div className="rounded-2xl border border-(--color-green)/40 bg-(--color-green)/10 p-5">
                <span className="mb-1.5 block text-sm text-(--color-muted)">Con Rulay, esos mismos meses</span>
                <span className="font-mono text-3xl font-bold text-(--color-green) tabular-nums">$0</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-(--color-muted-2)">
              $39/mes es el plan de entrada más barato entre las herramientas de página con IA por suscripción. Con
              Rulay, un mes sin generar nada es un mes sin gastar nada.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      <section id="precios" className="border-t border-(--color-border) px-6 py-18">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-10 text-center">
            <span className="mb-3 block font-mono text-xs tracking-widest text-(--color-accent-2) uppercase">
              Sin letra chica
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Comprás créditos. Ya está.</h2>
            <p className="mx-auto mt-3 max-w-md text-(--color-muted)">
              Nada se renueva solo. Comprás un paquete y lo usás cuando querés.
            </p>
          </Reveal>

          <Reveal className="mx-auto grid max-w-sm grid-cols-1 gap-4 sm:max-w-none sm:grid-cols-3">
            {PRICING.map((p) => (
              <div
                key={p.name}
                className={`relative rounded-2xl border p-7 transition hover:-translate-y-1 ${
                  p.popular
                    ? "border-(--color-accent)/50 bg-(--color-panel-2)"
                    : "border-(--color-border) bg-(--color-panel) hover:border-(--color-accent)/35"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-(--color-accent) px-2.5 py-1 font-mono text-[10px] tracking-wide whitespace-nowrap text-white">
                    MÁS USADO
                  </span>
                )}
                <h4 className="text-base font-bold">{p.name}</h4>
                <div className="mt-2 mb-0.5 font-mono text-3xl font-bold">
                  {p.price}
                  <sup className="ml-1 text-sm font-normal text-(--color-muted-2)">USD</sup>
                </div>
                <p className="mb-5 text-sm font-semibold text-(--color-accent-2)">{p.outcome}</p>
                <ul className="mb-6 space-y-2">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex gap-2 text-sm text-(--color-muted)">
                      <span className="text-(--color-green)">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition ${
                    p.popular
                      ? "bg-gradient-to-b from-(--color-accent-2) to-(--color-accent) text-white hover:brightness-110"
                      : "border border-(--color-border) hover:border-(--color-accent)/40"
                  }`}
                >
                  Comprar {p.name}
                </Link>
              </div>
            ))}
          </Reveal>
          <p className="mt-6 text-center text-xs text-(--color-muted-2)">
            Los créditos vencen 3 meses después de la compra. Ningún plan se renueva solo — comprás de nuevo cuando
            quieras.
          </p>
        </div>
      </section>

      {/* ---------- Por qué existe Rulay ---------- */}
      <section className="border-t border-(--color-border) px-6 py-18">
        <Reveal className="mx-auto flex max-w-4xl flex-col items-start gap-5 rounded-2xl border border-(--color-border) bg-(--color-panel) p-7 sm:flex-row sm:p-8">
          <div className="h-12 w-12 shrink-0 rounded-[14px] border border-white/10 bg-gradient-to-br from-(--color-panel-2) to-(--color-base)" />
          <div>
            <h3 className="mb-2.5 text-lg font-extrabold tracking-tight">Por qué existe Rulay</h3>
            <p className="text-[15px] leading-relaxed text-(--color-muted)">
              No es un feature más adentro del roadmap de una empresa de 40 personas. Es lo único que este producto
              hace, y lo hace resolviendo un solo problema real: te cobran la misma cuota generes una página o
              generes cien, y encima lo que armás termina viéndose igual a lo de tu competencia — porque salió de la
              misma galería pública que usa todo el nicho. Rulay ataca las dos cosas de raíz: pagás por lo que
              generás, y lo que generás no lo ve nadie más.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-(--color-muted)">
              Cuando algo no te cuadra, no hay una fila de soporte entre el problema y la solución — hablás directo
              con quien lo construyó.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="relative overflow-hidden border-t border-(--color-border) bg-[#0a0c10]">
        <div
          className="pointer-events-none absolute bottom-[-140px] left-1/2 h-[320px] w-[550px] max-w-full -translate-x-1/2 rounded-full opacity-[0.16] blur-[55px]"
          style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.9), transparent 70%)" }}
        />
        {/* newsletter */}
        <Reveal className="mx-auto max-w-xl px-6 pt-20 pb-14 text-center">
          <h2 className="font-serif text-[1.9rem] leading-[1.15] text-white sm:text-4xl">
            Entérate primero de las
            <br />
            <em className="italic">novedades de Rulay.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm text-(--color-muted)">
            Te avisamos cuando sale una función nueva, cambia algo del pricing, o hay algo que sí vale la pena saber
            — sin spam de relleno.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="Tu correo"
              className="w-full rounded-full border border-(--color-border) bg-(--color-panel) px-4.5 py-2.5 text-sm text-(--color-text) placeholder:text-(--color-muted-2) focus:border-(--color-accent)/50 focus:outline-none sm:w-64"
            />
            <button
              type="submit"
              className="w-full shrink-0 rounded-full bg-gradient-to-b from-(--color-accent-2) to-(--color-accent) px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 sm:w-auto"
            >
              Suscribirme
            </button>
          </form>
        </Reveal>

        {/* logo + link columns */}
        <Reveal className="mx-auto flex max-w-4xl flex-wrap justify-between gap-10 border-t border-(--color-border) px-6 py-11">
          <div>
            <Link to="/" className="flex items-center gap-2 text-[15px] font-extrabold tracking-tight">
              <Logo className="h-6 w-6" />
              <span>Rulay.AI</span>
            </Link>
            <p className="mt-2 max-w-[24ch] text-sm text-(--color-muted)">
              Páginas de producto con IA. Pagás por lo que generás, no por mes.
            </p>
          </div>
          <div className="flex flex-wrap gap-12">
            <div>
              <h5 className="mb-3 text-sm font-semibold text-white">Producto</h5>
              <a href="#precios" className="mb-2 block text-sm text-(--color-muted) transition hover:text-(--color-text)">
                Precios
              </a>
              <a href="#producto" className="mb-2 block text-sm text-(--color-muted) transition hover:text-(--color-text)">
                Cómo funciona
              </a>
              <a href="#diferencia" className="block text-sm text-(--color-muted) transition hover:text-(--color-text)">
                Por qué Rulay
              </a>
            </div>
            <div>
              <h5 className="mb-3 text-sm font-semibold text-white">Cuenta</h5>
              <Link to="/login" className="mb-2 block text-sm text-(--color-muted) transition hover:text-(--color-text)">
                Iniciar sesión
              </Link>
              <Link to="/login" className="block text-sm text-(--color-muted) transition hover:text-(--color-text)">
                Crear cuenta
              </Link>
            </div>
            <div>
              <h5 className="mb-3 text-sm font-semibold text-white">Legal</h5>
              <a href="#" className="mb-2 block text-sm text-(--color-muted) transition hover:text-(--color-text)">
                Privacidad
              </a>
              <a href="#" className="block text-sm text-(--color-muted) transition hover:text-(--color-text)">
                Términos
              </a>
            </div>
          </div>
        </Reveal>

        {/* ghost wordmark — shows the tops of the letters, cropped at the container's bottom edge */}
        <div className="relative h-[clamp(160px,20vw,340px)] overflow-hidden">
          <span
            className="pointer-events-none absolute left-1/2 w-full -translate-x-1/2 text-center text-[34vw] leading-none font-extrabold tracking-tighter whitespace-nowrap text-white/[0.06] select-none"
            style={{ top: "-0.04em" }}
          >
            RULAY
          </span>
        </div>
      </footer>
    </div>
  )
}
