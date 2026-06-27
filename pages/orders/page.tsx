import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { supabase } from '@/lib/supabase';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  final_price: number;
  subtotal: number;
  sku_label: string | null;
}

interface OrderHeader {
  id: number;
  status: string;
  currency: string;
  subtotal_items: number;
  shipping_total: number;
  tax_total: number;
  recipient: Record<string, string>;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed', icon: 'ri-checkbox-circle-line', description: 'Your order has been received and confirmed.' },
  { key: 'processing', label: 'Processing', icon: 'ri-settings-3-line', description: 'Our artisans are carefully preparing your items.' },
  { key: 'dispatched', label: 'Dispatched', icon: 'ri-ship-line', description: 'Your package is on its way from our studio.' },
  { key: 'transit', label: 'Out for Delivery', icon: 'ri-truck-line', description: 'Your order is in transit to your address.' },
  { key: 'delivered', label: 'Delivered', icon: 'ri-home-smile-line', description: 'Your handcrafted treasures have arrived.' },
];

function getStepIndex(status: string): number {
  switch (status) {
    case 'pending_payment':
    case 'paid':
      return 0;
    case 'processing':
      return 1;
    case 'shipped':
      return 2;
    case 'out_for_delivery':
      return 3;
    case 'delivered':
      return 4;
    case 'cancelled':
    case 'refunded':
      return -1;
    default:
      return 0;
  }
}

function getStatusBadge(status: string): { label: string; className: string } {
  switch (status) {
    case 'pending_payment':
      return { label: 'Awaiting Payment', className: 'bg-accent-100 text-accent-800' };
    case 'paid':
      return { label: 'Payment Confirmed', className: 'bg-secondary-100 text-secondary-800' };
    case 'processing':
      return { label: 'Processing', className: 'bg-secondary-100 text-secondary-800' };
    case 'shipped':
      return { label: 'Dispatched', className: 'bg-accent-100 text-accent-800' };
    case 'out_for_delivery':
      return { label: 'Out for Delivery', className: 'bg-primary-100 text-primary-800' };
    case 'delivered':
      return { label: 'Delivered', className: 'bg-secondary-100 text-secondary-800' };
    case 'cancelled':
      return { label: 'Cancelled', className: 'bg-foreground-100 text-foreground-700' };
    case 'refunded':
      return { label: 'Refunded', className: 'bg-foreground-100 text-foreground-700' };
    default:
      return { label: status, className: 'bg-foreground-100 text-foreground-700' };
  }
}

export default function Orders() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<OrderHeader | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setItems([]);

    const trimmedOrder = orderNumber.trim();
    const trimmedEmail = email.trim();

    if (!trimmedOrder) {
      setError('Please enter your order number.');
      return;
    }

    const orderId = parseInt(trimmedOrder, 10);
    if (isNaN(orderId)) {
      setError('Order number should be a number. It can be found in your confirmation email.');
      return;
    }

    setLoading(true);

    try {
      const { data: orderData, error: orderErr } = await supabase
        .from('order_headers')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (orderErr) throw orderErr;

      if (!orderData) {
        setError('No order found with that number. Please double-check and try again.');
        setLoading(false);
        return;
      }

      const header = orderData as unknown as OrderHeader;

      if (trimmedEmail) {
        const recipient = header.recipient || {};
        const recipientEmail = (recipient.email || '').toLowerCase();
        if (recipientEmail && recipientEmail !== trimmedEmail.toLowerCase()) {
          setError('The email does not match this order. Please try again.');
          setLoading(false);
          return;
        }
      }

      const { data: itemData, error: itemsErr } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)
        .order('id', { ascending: true });

      if (itemsErr) throw itemsErr;

      setOrder(header);
      setItems((itemData as unknown as OrderItem[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(`Could not look up your order: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = order ? getStepIndex(order.status) : -1;
  const statusBadge = order ? getStatusBadge(order.status) : null;
  const totalAmount = order
    ? (order.subtotal_items || 0) + (order.shipping_total || 0) + (order.tax_total || 0)
    : 0;
  const isCancelled = order?.status === 'cancelled' || order?.status === 'refunded';

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section className="relative h-[340px] md:h-[440px] flex items-end pb-12 md:pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Warm%20artisan%20studio%20interior%20with%20handcrafted%20wooden%20boxes%20wrapped%20in%20linen%20cloth%20tied%20with%20twine%20sitting%20on%20a%20rustic%20workbench%20soft%20morning%20light%20streaming%20through%20tall%20windows%20cream%20plaster%20walls%20terracotta%20pottery%20on%20shelves%20amber%20and%20beige%20earth%20tones%20editorial%20product%20photography%20peaceful%20atmosphere%20parcels%20ready%20for%20shipping&width=2000&height=1200&seq=orders-hero-v1&orientation=landscape"
              alt="Track your handcrafted order"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-8 md:w-12 h-px bg-accent-300/70"></span>
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent-200 font-label">
                  Track Your Order
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-light text-background-50 leading-[1.08] text-balance">
                Your treasures are{' '}
                <span className="italic text-accent-300">on their way</span>
              </h1>
              <p className="mt-4 md:mt-5 text-sm md:text-base text-background-100/80 leading-relaxed max-w-lg">
                Enter your order number to see real-time updates on your handcrafted pieces — from our artisan studio to your doorstep.
              </p>
            </div>
          </div>
        </section>

        {/* ── Editorial Divider ── */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-foreground-200 to-transparent"></div>
        </div>

        {/* ── Order Lookup ── */}
        <section className="bg-background-50 py-16 md:py-24">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">

            {/* Lookup form */}
            <div className="max-w-lg mx-auto mb-16">
              <h2 className="font-heading text-2xl md:text-3xl font-light text-foreground-950 text-center mb-8">
                Find your order
              </h2>

              <form onSubmit={handleLookup} className="space-y-5">
                <div>
                  <label htmlFor="order-number" className="block text-xs font-medium text-foreground-500 mb-2 uppercase tracking-wider font-label">
                    Order Number
                  </label>
                  <input
                    id="order-number"
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. 100001"
                    className="w-full bg-transparent border-b border-foreground-300/60 text-foreground-950 text-sm py-3 px-1 placeholder:text-foreground-400 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="order-email" className="block text-xs font-medium text-foreground-500 mb-2 uppercase tracking-wider font-label">
                    Email (optional)
                  </label>
                  <input
                    id="order-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="The email used at checkout"
                    className="w-full bg-transparent border-b border-foreground-300/60 text-foreground-950 text-sm py-3 px-1 placeholder:text-foreground-400 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <p className="mt-1.5 text-[11px] text-foreground-400">Add your email for extra verification. Optional but recommended.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-3 bg-primary-500 text-background-50 text-sm md:text-base font-medium px-8 py-4 rounded-full hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-loader-4-line animate-spin"></i>
                      </span>
                      Looking up...
                    </>
                  ) : (
                    <>
                      Track Order
                      <span className="w-4 h-4 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <i className="ri-search-line"></i>
                      </span>
                    </>
                  )}
                </button>

                {error && (
                  <div className="flex gap-2.5 p-4 bg-primary-100/60 rounded-lg">
                    <span className="shrink-0 w-4 h-4 flex items-center justify-center mt-0.5">
                      <i className="ri-error-warning-line text-xs text-primary-700"></i>
                    </span>
                    <p className="text-xs text-primary-800 leading-relaxed">{error}</p>
                  </div>
                )}
              </form>
            </div>

            {/* ── Order found — Display ── */}
            {order && (
              <div className="space-y-12 md:space-y-16">
                {/* Order header info bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-background-200/70">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs text-foreground-400 font-label uppercase tracking-wider">Order</span>
                      <span className="font-heading text-xl font-medium text-foreground-950">#{order.id}</span>
                      {statusBadge && (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium ${statusBadge.className} font-label`}>
                          {statusBadge.label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground-400 mt-1">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  {order.tracking_number && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-background-100 rounded-lg">
                      <span className="text-[11px] text-foreground-400 font-label uppercase tracking-wider">Tracking</span>
                      <span className="text-sm font-medium text-foreground-950 font-label">{order.tracking_number}</span>
                    </div>
                  )}
                </div>

                {/* ── Timeline ── */}
                <div>
                  <h3 className="font-heading text-xl font-light text-foreground-950 mb-8">
                    Order Progress
                  </h3>

                  {isCancelled ? (
                    <div className="flex gap-3 p-5 bg-foreground-100/60 rounded-lg">
                      <span className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                        <i className="ri-close-circle-line text-foreground-500"></i>
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground-700">
                          {order.status === 'cancelled' ? 'This order has been cancelled.' : 'This order has been refunded.'}
                        </p>
                        <p className="text-xs text-foreground-500 mt-1 leading-relaxed">
                          If you have questions, please reach out to us at hello@glowkraftee.com.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Connector line */}
                      <div className="absolute left-5 top-0 bottom-0 w-px bg-background-200 hidden md:block" style={{ left: '1.25rem' }}></div>

                      <div className="space-y-0">
                        {STATUS_STEPS.map((step, idx) => {
                          const isCompleted = idx <= stepIndex;
                          const isCurrent = idx === stepIndex;
                          const isUpcoming = idx > stepIndex;

                          let dotBg = 'bg-background-200 border-2 border-background-300';
                          let dotIcon = '';
                          let textColor = 'text-foreground-400';
                          let descColor = 'text-foreground-400';

                          if (isCompleted) {
                            dotBg = 'bg-primary-500 border-2 border-primary-500';
                            dotIcon = 'ri-check-line';
                            textColor = 'text-foreground-950';
                            descColor = 'text-foreground-500';
                          }

                          if (isCurrent) {
                            dotBg = 'bg-primary-500 border-4 border-primary-200';
                            dotIcon = '';
                            textColor = 'text-primary-700 font-medium';
                            descColor = 'text-foreground-600';
                          }

                          return (
                            <div key={step.key} className="flex gap-5 pb-10 last:pb-0">
                              {/* Dot */}
                              <div className="relative shrink-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${dotBg}`}>
                                  {dotIcon ? (
                                    <i className={`${dotIcon} text-xs text-background-50`}></i>
                                  ) : isCurrent ? (
                                    <span className="w-2 h-2 rounded-full bg-background-50"></span>
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-foreground-300"></span>
                                  )}
                                </div>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0 pt-1.5">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <p className={`text-sm md:text-base ${textColor} transition-colors whitespace-nowrap`}>
                                    {step.label}
                                  </p>
                                  {isCurrent && (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-primary-600 font-medium font-label">
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                                      Current
                                    </span>
                                  )}
                                  {isCompleted && !isCurrent && (
                                    <span className="text-[11px] text-secondary-600 font-label">
                                      <span className="w-4 h-4 flex items-center justify-center inline-block mr-1">
                                        <i className="ri-check-line text-[10px]"></i>
                                      </span>
                                      Complete
                                    </span>
                                  )}
                                </div>
                                <p className={`text-xs ${descColor} mt-1 leading-relaxed`}>
                                  {step.description}
                                </p>

                                {/* Show estimated delivery on the last active step */}
                                {isCurrent && idx === 3 && (
                                  <p className="mt-2 text-xs text-secondary-700 font-medium font-label">
                                    Estimated delivery in 1–3 business days
                                  </p>
                                )}
                                {isCompleted && idx === 4 && (
                                  <p className="mt-2 text-xs text-secondary-700 font-medium font-label">
                                    Delivered on {new Date(order.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Order Details Grid ── */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                  {/* Left — Items list */}
                  <div className="w-full lg:w-7/12">
                    <h3 className="font-heading text-xl font-light text-foreground-950 mb-6">
                      Items in Your Order
                    </h3>

                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-4 bg-background-100 rounded-lg border border-background-200/60"
                        >
                          <div className="shrink-0 w-14 h-14 rounded-md bg-background-200 flex items-center justify-center">
                            <i className="ri-box-3-line text-xl text-foreground-400"></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground-950 line-clamp-1">
                              {item.product_name}
                            </p>
                            {item.sku_label && (
                              <p className="text-[11px] text-foreground-400 mt-0.5">{item.sku_label}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-foreground-500">
                                Qty: {item.quantity} × ${Number(item.final_price || item.unit_price).toFixed(2)}
                              </span>
                              <span className="text-sm font-medium text-foreground-950 font-label">
                                ${Number(item.subtotal || (item.final_price || item.unit_price) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right — Order Summary */}
                  <div className="w-full lg:w-5/12">
                    <div className="lg:sticky lg:top-28 bg-background-100 rounded-lg p-6 md:p-8">
                      <h3 className="font-heading text-xl font-light text-foreground-950 mb-6">
                        Order Summary
                      </h3>

                      <div className="space-y-4 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground-500">Subtotal</span>
                          <span className="font-medium text-foreground-950 font-label">
                            ${Number(order.subtotal_items || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-foreground-500">Shipping</span>
                          <span className="font-medium text-foreground-950 font-label">
                            {Number(order.shipping_total || 0) === 0 ? (
                              <span className="text-secondary-700">Free</span>
                            ) : (
                              `$${Number(order.shipping_total || 0).toFixed(2)}`
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-foreground-500">Tax</span>
                          <span className="font-medium text-foreground-950 font-label">
                            ${Number(order.tax_total || 0).toFixed(2)}
                          </span>
                        </div>

                        <div className="h-px bg-foreground-200/60"></div>

                        <div className="flex items-center justify-between text-base">
                          <span className="font-medium text-foreground-950">Total</span>
                          <span className="font-heading text-xl font-semibold text-foreground-950">
                            {order.currency || 'USD'} ${totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Shipping address */}
                      {order.recipient && Object.keys(order.recipient).length > 0 && (
                        <div className="mt-6 pt-6 border-t border-background-200/70">
                          <h4 className="text-xs font-medium text-foreground-500 uppercase tracking-wider mb-3 font-label">
                            Shipping Address
                          </h4>
                          <div className="text-xs text-foreground-600 leading-relaxed space-y-0.5">
                            {order.recipient.name && <p>{order.recipient.name}</p>}
                            {order.recipient.address && <p>{order.recipient.address}</p>}
                            {order.recipient.city && order.recipient.state && (
                              <p>{order.recipient.city}{order.recipient.state ? `, ${order.recipient.state}` : ''}{order.recipient.zip ? ` ${order.recipient.zip}` : ''}</p>
                            )}
                            {order.recipient.country && <p>{order.recipient.country}</p>}
                          </div>
                        </div>
                      )}

                      {/* Support note */}
                      <div className="mt-6 flex gap-2.5 p-3 bg-accent-100/60 rounded-lg">
                        <span className="shrink-0 w-4 h-4 flex items-center justify-center mt-0.5">
                          <i className="ri-customer-service-line text-xs text-accent-700"></i>
                        </span>
                        <p className="text-[11px] text-accent-800 leading-relaxed">
                          Questions about your order? Reach out at{' '}
                          <a href="mailto:hello@glowkraftee.com" className="underline decoration-accent-400 underline-offset-2 hover:text-accent-900 transition-colors">
                            hello@glowkraftee.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── No order yet — Placeholder ── */}
            {!order && !loading && !error && (
              <div className="max-w-lg mx-auto text-center py-8">
                <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-background-100 mb-8">
                  <i className="ri-file-search-line text-3xl text-foreground-300"></i>
                </div>
                <p className="text-sm text-foreground-500 leading-relaxed mb-4">
                  Enter your order number above to track your shipment. Your order number can be found in the confirmation email you received after checkout.
                </p>
                <p className="text-xs text-foreground-400">
                  Example order number: <span className="font-medium text-foreground-600 font-label">100001</span>
                </p>
              </div>
            )}

          </div>
        </section>

        {/* ── Editorial Divider ── */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-foreground-200 to-transparent"></div>
        </div>

        {/* ── Trust bar ── */}
        <section className="bg-background-50 py-12 md:py-16">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <span className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-accent-100">
                  <i className="ri-global-line text-accent-600"></i>
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground-950">Ships Worldwide</p>
                  <p className="text-[11px] text-foreground-400">7–14 days to the USA</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100">
                  <i className="ri-shield-check-line text-secondary-600"></i>
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground-950">Secure &amp; Insured</p>
                  <p className="text-[11px] text-foreground-400">Every package is protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-100">
                  <i className="ri-customer-service-2-line text-primary-600"></i>
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground-950">Artisan Support</p>
                  <p className="text-[11px] text-foreground-400">Real humans, real care</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Closing CTA ── */}
        <section className="relative py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Warm%20artisan%20marketplace%20filled%20with%20handcrafted%20textiles%20hanging%20from%20wooden%20beams%20carved%20leather%20goods%20on%20display%20shelves%20terracotta%20pottery%20collection%20arranged%20on%20vintage%20table%20golden%20afternoon%20light%20filtering%20through%20tall%20windows%20earth%20tone%20cream%20beige%20amber%20palette%20editorial%20interior%20photography%20inviting%20serene%20atmosphere&width=2000&height=1000&seq=orders-cta-v1&orientation=landscape"
              alt="The GlowKraftee artisan marketplace — return to discover more handcrafted treasures"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/60"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
            <div className="max-w-xl mx-auto">
              <h2 className="font-heading text-2xl md:text-4xl font-light text-background-50 leading-tight text-balance">
                Crafted with patience,{' '}
                <span className="italic text-accent-300">delivered with care</span>
              </h2>
              <p className="mt-5 text-xs md:text-sm text-background-100/80 leading-relaxed max-w-md mx-auto">
                Every order is packed by hand in our Lahore studio and shipped with love. Thank you for supporting artisan communities.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-3 bg-background-50 text-foreground-950 text-sm md:text-base font-medium px-8 py-4 rounded-full hover:bg-accent-100 transition-colors cursor-pointer whitespace-nowrap group"
                >
                  <span className="w-4 h-4 flex items-center justify-center group-hover:-translate-x-0.5 transition-transform">
                    <i className="ri-arrow-left-line"></i>
                  </span>
                  Back to Home
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 bg-primary-500 text-background-50 text-sm md:text-base font-medium px-8 py-4 rounded-full hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap group"
                >
                  Browse Collection
                  <span className="w-4 h-4 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </span>
                </Link>
              </div>
              <p className="mt-6 text-xs text-background-100/50 font-label italic tracking-wider">
                GlowKraftee — Light up the World, One Handcrafted Piece at a Time
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}