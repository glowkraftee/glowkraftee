import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

interface Product {
  id: number;
  name: string;
  price: number;
  media: { url: string; type: string }[];
  category_id: number;
  discount_enabled: boolean;
  discount_price: number | null;
  product_categories: { id: number; name: string } | null;
}

interface Category {
  id: number;
  name: string;
  sort_order: number;
}

const productBadges: Record<number, string> = {
  100000: 'Bestseller',
  100003: 'New',
};

type SortOption = 'newest' | 'price-asc' | 'price-desc';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategorySlug = searchParams.get('category') || '';
  const searchQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Category slug → id mapping
  const slugToId: Record<string, number> = {
    'home-decor': 1,
    'personalized-gifts': 2,
    accessories: 3,
  };

  const idToSlug: Record<number, string> = {
    1: 'home-decor',
    2: 'personalized-gifts',
    3: 'accessories',
  };

  const activeCategoryId = slugToId[activeCategorySlug] || null;

  // Fetch categories
  useEffect(() => {
    supabase
      .from('product_categories')
      .select('id, name, sort_order')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    setError(false);

    let query = supabase
      .from('product_items')
      .select('id, name, price, media, category_id, discount_enabled, discount_price, product_categories(id, name)')
      .eq('status', 'active');

    if (activeCategoryId) {
      query = query.eq('category_id', activeCategoryId);
    }

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    // Apply sorting
    if (sortBy === 'price-asc') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price-desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    query
      .then(({ data, error: err }) => {
        if (err) {
          setError(true);
        } else if (data) {
          setProducts(data as Product[]);
        }
      })
      .finally(() => setLoading(false));
  }, [activeCategoryId, searchQuery, sortBy]);

  const handleCategoryClick = (slug: string) => {
    if (slug === activeCategorySlug) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchParams.set('q', searchInput.trim());
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const clearSearch = () => {
    setSearchInput('');
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  const categoryTitle = activeCategoryId
    ? categories.find((c) => c.id === activeCategoryId)?.name || 'Products'
    : 'All Products';

  const headingTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : categoryTitle;

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />

      <main className="pt-20 md:pt-24">
        {/* Header */}
        <section className="bg-background-50 border-b border-background-200/70">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
            <h1 className="font-heading text-3xl md:text-5xl font-semibold text-foreground-950">
              {headingTitle}
            </h1>
            <p className="mt-2 text-sm md:text-base text-foreground-500">
              {products.length} {products.length === 1 ? 'piece' : 'pieces'} curated for you
            </p>
          </div>
        </section>

        {/* Filters + Search Bar */}
        <section className="sticky top-16 md:top-20 z-40 bg-background-50/95 backdrop-blur-md border-b border-background-200/70">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
              {/* Category Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                <button
                  onClick={() => {
                    searchParams.delete('category');
                    setSearchParams(searchParams);
                  }}
                  className={`whitespace-nowrap text-xs md:text-sm font-medium px-4 py-2 rounded-full transition-colors cursor-pointer ${
                    !activeCategorySlug
                      ? 'bg-primary-500 text-background-50'
                      : 'text-foreground-600 hover:text-foreground-950 hover:bg-background-200'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => {
                  const slug = idToSlug[cat.id];
                  const isActive = activeCategorySlug === slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(slug)}
                      className={`whitespace-nowrap text-xs md:text-sm font-medium px-4 py-2 rounded-full transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-primary-500 text-background-50'
                          : 'text-foreground-600 hover:text-foreground-950 hover:bg-background-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Search + Sort */}
              <div className="flex items-center gap-2">
                {/* Search */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search pieces..."
                    className="w-36 md:w-48 text-xs md:text-sm bg-background-100 border border-background-200 rounded-full pl-8 pr-3 py-2 text-foreground-950 placeholder:text-foreground-400 outline-none focus:border-primary-400 transition-colors"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 flex items-center justify-center text-foreground-400">
                    <i className="ri-search-line text-xs"></i>
                  </span>
                  {searchInput && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-foreground-400 hover:text-foreground-600 cursor-pointer"
                    >
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  )}
                </form>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="text-xs md:text-sm bg-background-100 border border-background-200 rounded-full px-3 py-2 text-foreground-950 outline-none focus:border-primary-400 transition-colors cursor-pointer appearance-none pr-8"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                  }}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8 md:py-12">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-background-200 rounded-lg mb-4"></div>
                    <div className="h-5 w-32 bg-background-200 rounded mx-auto mb-2"></div>
                    <div className="h-4 w-16 bg-background-200 rounded mx-auto"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="text-center py-20">
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-background-200">
                  <i className="ri-error-warning-line text-2xl text-foreground-400"></i>
                </div>
                <p className="text-foreground-500 mb-4">Something went wrong loading the products.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 bg-primary-500 text-background-50 text-sm font-medium px-6 py-2.5 rounded-full hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-refresh-line"></i>
                  </span>
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-20">
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-background-200">
                  <i className="ri-search-line text-2xl text-foreground-400"></i>
                </div>
                <h3 className="font-heading text-xl font-medium text-foreground-950 mb-2">No pieces found</h3>
                <p className="text-sm text-foreground-500 mb-6">
                  {searchQuery
                    ? `We couldn't find anything matching "${searchQuery}". Try a different search.`
                    : 'No products in this category yet. Check back soon!'}
                </p>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="text-sm font-medium text-primary-500 hover:text-primary-600 underline underline-offset-4 whitespace-nowrap cursor-pointer"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {products.map((product) => {
                  const imageUrl = product.media?.[0]?.url || '';
                  const badge = productBadges[product.id];
                  const displayPrice = product.discount_enabled && product.discount_price
                    ? product.discount_price
                    : product.price;
                  const originalPrice = product.discount_enabled && product.discount_price
                    ? product.price
                    : null;

                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="group block"
                    >
                      <div className="relative overflow-hidden rounded-lg bg-background-200 aspect-square mb-4">
                        {badge && (
                          <span
                            className={`absolute top-3 left-3 z-10 text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                              badge === 'Bestseller'
                                ? 'bg-primary-500 text-background-50'
                                : 'bg-accent-500 text-foreground-950'
                            }`}
                          >
                            {badge}
                          </span>
                        )}
                        {product.discount_enabled && (
                          <span className="absolute top-3 right-3 z-10 text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-500 text-background-50 whitespace-nowrap">
                            Sale
                          </span>
                        )}
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-foreground-950/0 group-hover:bg-foreground-950/10 transition-colors duration-300 flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background-50 text-foreground-950 text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap">
                            View Details
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-foreground-400 uppercase tracking-wider mb-1 text-center">
                        {product.product_categories?.name || ''}
                      </p>
                      <h3 className="font-heading text-lg md:text-xl font-medium text-foreground-950 mb-1 text-center">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-foreground-500">
                          ${Number(displayPrice).toFixed(2)} USD
                        </span>
                        {originalPrice && (
                          <span className="text-sm text-foreground-400 line-through">
                            ${Number(originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}