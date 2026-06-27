import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useCart } from '@/hooks/useCart';

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, totalItems, clearCart } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const shippingEstimate = items.length > 0 ? (subtotal >= 800 ? 0 : 14.99) : 0;
  const taxEstimate = items.length > 0 ? subtotal * 0.0625 : 0;
  const orderTotal = subtotal + shippingEstimate + taxEstimate;

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />

      <main>
        {/* ── Hero — Editorial hero ── */}
        <section className="relative h-[340px] md:h-[440px] flex items-end pb-12 md:pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Warm%20artisan%20marketplace%20interior%20scene%20with%20handcrafted%20leather%20bags%20carved%20wooden%20items%20and%20woven%20textiles%20arranged%20on%20rustic%20wooden%20display%20table%20soft%20morning%20light%20streaming%20through%20windows%20cream%20plaster%20walls%20terracotta%20accents%20editorial%20product%20photography%20with%20peaceful%20inviting%20atmosphere%20earth%20tones%20beige%20brown%20cream%20warm%20amber%20palette%20empty%20waiting%20for%20customer&width=2000&height=1200&seq=cart-hero-v1&orientation=landscape"
              alt="Your cart — handcrafted treasures waiting to find their home"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-8 md:w-12 h-px bg-accent-300/70"></span>
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent-200 font-label">
                  Your Cart
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-light text-background-50 leading-[1.08] text-balance">
                {items.length > 0 ? (
                  <>
                    {totalItems} handcrafted{' '}
                    <span className="italic text-accent-300">treasure{totalItems !== 1 ? 's' : ''}</span>
                  </>
                ) : (
                  <>
                    Your cart is{' '}
                    <span className="italic text-accent-300">waiting</span>
                  </>
                )}
              </h1>
              <p className="mt-4 md:mt-5 text-sm md:text-base text-background-100/80 leading-relaxed max-w-lg">
                {items.length > 0
                  ? 'Almost there — review your selections and proceed when ready.'
                  : 'Looks like you have not added anything yet. Browse our collection and find something you love.'}
              </p>
            </div>
          </div>
        </section>

        {/* ── Editorial Divider ── */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-foreground-200 to-transparent"></div>
        </div>

        {/* ── Cart Body ── */}
        <section className="bg-background-50 py-16 md:py-28">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            {items.length === 0 ? (
              /* ── Empty State ── */
              <div className="max-w-lg mx-auto text-center py-16 md:py-24">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto flex items-center justify-center rounded-full bg-background-100 mb-8">
                  <i className="ri-shopping-bag-line text-3xl md:text-4xl text-foreground-300"></i>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-light text-foreground-950 mb-4">
                  Your cart is empty
                </h2>
                <p className="text-sm text-foreground-500 leading-relaxed mb-10">
                  Discover handcrafted treasures from our artisan collection — each piece carries the warmth of human hands and the weight of tradition.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 bg-primary-500 text-background-50 text-sm md:text-base font-medium px-10 py-4 rounded-full hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap group"
                >
                  Browse the Collection
                  <span className="w-4 h-4 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </span>
                </Link>
              </div>
            ) : (
              /* ── Cart with items ── */
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                {/* Left — Cart items */}
                <div className="w-full lg:w-7/12">
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-heading text-xl font-light text-foreground-950">
                      {totalItems} item{totalItems !== 1 ? 's' : ''}
                    </h2>
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="text-xs text-foreground-400 hover:text-primary-500 transition-colors cursor-pointer whitespace-nowrap underline decoration-foreground-300/40 underline-offset-4"
                    >
                      Clear all
                    </button>
                  </div>

                  {/* Items list */}
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex gap-4 md:gap-6 p-4 md:p-5 bg-background-50 border border-background-200/60 rounded-lg"
                      >
                        {/* Product image */}
                        <Link
                          to={`/product/${item.productId}`}
                          className="shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-md overflow-hidden bg-background-100 block cursor-pointer"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover object-center"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <Link
                              to={`/product/${item.productId}`}
                              className="font-heading text-sm md:text-base font-medium text-foreground-950 hover:text-primary-500 transition-colors line-clamp-1 cursor-pointer"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-1 text-sm text-foreground-500 font-label">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity adjuster */}
                            <div className="flex items-center gap-1 bg-background-100 rounded-full px-1 py-1">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-background-200 transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <i className="ri-subtract-line text-xs text-foreground-600"></i>
                              </button>
                              <span className="w-8 text-center text-sm font-medium text-foreground-950 font-label">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-background-200 transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <i className="ri-add-line text-xs text-foreground-600"></i>
                              </button>
                            </div>

                            {/* Line total + remove */}
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-medium text-foreground-950 font-label whitespace-nowrap">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-primary-100 transition-colors cursor-pointer"
                                aria-label={`Remove ${item.name}`}
                              >
                                <i className="ri-delete-bin-line text-sm text-foreground-400 hover:text-primary-500"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — Order summary */}
                <div className="w-full lg:w-5/12">
                  <div className="lg:sticky lg:top-28 bg-background-100 rounded-lg p-6 md:p-8">
                    <h2 className="font-heading text-xl font-light text-foreground-950 mb-6">
                      Order Summary
                    </h2>

                    <div className="space-y-4 text-sm">
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

                      {shippingEstimate > 0 && subtotal > 0 && (
                        <p className="text-[11px] text-foreground-400 leading-relaxed">
                          Free shipping on orders over $800 to the USA. Add ${(800 - subtotal).toFixed(2)} more to qualify.
                        </p>
                      )}

                      {shippingEstimate === 0 && subtotal > 0 && (
                        <p className="text-[11px] text-secondary-700 leading-relaxed">
                          Free shipping unlocked — your order qualifies for complimentary delivery to the USA.
                        </p>
                      )}

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

                    {/* Customs Info */}
                    {subtotal > 0 && subtotal < 800 && (
                      <div className="mt-5 flex gap-2.5 p-3 bg-accent-100/60 rounded-lg">
                        <span className="shrink-0 w-4 h-4 flex items-center justify-center mt-0.5">
                          <i className="ri-information-line text-xs text-accent-700"></i>
                        </span>
                        <p className="text-[11px] text-accent-800 leading-relaxed">
                          Orders under $800 ship duty-free to the USA under the de minimis rule. No surprise customs fees.
                        </p>
                      </div>
                    )}

                    <Link
                      to="/checkout"
                      className="mt-8 w-full inline-flex items-center justify-center gap-3 bg-primary-500 text-background-50 text-sm md:text-base font-medium px-8 py-4 rounded-full hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap group"
                    >
                      Proceed to Checkout
                      <span className="w-4 h-4 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <i className="ri-arrow-right-line"></i>
                      </span>
                    </Link>

                    <Link
                      to="/products"
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 text-sm text-foreground-500 hover:text-foreground-800 transition-colors cursor-pointer whitespace-nowrap underline decoration-foreground-300/40 underline-offset-4"
                    >
                      <span className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-arrow-left-line text-xs"></i>
                      </span>
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Clear cart confirmation modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-background-50 rounded-lg p-6 md:p-8 max-w-sm mx-4 w-full shadow-lg">
              <h3 className="font-heading text-lg font-medium text-foreground-950 mb-2">
                Clear your cart?
              </h3>
              <p className="text-sm text-foreground-500 leading-relaxed mb-6">
                This will remove all {totalItems} item{totalItems !== 1 ? 's' : ''} from your cart. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-foreground-600 bg-background-100 rounded-full hover:bg-background-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    clearCart();
                    setShowClearConfirm(false);
                  }}
                  className="flex-1 py-2.5 text-sm font-medium text-background-50 bg-primary-500 rounded-full hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Editorial Divider ── */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-foreground-200 to-transparent"></div>
        </div>

        {/* ── Trust bar ── */}
        <section className="bg-background-50 py-12 md:py-16">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <span className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100">
                  <i className="ri-shield-check-line text-secondary-600"></i>
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground-950">Secure Checkout</p>
                  <p className="text-[11px] text-foreground-400">Encrypted &amp; protected</p>
                </div>
              </div>
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
                <span className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-100">
                  <i className="ri-arrow-go-back-line text-primary-600"></i>
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground-950">Easy Returns</p>
                  <p className="text-[11px] text-foreground-400">14-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Closing CTA ── */}
        <section className="relative py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Warm%20modern%20living%20space%20featuring%20handcrafted%20artisan%20decor%20woven%20macrame%20wall%20hanging%20leather%20armchair%20carved%20wooden%20side%20table%20with%20ceramic%20vessel%20golden%20afternoon%20sunlight%20streaming%20through%20window%20creating%20peaceful%20atmosphere%20earth%20tone%20palette%20cream%20beige%20terracotta%20amber%20accent%20editorial%20interior%20photography%20inviting%20and%20serene&width=2000&height=1000&seq=cart-cta-v1&orientation=landscape"
              alt="A warm artisan-filled living space — where every handcrafted piece tells a story"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/60"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
            <div className="max-w-xl mx-auto">
              <h2 className="font-heading text-2xl md:text-4xl font-light text-background-50 leading-tight text-balance">
                Every piece is made{' '}
                <span className="italic text-accent-300">just for you</span>
              </h2>
              <p className="mt-5 text-xs md:text-sm text-background-100/80 leading-relaxed max-w-md mx-auto">
                Nothing mass-produced. Everything handcrafted with care by artisans who pour their soul into every creation.
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