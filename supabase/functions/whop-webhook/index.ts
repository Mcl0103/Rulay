// Webhook de Whop — se dispara cuando se completa una compra de créditos.
// Configurar la URL de este endpoint en el dashboard de Whop (Developer > Webhooks).
import { createClient } from "npm:@supabase/supabase-js@2"

// Mapea el ID del producto de Whop -> cuántos créditos entrega el paquete.
// Actualizar con los IDs reales de los productos creados en Whop.
const CREDIT_PACKAGES: Record<string, number> = {
  // "prod_xxx": 100,
  // "prod_yyy": 500,
}

Deno.serve(async (req) => {
  const signature = req.headers.get("whop-signature")
  const body = await req.text()

  if (!verifyWhopSignature(body, signature)) {
    return new Response("firma inválida", { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.type !== "payment.succeeded") {
    return new Response("ignorado", { status: 200 })
  }

  const whopUserId = event.data.user_id
  const productId = event.data.product_id
  const paymentId = event.data.id

  const credits = CREDIT_PACKAGES[productId]
  if (!credits) {
    return new Response(`producto desconocido: ${productId}`, { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  )

  // Requiere mapear whopUserId -> user_id de Supabase (guardado al conectar la cuenta,
  // o pasado como metadata en el checkout de Whop).
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("whop_user_id", whopUserId)
    .single()

  if (!profile) {
    return new Response("usuario no encontrado", { status: 404 })
  }

  const { error } = await supabase.from("credit_batches").insert({
    user_id: profile.id,
    credits_total: credits,
    credits_remaining: credits,
    source: "whop",
    whop_payment_id: paymentId,
  })

  if (error) {
    return new Response(error.message, { status: 500 })
  }

  return new Response("ok", { status: 200 })
})

function verifyWhopSignature(_body: string, signature: string | null): boolean {
  // TODO: validar con el webhook secret de Whop (HMAC SHA-256).
  // Ver docs: https://docs.whop.com/webhooks
  return Boolean(signature)
}
