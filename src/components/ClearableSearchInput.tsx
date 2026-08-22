import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

/**
 * Transitions.dev "Input clear with dissolve" (see index.css) wired up for
 * a controlled text input: clearing flies each word up + fades it while a
 * per-word glow streak rides underneath, written to .t-clear-glow every
 * frame since the rise/peak/fall envelope can't be a static @keyframe.
 */
export function ClearableSearchInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  className?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [clearing, setClearing] = useState(false)
  const [displayValue, setDisplayValue] = useState(value)
  const rafRef = useRef(0)

  useEffect(() => {
    if (!clearing) setDisplayValue(value)
  }, [value, clearing])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const words = displayValue.split(/(\s+)/).filter(Boolean)

  function readVar(name: string, fallback: number) {
    const el = wrapRef.current
    if (!el) return fallback
    const n = parseFloat(getComputedStyle(el).getPropertyValue(name))
    return Number.isNaN(n) ? fallback : n
  }

  function handleClear() {
    if (!value || clearing) return
    setClearing(true)

    const outDur = readVar("--clear-out-dur", 400)
    const outFly = readVar("--clear-out-fly", 12)
    const glowDelay = readVar("--glow-delay", 50)
    const peakAt = readVar("--glow-peak-at", 0.15)
    const glowOpacity = readVar("--glow-opacity", 0.85)
    const glowSpread = readVar("--glow-spread", 1.5)
    const blurMax = readVar("--clear-blur", 2)

    const wrap = wrapRef.current
    const glow = glowRef.current
    const wrapWidth = wrap?.getBoundingClientRect().width || 1
    const wrapLeft = wrap?.getBoundingClientRect().left || 0
    const wordBoxes = wordRefs.current.map((el) => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { left: r.left - wrapLeft, width: r.width }
    })

    const start = performance.now()

    function frame(now: number) {
      const elapsed = now - start
      const t = Math.min(elapsed / outDur, 1)
      const gradients: string[] = []

      wordRefs.current.forEach((el, i) => {
        const box = wordBoxes[i]
        const localStart = i * glowDelay
        const localDur = Math.max(outDur - localStart, 1)
        const localT = Math.min(Math.max((elapsed - localStart) / localDur, 0), 1)
        const eased = 1 - Math.pow(1 - localT, 3)

        if (el) {
          el.style.transform = `translateY(${-outFly * eased}px)`
          el.style.opacity = String(1 - eased)
          el.style.filter = `blur(${blurMax * eased}px)`
        }

        if (box) {
          const alpha =
            localT <= 0 || localT >= 1
              ? 0
              : localT <= peakAt
                ? (localT / peakAt) * glowOpacity
                : glowOpacity * (1 - (localT - peakAt) / (1 - peakAt))
          const cx = ((box.left + box.width / 2) / wrapWidth) * 100
          gradients.push(
            `radial-gradient(circle at ${cx.toFixed(1)}% 50%, rgba(96,165,250,${alpha.toFixed(3)}) 0%, transparent ${(60 * glowSpread).toFixed(0)}%)`,
          )
        }
      })

      if (glow) {
        glow.style.background = gradients.join(", ")
        glow.style.opacity = t < 1 ? "1" : "0"
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame)
      } else {
        onChange("")
        setDisplayValue("")
        setClearing(false)
        if (glow) {
          glow.style.background = "none"
          glow.style.opacity = "0"
        }
      }
    }

    rafRef.current = requestAnimationFrame(frame)
  }

  return (
    <div
      ref={wrapRef}
      className={`t-clear ${value ? "has-value" : ""} ${clearing ? "is-clearing" : ""} ${className}`}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="relative z-[1] w-full bg-transparent px-2.5 py-1.5 text-xs text-(--color-text) focus:outline-none"
      />
      <div className="t-clear-mirror px-2.5 text-xs text-(--color-text)">
        {words.map((w, i) => (
          <span
            key={i}
            ref={(el) => {
              wordRefs.current[i] = el
            }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {w}
          </span>
        ))}
      </div>
      <div className="t-clear-placeholder px-2.5 text-xs text-(--color-muted-2)">{placeholder}</div>
      <div ref={glowRef} className="t-clear-glow" />
      {value && !clearing && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear"
          className="absolute top-1/2 right-1.5 z-[2] flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full text-(--color-muted-2) transition hover:text-(--color-text)"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
