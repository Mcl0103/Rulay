import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  ChevronDown,
  Plus,
  Sparkles,
  Upload,
  UserRound,
  X,
} from "lucide-react"
import { Sidebar } from "../components/Sidebar"
import { ClearableSearchInput } from "../components/ClearableSearchInput"
import { useTheme } from "../lib/theme"
import { useLanguage, type TranslationKey } from "../lib/i18n"

type Origin = "foto" | "sintetico"
type Gender = "femenino" | "masculino"

const GENDERS: { id: Gender; labelKey: TranslationKey }[] = [
  { id: "femenino", labelKey: "avatares.genero.femenino" },
  { id: "masculino", labelKey: "avatares.genero.masculino" },
]

// Rango real de tonos de piel humanos — nada de categorías de etnia ni
// colores de fantasía, solo el atributo visual en sí (pedido de Marlon).
const SKIN_TONES: { hex: string; labelKey: TranslationKey }[] = [
  { hex: "#3d2314", labelKey: "avatares.piel.muyOscuro" },
  { hex: "#6b4226", labelKey: "avatares.piel.oscuro" },
  { hex: "#8d5524", labelKey: "avatares.piel.moreno" },
  { hex: "#c68642", labelKey: "avatares.piel.trigueno" },
  { hex: "#e0ac69", labelKey: "avatares.piel.bronceado" },
  { hex: "#f1c27d", labelKey: "avatares.piel.medio" },
  { hex: "#ffdbac", labelKey: "avatares.piel.claro" },
  { hex: "#ffe7d1", labelKey: "avatares.piel.muyClaro" },
]

// Mismo criterio para ojos: colores humanos reales, sin las opciones de
// fantasía (púrpura, blanco/ciego) que traía la referencia.
const EYE_COLORS: { hex: string; labelKey: TranslationKey }[] = [
  { hex: "#2b2b2b", labelKey: "avatares.ojos.negro" },
  { hex: "#6f4e2f", labelKey: "avatares.ojos.marron" },
  { hex: "#3b2415", labelKey: "avatares.ojos.marronOscuro" },
  { hex: "#4a72b0", labelKey: "avatares.ojos.azul" },
  { hex: "#4c7c59", labelKey: "avatares.ojos.verde" },
  { hex: "#b08d3f", labelKey: "avatares.ojos.ambar" },
  { hex: "#8a9aa5", labelKey: "avatares.ojos.gris" },
]

type AgeRange = "adulto" | "maduro" | "mayor"

const AGE_RANGES: { id: AgeRange; labelKey: TranslationKey }[] = [
  { id: "adulto", labelKey: "avatares.edad.adulto" },
  { id: "maduro", labelKey: "avatares.edad.maduro" },
  { id: "mayor", labelKey: "avatares.edad.mayor" },
]

type RenderStyle = "hiperrealista" | "anime" | "cartoon" | "ilustracion2d"

const RENDER_STYLES: { id: RenderStyle; labelKey: TranslationKey }[] = [
  { id: "hiperrealista", labelKey: "avatares.estilo.hiperrealista" },
  { id: "anime", labelKey: "avatares.estilo.anime" },
  { id: "cartoon", labelKey: "avatares.estilo.cartoon" },
  { id: "ilustracion2d", labelKey: "avatares.estilo.ilustracion2d" },
]

// Del tab "Body" de la referencia — el tab "Face" no se incluyó, esos
// atributos quedan cubiertos por color de piel/ojos, edad y detalles.
type BodyType = "delgada" | "esbelta" | "atletica" | "musculosa" | "curvy" | "robusta" | "muyDelgada"

const BODY_TYPES: { id: BodyType; labelKey: TranslationKey }[] = [
  { id: "delgada", labelKey: "avatares.cuerpo.delgada" },
  { id: "esbelta", labelKey: "avatares.cuerpo.esbelta" },
  { id: "atletica", labelKey: "avatares.cuerpo.atletica" },
  { id: "musculosa", labelKey: "avatares.cuerpo.musculosa" },
  { id: "curvy", labelKey: "avatares.cuerpo.curvy" },
  { id: "robusta", labelKey: "avatares.cuerpo.robusta" },
  { id: "muyDelgada", labelKey: "avatares.cuerpo.muyDelgada" },
]

// Cuenta nueva: sin avatares creados todavía.
const GALLERY: { id: string; name: string; gradient: string }[] = []

const AVATAR_COST = 15
const BALANCE = 180

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-(--color-border) py-4 first:pt-0 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-sm font-medium text-(--color-text)"
      >
        {title}
        <ChevronDown className={`h-4 w-4 text-(--color-muted) transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export function CreateAvatar() {
  const { theme } = useTheme()
  const { t } = useLanguage()

  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null)
  const [gallerySearch, setGallerySearch] = useState("")
  const [origin, setOrigin] = useState<Origin>("sintetico")
  const [gender, setGender] = useState<Gender | null>(null)
  const [skinTone, setSkinTone] = useState<string | null>(null)
  const [eyeColor, setEyeColor] = useState<string | null>(null)
  const [ageRange, setAgeRange] = useState<AgeRange | null>(null)
  const [bodyType, setBodyType] = useState<BodyType | null>(null)
  const [renderStyle, setRenderStyle] = useState<RenderStyle>("hiperrealista")
  const [details, setDetails] = useState("")

  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["tipo", "genero", "piel", "ojos"]),
  )

  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const remaining = BALANCE - AVATAR_COST
  const canGenerate = Boolean(details) || origin === "foto" || Boolean(gender)
  const selected = GALLERY.find((g) => g.id === selectedGalleryId) ?? null

  const qualityPills: { key: string; label: string; swatch?: string; onRemove: () => void }[] = [
    { key: "style", label: t(RENDER_STYLES.find((s) => s.id === renderStyle)!.labelKey), onRemove: () => setRenderStyle("hiperrealista") },
    ...(gender ? [{ key: "gender", label: t(GENDERS.find((g) => g.id === gender)!.labelKey), onRemove: () => setGender(null) }] : []),
    ...(ageRange
      ? [{ key: "age", label: t(AGE_RANGES.find((a) => a.id === ageRange)!.labelKey), onRemove: () => setAgeRange(null) }]
      : []),
    ...(bodyType
      ? [{ key: "body", label: t(BODY_TYPES.find((b) => b.id === bodyType)!.labelKey), onRemove: () => setBodyType(null) }]
      : []),
    ...(skinTone
      ? [
          {
            key: "skin",
            label: t(SKIN_TONES.find((s) => s.hex === skinTone)!.labelKey),
            swatch: skinTone,
            onRemove: () => setSkinTone(null),
          },
        ]
      : []),
    ...(eyeColor
      ? [
          {
            key: "eyes",
            label: t(EYE_COLORS.find((c) => c.hex === eyeColor)!.labelKey),
            swatch: eyeColor,
            onRemove: () => setEyeColor(null),
          },
        ]
      : []),
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-(--color-base)">
      <Sidebar />
      <main data-theme={theme} className="flex min-h-0 flex-1 flex-col overflow-hidden bg-(--color-panel)/40">
        <div className="shrink-0 border-b border-(--color-border) px-6 py-4">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-sm text-(--color-muted) transition hover:text-(--color-text)"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("sidebar.dashboard")}
          </Link>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* ---- Galería lateral ---- */}
          <aside
            className="flex min-h-0 w-44 shrink-0 origin-left animate-[fadein_.45s_ease_forwards] flex-col gap-3 overflow-y-auto border-r border-(--color-border) p-4 opacity-0"
          >
            <ClearableSearchInput
              value={gallerySearch}
              onChange={setGallerySearch}
              placeholder={t("avatares.buscarPlaceholder")}
              className="rounded-lg border border-(--color-border) bg-(--color-panel) transition focus-within:border-(--color-border-hover)"
            />

            <button
              onClick={() => setSelectedGalleryId(null)}
              className="group flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border) bg-(--color-panel) text-center transition hover:border-(--color-border-hover)"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-panel-2) text-(--color-muted) transition group-hover:text-(--color-accent-2)">
                <Plus className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-(--color-muted) transition group-hover:text-(--color-text)">
                {t("avatares.crearNuevo")}
              </span>
            </button>

            {GALLERY.length === 0 && (
              <p className="px-1 text-center text-[11px] text-(--color-muted-2)">{t("avatares.galeriaVacia")}</p>
            )}

            {GALLERY.filter((av) => av.name.toLowerCase().includes(gallerySearch.toLowerCase())).map((av) => (
              <button
                key={av.id}
                onClick={() => setSelectedGalleryId(av.id)}
                className={`relative flex aspect-[3/4] items-end overflow-hidden rounded-xl border bg-gradient-to-br p-2.5 transition ${av.gradient} ${
                  selectedGalleryId === av.id
                    ? "border-(--color-accent)"
                    : "border-(--color-border) hover:border-(--color-border-hover)"
                }`}
              >
                <span className="rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
                  {av.name}
                </span>
              </button>
            ))}
          </aside>

          {/* ---- Preview central ---- */}
          <div
            className="flex min-h-0 flex-1 animate-[fadein_.45s_ease_forwards] flex-col items-center justify-center gap-4 overflow-y-auto p-6 opacity-0"
            style={{ animationDelay: "80ms" }}
          >
            {selected ? (
              <div
                className={`flex aspect-[3/4] w-full max-w-xs items-end justify-center rounded-2xl border border-(--color-border) bg-gradient-to-br p-4 ${selected.gradient}`}
              >
                <span className="rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur">
                  {selected.name}
                </span>
              </div>
            ) : (
              <div className="flex aspect-[3/4] w-full max-w-xs flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-(--color-border) bg-(--color-panel) px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-panel-2) text-(--color-muted)">
                  <UserRound className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-(--color-text)">{t("avatares.vacioTitulo")}</p>
                <p className="text-xs text-(--color-muted-2)">{t("avatares.vacioDesc")}</p>
              </div>
            )}

            <div className="w-full max-w-xs">
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={t("avatares.placeholderDetalles")}
                className="w-full resize-none rounded-xl border border-(--color-border) bg-(--color-panel) px-3.5 py-2.5 text-sm text-(--color-text) placeholder:text-(--color-muted-2) focus:border-(--color-border-hover) focus:outline-none"
              />
              {qualityPills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {qualityPills.map((p) => (
                    <button
                      key={p.key}
                      onClick={p.onRemove}
                      className="flex items-center gap-1.5 rounded-full border border-(--color-border) bg-(--color-panel-2) py-1 pr-1.5 pl-2.5 text-xs text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-(--color-text)"
                    >
                      {p.swatch && <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.swatch }} />}
                      {p.label}
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              disabled={!canGenerate}
              className="flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-(--color-primary) px-5 py-2.5 text-sm font-medium text-(--color-on-primary) transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles className="h-4 w-4" />
              {t("avatares.generar")}
              <span className="text-xs opacity-70">· {AVATAR_COST}cr</span>
            </button>
            <p className="text-xs text-(--color-muted-2)">
              {t("avatares.costoLinea", { n: AVATAR_COST })}{" "}
              <span className="text-(--color-muted)">{remaining}</span>
            </p>
          </div>

          {/* ---- Panel builder ---- */}
          <aside
            className="min-h-0 w-80 shrink-0 animate-[fadein_.45s_ease_forwards] overflow-y-auto border-l border-(--color-border) p-5 opacity-0"
            style={{ animationDelay: "140ms" }}
          >
            <Section title={t("avatares.tipoPersonaje")} open={openSections.has("tipo")} onToggle={() => toggleSection("tipo")}>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setOrigin("foto")}
                  className={`rounded-xl border p-3 text-left transition ${
                    origin === "foto"
                      ? "border-(--color-accent) bg-(--color-accent)/10"
                      : "border-(--color-border) hover:border-(--color-border-hover)"
                  }`}
                >
                  <p className="text-sm font-medium text-(--color-text)">{t("avatares.origenFoto")}</p>
                  <p className="mt-0.5 text-xs text-(--color-muted-2)">{t("avatares.origenFotoDesc")}</p>
                </button>
                <button
                  onClick={() => setOrigin("sintetico")}
                  className={`rounded-xl border p-3 text-left transition ${
                    origin === "sintetico"
                      ? "border-(--color-accent) bg-(--color-accent)/10"
                      : "border-(--color-border) hover:border-(--color-border-hover)"
                  }`}
                >
                  <p className="text-sm font-medium text-(--color-text)">{t("avatares.origenSintetico")}</p>
                  <p className="mt-0.5 text-xs text-(--color-muted-2)">{t("avatares.origenSinteticoDesc")}</p>
                </button>

                {origin === "foto" && (
                  <button className="mt-1 flex items-center justify-center gap-2 rounded-xl border border-dashed border-(--color-border) bg-(--color-panel) px-4 py-3 text-sm text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-(--color-text)">
                    <Upload className="h-4 w-4" />
                    {t("avatares.subirFoto")}
                  </button>
                )}
              </div>
            </Section>

            <Section title={t("avatares.genero")} open={openSections.has("genero")} onToggle={() => toggleSection("genero")}>
              <div className="grid grid-cols-2 gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGender(g.id)}
                    className={`rounded-lg border px-2 py-2.5 text-center text-xs transition ${
                      gender === g.id
                        ? "border-(--color-accent) bg-(--color-accent)/10 text-(--color-accent-2)"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-(--color-text)"
                    }`}
                  >
                    {t(g.labelKey)}
                  </button>
                ))}
              </div>
            </Section>

            <Section title={t("avatares.estiloRenderizado")} open={openSections.has("estilo")} onToggle={() => toggleSection("estilo")}>
              <div className="grid grid-cols-2 gap-2">
                {RENDER_STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setRenderStyle(s.id)}
                    className={`rounded-lg border px-2 py-2.5 text-center text-xs transition ${
                      renderStyle === s.id
                        ? "border-(--color-accent) bg-(--color-accent)/10 text-(--color-accent-2)"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-(--color-text)"
                    }`}
                  >
                    {t(s.labelKey)}
                  </button>
                ))}
              </div>
            </Section>

            <Section title={t("avatares.colorPiel")} open={openSections.has("piel")} onToggle={() => toggleSection("piel")}>
              <div className="grid grid-cols-5 gap-2">
                {SKIN_TONES.map((s) => (
                  <button
                    key={s.hex}
                    onClick={() => setSkinTone(s.hex)}
                    title={t(s.labelKey)}
                    style={{ background: s.hex }}
                    className={`aspect-square rounded-lg border-2 transition ${
                      skinTone === s.hex ? "border-(--color-accent)" : "border-(--color-border) hover:border-(--color-border-hover)"
                    }`}
                  />
                ))}
              </div>
            </Section>

            <Section title={t("avatares.colorOjos")} open={openSections.has("ojos")} onToggle={() => toggleSection("ojos")}>
              <div className="grid grid-cols-4 gap-2">
                {EYE_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setEyeColor(c.hex)}
                    title={t(c.labelKey)}
                    style={{ background: c.hex }}
                    className={`aspect-square rounded-full border-2 transition ${
                      eyeColor === c.hex ? "border-(--color-accent)" : "border-(--color-border) hover:border-(--color-border-hover)"
                    }`}
                  />
                ))}
              </div>
            </Section>

            <Section title={t("avatares.edad")} open={openSections.has("edad")} onToggle={() => toggleSection("edad")}>
              <div className="grid grid-cols-3 gap-2">
                {AGE_RANGES.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAgeRange(a.id)}
                    className={`rounded-lg border px-2 py-2.5 text-center text-xs transition ${
                      ageRange === a.id
                        ? "border-(--color-accent) bg-(--color-accent)/10 text-(--color-accent-2)"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-(--color-text)"
                    }`}
                  >
                    {t(a.labelKey)}
                  </button>
                ))}
              </div>
            </Section>

            <Section title={t("avatares.tipoCuerpo")} open={openSections.has("cuerpo")} onToggle={() => toggleSection("cuerpo")}>
              <div className="grid grid-cols-3 gap-2">
                {BODY_TYPES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBodyType(b.id)}
                    className={`rounded-lg border px-2 py-2.5 text-center text-xs transition ${
                      bodyType === b.id
                        ? "border-(--color-accent) bg-(--color-accent)/10 text-(--color-accent-2)"
                        : "border-(--color-border) text-(--color-muted) hover:border-(--color-border-hover) hover:text-(--color-text)"
                    }`}
                  >
                    {t(b.labelKey)}
                  </button>
                ))}
              </div>
            </Section>
          </aside>
        </div>
      </main>
    </div>
  )
}
