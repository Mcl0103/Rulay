import { LayoutGrid } from "lucide-react"

export function TopBar({ label }: { label: string }) {
  return (
    <header className="flex items-center gap-2 px-1 py-1 text-sm text-(--color-muted)">
      <LayoutGrid className="h-4 w-4" strokeWidth={1.75} />
      {label}
    </header>
  )
}
