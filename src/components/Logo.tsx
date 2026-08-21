export function Logo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-slate-300 via-slate-400 to-blue-500 text-sm font-semibold text-white ${className}`}
    >
      R
    </div>
  )
}
