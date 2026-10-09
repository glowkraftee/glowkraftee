// Supabase Edge Function: safepay-webhook
//
// Safepay calls this URL after a payment. We verify the call really came from
// Safepay, find the order by its tracker token, and mark it "paid".
//
// Signature check follows Safepay's official Node SDK (src/resources/verify.ts):
//   x-sfpy-signature = HMAC-SHA512( JSON.stringify(body.data), SAFEPAY_WEBHOOK_SECRET )
// The previous version used HMAC-SHA256 over the raw body, so every genuine
// Safepay call was rejected with "signature mismatch".
//
// Register this function's URL in Safepay Dashboard -> Developer -> Webhooks.
// Deploy with verify_jwt = false (Safepay can't send a Supabase JWT; the HMAC
// signature is the authentication).

import { createClient } from "npm:@supabase/supabase-js@2";
import { createHmac, timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";

const PAID_STATES = new Set(["PAID", "TRACKER_ENDED", "COMPLETED", "CAPTURED", "SUCCEEDED"]);
const FAILED_STATES = new Set(["FAILED", "DECLINED", "CANCELLED", "CANCELED", "TRACKER_CANCELLED"]);

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a.toLowerCase());
  const bb = Buffer.from(b.toLowerCase());
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

function hmac(alg: "sha512" | "sha256", secret: string, payload: string): string {
  return createHmac(alg, secret).update(payload).digest("hex");
}

// deno-lint-ignore no-explicit-any
function pick(obj: any, paths: string[]): any {
  for (const path of paths) {
    let cur = obj;
    for (const key of path.split(".")) cur = cur?.[key];
    if (cur !== undefined && cur !== null && cur !== "") return cur;
  }
  return undefined;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const rawBody = await req.text();
  // deno-lint-ignore no-explicit-any
  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // --- Verify the webhook came from Safepay ---
  const signature = (req.headers.get("x-sfpy-signature") ?? "").trim();
  const secret = Deno.env.get("SAFEPAY_WEBHOOK_SECRET") ?? "";
  if (!signature || !secret) {
    console.error("Webhook rejected: missing signature header or SAFEPAY_WEBHOOK_SECRET");
    return new Response("Invalid signature", { status: 401 });
  }

  const candidates: Record<string, string> = {};
  if (event?.data !== undefined) {
    candidates["sha512(data)"] = hmac("sha512", secret, JSON.stringify(event.data));
  }
  candidates["sha512(raw)"] = hmac("sha512", secret, rawBody);
  candidates["sha256(raw)"] = hmac("sha256", secret, rawBody);

  const matched = Object.entries(candidates).find(([, sig]) => safeEqual(sig, signature))?.[0];
  if (!matched) {
    console.error(
      "SafePay webhook signature mismatch. Check SAFEPAY_WEBHOOK_SECRET matches the Safepay dashboard. Payload keys:",
      Object.keys(event ?? {}),
      "data keys:",
      Object.keys(event?.data ?? {}),
    );
    return new Response("Invalid signature", { status: 401 });
  }

  // --- Read the event ---
  const data = event?.data ?? event;
  const eventType: string = String(pick(event, ["type", "event", "data.type"]) ?? "");
  const trackerToken: string | undefined = pick(data, [
    "tracker",
    "tracker.token",
    "notification.tracker",
    "token",
  ]) ?? pick(event, ["notification.tracker", "tracker"]);
  const state = String(pick(data, ["state", "notification.state", "tracker.state", "status"]) ?? "").toUpperCase();

  console.log(`Webhook verified via ${matched}: type=${eventType} state=${state} tracker=${trackerToken}`);

  if (!trackerToken || typeof trackerToken !== "string") {
    console.error("Webhook payload missing tracker token. data keys:", Object.keys(data ?? {}));
    // 200 so Safepay stops retrying something we can never match.
    return new Response("Missing tracker", { status: 200 });
  }

  const typeLower = eventType.toLowerCase();
  const isPaid =
    PAID_STATES.has(state) ||
    data?.success === true ||
    event?.success === true ||
    ["payment:created", "payment.succeeded", "payment:succeeded", "payment.created"].includes(typeLower);
  const isFailed = !isPaid && (FAILED_STATES.has(state) || typeLower.includes("fail"));

  if (!isPaid && !isFailed) {
    console.log(`Ignoring webhook event (no status change): type=${eventType} state=${state}`);
    return new Response("ok", { status: 200 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: order, error: findErr } = await supabase
    .from("order_headers")
    .select("id, status")
    .eq("safepay_tracker", trackerToken)
    .maybeSingle();

  if (findErr) {
    console.error("Error looking up order for webhook:", findErr);
    return new Response("Lookup failed", { status: 500 });
  }
  if (!order) {
    console.error("No order found for tracker:", trackerToken);
    return new Response("No matching order", { status: 200 });
  }

  // Only move orders forward from pending_payment; never downgrade a paid order.
  if (order.status !== "pending_payment") {
    console.log(`Order ${order.id} already ${order.status}; leaving unchanged.`);
    return new Response("ok", { status: 200 });
  }

  const newStatus = isPaid ? "paid" : "failed";
  const { error: updateErr } = await supabase
    .from("order_headers")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", order.id)
    .eq("status", "pending_payment");

  if (updateErr) {
    console.error("Error updating order status:", updateErr);
    return new Response("Update failed", { status: 500 });
  }

  console.log(`Order ${order.id} updated to ${newStatus} (event: ${eventType}, state: ${state})`);
  return new Response("ok", { status: 200 });
});
