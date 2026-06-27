import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/lib/supabase';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const CHECKOUT_SEO = {
  title: 'Checkout — GlowKraftee | Secure Order for Handcrafted Artisan Goods',
  description: 'Complete your order with GlowKraftee. Secure checkout for premium handcrafted artisan goods including leather bags, carved wood decor, Kashmiri shawls, macrame home decor, and more. Ships from Pakistan to the USA.',
  keywords: 'checkout GlowKraftee, secure artisan order, handcrafted goods order, Pakistani crafts shipping, leather goods order, woodcraft order',
  canonical: 'https://glowkraftee.com/checkout',
};

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'United Arab Emirates', 'Saudi Arabia', 'Other'];

const STATES_US = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

export default function Checkout() {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'United States',
    state: '',
    city: '',
    address: '',
    apt: '',
    zip: '',
    honeypot: '',
  });

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const shippingEstimate = items.length > 0 ? (subtotal >= 800 ? 0 : 14.99) : 0;
  const taxEstimate = items.length > 0 ? subtotal * 0.0625 : 0;
  const orderTotal = subtotal + shippingEstimate + taxEstimate;

  // SEO injection
  useState(() => {
    document.title = CHECKOUT_SEO.title;

    const setMetaTag = (name: string, content: string, property?: string) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaTag('description', CHECKOUT_SEO.description);
    setMetaTag('keywords', CHECKOUT_SEO.keywords);
    setMetaTag('og:title', CHECKOUT_SEO.title, true);
    setMetaTag('og:description', CHECKOUT_SEO.description, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:url', CHECKOUT_SEO.canonical, true);
    setMetaTag('twitter:title', CHECKOUT_SEO.title);
    setMetaTag('twitter:description', CHECKOUT_SEO.description);
    setMetaTag('twitter:card', 'summary_large_image');

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', CHECKOUT_SEO.canonical);
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    // Honeypot check — silently reject bots
    if (formData.honeypot.trim() !== '') {
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 4000);
      return;
    }

    try {
      // Build recipient JSONB
      const recipient = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        country: formData.country,
        state: formData.state.trim(),
        city: formData.city.trim(),
        address: formData.address.trim() + (formData.apt.trim() ? `, Apt ${formData.apt.trim()}` : ''),
        zip: formData.zip.trim(),
      };

      // Create order header
      const { data: orderData, error: orderError } = await supabase
        .from('order_headers')
        .insert({
          currency: 'USD',
          payment_provider: 'manual',
          status: 'pending_payment',
          subtotal_items: subtotal,
          shipping_total: shippingEstimate,
          tax_total: taxEstimate,
          recipient,
          customer_notes: '',
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: String(item.productId),
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        final_price: item.price,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderNumber(String(orderData.id));
      clearCart();
      setSubmitStatus('success');
    } catch (err) {
      console.error('Order creation failed:', err);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  // If cart is empty and not in success state, redirect
  if (items.length === 0 && submitStatus !== 'success') {
    return (
      <div className="min-h-screen bg-background-50">
        <Navbar />
        <main>
          <section className="relative h-[340px] md:h-[440px] flex items-end pb-12 md:pb-20 overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://readdy.ai/api/search-image?query=Warm%20artisan%20marketplace%20interior%20scene%20with%20handcrafted%20leather%20bags%20carved%20wooden%20items%20and%20woven%20textiles%20arranged%20on%20rustic%20wooden%20display%20table%20soft%20morning%20light%20streaming%20through%20windows%20cream%20plaster%20walls%20terracotta%20accents%20editorial%20product%20photography%20with%20peaceful%20inviting%20atmosphere%20earth%20tones%20beige%20brown%20cream%20warm%20amber%20palette&width=2000&height=1200&seq=checkout-empty-v1&orientation=landscape"
                alt="Checkout"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10"></div>
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <span className="block w-8 md:w-12 h-px bg-accent-300/70"></span>
                  <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent-200 font-label">
                    Checkout
                  </span>
                </div>
                <h1 className="font-heading text-3xl md:text-5xl font-light text-background-50 leading-[1.08] text-balance">
                  Your cart is <span className="italic text-accent-300">empty</span>
                </h1>
                <p className="mt-4 text-sm text-background-100/80 leading-relaxed max-w-lg">
                  Add some handcrafted treasures to your cart before checking out.
                </p>
                <Link
                  to="/products"
                  className="mt-8 inline-flex items-center gap-3 bg-accent-300 text-foreground-950 text-sm font-medium px-8 py-3.5 rounded-full hover:bg-accent-200 transition-colors cursor-pointer whitespace-nowrap group"
                >
                  Browse Collection
                  <span className="w-4 h-4 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </span>
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />

      <main>
        {/* ── Hero — Editorial hero ── */}
        <section className="relative h-[340px] md:h-[440px] flex items-end pb-12 md:pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Warm%20artisan%20marketplace%20interior%20scene%20with%20handcrafted%20leather%20bags%20carved%20wooden%20items%20and%20woven%20textiles%20arranged%20on%20rustic%20wooden%20display%20table%20soft%20morning%20light%20streaming%20through%20windows%20cream%20plaster%20walls%20terracotta%20accents%20editorial%20product%20photography%20with%20peaceful%20inviting%20atmosphere%20earth%20tones%20beige%20brown%20cream%20warm%20amber%20palette%20empty%20waiting%20for%20customer&width=2000&height=1200&seq=checkout-hero-v1&orientation=landscape"
              alt="Complete your order — your handcrafted treasures are almost home"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-8 md:w-12 h-px bg-accent-300/70"></span>
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent-200 font-label">
                  Checkout
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-light text-background-50 leading-[1.08] text-balance">
                Almost{' '}
                <span className="italic text-accent-300">yours</span>
              </h1>
              <p className="mt-4 md:mt-5 text-sm md:text-base text-background-100/80 leading-relaxed max-w-lg">
                Just a few details and your handcrafted treasures will be on their way.
              </p>
            </div>
          </div>
        </section>

        {/* ── Editorial Divider ── */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-foreground-200 to-transparent"></div>
        </div>

        {/* ── Checkout Body ── */}
        <section className="bg-background-50 py-16 md:py-28">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            {submitStatus === 'success' ? (
              /* ── Success State ── */
              <div className="max-w-lg mx-auto text-center py-16 md:py-24">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto flex items-center justify-center rounded-full bg-secondary-100 mb-8">
                  <i className="ri-check-line text-3xl md:text-4xl text-secondary-600"></i>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-light text-foreground-950 mb-4">
                  Order confirmed!
                </h2>
                <p className="text-sm text-foreground-500 leading-relaxed mb-2">
                  Thank you for your order. Your handcrafted treasures are being prepared with care.
                </p>
                {orderNumber && (
                  <p className="text-sm text-foreground-400 mb-8">
                    Order #{orderNumber}
                  </p>
                )}
                <p className="text-xs text-foreground-400 leading-relaxed mb-10 max-w-sm mx-auto">
                  A confirmation email will be sent to {formData.email.trim()}. You can also reach us anytime at{' '}
                  <a href="mailto:hello@glowkraftee.com" className="text-primary-500 hover:text-primary-600 underline underline-offset-4 transition-colors cursor-pointer">hello@glowkraftee.com</a>.
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
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 text-sm text-foreground-500 hover:text-foreground-800 transition-colors cursor-pointer whitespace-nowrap underline decoration-foreground-300/40 underline-offset-4 py-3.5 px-4"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              /* ── Checkout Form ── */
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                {/* Left — Shipping form */}
                <div className="w-full lg:w-7/12">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-7"
                  >
                    {/* Honeypot — anti-spam */}
                    <input
                      type="text"
                      name="company_alt"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="honeypot-field"
                      value={formData.honeypot}
                      onChange={(e) => setFormData((prev) => ({ ...prev, honeypot: e.target.value }))}
                    />

                    {/* Section: Contact Info */}
                    <div>
                      <h3 className="font-heading text-lg font-medium text-foreground-950 mb-5">
                        Contact Information
                      </h3>
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label htmlFor="firstName" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                              First Name
                            </label>
                            <input
                              id="firstName"
                              name="firstName"
                              type="text"
                              required
                              value={formData.firstName}
                              onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                              placeholder="First name"
                              className="w-full bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors"
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                              Last Name
                            </label>
                            <input
                              id="lastName"
                              name="lastName"
                              type="text"
                              required
                              value={formData.lastName}
                              onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                              placeholder="Last name"
                              className="w-full bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                            Email Address
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="you@example.com"
                            className="w-full bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section: Shipping Address */}
                    <div className="pt-4">
                      <h3 className="font-heading text-lg font-medium text-foreground-950 mb-5">
                        Shipping Address
                      </h3>
                      <div className="space-y-5">
                        <div>
                          <label htmlFor="country" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                            Country
                          </label>
                          <div className="relative">
                            <select
                              id="country"
                              name="country"
                              required
                              value={formData.country}
                              onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value, state: '' }))}
                              className="w-full appearance-none bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 focus:outline-none focus:border-primary-400 transition-colors cursor-pointer"
                            >
                              {COUNTRIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                            <span className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none text-foreground-300">
                              <i className="ri-arrow-down-s-line text-sm"></i>
                            </span>
                          </div>
                        </div>

                        {formData.country === 'United States' && (
                          <div>
                            <label htmlFor="state" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                              State
                            </label>
                            <div className="relative">
                              <select
                                id="state"
                                name="state"
                                required
                                value={formData.state}
                                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                                className="w-full appearance-none bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 focus:outline-none focus:border-primary-400 transition-colors cursor-pointer"
                              >
                                <option value="" disabled>Select state</option>
                                {STATES_US.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              <span className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none text-foreground-300">
                                <i className="ri-arrow-down-s-line text-sm"></i>
                              </span>
                            </div>
                          </div>
                        )}

                        {formData.country !== 'United States' && (
                          <div>
                            <label htmlFor="state" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                              State / Province
                            </label>
                            <input
                              id="state"
                              name="state"
                              type="text"
                              required
                              value={formData.state}
                              onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                              placeholder="State or province"
                              className="w-full bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label htmlFor="city" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                              City
                            </label>
                            <input
                              id="city"
                              name="city"
                              type="text"
                              required
                              value={formData.city}
                              onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                              placeholder="City"
                              className="w-full bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors"
                            />
                          </div>
                          <div>
                            <label htmlFor="zip" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                              ZIP / Postal Code
                            </label>
                            <input
                              id="zip"
                              name="zip"
                              type="text"
                              required
                              value={formData.zip}
                              onChange={(e) => setFormData((prev) => ({ ...prev, zip: e.target.value }))}
                              placeholder="ZIP code"
                              className="w-full bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="address" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                            Street Address
                          </label>
                          <input
                            id="address"
                            name="address"
                            type="text"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                            placeholder="Street address"
                            className="w-full bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors"
                          />
                        </div>

                        <div>
                          <label htmlFor="apt" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                            Apartment / Suite (Optional)
                          </label>
                          <input
                            id="apt"
                            name="apt"
                            type="text"
                            value={formData.apt}
                            onChange={(e) => setFormData((prev) => ({ ...prev, apt: e.target.value }))}
                            placeholder="Apt, suite, unit, etc."
                            className="w-full bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section: Payment — placeholder */}
                    <div className="pt-4">
                      <h3 className="font-heading text-lg font-medium text-foreground-950 mb-5">
                        Payment Details
                      </h3>
                      <div className="bg-background-100 rounded-lg p-5 md:p-6 border border-background-200/60">
                        <div className="space-y-4">
                          {/* Card Number placeholder */}
                          <div>
                            <label className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                              Card Number
                            </label>
                            <div className="flex items-center gap-3 w-full border-b border-foreground-200 py-3.5 px-1">
                              <span className="w-4 h-4 flex items-center justify-center text-foreground-300">
                                <i className="ri-bank-card-line text-sm"></i>
                              </span>
                              <span className="text-sm text-foreground-300">•••• •••• •••• ••••</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-5">
                            <div>
                              <label className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                                Expiry Date
                              </label>
                              <div className="w-full border-b border-foreground-200 py-3.5 px-1">
                                <span className="text-sm text-foreground-300">MM / YY</span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                                CVC
                              </label>
                              <div className="w-full border-b border-foreground-200 py-3.5 px-1">
                                <span className="text-sm text-foreground-300">•••</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="mt-5 text-[11px] text-foreground-400 leading-relaxed flex items-start gap-2">
                          <span className="shrink-0 w-4 h-4 flex items-center justify-center mt-px">
                            <i className="ri-information-line text-xs"></i>
                          </span>
                          <span>
                            Payment processing will be set up when you connect Stripe. For now, your order will be placed and we will follow up with payment instructions via email.
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={submitStatus === 'submitting'}
                        className="w-full inline-flex items-center justify-center gap-3 bg-primary-500 text-background-50 text-sm md:text-base font-medium px-8 py-4 rounded-full hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed group"
                      >
                        {submitStatus === 'submitting' ? (
                          <>
                            <span className="w-4 h-4 border-2 border-background-50/30 border-t-background-50 rounded-full animate-spin"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            Place Order — ${orderTotal.toFixed(2)}
                            <span className="w-4 h-4 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                              <i className="ri-lock-line"></i>
                            </span>
                          </>
                        )}
                      </button>

                      {submitStatus === 'error' && (
                        <div className="mt-4 flex items-center gap-3 text-sm text-primary-700 bg-primary-100/60 rounded-lg px-5 py-3.5">
                          <span className="w-5 h-5 flex items-center justify-center shrink-0">
                            <i className="ri-error-warning-line"></i>
                          </span>
                          <span>Something went wrong placing your order. Please try again or contact us at hello@glowkraftee.com.</span>
                        </div>
                      )}

                      <Link
                        to="/cart"
                        className="mt-4 inline-flex items-center justify-center gap-2 text-sm text-foreground-500 hover:text-foreground-800 transition-colors cursor-pointer whitespace-nowrap underline decoration-foreground-300/40 underline-offset-4"
                      >
                        <span className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-arrow-left-line text-xs"></i>
                        </span>
                        Back to Cart
                      </Link>
                    </div>
                  </form>
                </div>

                {/* Right — Order Summary Sidebar */}
                <div className="w-full lg:w-5/12">
                  <div className="lg:sticky lg:top-28 bg-background-100 rounded-lg p-6 md:p-8">
                    <h2 className="font-heading text-xl font-light text-foreground-950 mb-6">
                      Order Summary
                      <span className="text-sm text-foreground-400 ml-2 font-label">({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                    </h2>

                    {/* Item list */}
                    <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div key={item.productId} className="flex gap-3">
                          <div className="shrink-0 w-14 h-14 rounded-md overflow-hidden bg-background-200">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover object-center"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground-950 line-clamp-1">{item.name}</p>
                            <p className="text-xs text-foreground-400 mt-0.5">Qty: {item.quantity}</p>
                            <p className="text-sm font-medium text-foreground-950 mt-1 font-label">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-foreground-200/60 my-5"></div>

                    {/* Totals */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-500">Subtotal</span>
                        <span className="font-medium text-foreground-950 font-label">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-500">Shipping</span>
                        {shippingEstimate === 0 ? (
                          <span className="text-secondary-700 font-medium font-label">Free</span>
                        ) : (
                          <span className="font-medium text-foreground-950 font-label">${shippingEstimate.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-500">Estimated Tax</span>
                        <span className="font-medium text-foreground-950 font-label">${taxEstimate.toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-foreground-200/60"></div>
                      <div className="flex items-center justify-between text-base">
                        <span className="font-medium text-foreground-950">Total</span>
                        <span className="font-heading text-xl font-semibold text-foreground-950">
                          ${orderTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Customs info */}
                    {subtotal > 0 && subtotal < 800 && (
                      <div className="mt-5 flex gap-2.5 p-3 bg-accent-100/60 rounded-lg">
                        <span className="shrink-0 w-4 h-4 flex items-center justify-center mt-0.5">
                          <i className="ri-information-line text-xs text-accent-700"></i>
                        </span>
                        <p className="text-[11px] text-accent-800 leading-relaxed">
                          Orders under $800 ship duty-free to the USA under the de minimis rule. No surprise customs fees on delivery.
                        </p>
                      </div>
                    )}

                    {shippingEstimate === 0 && subtotal > 0 && (
                      <div className="mt-4 flex gap-2.5 p-3 bg-secondary-100/60 rounded-lg">
                        <span className="shrink-0 w-4 h-4 flex items-center justify-center mt-0.5">
                          <i className="ri-check-line text-xs text-secondary-700"></i>
                        </span>
                        <p className="text-[11px] text-secondary-800 leading-relaxed">
                          Free shipping unlocked! Your order qualifies for complimentary delivery to the USA.
                        </p>
                      </div>
                    )}

                    {/* Trust badges */}
                    <div className="mt-6 pt-5 border-t border-background-200/60">
                      <div className="flex items-center gap-4 text-[11px] text-foreground-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 flex items-center justify-center">
                            <i className="ri-shield-check-line text-[10px] text-secondary-600"></i>
                          </span>
                          Secure
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 flex items-center justify-center">
                            <i className="ri-truck-line text-[10px] text-secondary-600"></i>
                          </span>
                          Ships 7–14 days
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 flex items-center justify-center">
                            <i className="ri-arrow-go-back-line text-[10px] text-secondary-600"></i>
                          </span>
                          14-day returns
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Editorial Divider ── */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-foreground-200 to-transparent"></div>
        </div>

        {/* ── Closing CTA ── */}
        <section className="relative py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Warm%20modern%20living%20space%20featuring%20handcrafted%20artisan%20decor%20woven%20macrame%20wall%20hanging%20leather%20armchair%20carved%20wooden%20side%20table%20with%20ceramic%20vessel%20golden%20afternoon%20sunlight%20streaming%20through%20window%20creating%20peaceful%20atmosphere%20earth%20tone%20palette%20cream%20beige%20terracotta%20amber%20accent%20editorial%20interior%20photography%20inviting%20and%20serene&width=2000&height=1000&seq=checkout-cta-v1&orientation=landscape"
              alt="Your artisan treasures — soon to be part of your home"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/60"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
            <div className="max-w-xl mx-auto">
              <h2 className="font-heading text-2xl md:text-4xl font-light text-background-50 leading-tight text-balance">
                Crafted with{' '}
                <span className="italic text-accent-300">patience</span>,
                <br />
                delivered with{' '}
                <span className="italic text-accent-300">care</span>
              </h2>
              <p className="mt-5 text-xs md:text-sm text-background-100/80 leading-relaxed max-w-md mx-auto">
                Every order is packed by hand with the same attention to detail that goes into creating each piece. Your treasures will arrive safely — we guarantee it.
              </p>
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