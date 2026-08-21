import { useState } from "react"
import { Mail } from "lucide-react"
import { Logo } from "../components/Logo"
import { useAuth } from "../lib/auth"

const copyByMode = {
  login: {
    title: "Bienvenido de nuevo",
    subtitle: "Ingresa a tu cuenta para seguir generando páginas.",
    switchText: "¿No tienes cuenta?",
    switchAction: "Crear cuenta",
  },
  signup: {
    title: "Crea tu cuenta",
    subtitle: "Genera tu primera página de producto con IA en minutos.",
    switchText: "¿Ya tienes cuenta?",
    switchAction: "Iniciar sesión",
  },
} as const

export function Login() {
  const { signInWithGoogle, signInWithMagicLink } = useAuth()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const copy = copyByMode[mode]

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError(null)
    const { error } = await signInWithMagicLink(email)
    setSending(false)
    if (error) {
      setError(error)
      return
    }
    setSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--color-base) px-6">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-panel)">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-56"
          style={{
            background:
              "radial-gradient(ellipse 70% 65% at 50% 0%, rgba(59,130,246,0.55) 0%, rgba(59,130,246,0.12) 45%, transparent 75%)",
          }}
        />

        <div className="relative flex flex-col items-center px-6 pt-9 pb-7">
          <Logo className="h-10 w-10" />
          <h1 className="mt-4 font-serif text-2xl text-white">{copy.title}</h1>
          <p className="mt-1 text-center text-sm text-(--color-muted)">
            {copy.subtitle}
          </p>

          <button
            onClick={signInWithGoogle}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            <GoogleIcon />
            Continuar con Google
          </button>

          <div className="my-5 flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-(--color-border)" />
            <span className="text-xs text-(--color-muted-2)">o con tu correo</span>
            <div className="h-px flex-1 bg-(--color-border)" />
          </div>

          {sent ? (
            <div className="w-full rounded-xl border border-(--color-border) bg-(--color-panel-2) px-4 py-3 text-center">
              <p className="text-sm text-white">Revisa tu correo</p>
              <p className="mt-1 text-xs text-(--color-muted-2)">
                Te enviamos un link mágico a {email}
              </p>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="flex w-full flex-col gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-panel-2) px-4 py-2.5 transition focus-within:border-(--color-border-hover)">
                <Mail className="h-4 w-4 shrink-0 text-(--color-muted-2)" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-transparent text-[15px] text-white placeholder:text-(--color-muted-2) focus:outline-none"
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={sending || !email}
                className="rounded-xl bg-(--color-accent) px-4 py-2.5 text-sm font-medium text-white transition hover:bg-(--color-accent)/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? "Enviando…" : "Iniciar con correo"}
              </button>
            </form>
          )}

          <p className="mt-5 text-xs text-(--color-muted-2)">
            {copy.switchText}{" "}
            <button
              type="button"
              onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
              className="text-(--color-accent-2) hover:underline"
            >
              {copy.switchAction}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.26A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.26 5.39l4.01-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.26 6.61l4.01 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  )
}
