import { useState, useEffect } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  icon: string;
  title: string;
  subtitle: string;
  accentColor: string;
  questions: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    icon: 'ri-shopping-bag-3-line',
    title: 'Ordering & Payment',
    subtitle: 'Everything you need to know about placing and managing your order.',
    accentColor: 'bg-primary-400/50',
    questions: [
      {
        question: 'How do I place an order on GlowKraftee?',
        answer: 'Placing an order is simple and secure. Browse our collection, select the piece that speaks to you, choose any available options, and click "Add to Cart." When you are ready, proceed to checkout and follow the steps to complete your purchase. If you ever get stuck, our support team is just a message away.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit and debit cards including Visa and MasterCard, as well as SafePay — our trusted and secure payment partner. All transactions are fully encrypted and protected for your complete peace of mind.',
      },
      {
        question: 'Can I modify or cancel my order after placing it?',
        answer: 'We begin processing orders quickly to ensure your piece reaches you without delay. If you need to make a change or cancellation, please contact us within 24 hours of placing your order and we will do our very best to accommodate you. After that window, the order may already be in preparation.',
      },
      {
        question: 'Will I receive an order confirmation?',
        answer: 'Yes, absolutely. As soon as your order is placed, you will receive a confirmation email with your order details. Please check your spam or junk folder if it does not appear within a few minutes.',
      },
      {
        question: 'Can I place a bulk or wholesale order?',
        answer: 'Yes! We warmly welcome bulk orders — whether for gifting, interior decoration, corporate purposes, or retail. Please reach out to us directly through our Contact page and we will create a custom arrangement just for you.',
      },
    ],
  },
  {
    icon: 'ri-truck-line',
    title: 'Shipping & Delivery',
    subtitle: 'How your handcrafted piece finds its way to your home.',
    accentColor: 'bg-accent-400/50',
    questions: [
      {
        question: 'Do you ship to the United States and internationally?',
        answer: 'Yes. Our primary market is the United States, and we ship across all 50 states. We also ship to select international destinations. At checkout, simply enter your address and available shipping options will be displayed for your location.',
      },
      {
        question: 'How long does delivery take?',
        answer: 'Because each piece is handcrafted and carefully packaged, please allow some time for love to travel. Standard delivery to the United States typically takes 7 to 14 business days. International orders may take slightly longer depending on destination and customs processes. Expedited options may be available at checkout where applicable.',
      },
      {
        question: 'How much does shipping cost?',
        answer: 'Shipping costs are calculated at checkout based on your location and order size. We strive to keep shipping as affordable as possible, and we occasionally offer free shipping promotions — so keep an eye on our announcements!',
      },
      {
        question: 'How can I track my order?',
        answer: 'Once your order is dispatched, you will receive a shipping confirmation email containing your tracking number and a link to monitor your delivery in real time. If you experience any issues with tracking, please do not hesitate to contact us.',
      },
      {
        question: 'What if my order is delayed or lost in transit?',
        answer: 'While rare, delays can occasionally occur due to customs clearance or courier circumstances beyond our control. If your order has not arrived within the estimated timeframe, please contact us and we will investigate promptly and make it right.',
      },
      {
        question: 'What about taxes and customs duties?',
        answer: 'We have got you fully covered — and this is one of our favourite things to tell customers! For all orders with a product value under USD 800, we absorb all import taxes and customs duties on your behalf. That means your item arrives at your door fully paid — no surprises, no extra charges at delivery. What you see at checkout is all you ever pay.',
      },
    ],
  },
  {
    icon: 'ri-award-line',
    title: 'Products & Authenticity',
    subtitle: 'The truth behind every piece — craftsmanship you can trust.',
    accentColor: 'bg-secondary-400/50',
    questions: [
      {
        question: 'Are all GlowKraftee products genuinely handmade?',
        answer: 'Every single item. We do not stock mass-produced goods. Each piece in our collection is handcrafted by a real artisan — shaped, stitched, carved, or woven by skilled hands carrying traditions passed through generations. When you hold a GlowKraftee piece, you are holding someone\'s life\'s work.',
      },
      {
        question: 'Will my product look exactly like the photo?',
        answer: 'Because everything is made by hand, there may be very slight natural variations in color, pattern, or dimensions from piece to piece. We consider these variations a mark of authenticity — proof that your item is truly one of a kind and not a factory copy. Any significant differences from the listing will always be disclosed.',
      },
      {
        question: 'Are the materials used safe and ethically sourced?',
        answer: 'Absolutely. We are deeply committed to ethical sourcing. Our artisans use natural, traditional, and responsibly obtained materials wherever possible. We care as much about how things are made as we do about how they look.',
      },
      {
        question: 'Can I request a custom or personalized piece?',
        answer: 'We love this question — and the answer is often yes! Many of our artisans are happy to create custom pieces tailored to your preferences. Please reach out to us through the Contact page with your ideas and we will connect you with the right maker.',
      },
    ],
  },
  {
    icon: 'ri-hand-heart-line',
    title: 'Artisan & Mission',
    subtitle: 'Who makes your pieces and how your purchase changes lives.',
    accentColor: 'bg-primary-400/50',
    questions: [
      {
        question: 'Who are the artisans behind GlowKraftee?',
        answer: 'They are extraordinary men and women — many living in economically marginalized communities — who carry within their hands a mastery built over lifetimes and passed down through generations. They are weavers, potters, woodworkers, embroiderers, and more. They are the soul of everything we do, and their stories inspire us every single day.',
      },
      {
        question: 'How does my purchase actually help the artisans?',
        answer: 'Directly and meaningfully. A fair and transparent portion of every sale goes to the artisan who created your piece. This is not charity — it is commerce with conscience. Your purchase funds a livelihood, supports a family, and gives a gifted creator the recognition and reward they have always deserved.',
      },
      {
        question: 'Does GlowKraftee work to preserve endangered crafts?',
        answer: 'Yes, and this is very close to our heart. Many of the traditions our artisans practice are at genuine risk of disappearing as younger generations move away from them due to lack of economic incentive. By creating a sustainable market for these crafts, we give artisans a reason — and a means — to keep their traditions alive and pass them on.',
      },
    ],
  },
  {
    icon: 'ri-arrow-go-back-line',
    title: 'Returns & Refunds',
    subtitle: 'Our commitment to making things right when they are not.',
    accentColor: 'bg-accent-400/50',
    questions: [
      {
        question: 'What is your return policy?',
        answer: 'Your satisfaction matters deeply to us. If your item arrives damaged, defective, or significantly different from what was described, please contact us within 7 days of delivery with photos of the issue and we will arrange a replacement or full refund — no hassle, no hard feelings.',
      },
      {
        question: 'Can I return an item if I simply change my mind?',
        answer: 'Because our products are handcrafted and made to order in many cases, we are unable to accept returns for change of mind. We encourage you to read product descriptions carefully and reach out before purchasing if you have any questions. We are always happy to help you find the perfect piece.',
      },
      {
        question: 'How long does a refund take to process?',
        answer: 'Once your refund is approved, it is typically processed within 5 to 7 business days and returned to your original payment method. You will receive an email confirmation as soon as it is initiated.',
      },
    ],
  },
];

const FAQ_PAGE_SEO = {
  title: 'FAQ — GlowKraftee | Handcrafted Artisan Goods from Pakistan to USA',
  description: 'Find answers to common questions about GlowKraftee handcrafted artisan goods. Learn about ordering, shipping to the USA, product authenticity, our artisan mission, returns, and more. Premium handmade home decor, leather goods, woodcraft, textiles, and folk art delivered worldwide.',
  keywords: 'GlowKraftee FAQ, handcrafted goods shipping, artisan products USA, handmade home decor, Pakistani crafts, leather goods, woodcraft, Kashmiri shawls, macrame, returns and refunds',
  canonical: 'https://glowkraftee.com/faq',
};

function generateFAQPageSchema(): object {
  const mainEntity = faqData.flatMap((category) =>
    category.questions.map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer,
      },
    }))
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
}

function AccordionPanel({ item, isOpen, onToggle, accentColor }: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  accentColor: string;
}) {
  return (
    <div className="border-b border-foreground-100/60 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full text-left py-5 md:py-6 flex items-start gap-4 md:gap-5 group cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className={`shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded-full border transition-colors duration-300 ${
          isOpen
            ? 'border-primary-400 bg-primary-100 text-primary-500'
            : 'border-foreground-200 text-foreground-400 group-hover:border-foreground-300 group-hover:text-foreground-600'
        }`}>
          <i className={`text-xs transition-transform duration-300 ${isOpen ? 'ri-subtract-line' : 'ri-add-line'}`}></i>
        </span>
        <span className={`flex-1 text-sm md:text-base font-medium transition-colors duration-300 ${
          isOpen ? 'text-foreground-950' : 'text-foreground-700 group-hover:text-foreground-900'
        }`}>
          {item.question}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100 pb-5 md:pb-6' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex gap-4 md:gap-5">
          <span className={`shrink-0 w-0.5 self-stretch rounded-full ml-[9px] ${accentColor}`}></span>
          <p className="text-xs md:text-sm text-foreground-500 leading-relaxed pr-2">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQSection({ category }: { category: FAQCategory }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-background-50 py-16 md:py-24">
      <div className="w-full max-w-3xl mx-auto px-4 md:px-6">
        {/* Category header */}
        <div className="flex items-start gap-4 mb-10 md:mb-12">
          <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg bg-background-100">
            <i className={`${category.icon} text-lg md:text-xl text-foreground-600`}></i>
          </div>
          <div>
            <h2 className="font-heading text-xl md:text-2xl font-medium text-foreground-950">
              {category.title}
            </h2>
            <p className="mt-1.5 text-xs md:text-sm text-foreground-400 leading-relaxed">
              {category.subtitle}
            </p>
          </div>
        </div>

        {/* Accordion */}
        <div className="bg-background-50 border border-foreground-100/60 rounded-lg px-4 md:px-6">
          {category.questions.map((item, index) => (
            <AccordionPanel
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => toggleQuestion(index)}
              accentColor={category.accentColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FAQ() {
  useEffect(() => {
    document.title = FAQ_PAGE_SEO.title;

    const setMetaTag = (name: string, content: string, property?: string) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaTag('description', FAQ_PAGE_SEO.description);
    setMetaTag('keywords', FAQ_PAGE_SEO.keywords);
    setMetaTag('og:title', FAQ_PAGE_SEO.title, true);
    setMetaTag('og:description', FAQ_PAGE_SEO.description, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:url', FAQ_PAGE_SEO.canonical, true);
    setMetaTag('twitter:title', FAQ_PAGE_SEO.title);
    setMetaTag('twitter:description', FAQ_PAGE_SEO.description);
    setMetaTag('twitter:card', 'summary_large_image');

    // Inject or update FAQPage schema
    const schemaId = 'faq-page-schema';
    let schemaEl = document.getElementById(schemaId);
    if (!schemaEl) {
      schemaEl = document.createElement('script');
      schemaEl.id = schemaId;
      schemaEl.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaEl);
    }
    schemaEl.textContent = JSON.stringify(generateFAQPageSchema());

    // Set canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', FAQ_PAGE_SEO.canonical);

    return () => {
      // Cleanup schema on unmount
      const el = document.getElementById(schemaId);
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />

      <main>
        {/* ── Hero — Warm editorial hero ── */}
        <section className="relative h-[420px] md:h-[520px] flex items-end pb-14 md:pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Softly%20lit%20artisan%20workshop%20interior%20with%20handcrafted%20wooden%20furniture%20pieces%20leather%20goods%20and%20woven%20textiles%20displayed%20on%20a%20warm%20wooden%20table%20morning%20sunlight%20streaming%20through%20windows%20creating%20gentle%20shadows%20on%20cream%20walls%20organized%20creative%20workspace%20with%20tools%20neatly%20arranged%20earthy%20brown%20cream%20terracotta%20color%20palette%20subtle%20amber%20and%20olive%20accents%20editorial%20interior%20photography%20calm%20and%20inviting%20atmosphere%20high%20detail%20craftsmanship%20visible%20in%20every%20piece&width=2000&height=1200&seq=faq-hero-v2&orientation=landscape"
              alt="A warm artisan workshop — handcrafted pieces bathed in soft morning light, inviting and peaceful"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-8 md:w-12 h-px bg-accent-300/70"></span>
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent-200 font-label">
                  Frequently Asked Questions
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-light text-background-50 leading-[1.08] text-balance">
                We know you may have{' '}
                <span className="italic text-accent-300">questions</span>
              </h1>
              <p className="mt-4 md:mt-5 text-sm md:text-base text-background-100/80 leading-relaxed max-w-lg">
                and we love that. It means you care. Here are the answers to everything our customers most often ask.
              </p>
            </div>
          </div>
        </section>

        {/* ── Editorial Divider ── */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-foreground-200 to-transparent"></div>
        </div>

        {/* ── FAQ Sections ── */}
        {faqData.map((category, catIndex) => (
          <div key={catIndex}>
            <FAQSection category={category} />
            {catIndex < faqData.length - 1 && (
              <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
                <div className="h-px bg-gradient-to-r from-transparent via-foreground-150/50 to-transparent"></div>
              </div>
            )}
          </div>
        ))}

        {/* ── Still Have Questions? — Contact CTA ── */}
        <section className="relative py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Warm%20sunlit%20interior%20of%20a%20peaceful%20modern%20home%20corner%20featuring%20artisan%20handcrafted%20decor%20pieces%20woven%20wall%20hanging%20ceramic%20vase%20leather%20tote%20bag%20and%20carved%20wooden%20bowl%20on%20a%20console%20table%20soft%20natural%20window%20light%20creating%20gentle%20shadows%20on%20plaster%20walls%20cream%20beige%20terracotta%20earth%20tone%20color%20palette%20lifestyle%20interior%20photography%20serene%20contemplative%20atmosphere%20editorial%20style%20with%20shallow%20depth%20of%20field&width=2000&height=1000&seq=faq-cta-v2&orientation=landscape"
              alt="A peaceful home corner adorned with handcrafted artisan pieces — warm, inviting, serene"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/60"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-xl mx-auto text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto flex items-center justify-center rounded-full bg-background-50/15 backdrop-blur-sm mb-8">
                <i className="ri-mail-line text-xl md:text-2xl text-accent-300"></i>
              </div>
              <h2 className="font-heading text-2xl md:text-4xl font-light text-background-50 leading-tight text-balance">
                Still have questions?
              </h2>
              <p className="mt-4 text-xs md:text-sm text-background-100/80 leading-relaxed max-w-md mx-auto">
                We are real people who genuinely care about your experience. If your question is not answered here, please reach out — we would love to hear from you.
              </p>
              <a
                href="mailto:hello@glowkraftee.com"
                className="mt-8 inline-flex items-center gap-2.5 bg-background-50 text-foreground-950 text-sm md:text-base font-medium px-8 py-3.5 rounded-full hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap group"
              >
                <i className="ri-mail-send-line"></i>
                hello@glowkraftee.com
                <span className="w-4 h-4 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <i className="ri-arrow-right-line"></i>
                </span>
              </a>
              <p className="mt-6 text-xs text-background-100/50 font-label italic tracking-wider">
                GlowKraftee — Every question deserves an honest answer. Every customer deserves a great experience.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}