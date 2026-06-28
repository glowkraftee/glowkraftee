import React, { useState } from 'react';

export default function Home() {
  const [showCheckout, setShowCheckout] = useState(false);

  const handleBuyNow = () => {
    setShowCheckout(true);
    document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* NAVIGATION HEADER */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛍️</span>
            <span className="text-xl font-bold tracking-tight text-gray-900">GlowKraftee</span>
          </div>
          <div className="hidden md:flex space-x-8 font-medium text-gray-600">
            <a href="#" className="text-amber-600">Home</a>
            <a href="#shop" className="hover:text-amber-600 transition">Shop Collections</a>
            <a href="#" className="hover:text-amber-600 transition">Our Story</a>
            <a href="#" className="hover:text-amber-600 transition">Track Order</a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-600 hover:text-amber-600">
              <span className="text-xl">🛒</span>
              <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">1</span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO BANNER SECTION */}
      <header className="relative bg-amber-50/40 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Authentic Heritage. Modern Elegance.
          </h1>
          <p className="text-lg sm:text-xl italic text-amber-700 font-medium mb-6">
            Where Artisans Glow Relations with Love & Care.
          </p>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Bring the timeless soul of traditional Pakistani craftsmanship into your modern home. Handcrafted by master artisans, curated with precision, and shipped directly to your doorstep in the USA.
          </p>
          <a href="#shop" className="inline-block bg-amber-700 hover:bg-amber-800 text-white font-medium px-8 py-3 rounded-md transition shadow-md">
            Explore Collection →
          </a>
        </div>
      </header>

      {/* TRUST & VALUE PROPS BAR */}
      <section className="border-y border-gray-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">📦</span>
            <h3 className="font-semibold text-gray-900">Free Tracking to USA</h3>
            <p className="text-sm text-gray-500">Fully monitored international delivery</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">✨</span>
            <h3 className="font-semibold text-gray-900">100% Handcrafted</h3>
            <p className="text-sm text-gray-500">Ethically sourced from traditional master artisans</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">🔒</span>
            <h3 className="font-semibold text-gray-900">Secure Credit Card Checkout</h3>
            <p className="text-sm text-gray-500">Fully encrypted end-to-end global processing</p>
          </div>
        </div>
      </section>

      {/* MAIN PRODUCT CATALOG GRID */}
      <main id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">The Artisan Collection</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Product Card 1 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="h-72 bg-gray-200 flex items-center justify-center text-gray-400">
              <span className="text-4xl">🖼️</span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Handcrafted Premium Macrame Swing</h3>
                <div className="text-amber-500 text-sm mb-3">★★★★★ <span className="text-gray-500 text-xs ml-1">(14 reviews)</span></div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-bold text-gray-900">$45.00</span>
                <button onClick={handleBuyNow} className="bg-amber-700 hover:bg-amber-800 text-white text-sm px-4 py-2 rounded transition">Buy Now</button>
              </div>
            </div>
          </div>

          {/* Product Card 2 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="h-72 bg-gray-200 flex items-center justify-center text-gray-400">
              <span className="text-4xl">🖼️</span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Heritage Collection Decorative Accent</h3>
                <div className="text-amber-500 text-sm mb-3">★★★★★ <span className="text-gray-500 text-xs ml-1">(22 reviews)</span></div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-bold text-gray-900">$65.00</span>
                <button onClick={handleBuyNow} className="bg-amber-700 hover:bg-amber-800 text-white text-sm px-4 py-2 rounded transition">Buy Now</button>
              </div>
            </div>
          </div>

          {/* Product Card 3 (Matches your checkout setup) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col border-2 border-amber-600/40">
            <div className="h-72 bg-gray-200 flex items-center justify-center text-gray-400">
              <span className="text-4xl">🖼️</span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-medium mb-2">Popular</div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Handcrafted Premium Utility Item</h3>
                <div className="text-amber-500 text-sm mb-3">★★★★★ <span className="text-gray-500 text-xs ml-1">(8 reviews)</span></div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-bold text-gray-900">$15.00</span>
                <button onClick={handleBuyNow} className="bg-amber-700 hover:bg-amber-800 text-white text-sm px-4 py-2 rounded transition">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* LIVE SECURE CHECKOUT INTERFACES */}
      <section id="checkout-section" className="bg-gray-100 py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-2 mb-1">
              <span className="text-2xl">🛍️</span>
              <span className="text-xl font-bold text-gray-900">GlowKraftee</span>
            </div>
            <p className="text-xs italic text-gray-500">Where Artisans Glow Relations with Love & Care - Storefront</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Handcrafted Premium Item</span>
              <span className="font-bold text-gray-900">$15.00</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Shipping (USA Base)</span>
              <span>Calculated at cart</span>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition duration-200">
            Proceed to Secure Checkout
          </button>
        </div>
      </section>

      {/* FLOATING LIVE CHAT BOT BADGE */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-amber-900 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 hover:bg-amber-950 transition">
          <span className="font-medium text-sm">💬 Talk with Us</span>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        </button>
      </div>

    </div>
  );
}
