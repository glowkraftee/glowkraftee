import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useCart } from '@/hooks/useCart';
import { CONTACT_EMAIL } from '@/lib/siteConfig';
import { supabase } from '@/lib/supabase';

// Safepay sends the customer back here after the hosted payment page.
// The exact query parameter names depend on the redirect URL configured in
// the create-checkout-session Edge Function, so we accept the common ones.
const ORDER_PARAM_KEYS = ['order_id', 'orderId', 'order', 'reference', 'ref'];
const TRACKER_PARAM_KEYS = ['tracker', 'token', 'tbt'];

// Safepay appends its own "?tracker=..." to a redirect URL that may already
// contain "?order_id=...", producing values like "track_abc?order_id=20".
// Split those apart so each parameter is read cleanly.
function normalizeParams(raw: URLSearchParams): URLSearchParams {
  const clean = new URLSearchParams();
  raw.forEach((value, key) => {
    const [head, ...rest] = value.split('?');
    if (!clean.has(key)) clean.set(key, head);
    if (rest.length) {
      new URLSearchParams(rest.join('&')).forEach((v, k) => {
        if (!clean.has(k)) clean.set(k, v);
      });
    }
  });
  return clean;
}

function firstParam(params: URLSearchParams, keys: string[]): string | null {
  for (const key of keys) {
    const value = params.get(key);
    if (value && value.trim()) return value.trim();
  }
  return null;
}

export default function OrderConfirmation() {
  const [rawParams] = useSearchParams();
  const searchParams = normalizeParams(rawParams);
  const { clearCart } = useCart();
  const cleared = useRef(false);

  const orderNumber = firstParam(searchParams, ORDER_PARAM_KEYS);
  const tracker = firstParam(searchParams, TRACKER_PARAM_KEYS);
  const status = (searchParams.get('status') || searchParams.get('state') || '').toLowerCase();
  const failed = ['failed', 'cancelled', 'canceled', 'error', 'declined'].includes(status);

  useEffect(() => {
    document.title = failed
      ? 'Payment not completed — GlowKraftee'
      : 'Order Confirmed — GlowKraftee';
  }, [failed]);

  // Digital downloads: ask the server (with the payment reference as proof)
  // until Safepay's confirmation arrives, then show the download links.
  const [hasDigital, setHasDigital] = useState(false);
  const [downloads, setDownloads] = useState<{ product_name: string; url: string }[]>([]);
  const [waitingTooLong, setWaitingTooLong] = useState(false);

  useEffect(() => {
    if (failed || !orderNumber || !tracker) return;
    let stopped = false;
    let attempts = 0;
    const check = async () => {
      attempts += 1;
      const { data } = await supabase.functions.invoke('order-access', {
        body: { order_id: Number(orderNumber), tracker },
      });
      if (stopped) return;
      if (data?.has_digital) setHasDigital(true);
      if (data?.downloads?.length) {
        setDownloads(data.downloads);
        return; // done
      }
      if (data && !data.has_digital) return; // physical-only order: nothing to wait for
      if (attempts >= 50) {
        setWaitingTooLong(true); // ~5 minutes
        return;
      }
      setTimeout(check, 6000);
    };
    check();
    return () => {
      stopped = true;
    };
  }, [failed, orderNumber, tracker]);

  // Payment went through on Safepay's side, so empty the cart once.
  useEffect(() => {
    if (!failed && !cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [failed, clearCart]);

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main>
        <section className="bg-background-50 py-16 md:py-28">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-lg mx-auto text-center py-16 md:py-24">
              {failed ? (
                <>
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto flex items-center justify-center rounded-full bg-red-50 mb-8">
                    <i className="ri-close-line text-3xl md:text-4xl text-red-500"></i>
                  </div>
                  <h1 className="font-heading text-2xl md:text-3xl font-light text-foreground-950 mb-4">
                    Payment not completed
                  </h1>
                  <p className="text-sm text-foreground-500 leading-relaxed mb-10">
                    Your payment didn't go through and you have not been charged. Your cart is still saved, so you can try again.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to="/checkout"
                      className="inline-flex items-center justify-center gap-2 bg-primary-500 text-background-50 text-sm font-medium px-8 py-3.5 rounded-full hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Return to Checkout
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-2 text-sm text-foreground-600 hover:text-foreground-900 transition-colors cursor-pointer whitespace-nowrap underline decoration-foreground-300/40 underline-offset-4 py-3.5 px-4"
                    >
                      Contact Us
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto flex items-center justify-center rounded-full bg-secondary-100 mb-8">
                    <i className="ri-check-line text-3xl md:text-4xl text-secondary-600"></i>
                  </div>
                  <h1 className="font-heading text-2xl md:text-3xl font-light text-foreground-950 mb-4">
                    Order confirmed!
                  </h1>
                  <p className="text-sm text-foreground-500 leading-relaxed mb-2">
                    Thank you for your order. Your handcrafted treasures are being prepared with care.
                  </p>
                  {orderNumber && (
                    <p className="text-sm text-foreground-400 mb-2">Order #{orderNumber}</p>
                  )}
                  {tracker && (
                    <p className="text-xs text-foreground-400 font-mono mb-2 break-all">
                      Payment reference: {tracker}
                    </p>
                  )}
                  {hasDigital && (
                    <div className="mt-8 rounded-2xl border border-secondary-200 bg-secondary-100/40 p-5 text-left">
                      <h2 className="font-heading text-xl text-foreground-950 mb-3 flex items-center gap-2">
                        <i className="ri-download-2-line text-primary-600"></i>
                        Your digital download
                      </h2>
                      {downloads.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {downloads.map((d) => (
                            <a
                              key={d.url}
                              href={d.url}
                              className="inline-flex items-center justify-between gap-3 bg-primary-500 hover:bg-primary-600 text-white text-base font-semibold px-5 py-3 rounded-full transition-colors"
                            >
                              <span className="truncate">Download: {d.product_name}</span>
                              <i className="ri-download-line text-xl"></i>
                            </a>
                          ))}
                          <p className="text-sm text-foreground-600">
                            This link works for 24 hours. Need it again later? Go to{' '}
                            <Link to="/orders" className="underline text-primary-600">Orders</Link>, enter order #{orderNumber} and your email.
                          </p>
                        </div>
                      ) : waitingTooLong ? (
                        <p className="text-sm text-foreground-700">
                          Your payment is still being confirmed. Go to{' '}
                          <Link to="/orders" className="underline text-primary-600">Orders</Link> in a few minutes, enter order #{orderNumber} and your email, and your download will be there.
                        </p>
                      ) : (
                        <p className="text-sm text-foreground-700 flex items-center gap-2">
                          <i className="ri-loader-4-line animate-spin text-lg text-primary-600"></i>
                          Confirming your payment… your download button will appear here in a minute or two. Please keep this page open.
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-foreground-400 leading-relaxed mt-6 mb-10 max-w-sm mx-auto">
                    A confirmation email will be sent to you shortly. You can also reach us anytime at{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-primary-500 hover:text-primary-600 underline underline-offset-4 transition-colors cursor-pointer"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to="/orders"
                      className="inline-flex items-center justify-center gap-2 bg-primary-500 text-background-50 text-sm font-medium px-8 py-3.5 rounded-full hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap group"
                    >
                      Track Your Order
                      <span className="w-4 h-4 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <i className="ri-map-pin-line"></i>
                      </span>
                    </Link>
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-center gap-2 text-sm text-foreground-600 hover:text-foreground-900 transition-colors cursor-pointer whitespace-nowrap underline decoration-foreground-300/40 underline-offset-4 py-3.5 px-4"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
