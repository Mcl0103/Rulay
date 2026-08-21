import { Logo } from "./Logo"

/** Loader de pantalla completa reutilizable — entrada del sitio, transición
 * de login, o cualquier cambio de pantalla que necesite un momento de carga.
 * Se adapta al tema ambiente (usa --color-base/--color-accent), solo hay que
 * pasarle el variant correcto del logo (negro sobre fondo claro, blanco sobre oscuro). */
export function Loader({
  show,
  variant = "light",
  fullscreen = true,
}: {
  show: boolean
  variant?: "light" | "dark"
  fullscreen?: boolean
}) {
  return (
    <div
      aria-hidden={!show}
      className={`${fullscreen ? "fixed inset-0 z-[100]" : "absolute inset-0"} flex items-center justify-center bg-(--color-base) transition-opacity duration-500 ease-out ${
        show ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="t-loader-ring-pro absolute inset-0 rounded-full" />
        <span className="absolute inset-[3px] rounded-full bg-(--color-base)" />
        <Logo className="relative h-6 w-6 animate-pulse" variant={variant} />
      </div>
    </div>
  )
}
