// Dispara la detección de país server-side (api/detect-country.ts) una vez
// que hay sesión. El endpoint decide internamente si ya hay país guardado
// (no pisa una elección manual) y de dónde sacarlo (header de Vercel).
// En dev local (`npm run dev`, sin Vercel) la ruta /api no existe — el
// fetch falla en silencio y no rompe nada.
export async function autoDetectCountryIfMissing(accessToken: string) {
  try {
    await fetch("/api/detect-country", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  } catch {
    // sin conexión a /api (dev local) o error de red — no crítico, se reintenta en la próxima sesión
  }
}
