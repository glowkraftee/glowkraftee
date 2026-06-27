import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Category {
  id: number;
  name: string;
}

const categoryImages: Record<number, { image: string; description: string; slug: string }> = {
  1: {
    image: 'https://readdy.ai/api/search-image?query=Warm%20artisan%20handcrafted%20ceramic%20vase%20on%20wooden%20shelf%20with%20dried%20pampas%20grass%2C%20soft%20natural%20light%20from%20window%2C%20earthy%20neutral%20tones%2C%20minimal%20boho%20interior%2C%20cream%20walls%2C%20textured%20linen%20fabric%20nearby%2C%20elegant%20composition%2C%20editorial%20product%20photography%2C%20warm%20shadows%2C%20premium%20artisan%20aesthetic&width=800&height=1000&seq=glowkraftee-collection-home-decor&orientation=portrait',
    description: 'Artisan-crafted pieces that transform any space into a sanctuary of warmth and elegance.',
    slug: 'home-decor',
  },
  2: {
    image: 'https://readdy.ai/api/search-image?query=Elegant%20handcrafted%20personalized%20leather%20journal%20with%20embossed%20initials%20on%20marble%20surface%2C%20brass%20pen%20beside%20it%2C%20soft%20warm%20lighting%2C%20cream%20background%2C%20minimal%20luxury%20composition%2C%20artisan%20craftsmanship%20details%2C%20editorial%20product%20photography%2C%20rich%20brown%20and%20gold%20accents&width=800&height=500&seq=glowkraftee-collection-personalized&orientation=landscape',
    description: 'Thoughtfully customized treasures crafted with care for the ones who matter most.',
    slug: 'personalized-gifts',
  },
  3: {
    image: 'https://readdy.ai/api/search-image?query=Handcrafted%20woven%20textile%20scarf%20draped%20elegantly%20on%20wooden%20surface%2C%20warm%20terracotta%20and%20cream%20color%20palette%2C%20soft%20natural%20light%2C%20minimal%20composition%2C%20artisan%20textile%20details%20visible%2C%20editorial%20photography%2C%20earthy%20aesthetic%2C%20premium%20handmade%20feel&width=800&height=500&seq=glowkraftee-collection-accessories&orientation=landscape',
    description: 'Distinctive handcrafted adornments that speak to individuality and refined taste.',
    slug: 'accessories',
  },
};

export default function CollectionsGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('product_categories')
      .select('id, name')
      .order('sort_order')
      .then(({ data, error }) => {
        if (!error && data) setCategories(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-background-50 py-16 md:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-background-200 rounded mx-auto"></div>
            <div className="h-4 w-64 bg-background-200 rounded mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const [large, ...smallOnes] = categories;

  return (
    <section className="bg-background-50 py-16 md:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        {/* Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-foreground-950 leading-tight">
            Curated{' '}
            <span className="text-accent-500 italic font-light">Collections</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-foreground-500 max-w-md mx-auto">
            Explore our signature categories — each piece hand-selected for its character and charm.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Large Left Card */}
          {large && categoryImages[large.id] && (
            <Link
              to={`/products?category=${categoryImages[large.id].slug}`}
              className="group relative overflow-hidden rounded-lg cursor-pointer h-[400px] md:h-[520px]"
            >
              <img
                src={categoryImages[large.id].image}
                alt={large.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground-950/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="font-heading text-2xl md:text-3xl font-semibold text-background-50 mb-1">
                  {large.name}
                </h3>
                <p className="text-sm text-background-50/75 max-w-xs">
                  {categoryImages[large.id].description}
                </p>
              </div>
            </Link>
          )}

          {/* Right stacked small cards */}
          <div className="flex flex-col gap-4 md:gap-6">
            {smallOnes.map((cat) => {
              const meta = categoryImages[cat.id];
              if (!meta) return null;
              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${meta.slug}`}
                  className="group relative overflow-hidden rounded-lg cursor-pointer flex-1 min-h-[190px] md:min-h-[248px]"
                >
                  <img
                    src={meta.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground-950/50 via-foreground-950/10 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <h3 className="font-heading text-xl md:text-2xl font-semibold text-background-50 mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs md:text-sm text-background-50/75 max-w-xs">
                      {meta.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}