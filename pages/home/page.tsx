import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { supabase } from '@/lib/supabase';

interface LiveProduct {
  id: number;
  name: string;
  price: number;
  media: { url: string; type: string }[] | null;
}

export default function Home() {
const navigate = useNavigate();

const { addItem, totalItems } = useCart();

const handleBuyNow = (product: { productId: number; name: string; price: number; image: string }) => {
  addItem({ ...product, quantity: 1 });
  const target = document.getElementById('checkout-section');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

const [products, setProducts] = useState<LiveProduct[]>([]);
const [productsLoading, setProductsLoading] = useState(true);
const [productsError, setProductsError] = useState(false);

useEffect(() => {
  supabase
    .from('product_items')
    .select('id, name, price, media')
    .eq('status', 'active')
    .order('id', { ascending: false })
    .limit(6)
    .then(({ data, error: err }) => {
      if (err) {
        setProductsError(true);
      } else if (data) {
        setProducts(data as LiveProduct[]);
      }
    })
    .finally(() => setProductsLoading(false));
}, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* NAVIGATION HEADER */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16 items-center">
      <div className="flex-shrink-0">
        <span className="text-xl font-bold tracking-tight text-gray-900">GlowKraftee</span>
      </div>

          <div className="hidden md:flex space-x-8 font-medium text-gray-600">
           <Link to="/" className="text-amber-600">Home</Link>
<Link to="/products" className="hover:text-amber-600 transition">Shop Collections</Link>
<Link to="/about" className="hover:text-amber-600 transition">Our Story</Link>
<Link to="/orders" className="hover:text-amber-600 transition">Track Order</Link>
          </div>

          <button onClick={() => window.location.href = '/cart'} className="relative text-gray-600 hover:text-amber-600 transition p-1" aria-label="View Cart">
            <span className="text-xl">🛒</span>
            <span className="absolute -top-1 -right-2 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{totalItems}</span>
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
            Where Artisans Glow Relations with Love and Care.
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

        {productsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-72 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!productsLoading && productsError && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Unable to load products right now.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-700 hover:bg-amber-800 text-white text-sm px-5 py-2.5 rounded transition"
            >
              Retry
            </button>
          </div>
        )}

        {!productsLoading && !productsError && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">New pieces are on their way — check back soon.</p>
          </div>
        )}

        {!productsLoading && !productsError && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => {
              const imageUrl = product.media?.[0]?.url || '';
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <Link to={`/product/${product.id}`} className="h-72 bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">🖼️</span>
                    )}
                  </Link>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold text-lg text-gray-900 mb-1 hover:text-amber-700 transition">{product.name}</h3>
                      </Link>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
                      <button
                        onClick={() => handleBuyNow({ productId: product.id, name: product.name, price: Number(product.price), image: imageUrl })}
                        className="bg-amber-700 hover:bg-amber-800 text-white text-sm px-4 py-2 rounded transition"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!productsLoading && !productsError && products.length > 0 && (
          <div className="text-center mt-10">
            <Link to="/products" className="text-amber-700 hover:text-amber-800 font-medium underline underline-offset-4">
              View All Products →
            </Link>
          </div>
        )}
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

          <button 
            onClick={() => navigate('/checkout')} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition duration-200"
          >
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
