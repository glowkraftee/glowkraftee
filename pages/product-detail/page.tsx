import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
  media: { url: string; type: string }[];
  category_id: number;
  discount_enabled: boolean;
  discount_price: number | null;
  stock: number;
  product_categories: { id: number; name: string } | null;
}

const tabLabels = ['Product Details', 'Materials & Care', 'Shipping & Delivery'];

// Rich product descriptions keyed by product ID
const productDescriptions: Record<number, { details: string; materials: string; shipping: string }> = {
  100000: {
    details: 'A set of three hand-thrown terracotta vessels, each uniquely glazed in warm earthy tones that deepen beautifully with age. Perfect as standalone decorative accents or styled with dried botanicals for an organic centerpiece. Every piece is shaped by hand on a traditional potter\'s wheel, ensuring no two sets are identical. The varied sizes create a harmonious visual rhythm on any shelf, mantel, or dining table.',
    materials: 'Each vessel is crafted from locally sourced natural clay, kiln-fired at high temperatures for durability. The interior is sealed with a food-safe glaze, while the exterior retains its raw matte texture for an authentic artisan finish. Variations in tone and surface are not imperfections — they are the signature of genuine handcraftsmanship.',
    shipping: 'Dispatched from our Lahore workshop within 2-3 business days. International shipping to the United States typically takes 7-12 business days via tracked courier (DHL or FedEx). Each piece is carefully wrapped in recycled kraft paper and secured in a custom-fit box. A tracking number is emailed to you as soon as your order ships.',
  },
  100001: {
    details: 'Woven on a traditional wooden loom by artisans in Pakistan\'s northern valleys, this wool throw blends heritage techniques with a modern, minimalist aesthetic. The open, breathable weave makes it lightweight enough for summer evenings yet warm enough to layer in winter. Drape it over a sofa, fold it at the foot of your bed, or use it as a picnic blanket — it transitions effortlessly across seasons and settings.',
    materials: '100% pure wool sourced from free-grazing sheep in the Karakoram region. The wool is hand-spun, then woven using time-honored techniques passed down through five generations. Natural cream and warm beige tones are achieved without synthetic dyes — only the wool\'s own color variations are used, making each throw subtly one-of-a-kind.',
    shipping: 'Dispatched from our Lahore workshop within 2-3 business days. International shipping to the United States typically takes 7-12 business days via tracked courier (DHL or FedEx). The throw is folded with acid-free tissue and shipped in a protective cotton dust bag. A tracking number is emailed to you as soon as your order ships.',
  },
  100002: {
    details: 'This full-grain leather journal is bound by hand and personalized with your choice of embossed initials on the cover. The supple leather develops a rich patina with use, telling the story of your thoughts, sketches, and plans. Inside, 192 pages of thick, acid-free paper welcome fountain pens, rollerballs, and pencils alike — no bleed-through, no feathering.',
    materials: 'Full-grain cowhide leather sourced from a family-run tannery in Pakistan, vegetable-tanned without harsh chemicals. The pages are 120gsm acid-free, archival-quality paper with a subtle cream tone that\'s gentle on the eyes. Binding is done with waxed linen thread in the traditional Coptic style, allowing the journal to lie completely flat when open.',
    shipping: 'Dispatched from our Lahore workshop within 2-3 business days. Personalization may add 1 business day. International shipping to the United States typically takes 7-12 business days via tracked courier (DHL or FedEx). The journal is wrapped in tissue and shipped in a rigid mailer. A tracking number is emailed to you as soon as your order ships.',
  },
  100003: {
    details: 'Where warm brass meets rich dark wood, this candle holder is a study in material harmony. The weighted wooden base ensures stability, while the brushed brass cup catches every flicker of light and throws it back into the room. Designed to hold a standard pillar candle, it works solo as a statement piece or in pairs for a balanced tablescape.',
    materials: 'The base is carved from sustainably harvested Sheesham (Indian rosewood), known for its deep grain and natural durability. The candle cup is solid brass, hand-polished to a soft gleam and left un-lacquered so it develops a living patina over time. Both materials are joined with a concealed stainless steel fitting for strength.',
    shipping: 'Dispatched from our Lahore workshop within 2-3 business days. International shipping to the United States typically takes 7-12 business days via tracked courier (DHL or FedEx). The holder is packed in molded pulp cushioning inside a sturdy box. A tracking number is emailed to you as soon as your order ships.',
  },
  100004: {
    details: 'Hand-embroidered by women artisans in rural Punjab, each cushion cover carries the rhythm of countless tiny stitches — geometric motifs inspired by centuries-old textile traditions, reimagined in a contemporary palette. The cover features an invisible zipper closure and fits a standard 18×18-inch insert (sold separately). Every cover takes approximately 40 hours of handwork to complete.',
    materials: '100% cotton canvas base, pre-washed for softness and shrinkage control. Embroidery is done with colorfast cotton thread in terracotta, cream, and warm ochre tones. The back panel is plain cotton canvas with a concealed YKK zipper. All dyes are AZO-free and meet OEKO-TEX safety standards.',
    shipping: 'Dispatched from our Lahore workshop within 2-3 business days. International shipping to the United States typically takes 7-12 business days via tracked courier (DHL or FedEx). The cover is folded with tissue and shipped in a protective poly-mailer. A tracking number is emailed to you as soon as your order ships.',
  },
  100005: {
    details: 'Carved from a single slab of olive wood, this serving board is a functional work of art. The live edge follows the tree\'s natural contour — no two boards share the same shape. Use it as a cheese board, a charcuterie platter, or simply as a sculptural kitchen accent hung on the wall. The generous size accommodates a full spread for 4-6 guests.',
    materials: 'Solid olive wood sourced from managed groves in Pakistan\'s Potohar region. The board is hand-sanded to a silky smooth finish, then conditioned with food-grade mineral oil and beeswax. No varnishes or synthetic sealers are used. The wood\'s natural oils provide inherent antibacterial properties, making it safe for direct food contact.',
    shipping: 'Dispatched from our Lahore workshop within 2-3 business days. International shipping to the United States typically takes 7-12 business days via tracked courier (DHL or FedEx). The board is wrapped in recycled kraft paper and shipped in a custom-fit box with molded pulp cushioning. A tracking number is emailed to you as soon as your order ships.',
  },
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem, totalItems, setCartOpen } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const productId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    if (!productId) return;

    setLoading(true);
    setError(false);
    setActiveImage(0);
    setQuantity(1);

    supabase
      .from('product_items')
      .select('*, product_categories(id, name)')
      .eq('id', productId)
      .eq('status', 'active')
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (err || !data) {
          setError(true);
        } else {
          setProduct(data as Product);

          // Fetch related products from same category
          if (data.category_id) {
            supabase
              .from('product_items')
              .select('id, name, price, media, discount_enabled, discount_price, product_categories(id, name)')
              .eq('status', 'active')
              .eq('category_id', data.category_id)
              .neq('id', data.id)
              .limit(4)
              .then(({ data: related }) => {
                if (related) setRelatedProducts(related as Product[]);
              });
          }
        }
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    const displayPrice = product.discount_enabled && product.discount_price
      ? Number(product.discount_price)
      : Number(product.price);

    addItem({
      productId: product.id,
      name: product.name,
      price: displayPrice,
      image: product.media?.[0]?.url || '',
      quantity,
    });

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-background-50">
        <Navbar />
        <main className="pt-20 md:pt-24">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row gap-8 md:gap-12 animate-pulse">
              <div className="w-full lg:w-3/5">
                <div className="aspect-square bg-background-200 rounded-lg"></div>
                <div className="flex gap-3 mt-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-20 h-20 bg-background-200 rounded-md"></div>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-2/5 space-y-4">
                <div className="h-4 w-24 bg-background-200 rounded"></div>
                <div className="h-8 w-64 bg-background-200 rounded"></div>
                <div className="h-6 w-20 bg-background-200 rounded"></div>
                <div className="h-20 bg-background-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- Error State ---
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background-50">
        <Navbar />
        <main className="pt-20 md:pt-24">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-20 text-center">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-background-200">
              <i className="ri-error-warning-line text-2xl text-foreground-400"></i>
            </div>
            <h2 className="font-heading text-2xl font-medium text-foreground-950 mb-2">Product not found</h2>
            <p className="text-sm text-foreground-500 mb-6">This piece may no longer be available or the link might be broken.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-primary-500 text-background-50 text-sm font-medium px-6 py-2.5 rounded-full hover:bg-primary-600 transition-colors whitespace-nowrap cursor-pointer"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-left-line"></i>
              </span>
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const allImages = product.media?.length ? product.media : [];
  const displayPrice = product.discount_enabled && product.discount_price
    ? Number(product.discount_price)
    : Number(product.price);
  const originalPrice = product.discount_enabled && product.discount_price
    ? Number(product.price)
    : null;
  const content = productDescriptions[product.id] || {
    details: product.description || 'A beautifully handcrafted piece from our artisan workshop in Pakistan. Each item is made with care using traditional techniques.',
    materials: 'Premium natural materials sourced locally in Pakistan. Crafted using traditional techniques passed down through generations.',
    shipping: 'Dispatched from our Lahore workshop within 2-3 business days. International shipping to the United States typically takes 7-12 business days via tracked courier (DHL or FedEx). A tracking number is emailed to you as soon as your order ships.',
  };
  const tabContent: Record<number, string> = {
    0: content.details,
    1: content.materials,
    2: content.shipping,
  };

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />

      <main className="pt-20 md:pt-24">
        {/* Breadcrumb */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-4">
          <nav className="flex items-center gap-2 text-xs md:text-sm text-foreground-400">
            <Link to="/" className="hover:text-foreground-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-foreground-600 transition-colors">Shop</Link>
            <span>/</span>
            {product.product_categories && (
              <>
                <Link
                  to={`/products?category=${product.product_categories.id === 1 ? 'home-decor' : product.product_categories.id === 2 ? 'personalized-gifts' : 'accessories'}`}
                  className="hover:text-foreground-600 transition-colors"
                >
                  {product.product_categories.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground-600 truncate">{product.name}</span>
          </nav>
        </div>

        {/* Product Main Section */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pb-8">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
            {/* Left - Image Gallery */}
            <div className="w-full lg:w-3/5">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-lg bg-background-200 aspect-square">
                {allImages[activeImage] && (
                  <img
                    src={allImages[activeImage].url}
                    alt={`${product.name} — ${activeImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
                {product.discount_enabled && (
                  <span className="absolute top-4 left-4 text-xs font-medium px-2.5 py-1 rounded-full bg-red-500 text-background-50 whitespace-nowrap">
                    Sale
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-colors cursor-pointer ${
                        idx === activeImage
                          ? 'border-primary-500'
                          : 'border-transparent hover:border-background-300'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Product Info */}
            <div className="w-full lg:w-2/5">
              <div className="lg:sticky lg:top-24">
                {/* Category */}
                {product.product_categories && (
                  <p className="text-xs text-foreground-400 uppercase tracking-wider mb-2">
                    {product.product_categories.name}
                  </p>
                )}

                {/* Name */}
                <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground-950 leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-xl md:text-2xl font-medium text-foreground-950">
                    ${displayPrice.toFixed(2)} USD
                  </span>
                  {originalPrice && (
                    <span className="text-lg text-foreground-400 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-sm md:text-base text-foreground-500 leading-relaxed mb-6">
                  {content.details.length > 180
                    ? content.details.slice(0, 180) + '...'
                    : content.details}
                </p>

                {/* Divider */}
                <div className="border-t border-background-200/70 my-6"></div>

                {/* Quantity + Add to Cart */}
                <div className="flex items-center gap-4 mb-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-background-200 rounded-full">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-foreground-500 hover:text-foreground-950 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <i className="ri-subtract-line"></i>
                    </button>
                    <span className="w-10 text-center text-sm font-medium text-foreground-950 select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-foreground-500 hover:text-foreground-950 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 text-sm md:text-base font-medium px-6 py-3 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                      addedFeedback
                        ? 'bg-green-600 text-background-50'
                        : 'bg-primary-500 text-background-50 hover:bg-primary-600'
                    }`}
                  >
                    <span className="w-4 h-4 flex items-center justify-center">
                      <i className={addedFeedback ? 'ri-check-line' : 'ri-shopping-bag-line'}></i>
                    </span>
                    {addedFeedback ? 'Added to Cart!' : 'Add to Cart'}
                  </button>
                </div>

                {/* Cart quick view button */}
                {totalItems > 0 && (
                  <button
                    onClick={() => setCartOpen(true)}
                    className="w-full text-center text-xs text-foreground-500 hover:text-primary-500 transition-colors underline underline-offset-4 cursor-pointer mb-4"
                  >
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart — view cart
                  </button>
                )}

                {/* Trust badges */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="flex items-center gap-2 text-xs text-foreground-500">
                    <span className="w-4 h-4 flex items-center justify-center text-accent-500">
                      <i className="ri-shield-check-line"></i>
                    </span>
                    Secure Checkout
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground-500">
                    <span className="w-4 h-4 flex items-center justify-center text-accent-500">
                      <i className="ri-truck-line"></i>
                    </span>
                    Tracked Shipping
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground-500">
                    <span className="w-4 h-4 flex items-center justify-center text-accent-500">
                      <i className="ri-verified-badge-line"></i>
                    </span>
                    Authenticity Guaranteed
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground-500">
                    <span className="w-4 h-4 flex items-center justify-center text-accent-500">
                      <i className="ri-customer-service-line"></i>
                    </span>
                    Premium Support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <section className="border-t border-background-200/70">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
            {/* Tab Headers */}
            <div className="flex items-center gap-1 border-b border-background-200/70 mb-6 overflow-x-auto">
              {tabLabels.map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`whitespace-nowrap text-sm md:text-base font-medium px-4 py-3 border-b-2 transition-colors cursor-pointer ${
                    idx === activeTab
                      ? 'border-primary-500 text-foreground-950'
                      : 'border-transparent text-foreground-400 hover:text-foreground-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="max-w-3xl">
              <p className="text-sm md:text-base text-foreground-600 leading-relaxed whitespace-pre-line">
                {tabContent[activeTab]}
              </p>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-background-100 py-12 md:py-16">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-8 text-center">
                You May Also <span className="italic font-light text-primary-500">Love</span>
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((rp) => {
                  const rpPrice = rp.discount_enabled && rp.discount_price
                    ? Number(rp.discount_price)
                    : Number(rp.price);
                  return (
                    <Link
                      key={rp.id}
                      to={`/product/${rp.id}`}
                      className="group block"
                    >
                      <div className="relative overflow-hidden rounded-lg bg-background-200 aspect-square mb-3">
                        <img
                          src={rp.media?.[0]?.url || ''}
                          alt={rp.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="font-heading text-base font-medium text-foreground-950 mb-1 text-center">
                        {rp.name}
                      </h3>
                      <p className="text-sm text-foreground-500 text-center">
                        ${rpPrice.toFixed(2)} USD
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}