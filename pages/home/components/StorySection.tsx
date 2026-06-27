export default function StorySection() {
  return (
    <section className="bg-background-100 py-16 md:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          {/* Left — Label */}
          <div className="lg:w-[30%] shrink-0">
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-foreground-400 font-label">
              / Our Heritage
            </p>
          </div>

          {/* Right — Content */}
          <div className="flex-1">
            <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-light leading-snug text-foreground-950 text-balance">
              Every piece carries the{' '}
              <span className="italic text-primary-500">soul of its maker</span>
              — a story shaped by hands that have perfected their craft across generations.
            </h2>

            <div className="mt-12 flex flex-col sm:flex-row items-start gap-8">
              {/* Avatars */}
              <div className="flex items-center -space-x-3 shrink-0">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-background-50 overflow-hidden bg-foreground-800">
                  <img
                    src="https://readdy.ai/api/search-image?query=Portrait%20of%20Pakistani%20artisan%20craftsperson%20working%20with%20clay%20in%20warm%20natural%20light%2C%20hands%20shaping%20pottery%2C%20earthy%20neutral%20tones%2C%20intimate%20closeup%2C%20warm%20brown%20background%2C%20authentic%20genuine%20expression&width=100&height=100&seq=glowkraftee-artisan-1&orientation=squarish"
                    alt="GlowKraftee artisan crafting pottery"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-background-50 overflow-hidden bg-foreground-800">
                  <img
                    src="https://readdy.ai/api/search-image?query=Portrait%20of%20Pakistani%20textile%20weaver%20at%20wooden%20loom%20in%20soft%20golden%20light%2C%20hands%20weaving%20fabric%2C%20warm%20neutral%20colors%2C%20intimate%20portrait%2C%20earthy%20background%2C%20authentic%20craftsmanship%20scene&width=100&height=100&seq=glowkraftee-artisan-2&orientation=squarish"
                    alt="GlowKraftee artisan weaving textiles"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-background-50 overflow-hidden bg-foreground-800">
                  <img
                    src="https://readdy.ai/api/search-image?query=Portrait%20of%20Pakistani%20leather%20artisan%20working%20on%20handcrafted%20journal%20in%20warm%20studio%20light%2C%20focused%20expression%2C%20earthy%20brown%20tones%2C%20intimate%20closeup%2C%20authentic%20artisan%20workshop%20atmosphere&width=100&height=100&seq=glowkraftee-artisan-3&orientation=squarish"
                    alt="GlowKraftee artisan crafting leather goods"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-background-50 overflow-hidden bg-foreground-800">
                  <img
                    src="https://readdy.ai/api/search-image?query=Portrait%20of%20Pakistani%20wood%20carver%20at%20workbench%20in%20warm%20natural%20light%2C%20hands%20carving%20wood%2C%20earthy%20neutral%20colors%2C%20intimate%20closeup%20portrait%2C%20authentic%20artisan%20expression&width=100&height=100&seq=glowkraftee-artisan-4&orientation=squarish"
                    alt="GlowKraftee artisan wood carving"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <p className="text-sm md:text-base text-foreground-600 leading-relaxed max-w-md">
                From our family workshop in Lahore to your home — each piece is thoughtfully designed, patiently crafted, and personally inspected before it begins its journey to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}