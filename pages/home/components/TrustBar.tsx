import { trustBadges } from '@/mocks/products';

export default function TrustBar() {
  return (
    <section className="bg-background-50 py-12 md:py-16 border-y border-background-200">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustBadges.map((badge) => (
            <div key={badge.title} className="flex flex-col items-center text-center gap-2">
              <span className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-accent-100/80 text-accent-600 mb-1">
                <i className={`${badge.icon} text-xl md:text-2xl`}></i>
              </span>
              <h4 className="text-sm md:text-base font-medium text-foreground-950 font-label">
                {badge.title}
              </h4>
              <p className="text-xs md:text-sm text-foreground-500 leading-relaxed max-w-[180px]">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}