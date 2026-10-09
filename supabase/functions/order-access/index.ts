// Supabase Edge Function: order-access
//
// The only way the website reads an order. The caller must prove the order is
// theirs with EITHER:
//   - the Safepay tracker from the payment redirect (order-confirmation page), or
//   - the email address used at checkout (Orders page).
// Returns the order summary, its items, and — once the order is paid — short-lived
// download links for any digital products in it.
//
// order_headers / order_items are NOT publicly readable; this function uses the
// service role and returns only what the customer should see.
// Deploy with verify_jwt = true (the site calls it with the public anon key).

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAID_STATUSES = new Set(["paid", "processing", "shipped", "out_for_delivery", "delivered"]);
const LINK_TTL_SECONDS = 60 * 60 * 24; // 24 hours
const BUCKET = "digital-products";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let orderId = 0;
  let email = "";
  let tracker = "";
  try {
    const body = await req.json();
    orderId = Number(body?.order_id);
    email = String(body?.email ?? "").trim().toLowerCase();
    tracker = String(body?.tracker ?? "").trim();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  if (!Number.isInteger(orderId) || orderId <= 0 || (!email && !tracker)) {
    return json({ error: "Order number and email are required" }, 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: order, error } = await supabase
    .from("order_headers")
    .select("id, status, currency, subtotal_items, shipping_total, tax_total, recipient, tracking_number, safepay_tracker, created_at, updated_at")
    .eq("id", orderId)
    .maybeSingle();
  if (error) {
    console.error("order-access lookup failed:", error);
    return json({ error: "Lookup failed" }, 500);
  }

  // Same answer for "no such order" and "wrong email" so order numbers can't be probed.
  const recipient = (order?.recipient ?? {}) as Record<string, string>;
  const emailOk = !!email && (recipient.email ?? "").trim().toLowerCase() === email;
  const trackerOk = !!tracker && !!order?.safepay_tracker && order.safepay_tracker === tracker;
  if (!order || (!emailOk && !trackerOk)) {
    return json({ error: "No order found with that number and email." }, 404);
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("id, product_name, quantity, unit_price, final_price, subtotal, sku_label")
    .eq("order_id", orderId)
    .order("id", { ascending: true });

  // Digital downloads — only once Safepay has confirmed payment.
  const isPaid = PAID_STATUSES.has(order.status);
  const productIds = (items ?? [])
    .map((i) => Number(i.sku_label))
    .filter((n) => Number.isInteger(n) && n > 0);

  let hasDigital = false;
  const downloads: { product_name: string; url: string; expires_in_hours: number }[] = [];
  if (productIds.length) {
    const { data: digital } = await supabase
      .from("product_items")
      .select("id, name, is_digital, digital_file_path")
      .in("id", productIds)
      .eq("is_digital", true);
    hasDigital = (digital ?? []).length > 0;
    if (isPaid) {
      for (const p of digital ?? []) {
        if (!p.digital_file_path) continue;
        const fileName = `${String(p.name).replace(/[^\w\- ]+/g, "").trim().slice(0, 80) || "download"}.pdf`;
        const { data: signed, error: signErr } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(p.digital_file_path, LINK_TTL_SECONDS, { download: fileName });
        if (signErr || !signed?.signedUrl) {
          console.error("order-access: could not sign", p.digital_file_path, signErr);
          continue;
        }
        downloads.push({ product_name: p.name, url: signed.signedUrl, expires_in_hours: LINK_TTL_SECONDS / 3600 });
      }
    }
  }

  return json({
    order: {
      id: order.id,
      status: order.status,
      currency: order.currency,
      subtotal_items: order.subtotal_items,
      shipping_total: order.shipping_total,
      tax_total: order.tax_total,
      tracking_number: order.tracking_number,
      created_at: order.created_at,
      updated_at: order.updated_at,
      recipient: {
        name: recipient.name ?? "",
        address: recipient.address ?? "",
        city: recipient.city ?? "",
        zip: recipient.zip ?? "",
        state: recipient.state ?? "",
        country: recipient.country ?? "",
      },
    },
    items: (items ?? []).map(({ sku_label: _s, ...rest }) => rest),
    has_digital: hasDigital,
    is_paid: isPaid,
    downloads,
  });
});
