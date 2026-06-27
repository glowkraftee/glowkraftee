import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroSection from './components/HeroSection';
import StorySection from './components/StorySection';
import CollectionsGrid from './components/CollectionsGrid';
import FeaturedProducts from './components/FeaturedProducts';
import TrustBar from './components/TrustBar';
import TestimonialsSection from './components/TestimonialsSection';
import CTABanner from './components/CTABanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />

      <main>
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Trust Bar — early trust signals */}
        <TrustBar />

        {/* 3. Story / Heritage */}
        <StorySection />

        {/* 4. Curated Collections */}
        <CollectionsGrid />

        {/* 5. Featured Products */}
        <section data-product-shop>
          <FeaturedProducts />
        </section>

        {/* 6. Testimonials */}
        <TestimonialsSection />

        {/* 7. CTA Banner */}
        <CTABanner />
      </main>

      <Footer />
    </div>
  );
}