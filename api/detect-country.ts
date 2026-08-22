// Vercel Serverless Function — detecta el país del usuario a partir del header
// x-vercel-ip-country (geolocalización propia de Vercel, sin llamar a ningún
// servicio de terceros ni exponer la IP del usuario fuera de nuestra infra) y
// lo guarda en user_preferences.pais SOLO si el usuario nunca lo ha seteado.
import { createClient } from "@supabase/supabase-js"

const isoToCountry: Record<string, string> = {
  CO: "Colombia",
  MX: "México",
  PE: "Perú",
  CL: "Chile",
  AR: "Argentina",
  EC: "Ecuador",
  US: "Estados Unidos",
  ES: "España",
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" })
    return
  }

  const authHeader = req.headers.authorization as string | undefined
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "falta token" })
    return
  }
  const accessToken = authHeader.slice("Bearer ".length)

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    res.status(500).json({ error: "faltan variables de entorno de Supabase" })
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })

  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken)
  if (userError || !userData.user) {
    res.status(401).json({ error: "token inválido" })
    return
  }

  const { data: existing } = await supabase
    .from("user_preferences")
    .select("pais")
    .eq("user_id", userData.user.id)
    .maybeSingle()

  if (existing?.pais) {
    res.status(200).json({ pais: existing.pais, skipped: true })
    return
  }

  const countryCode = req.headers["x-vercel-ip-country"] as string | undefined
  const pais = countryCode ? (isoToCountry[countryCode] ?? countryCode) : null

  if (!pais) {
    res.status(200).json({ pais: null, skipped: true })
    return
  }

  const { error: upsertError } = await supabase
    .from("user_preferences")
    .upsert({ user_id: userData.user.id, pais }, { onConflict: "user_id" })

  if (upsertError) {
    res.status(500).json({ error: upsertError.message })
    return
  }

  res.status(200).json({ pais, skipped: false })
}
