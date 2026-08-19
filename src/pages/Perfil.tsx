import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Camera, LogOut } from "lucide-react"
import { Sidebar } from "../components/Sidebar"
import { supabase } from "../lib/supabase"
import { useAuth } from "../lib/auth"

export function Perfil() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(
    user?.user_metadata?.full_name || user?.user_metadata?.name || "",
  )
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    (user?.user_metadata?.avatar_url as string | undefined) ?? null,
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    const path = `${user.id}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true })

    if (!uploadError) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path)
      setAvatarUrl(data.publicUrl)
    }
    setUploading(false)
  }

  async function handleSave() {
    setSaving(true)
    await supabase.auth.updateUser({
      data: { full_name: name, avatar_url: avatarUrl },
    })
    await supabase
      .from("profiles")
      .update({ name, avatar_url: avatarUrl })
      .eq("id", user!.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  async function handleSignOut() {
    await signOut()
    navigate("/login")
  }

  return (
    <div className="flex h-screen bg-(--color-base)">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-(--color-panel)/40 p-6">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-sm text-(--color-muted) transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>

        <div className="mx-auto mt-6 max-w-xl">
          <h1 className="text-2xl font-medium text-white">Tu perfil</h1>
          <p className="mt-1 text-sm text-(--color-muted)">
            Administra tu información básica de cuenta.
          </p>

          <div className="mt-8 rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="group relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg font-medium text-white"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (name || user?.email || "?").charAt(0).toUpperCase()
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </button>
              </div>
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="rounded-full border border-(--color-border) px-3 py-1.5 text-xs text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-white"
                >
                  {uploading ? "Subiendo…" : "Cambiar foto"}
                </button>
                <p className="mt-1.5 text-xs text-(--color-muted-2)">
                  PNG o JPG, máx 2MB.
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="mt-6">
              <label className="mb-2 block text-sm text-(--color-muted)">
                Nombre de usuario
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-(--color-border) bg-(--color-panel-2) px-4 py-2.5 text-[15px] text-white focus:border-(--color-border-hover) focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="mt-4">
              <label className="mb-2 block text-sm text-(--color-muted)">
                Correo electrónico
              </label>
              <input
                value={user?.email ?? ""}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-(--color-border) bg-(--color-panel-2)/50 px-4 py-2.5 text-[15px] text-(--color-muted) focus:outline-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-6 rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Guardando…" : saved ? "Guardado ✓" : "Guardar cambios"}
            </button>
          </div>

          {/* Sign out */}
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-(--color-border) bg-(--color-panel) p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-panel-2) text-(--color-muted)">
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Cerrar sesión</p>
                <p className="text-xs text-(--color-muted-2)">
                  Sales de tu cuenta en este dispositivo.
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="shrink-0 rounded-full border border-(--color-border) px-4 py-1.5 text-xs font-medium text-(--color-muted) transition hover:border-(--color-border-hover) hover:text-white"
            >
              Salir
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
