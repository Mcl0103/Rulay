import logoMark from "../assets/rulay-logo-mark.png"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logoMark}
      alt="Rulay"
      className={`h-7 w-7 object-contain ${className}`}
    />
  )
}
