import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useCart } from '@/hooks/useCart';

// Safepay sends the customer back here after the hosted payment page.
// The exact query parameter names depend on the redirect URL configured in
// the create-checkout-session Edge Function, so we accept the common ones.
const ORDER_PARAM_KEYS = ['order_id', 'orderId', 'order', 'reference', 'ref'];
const TRACKER_PARAM_KEYS = ['tracker', 'token', 'tbt'];

function firstParam(params: URLSearchParams, keys: string[]): string | null {
  for (const key of keys) {
    const value = params.get(key);
    if (value && value.trim()) return value.trim();
  }
  return null;
}

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
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
                  <p className="text-xs text-foreground-400 leading-relaxed mt-6 mb-10 max-w-sm mx-auto">
                    A confirmation email will be sent to you shortly. You can also reach us anytime at{' '}
                    <a
                      href="mailto:hello@glowkraftee.com"
                      className="text-primary-500 hover:text-primary-600 underline underline-offset-4 transition-colors cursor-pointer"
                    >
                      hello@glowkraftee.com
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
