import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />

      <main>
        {/* ── Hero — Full-bleed editorial hero ── */}
        <section className="relative h-screen max-h-[720px] flex items-end pb-16 md:pb-24 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Elderly%20Pakistani%20artisan%20hands%20closeup%20carefully%20carving%20intricate%20geometric%20patterns%20into%20rich%20dark%20Sheesham%20wood%20block%2C%20warm%20golden%20side%20light%20illuminating%20wood%20grain%20and%20weathered%20hands%2C%20shallow%20depth%20of%20field%2C%20earthy%20brown%20and%20warm%20cream%20tonal%20palette%2C%20editorial%20documentary%20photography%20with%20emotional%20resonance%2C%20quiet%20contemplative%20atmosphere&width=2000&height=1400&seq=about-hero-v2&orientation=landscape"
              alt="Artisan hands carving intricate geometric patterns into Sheesham wood — generations of mastery in every stroke"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/15"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-8 md:w-12 h-px bg-accent-300/70"></span>
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent-200 font-label">
                  About GlowKraftee
                </span>
              </div>
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-light text-background-50 leading-[1.05] text-balance">
                Where every purchase tells a{' '}
                <span className="italic text-accent-300">story worth telling</span>
              </h1>
            </div>
          </div>
        </section>

        {/* ── Opening — Large statement ── */}
        <section className="bg-background-50 py-20 md:py-32">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <p className="font-heading text-2xl md:text-4xl lg:text-5xl font-light text-foreground-950 leading-snug text-balance">
                We believe that beauty should do more than decorate a space —
              </p>
              <p className="font-heading text-2xl md:text-4xl lg:text-5xl font-light text-primary-500 italic leading-snug text-balance mt-2">
                it should change a life.
              </p>
              <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                <p className="text-sm md:text-base text-foreground-600 leading-relaxed">
                  We are more than an online store. We are a bridge — stretching across oceans and generations — connecting the extraordinary hands of marginalized artisans to the warm homes of appreciative souls around the world, especially across the United States.
                </p>
                <p className="text-sm md:text-base text-foreground-500 leading-relaxed">
                  Every piece in our collection carries the weight of tradition, the patience of human hands, and a quiet dignity that no factory can replicate. This is craft at its most honest.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Editorial Divider ── */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-foreground-200 to-transparent"></div>
        </div>

        {/* ── Our Story — Large image + text ── */}
        <section className="bg-background-50 py-20 md:py-32">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
              {/* Image — left */}
              <div className="w-full lg:w-1/2">
                <div className="relative h-[400px] md:h-[560px] w-full rounded-lg overflow-hidden">
                  <img
                    src="https://readdy.ai/api/search-image?query=Pakistani%20textile%20weaver%20woman%20at%20traditional%20wooden%20loom%20in%20intimate%20workshop%2C%20hands%20delicately%20threading%20natural%20cream%20cotton%20yarn%2C%20soft%20window%20light%20creating%20gentle%20shadows%2C%20earthy%20neutral%20palette%2C%20contemplative%20expression%2C%20editorial%20portrait%20photography%20with%20shallow%20depth%20of%20field%2C%20quiet%20dignity%20and%20grace&width=1200&height=1600&seq=about-story-weaver-v2&orientation=portrait"
                    alt="Textile weaver at traditional loom — threading natural cotton yarn with quiet grace"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

              {/* Text — right */}
              <div className="w-full lg:w-1/2 lg:pl-4">
                <div className="flex items-center gap-3 mb-8">
                  <span className="block w-6 h-px bg-primary-400/60"></span>
                  <span className="text-xs uppercase tracking-[0.25em] text-foreground-400 font-label">
                    Our Story
                  </span>
                </div>
                <p className="text-sm md:text-base text-foreground-600 leading-relaxed">
                  Hidden in the quiet corners of communities far from the spotlight, there exist masters of their craft. Men and women whose hands carry the memory of generations — weaving, carving, stitching, and shaping with a precision and soul that no machine can replicate.
                </p>
                <p className="mt-6 text-sm md:text-base text-foreground-600 leading-relaxed">
                  These are not hobbyists. These are <strong className="text-foreground-950 font-medium">living legends</strong> of their traditions. Yet many of them live in hardship. Their art, priceless by any cultural measure, often goes unseen, undervalued, and at risk of disappearing forever.
                </p>
                <p className="mt-6 font-heading text-xl md:text-2xl font-light text-primary-500 italic leading-relaxed">
                  GlowKraftee was born to change that.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Full-width editorial image break ── */}
        <section className="relative h-[350px] md:h-[500px] overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=Extreme%20closeup%20of%20multiple%20pairs%20of%20artisan%20hands%20working%20simultaneously%20on%20different%20crafts%20wood%20carving%20leather%20tooling%20textile%20weaving%20arranged%20as%20editorial%20composition%2C%20warm%20golden%20light%2C%20earthy%20brown%20and%20cream%20tones%2C%20celebration%20of%20human%20craftsmanship%2C%20magazine%20editorial%20photography%2C%20emotional%20warmth&width=2000&height=1000&seq=about-hands-wide-v2&orientation=landscape"
            alt="A celebration of human hands — wood carving, leather tooling, and textile weaving in harmony"
            className="w-full h-full object-cover object-center"
          />
        </section>

        {/* ── Editorial Divider ── */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-foreground-200 to-transparent"></div>
        </div>

        {/* ── What We Do — Three pillars ── */}
        <section className="bg-background-50 py-20 md:py-32">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-14">
                <span className="block w-6 h-px bg-accent-400/60"></span>
                <span className="text-xs uppercase tracking-[0.25em] text-foreground-400 font-label">
                  What We Do
                </span>
              </div>

              <p className="text-sm md:text-base text-foreground-600 leading-relaxed max-w-2xl">
                We seek out gifted creators — artisans whose generational talents have never had a modern marketplace to call home — and we give them one. From our base, we showcase the absolute pinnacle of their skill.
              </p>

              {/* Three craft columns */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                {/* Wood */}
                <div>
                  <div className="relative h-[320px] md:h-[380px] w-full rounded-lg overflow-hidden mb-6">
                    <img
                      src="https://readdy.ai/api/search-image?query=Closeup%20of%20hand%20carving%20intricate%20floral%20geometric%20pattern%20into%20dark%20rich%20Sheesham%20wood%20surface%2C%20carving%20tool%20visible%2C%20wood%20shavings%20scattered%2C%20warm%20directional%20light%20highlighting%20texture%20and%20depth%2C%20earthy%20brown%20tones%2C%20editorial%20craftsmanship%20photography%2C%20intimate%20detail&width=800&height=1000&seq=about-wood-closeup-v2&orientation=portrait"
                      alt="Closeup of hand carving intricate geometric patterns into Sheesham wood"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-accent-600 font-label">
                    01
                  </span>
                  <h3 className="font-heading text-xl md:text-2xl font-medium text-foreground-950 mt-2 mb-3">
                    Hand-Carved Wood
                  </h3>
                  <p className="text-xs md:text-sm text-foreground-500 leading-relaxed">
                    Intricate precision geometry carved into Sheesham. Furniture and chess sets shaped by generational mastery — each piece bearing the unmistakable mark of human hands.
                  </p>
                </div>

                {/* Leather */}
                <div>
                  <div className="relative h-[320px] md:h-[380px] w-full rounded-lg overflow-hidden mb-6">
                    <img
                      src="https://readdy.ai/api/search-image?query=Artisan%20hands%20carefully%20tooling%20and%20embossing%20intricate%20pattern%20into%20rich%20cognac%20brown%20leather%20surface%2C%20leatherworking%20tools%20on%20wooden%20workbench%2C%20warm%20natural%20side%20light%2C%20visible%20leather%20grain%20texture%2C%20earthy%20warm%20tones%2C%20editorial%20craftsmanship%20photography%2C%20intimate%20detail%20shot&width=800&height=1000&seq=about-leather-closeup-v2&orientation=portrait"
                      alt="Artisan hands embossing intricate patterns into premium cognac leather"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-accent-600 font-label">
                    02
                  </span>
                  <h3 className="font-heading text-xl md:text-2xl font-medium text-foreground-950 mt-2 mb-3">
                    Premium Leather
                  </h3>
                  <p className="text-xs md:text-sm text-foreground-500 leading-relaxed">
                    Rich textures and embossed artistry. Totes and leatherwear crafted to last lifetimes — each stitch placed with intention, each hide selected for character.
                  </p>
                </div>

                {/* Textiles */}
                <div>
                  <div className="relative h-[320px] md:h-[380px] w-full rounded-lg overflow-hidden mb-6">
                    <img
                      src="https://readdy.ai/api/search-image?query=Artisan%20hands%20carefully%20tying%20intricate%20macrame%20knots%20into%20natural%20cream%20cotton%20rope%20pattern%2C%20partially%20completed%20woven%20textile%20hanging%20visible%2C%20soft%20diffused%20natural%20light%2C%20earthy%20cream%20and%20warm%20beige%20tones%2C%20editorial%20craftsmanship%20photography%2C%20intimate%20detail%20of%20delicate%20handwork&width=800&height=1000&seq=about-macrame-closeup-v2&orientation=portrait"
                      alt="Artisan hands tying intricate macrame knots in natural cotton rope"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-accent-600 font-label">
                    03
                  </span>
                  <h3 className="font-heading text-xl md:text-2xl font-medium text-foreground-950 mt-2 mb-3">
                    Woven Textiles
                  </h3>
                  <p className="text-xs md:text-sm text-foreground-500 leading-relaxed">
                    Rhythmic knots and delicate weaves. Macrame swings and textiles woven with patience — each knot a meditation, each piece a quiet triumph of dedication.
                  </p>
                </div>
              </div>

              {/* Three values callout */}
              <div className="mt-20 p-8 md:p-12 bg-background-100 rounded-lg">
                <p className="font-heading text-lg md:text-xl font-light text-foreground-950 text-balance mb-10">
                  Every product in our collection is the result of authentic, handcrafted effort by real people with real stories. When you shop with us, you are:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="flex gap-4">
                    <span className="shrink-0 w-1 h-full min-h-[60px] bg-primary-400/50 rounded-full"></span>
                    <div>
                      <h4 className="font-heading text-base font-medium text-foreground-950 mb-2">
                        Empowering
                      </h4>
                      <p className="text-xs md:text-sm text-foreground-500 leading-relaxed">
                        A maker earns a dignified livelihood from their God-given talent.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="shrink-0 w-1 h-full min-h-[60px] bg-accent-400/50 rounded-full"></span>
                    <div>
                      <h4 className="font-heading text-base font-medium text-foreground-950 mb-2">
                        Preserving
                      </h4>
                      <p className="text-xs md:text-sm text-foreground-500 leading-relaxed">
                        A tradition that might otherwise fade into history endures another generation.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="shrink-0 w-1 h-full min-h-[60px] bg-secondary-400/50 rounded-full"></span>
                    <div>
                      <h4 className="font-heading text-base font-medium text-foreground-950 mb-2">
                        Bringing Home
                      </h4>
                      <p className="text-xs md:text-sm text-foreground-500 leading-relaxed">
                        Genuine artistry that carries heart, heritage, and humanity into your space.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Editorial Divider ── */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-foreground-200 to-transparent"></div>
        </div>

        {/* ── Our Mission — Sacred threefold ── */}
        <section className="bg-background-50 py-20 md:py-32">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-14">
                <span className="block w-6 h-px bg-primary-400/60"></span>
                <span className="text-xs uppercase tracking-[0.25em] text-foreground-400 font-label">
                  Our Mission
                </span>
              </div>

              <p className="font-heading text-xl md:text-2xl font-light text-foreground-950 text-balance mb-16">
                Our mission is threefold —{' '}
                <span className="italic text-primary-500">and we hold it sacred.</span>
              </p>

              <div className="space-y-16 md:space-y-20">
                {/* Uplift */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-14 items-start">
                  <div className="shrink-0">
                    <span className="font-heading text-6xl md:text-7xl font-light text-primary-200 leading-none">
                      01
                    </span>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-heading text-2xl md:text-3xl font-light text-foreground-950 mb-4">
                      Uplift
                    </h3>
                    <p className="text-sm md:text-base text-foreground-600 leading-relaxed max-w-lg">
                      To raise the economic standing of skilled but vulnerable artisans who have long been overlooked by the global marketplace — giving them not charity, but dignified opportunity.
                    </p>
                  </div>
                </div>

                {/* Connect */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-14 items-start">
                  <div className="shrink-0">
                    <span className="font-heading text-6xl md:text-7xl font-light text-accent-200 leading-none">
                      02
                    </span>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-heading text-2xl md:text-3xl font-light text-foreground-950 mb-4">
                      Connect
                    </h3>
                    <p className="text-sm md:text-base text-foreground-600 leading-relaxed max-w-lg">
                      To create a meaningful, lasting relationship between the maker and the buyer — built on authenticity, transparency, and shared values that transcend borders.
                    </p>
                  </div>
                </div>

                {/* Preserve */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-14 items-start">
                  <div className="shrink-0">
                    <span className="font-heading text-6xl md:text-7xl font-light text-secondary-200 leading-none">
                      03
                    </span>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-heading text-2xl md:text-3xl font-light text-foreground-950 mb-4">
                      Preserve
                    </h3>
                    <p className="text-sm md:text-base text-foreground-600 leading-relaxed max-w-lg">
                      To ensure that the world's most breathtaking craft traditions do not vanish with time, but instead find new life in homes that truly appreciate them.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mission image — community gathering */}
              <div className="mt-20 rounded-lg overflow-hidden">
                <div className="relative h-[320px] md:h-[480px] w-full">
                  <img
                    src="https://readdy.ai/api/search-image?query=Pakistani%20artisan%20community%20gathered%20in%20sunlit%20workshop%20courtyard%2C%20multiple%20generations%20men%20women%20elders%20working%20alongside%20each%20other%20on%20various%20handicrafts%2C%20warm%20golden%20evening%20sunlight%2C%20terracotta%20walls%20and%20natural%20textures%2C%20atmosphere%20of%20quiet%20collaboration%20and%20shared%20heritage%2C%20editorial%20documentary%20photography%2C%20deeply%20human%20and%20emotional&width=1600&height=900&seq=about-community-v2&orientation=landscape"
                    alt="Generations of artisans working together in sunlit courtyard — community, heritage, dignity"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <p className="mt-4 text-xs text-foreground-400 italic text-center">
                  Community at the heart of everything — artisans, makers, and appreciators alike.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Editorial Divider ── */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-foreground-200 to-transparent"></div>
        </div>

        {/* ── Why It Matters — Closing statement ── */}
        <section className="bg-background-50 py-20 md:py-32">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-14">
                <span className="block w-6 h-px bg-secondary-400/60"></span>
                <span className="text-xs uppercase tracking-[0.25em] text-foreground-400 font-label">
                  Why It Matters
                </span>
              </div>

              <p className="font-heading text-2xl md:text-3xl lg:text-4xl font-light text-foreground-950 leading-snug text-balance">
                Every civilization leaves behind its art. Generations from now, what remains of today's handcraft traditions will depend on the choices we make{' '}
                <span className="italic text-primary-500">right now</span> — as buyers, as communities, as human beings.
              </p>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
                <p className="text-sm md:text-base text-foreground-600 leading-relaxed">
                  At GlowKraftee, we refuse to let these traditions slip away quietly. We believe that skilled hands deserve fair reward, that ancient crafts deserve modern audiences, and that your home deserves something genuinely extraordinary.
                </p>
                <p className="text-sm md:text-base text-foreground-500 leading-relaxed">
                  Every piece you bring into your home carries more than beauty — it carries the weight of heritage, the warmth of human connection, and the quiet pride of a maker who knows their work is valued across the world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Join the Movement — Full-bleed editorial CTA ── */}
        <section className="relative py-24 md:py-40 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Beautiful%20sunlit%20interior%20of%20warm%20modern%20home%20featuring%20handcrafted%20artisan%20decor%20pieces%20wooden%20furniture%20woven%20textiles%20leather%20accessories%20thoughtfully%20arranged%2C%20golden%20natural%20window%20light%2C%20earthy%20cream%20terracotta%20brown%20color%20palette%2C%20lifestyle%20interior%20photography%2C%20peaceful%20inviting%20atmosphere%2C%20editorial%20style&width=2000&height=1000&seq=about-cta-home-v2&orientation=landscape"
              alt="A warm modern home filled with handcrafted artisan decor — beauty with purpose"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/60"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-light text-background-50 leading-tight text-balance">
                You choose{' '}
                <span className="italic text-accent-300">more than a product</span>.
                <br />
                You choose{' '}
                <span className="text-accent-200">purpose</span>.
              </h2>
              <p className="mt-8 text-sm md:text-base text-background-100/80 leading-relaxed">
                You restore dignity to a craftsperson. You keep a heritage alive. You bring into your home not just something beautiful — but something meaningful.
              </p>
              <Link
                to="/products"
                className="mt-12 inline-flex items-center gap-3 bg-accent-400 text-foreground-950 text-sm md:text-base font-medium px-10 py-4 rounded-full hover:bg-accent-300 transition-colors cursor-pointer whitespace-nowrap group"
              >
                Shop the Collection
                <span className="w-4 h-4 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <i className="ri-arrow-right-line"></i>
                </span>
              </Link>
              <p className="mt-5 text-xs text-background-100/50 font-label italic tracking-wider">
                Light up the World, One Handcrafted Piece at a Time
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}