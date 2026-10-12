// Supabase Edge Function: notify-owner
//
// Sends emails via Resend when:
//   - a contact message or newsletter sign-up is saved   -> alert to the owner
//   - an order becomes "paid" (Safepay confirmed payment) -> alert to the owner
//                                                           + confirmation to the buyer
// Database triggers call this with { table, id }.
//
// Safety: the request only names a row. The function re-reads that row with the
// service role, emails only if notified_at is empty (and, for orders, only when
// status is "paid"), then stamps notified_at. A forged request therefore can't
// send fake content or repeat emails.
//
// Secret: RESEND_API_KEY. Deploy with verify_jwt = false (called from triggers).

import { createClient } from "npm:@supabase/supabase-js@2";

// ---- Settings -------------------------------------------------------------
// Set to true once glowkraftee.com is verified in Resend (Domains page).
// Until then Resend only delivers to the account owner's address.
const DOMAIN_VERIFIED = true;

const FROM = DOMAIN_VERIFIED
  ? "GlowKraftee <orders@glowkraftee.com>"
  : "GlowKraftee <onboarding@resend.dev>";
const REPLY_TO_SHOP = "glowkraftee@gmail.com";
const RESEND_ACCOUNT_EMAIL = "altafiqbal04@gmail.com"; // only allowed recipient before verification

const ORDER_ALERT_TO = DOMAIN_VERIFIED
  ? ["glowkraftee@gmail.com", "altaf.iqbal@yahoo.com"]
  : [RESEND_ACCOUNT_EMAIL];
const MESSAGE_ALERT_TO = DOMAIN_VERIFIED ? ["glowkraftee@gmail.com"] : [RESEND_ACCOUNT_EMAIL];
const SEND_BUYER_EMAILS = DOMAIN_VERIFIED;

const SITE = "https://www.glowkraftee.com";
const DOWNLOAD_LINK_DAYS = 7;
const ALLOWED_TABLES = new Set(["contact_messages", "newsletter_subscribers", "order_headers"]);
// ---------------------------------------------------------------------------

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: unknown): string {
  return `<tr><td style="padding:6px 12px 6px 0;color:#8A7C64;vertical-align:top;white-space:nowrap">${esc(label)}</td><td style="padding:6px 0;color:#1A160F">${esc(value)}</td></tr>`;
}

const money = (n: unknown) => `$${Number(n ?? 0).toFixed(2)}`;

async function sendEmail(apiKey: string, msg: {
  to: string[]; subject: string; html: string; reply_to?: string;
}): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from: FROM, ...msg, subject: msg.subject.slice(0, 200) }),
  });
  if (!res.ok) {
    console.error("notify-owner: Resend error", res.status, await res.text());
    return false;
  }
  return true;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let table = "";
  let id = 0;
  try {
    const body = await req.json();
    table = String(body?.table ?? "");
    id = Number(body?.id);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!ALLOWED_TABLES.has(table) || !Number.isInteger(id) || id <= 0) {
    return new Response("Bad request", { status: 400 });
  }

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("notify-owner: RESEND_API_KEY is not set");
    return new Response("Not configured", { status: 500 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: record, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .is("notified_at", null)
    .maybeSingle();

  if (error) {
    console.error("notify-owner lookup failed:", error);
    return new Response("Lookup failed", { status: 500 });
  }
  if (!record) return new Response("Nothing to notify", { status: 200 });

  // ------------------------------------------------------------------ orders
  if (table === "order_headers") {
    if (record.status !== "paid") return new Response("Not paid", { status: 200 });

    // Claim the order first so a retry can never send duplicates.
    const { data: claimed } = await supabase
      .from("order_headers")
      .update({ notified_at: new Date().toISOString() })
      .eq("id", id)
      .is("notified_at", null)
      .select("id");
    if (!claimed?.length) return new Response("Already notified", { status: 200 });

    const r = (record.recipient ?? {}) as Record<string, string>;
    const { data: items } = await supabase
      .from("order_items")
      .select("product_name, quantity, unit_price, subtotal, sku_label")
      .eq("order_id", id)
      .order("id", { ascending: true });

    const total = Number(record.subtotal_items ?? 0) + Number(record.shipping_total ?? 0) + Number(record.tax_total ?? 0);
    const itemRows = (items ?? []).map((i) =>
      `<tr><td style="padding:6px 8px 6px 0;color:#1A160F">${esc(i.product_name)}</td><td style="padding:6px 8px;color:#1A160F;text-align:center">${esc(i.quantity)}</td><td style="padding:6px 0;color:#1A160F;text-align:right">${money(i.subtotal)}</td></tr>`
    ).join("");
    const itemsTable = `
      <table style="font-size:14px;border-collapse:collapse;width:100%;margin-top:8px">
        <tr><th style="text-align:left;color:#8A7C64;font-weight:normal;padding-bottom:4px">Item</th><th style="color:#8A7C64;font-weight:normal">Qty</th><th style="text-align:right;color:#8A7C64;font-weight:normal">Amount</th></tr>
        ${itemRows}
        <tr><td colspan="2" style="padding-top:8px;color:#8A7C64">Shipping</td><td style="padding-top:8px;text-align:right">${money(record.shipping_total)}</td></tr>
        <tr><td colspan="2" style="color:#8A7C64">Tax</td><td style="text-align:right">${money(record.tax_total)}</td></tr>
        <tr><td colspan="2" style="padding-top:6px;font-weight:bold">Total paid</td><td style="padding-top:6px;text-align:right;font-weight:bold">${money(total)} ${esc(record.currency ?? "USD")}</td></tr>
      </table>`;

    // Owner alert
    const addressLine = [r.address, r.city, r.state, r.zip, r.country].filter(Boolean).join(", ");
    const ownerHtml = `<div style="font-family:Arial,sans-serif;max-width:600px">
      <h2 style="color:#1A160F;font-weight:normal">New paid order #${esc(id)}</h2>
      <table style="font-size:14px;border-collapse:collapse">
        ${row("Customer", r.name)}
        ${row("Email", r.email)}
        ${row("Phone", r.phone)}
        ${row("Ship to", addressLine)}
        ${row("Safepay ref", record.safepay_tracker)}
      </table>
      ${itemsTable}
      <p style="font-size:12px;color:#8A7C64;margin-top:16px">Reply to this email to contact the customer.</p>
    </div>`;
    const ownerOk = await sendEmail(apiKey, {
      to: ORDER_ALERT_TO,
      subject: `New order #${id} – ${money(total)} from ${r.name ?? "customer"}`,
      html: ownerHtml,
      reply_to: r.email || undefined,
    });

    // Buyer confirmation (only once the domain is verified)
    let buyerOk = true;
    if (SEND_BUYER_EMAILS && r.email) {
      const productIds = (items ?? []).map((i) => Number(i.sku_label)).filter((n) => Number.isInteger(n) && n > 0);
      let downloadsHtml = "";
      if (productIds.length) {
        const { data: digital } = await supabase
          .from("product_items")
          .select("name, digital_file_path")
          .in("id", productIds)
          .eq("is_digital", true);
        const links: string[] = [];
        for (const p of digital ?? []) {
          if (!p.digital_file_path) continue;
          const { data: signed } = await supabase.storage
            .from("digital-products")
            .createSignedUrl(p.digital_file_path, DOWNLOAD_LINK_DAYS * 86400, {
              download: `${String(p.name).replace(/[^\w\- ]+/g, "").trim().slice(0, 80) || "download"}.pdf`,
            });
          if (signed?.signedUrl) {
            links.push(`<p style="margin:10px 0"><a href="${esc(signed.signedUrl)}" style="display:inline-block;background:#C17F3E;color:#fff;text-decoration:none;padding:10px 18px;border-radius:999px;font-weight:bold">Download: ${esc(p.name)}</a></p>`);
          }
        }
        if (links.length) {
          downloadsHtml = `<h3 style="color:#1A160F;font-weight:normal;margin-top:20px">Your download</h3>
            ${links.join("")}
            <p style="font-size:12px;color:#8A7C64">This link works for ${DOWNLOAD_LINK_DAYS} days. You can get a fresh link any time at <a href="${SITE}/orders">${SITE.replace("https://", "")}/orders</a> with your order number and email.</p>`;
        }
      }
      const buyerHtml = `<div style="font-family:Arial,sans-serif;max-width:600px">
        <h2 style="color:#1A160F;font-weight:normal">Thank you for your order!</h2>
        <p style="font-size:14px;color:#1A160F">Hi ${esc(r.name ?? "")}, your payment was received and order <strong>#${esc(id)}</strong> is confirmed.</p>
        ${itemsTable}
        ${downloadsHtml}
        <p style="font-size:14px;color:#1A160F;margin-top:20px">Track your order any time at <a href="${SITE}/orders">${SITE.replace("https://", "")}/orders</a>.
        Questions? Just reply to this email.</p>
        <p style="font-size:13px;color:#8A7C64">GlowKraftee Artisans made it with care and love for you.</p>
      </div>`;
      buyerOk = await sendEmail(apiKey, {
        to: [r.email],
        subject: `Your GlowKraftee order #${id} is confirmed`,
        html: buyerHtml,
        reply_to: REPLY_TO_SHOP,
      });
    }

    if (!ownerOk && !buyerOk) {
      // Nothing went out: release the claim so it can be retried.
      await supabase.from("order_headers").update({ notified_at: null }).eq("id", id);
      return new Response("Email failed", { status: 502 });
    }
    console.log(`notify-owner: order #${id} emails sent (owner: ${ownerOk}, buyer: ${SEND_BUYER_EMAILS ? buyerOk : "off"})`);
    return new Response("ok", { status: 200 });
  }

  // ---------------------------------------------- contact / newsletter alerts
  let subject: string;
  let html: string;
  let replyTo: string | undefined;

  if (table === "contact_messages") {
    subject = `New message: ${record.subject || record.inquiry_type} — from ${record.full_name}`;
    replyTo = record.email;
    html = `<div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="color:#1A160F;font-weight:normal">New contact message on GlowKraftee</h2>
      <table style="font-size:14px;border-collapse:collapse">
        ${row("From", record.full_name)}
        ${row("Email", record.email)}
        ${row("Type", record.inquiry_type)}
        ${row("Subject", record.subject)}
      </table>
      <div style="margin-top:16px;padding:14px;background:#FAF7F1;border-radius:8px;font-size:14px;white-space:pre-wrap;color:#1A160F">${esc(record.message)}</div>
      <p style="font-size:12px;color:#8A7C64;margin-top:16px">Reply to this email to answer ${esc(record.full_name)} directly.</p>
    </div>`;
  } else {
    subject = `New newsletter subscriber: ${record.email}`;
    html = `<div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="color:#1A160F;font-weight:normal">New newsletter subscriber</h2>
      <p style="font-size:14px;color:#1A160F">${esc(record.email)} just joined the GlowKraftee newsletter.</p>
    </div>`;
  }

  const ok = await sendEmail(apiKey, { to: MESSAGE_ALERT_TO, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) });
  if (!ok) return new Response("Email failed", { status: 502 });

  await supabase
    .from(table)
    .update({ notified_at: new Date().toISOString() })
    .eq("id", id)
    .is("notified_at", null);

  console.log(`notify-owner: emailed owner about ${table} #${id}`);
  return new Response("ok", { status: 200 });
});
