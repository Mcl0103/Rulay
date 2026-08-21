import logoMark from "../assets/rulay-logo-mark.webp"
import logoMarkBlack from "../assets/rulay-logo-mark-black.webp"

export function Logo({
  className = "",
  variant = "light",
}: {
  className?: string
  variant?: "light" | "dark"
}) {
  return (
    <img
      src={variant === "dark" ? logoMarkBlack : logoMark}
      alt="Rulay"
      className={`h-7 w-7 object-contain ${className}`}
    />
  )
}
