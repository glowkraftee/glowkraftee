// Supabase Edge Function: create-checkout-session
//
// Called by the React frontend when the customer clicks "Pay".
// 1. Looks up every item's real price in product_items (never trusts the browser)
// 2. Recomputes shipping and tax on the server
// 3. Writes a pending order to order_headers + order_items
// 4. Creates a SafePay payment tracker + auth token via direct REST calls
// 5. Returns { checkoutUrl, orderId } to the browser
//
// SECURITY: prices, product names, shipping and tax sent by the browser are
// ignored. The browser only tells us WHICH products and HOW MANY; everything
// that decides the amount charged comes from the database. Previously the
// browser's unit_price was used directly, so a modified request could pay less.
//
// NOTE: Safepay's REST API is called with plain fetch(); the @sfpy/node-core
// package crashed this function at boot inside Supabase's Deno runtime.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Must match the checkout page (pages/checkout/page.tsx).
const FREE_SHIPPING_THRESHOLD = 800;
const FLAT_SHIPPING = 14.99;
const TAX_RATE = 0.0625;
const MAX_QTY_PER_ITEM = 20;

interface CheckoutItemIn {
  product_id?: number | string;
  sku_label?: string | null; // older frontend sends the product id here
  quantity: number;
}

interface CheckoutRequestBody {
  recipient: {
    name: string;
    email: string;
    city: string;
    [key: string]: unknown;
  };
  items: CheckoutItemIn[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

function jsonError(message: string, status: number, details?: unknown) {
  console.error("create-checkout-session error:", message, details ?? "");
  return new Response(
    JSON.stringify({ error: message, details: details ?? undefined }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body: CheckoutRequestBody = await req.json();

    // --- Basic validation ---
    if (!body.recipient?.name || !body.recipient?.email || !body.recipient?.city) {
      return jsonError("Missing required recipient fields: name, email, city", 400);
    }
    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
      return jsonError("Order must include between 1 and 50 items", 400);
    }

    // --- Which products, how many (merge duplicates) ---
    const wanted = new Map<number, number>();
    for (const item of body.items) {
      const id = Number(item.product_id ?? item.sku_label);
      const qty = Number(item.quantity);
      if (!Number.isInteger(id) || id <= 0) return jsonError("Invalid product in cart", 400);
      if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_ITEM) {
        return jsonError("Invalid quantity in cart", 400);
      }
      wanted.set(id, (wanted.get(id) ?? 0) + qty);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // --- Real prices from the database ---
    const { data: products, error: prodErr } = await supabase
      .from("product_items")
      .select("id, name, price, discount_enabled, discount_price, status, is_digital")
      .in("id", [...wanted.keys()]);
    if (prodErr) throw prodErr;

    const byId = new Map((products ?? []).map((p) => [Number(p.id), p]));
    const lineItems = [];
    let allDigital = true;
    for (const [id, quantity] of wanted) {
      const p = byId.get(id);
      if (!p || p.status !== "active") {
        return jsonError("A product in your cart is no longer available. Please refresh your cart.", 409, { id });
      }
      const unit = p.discount_enabled && p.discount_price != null
        ? Number(p.discount_price)
        : Number(p.price);
      if (!(unit > 0)) return jsonError("A product in your cart has no valid price", 409, { id });
      if (!p.is_digital) allDigital = false;
      lineItems.push({
        product_name: p.name as string,
        quantity,
        unit_price: round2(unit),
        final_price: round2(unit),
        subtotal: round2(unit * quantity),
        sku_label: String(id),
      });
    }

    // --- Totals computed on the server ---
    const currency = "USD";
    const subtotal_items = round2(lineItems.reduce((s, i) => s + i.subtotal, 0));
    // Digital-only orders (downloads) have nothing to ship.
    const shipping_total = allDigital || subtotal_items >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
    const tax_total = round2(subtotal_items * TAX_RATE);
    const grandTotal = round2(subtotal_items + shipping_total + tax_total);

    // --- 1. Insert order_headers (status: pending_payment) ---
    const { data: orderHeader, error: headerErr } = await supabase
      .from("order_headers")
      .insert({
        status: "pending_payment",
        currency,
        subtotal_items,
        shipping_total,
        tax_total,
        recipient: body.recipient,
      })
      .select()
      .single();
    if (headerErr) throw headerErr;
    const orderId: number = orderHeader.id;

    // --- 2. Insert order_items ---
    const { error: itemsErr } = await supabase
      .from("order_items")
      .insert(lineItems.map((item) => ({ order_id: orderId, ...item })));
    if (itemsErr) throw itemsErr;

    // --- 3. Safepay config ---
    const safepaySecretKey = Deno.env.get("SAFEPAY_SECRET_KEY")!;
    const safepayPublicKey = Deno.env.get("SAFEPAY_PUBLIC_KEY")!;
    const isProduction = Deno.env.get("SAFEPAY_ENV") === "production";
    const apiHost = isProduction ? "https://api.getsafepay.com" : "https://sandbox.api.getsafepay.com";
    const componentsHost = isProduction
      ? "https://getsafepay.com/embedded/"
      : "https://sandbox.api.getsafepay.com/embedded/";

    const amountInLowestDenomination = Math.round(grandTotal * 100);

    // --- 4. Create SafePay tracker (payment session) ---
    const sessionRes = await fetch(`${apiHost}/order/payments/v3/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${safepaySecretKey}` },
      body: JSON.stringify({
        merchant_api_key: safepayPublicKey,
        intent: "CYBERSOURCE",
        mode: "payment",
        entry_mode: "raw",
        currency,
        amount: amountInLowestDenomination,
        metadata: { order_id: String(orderId) },
      }),
    });
    const sessionJson = await sessionRes.json();
    if (!sessionRes.ok) {
      return jsonError("Safepay session setup failed", 502, { status: sessionRes.status, body: sessionJson });
    }
    const trackerToken: string | undefined = sessionJson?.data?.tracker?.token;
    if (!trackerToken) return jsonError("Safepay did not return a tracker token", 502, sessionJson);

    // --- 5. Short-lived auth token (passport). Safepay wants the regular secret
    // key in X-SFPY-MERCHANT-SECRET here (confirmed with Safepay support). ---
    const authRes = await fetch(`${apiHost}/client/passport/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-SFPY-MERCHANT-SECRET": safepaySecretKey },
      body: JSON.stringify({}),
    });
    const authJson = await authRes.json();
    if (!authRes.ok) {
      return jsonError("Safepay auth token creation failed", 502, { status: authRes.status, body: authJson });
    }
    const authToken: string | undefined = authJson?.data;
    if (!authToken) return jsonError("Safepay did not return an auth token", 502, authJson);

    // --- 6. Hosted Checkout URL ---
    const siteUrl = Deno.env.get("SITE_URL")!;
    const checkoutParams = new URLSearchParams({
      environment: isProduction ? "production" : "sandbox",
      tracker: trackerToken,
      tbt: authToken,
      source: "hosted",
      order_id: String(orderId),
      redirect_url: `${siteUrl}/order-confirmation?order_id=${orderId}&tracker=${trackerToken}`,
      cancel_url: `${siteUrl}/checkout?cancelled=1&order_id=${orderId}`,
    });
    const checkoutUrl = `${componentsHost}?${checkoutParams.toString()}`;

    // --- 7. Save the tracker token so the webhook can find the order ---
    const { error: updateErr } = await supabase
      .from("order_headers")
      .update({ safepay_tracker: trackerToken, updated_at: new Date().toISOString() })
      .eq("id", orderId);
    if (updateErr) throw updateErr;

    return new Response(
      JSON.stringify({ checkoutUrl, orderId, total: grandTotal }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err) {
    console.error("create-checkout-session error:", err);
    return jsonError(err instanceof Error ? err.message : "Unexpected error", 500);
  }
});
