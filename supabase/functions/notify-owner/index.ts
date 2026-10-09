// Supabase Edge Function: notify-owner
//
// Emails the shop owner when a new contact message or newsletter sign-up
// arrives. A database trigger calls this with { table, id } after each insert.
//
// Safety: the request only names a row. The function re-reads that row with the
// service role and emails only if it has not been notified yet, then stamps
// notified_at. So a forged request can't send fake content or repeat alerts.
//
// Secrets: RESEND_API_KEY (required), OWNER_EMAIL (optional override).
// Deploy with verify_jwt = false (called from a database trigger).

import { createClient } from "npm:@supabase/supabase-js@2";

const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") ?? "altafiqbal04@gmail.com";
const FROM = Deno.env.get("NOTIFY_FROM") ?? "GlowKraftee <onboarding@resend.dev>";
const ALLOWED_TABLES = new Set(["contact_messages", "newsletter_subscribers"]);

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

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: FROM,
      to: [OWNER_EMAIL],
      subject: subject.slice(0, 200),
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    console.error("notify-owner: Resend error", res.status, await res.text());
    return new Response("Email failed", { status: 502 });
  }

  await supabase
    .from(table)
    .update({ notified_at: new Date().toISOString() })
    .eq("id", id)
    .is("notified_at", null);

  console.log(`notify-owner: emailed owner about ${table} #${id}`);
  return new Response("ok", { status: 200 });
});
