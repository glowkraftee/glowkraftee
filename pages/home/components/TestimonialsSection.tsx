import { testimonials } from '@/mocks/products';
import { useState } from 'react';

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const itemsPerView = 3;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const visible = testimonials.slice(activeIndex, activeIndex + itemsPerView);

  return (
    <section className="bg-background-100 py-16 md:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary-600 font-label mb-3">
            <i className="ri-shining-fill text-[10px]"></i>
            What Our Customers Say
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-foreground-950">
            Loved by <span className="italic font-light text-secondary-500">discerning</span> homes
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-8">
          {visible.map((t, idx) => (
            <div
              key={idx}
              className="bg-background-50 rounded-lg p-6 md:p-7 flex flex-col"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="w-4 h-4 flex items-center justify-center text-accent-500">
                    <i className="ri-star-fill text-sm"></i>
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-foreground-700 leading-relaxed flex-1 mb-5">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-background-200">
                <div className="w-9 h-9 rounded-full bg-secondary-200 flex items-center justify-center">
                  <span className="text-xs font-semibold text-secondary-700">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground-950 font-label">
                    {t.name}
                  </p>
                  <p className="text-xs text-foreground-500">
                    {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nav dots */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                i === activeIndex
                  ? 'bg-primary-500 w-6'
                  : 'bg-foreground-300 hover:bg-foreground-400'
              }`}
              aria-label={`Go to testimonial set ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}