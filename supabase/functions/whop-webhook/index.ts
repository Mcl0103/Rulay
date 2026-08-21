// Webhook de Whop — se dispara cuando se completa una compra de créditos.
// Configurar la URL de este endpoint en el dashboard de Whop (Developer > Webhooks).
import { createClient } from "npm:@supabase/supabase-js@2"
import { Whop } from "npm:@whop/sdk"

// Mapea el plan_id de Whop -> cuántos créditos entrega el paquete.
// Actualizar con los plan_id reales creados en Whop (uno por paquete de créditos).
const CREDIT_PACKAGES: Record<string, number> = {
  // "plan_xxx": 100,
  // "plan_yyy": 500,
}

const whop = new Whop({
  apiKey: Deno.env.get("WHOP_API_KEY") ?? "",
  webhookKey: btoa(Deno.env.get("WHOP_WEBHOOK_SECRET") ?? ""),
})

Deno.serve(async (req) => {
  const body = await req.text()

  let event
  try {
    event = whop.webhooks.unwrap(body, { headers: req.headers })
  } catch {
    return new Response("firma inválida", { status: 401 })
  }

  if (event.type !== "payment.succeeded") {
    return new Response("ignorado", { status: 200 })
  }

  const payment = event.data
  // internal_user_id se pasa como metadata al crear el checkout (ver ConnectShopifyBanner /
  // flujo de compra de créditos): es el user_id de Supabase del comprador.
  const userId = payment.metadata?.internal_user_id
  const planId = payment.plan_id
  const paymentId = payment.id

  if (!userId) {
    return new Response("falta internal_user_id en metadata", { status: 400 })
  }

  const credits = CREDIT_PACKAGES[planId]
  if (!credits) {
    return new Response(`plan desconocido: ${planId}`, { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  )

  const { error } = await supabase.from("credit_batches").insert({
    user_id: userId,
    credits_total: credits,
    credits_remaining: credits,
    source: "whop",
    payment_id: paymentId,
  })

  if (error) {
    return new Response(error.message, { status: 500 })
  }

  // Registro del cliente en payment_customers (auditoría / soporte), no crítico para el flujo de créditos.
  await supabase.from("payment_customers").upsert(
    { user_id: userId, provider: "whop", external_customer_id: payment.user_id ?? payment.member_id ?? paymentId },
    { onConflict: "user_id,provider" },
  )

  return new Response("ok", { status: 200 })
})
