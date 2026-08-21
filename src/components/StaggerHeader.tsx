import { useEffect, useState } from "react"

export function StaggerHeader({
  title,
  subtitle,
  className = "",
}: {
  title: string
  subtitle?: string
  className?: string
}) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className={`t-stagger ${shown ? "is-shown" : ""} ${className}`}>
      <h1 className="t-stagger-line t-stagger-line--1 text-2xl font-medium text-(--color-text)">
        {title}
      </h1>
      {subtitle && (
        <p className="t-stagger-line t-stagger-line--2 mt-1 text-sm text-(--color-muted)">
          {subtitle}
        </p>
      )}
    </div>
  )
}
