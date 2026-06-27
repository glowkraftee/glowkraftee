import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="relative w-full h-[380px] md:h-[480px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=Warm%20minimal%20flat%20lay%20of%20handcrafted%20ceramic%20bowls%20woven%20textiles%20and%20wooden%20objects%20arranged%20artfully%20on%20light%20cream%20surface%2C%20soft%20diffused%20lighting%2C%20earthy%20terracotta%20beige%20and%20cream%20color%20palette%2C%20elegant%20composition%2C%20premium%20artisan%20aesthetic%2C%20editorial%20photography%2C%20wide%20format&width=1800&height=800&seq=glowkraftee-cta-banner&orientation=landscape"
          alt="GlowKraftee artisan collection — explore handcrafted pieces"
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground-950/40"></div>

      {/* Content */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col justify-center">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-semibold text-background-50 leading-tight text-balance">
            Ready to bring{' '}
            <span className="italic font-light text-accent-300">artisan warmth</span>{' '}
            into your space?
          </h2>
        </div>

        <div className="mt-8 md:mt-10">
          <Link
            to="/products"
            className="whitespace-nowrap inline-flex items-center gap-3 bg-background-50 text-foreground-950 text-sm md:text-base font-medium px-7 py-3.5 rounded-full hover:bg-accent-200 transition-colors cursor-pointer"
          >
            Explore the Collection
            <span className="w-5 h-5 flex items-center justify-center bg-foreground-950 rounded-full">
              <i className="ri-arrow-right-line text-background-50 text-xs"></i>
            </span>
          </Link>
        </div>

        <p className="absolute bottom-8 right-8 text-sm text-background-50/70 max-w-xs text-right leading-relaxed hidden md:block">
          Free tracked shipping on orders over $150 to the United States.
        </p>
      </div>
    </section>
  );
}