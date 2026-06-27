import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  name: string;
  price: number;
  media: { url: string; type: string }[];
}

const productBadges: Record<number, string> = {
  100000: 'Bestseller',
  100003: 'New',
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    supabase
      .from('product_items')
      .select('id, name, price, media')
      .eq('status', 'active')
      .limit(6)
      .then(({ data, error: err }) => {
        if (err) {
          setError(true);
        } else if (data) {
          setProducts(data as Product[]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-background-100 py-16 md:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-14 animate-pulse space-y-4">
            <div className="h-8 w-48 bg-background-200 rounded mx-auto"></div>
            <div className="h-4 w-64 bg-background-200 rounded mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-background-200 rounded-lg mb-4"></div>
                <div className="h-5 w-32 bg-background-200 rounded mx-auto mb-2"></div>
                <div className="h-4 w-16 bg-background-200 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background-100 py-16 md:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
          <p className="text-foreground-500 mb-4">Unable to load featured products right now.</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-primary-500 text-background-50 text-sm font-medium px-6 py-2.5 rounded-full hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-refresh-line"></i>
            </span>
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background-100 py-16 md:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        {/* Title */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-foreground-950">
            Featured <span className="italic font-light text-primary-500">Pieces</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-foreground-500 max-w-md mx-auto">
            Handpicked favorites our customers keep coming back to.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => {
            const imageUrl = product.media?.[0]?.url || '';
            const badge = productBadges[product.id];

            return (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group block"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-lg bg-background-200 aspect-square mb-4">
                  {badge && (
                    <span className={`absolute top-3 left-3 z-10 text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                      badge === 'Bestseller'
                        ? 'bg-primary-500 text-background-50'
                        : 'bg-accent-500 text-foreground-950'
                    }`}>
                      {badge}
                    </span>
                  )}
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Quick view overlay */}
                  <div className="absolute inset-0 bg-foreground-950/0 group-hover:bg-foreground-950/10 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background-50 text-foreground-950 text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap">
                      View Details
                    </span>
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-heading text-lg md:text-xl font-medium text-foreground-950 mb-1 text-center">
                  {product.name}
                </h3>
                <p className="text-sm text-foreground-500 text-center">
                  ${Number(product.price).toFixed(2)} USD
                </p>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10 md:mt-14">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground-700 hover:text-primary-500 transition-colors whitespace-nowrap underline underline-offset-4 decoration-foreground-300"
          >
            View All Products
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-right-line"></i>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}