import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[520px] md:h-[680px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=Warm%20artisan%20workshop%20scene%20with%20handcrafted%20ceramic%20pottery%20and%20woven%20textiles%20on%20wooden%20workbench%2C%20soft%20golden%20hour%20light%20streaming%20through%20window%2C%20earthy%20terracotta%20cream%20and%20warm%20brown%20color%20palette%2C%20artisan%20tools%20scattered%20elegantly%2C%20shallow%20depth%20of%20field%2C%20cinematic%20composition%2C%20luxurious%20handcrafted%20aesthetic%2C%20premium%20editorial%20photography&width=1800&height=1000&seq=glowkraftee-hero-bg&orientation=landscape"
          alt="GlowKraftee artisan handcrafted goods — premium home decor and personalized gifts"
          title="GlowKraftee — Handcrafted Elegance, Delivered Worldwide"
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay"></div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4 md:px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-background-50/20 backdrop-blur-sm border border-background-50/30 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-accent-400"></span>
          <span className="text-xs md:text-sm font-medium text-background-50 tracking-wide">
            Artisanal Craftsmanship · Delivered Worldwide
          </span>
        </div>

        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-semibold text-background-50 max-w-4xl leading-tight text-balance">
          Handcrafted Elegance,{' '}
          <span className="italic font-light">Straight to Your Door</span>
        </h1>

        <p className="mt-5 md:mt-6 text-sm md:text-base text-background-50/75 max-w-xl text-balance leading-relaxed">
          Discover authentic artisan pieces crafted with generations of skill in Pakistan — delivered with care to your home in the United States.
        </p>

        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/products"
            className="whitespace-nowrap bg-background-50 text-foreground-950 text-sm md:text-base font-medium px-8 py-3.5 rounded-full hover:bg-accent-200 transition-colors cursor-pointer"
          >
            Shop the Collection
          </Link>
          <Link
            to="/about"
            className="whitespace-nowrap text-background-50/90 text-sm md:text-base font-medium underline underline-offset-4 decoration-background-50/30 hover:decoration-background-50/70 transition-colors cursor-pointer"
          >
            Discover Our Story
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <span className="block w-6 h-10 border-2 border-background-50/40 rounded-full relative">
            <span className="block w-1.5 h-1.5 bg-background-50/60 rounded-full absolute top-2 left-1/2 -translate-x-1/2 animate-bounce"></span>
          </span>
        </div>
      </div>
    </section>
  );
}