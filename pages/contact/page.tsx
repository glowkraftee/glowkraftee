import { useState, FormEvent } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

type InquiryType = 'General Inquiry' | 'Custom Design Request' | 'Bulk / Wholesale Order';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const CONTACT_FORM_SEO = {
  submitAddr: 'https://readdy.ai/api/form/d8uip4gu8fvptuidq02g',
  title: 'Contact — GlowKraftee | Reach Out for Handcrafted Artisan Goods',
  description: 'Get in touch with GlowKraftee for support, bulk orders, wholesale inquiries, or custom artisan collaborations. We craft premium handcrafted home decor, leather goods, woodcraft, textiles, and folk art. We would love to hear from you.',
  keywords: 'contact GlowKraftee, handcrafted artisan goods, custom design request, bulk wholesale order, Pakistani crafts, leather goods, woodcraft inquiries',
  canonical: 'https://glowkraftee.com/contact',
};

const inquiryOptions: { value: InquiryType; label: string; description: string }[] = [
  {
    value: 'General Inquiry',
    label: 'General Inquiry',
    description: 'Questions about products, orders, shipping, or anything else on your mind.',
  },
  {
    value: 'Custom Design Request',
    label: 'Custom Design Request',
    description: 'Work with our artisans on a bespoke piece tailored just for you.',
  },
  {
    value: 'Bulk / Wholesale Order',
    label: 'Bulk / Wholesale Order',
    description: 'Gifting, corporate, interior decoration, or retail — we will create a custom arrangement.',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    inquiryType: '' as InquiryType | '',
    subject: '',
    message: '',
    honeypot: '',
  });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  // SEO injection
  useState(() => {
    document.title = CONTACT_FORM_SEO.title;

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

    setMetaTag('description', CONTACT_FORM_SEO.description);
    setMetaTag('keywords', CONTACT_FORM_SEO.keywords);
    setMetaTag('og:title', CONTACT_FORM_SEO.title, true);
    setMetaTag('og:description', CONTACT_FORM_SEO.description, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:url', CONTACT_FORM_SEO.canonical, true);
    setMetaTag('twitter:title', CONTACT_FORM_SEO.title);
    setMetaTag('twitter:description', CONTACT_FORM_SEO.description);
    setMetaTag('twitter:card', 'summary_large_image');

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', CONTACT_FORM_SEO.canonical);
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    // Honeypot check — silently reject bots
    if (formData.honeypot.trim() !== '') {
      // Pretend success so bots get no signal
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 4000);
      return;
    }

    const body = new URLSearchParams();
    body.append('fullName', formData.fullName.trim());
    body.append('email', formData.email.trim());
    body.append('inquiryType', formData.inquiryType);
    body.append('subject', formData.subject.trim());
    body.append('message', formData.message.trim());

    try {
      const res = await fetch(CONTACT_FORM_SEO.submitAddr, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ fullName: '', email: '', inquiryType: '', subject: '', message: '', honeypot: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />

      <main>
        {/* ── Hero — Full-bleed editorial hero ── */}
        <section className="relative h-[420px] md:h-[560px] flex items-end pb-14 md:pb-24 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Warm%20sunlit%20artisan%20workspace%20interior%20with%20handcrafted%20goods%20on%20display%20leather%20bags%20woven%20textiles%20carved%20wood%20pieces%20arranged%20on%20a%20large%20wooden%20table%20morning%20light%20streaming%20through%20windows%20creating%20soft%20highlights%20on%20cream%20plaster%20walls%20terracotta%20accents%20scattered%20throughout%20the%20room%20peaceful%20creative%20atmosphere%20organized%20yet%20lived-in%20feel%20editorial%20interior%20photography%20with%20natural%20warmth%20earth%20tone%20palette%20beige%20brown%20cream%20amber%20olive%20tones%20inviting%20and%20human%20centered%20composition&width=2000&height=1200&seq=contact-hero-v1&orientation=landscape"
              alt="Artisan workspace bathed in warm morning light — handcrafted pieces, leather, and textiles in peaceful arrangement"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="block w-8 md:w-12 h-px bg-accent-300/70"></span>
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent-200 font-label">
                  Get in Touch
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-light text-background-50 leading-[1.08] text-balance">
                Let us make something{' '}
                <span className="italic text-accent-300">beautiful</span> together
              </h1>
              <p className="mt-4 md:mt-5 text-sm md:text-base text-background-100/80 leading-relaxed max-w-lg">
                Whether you have a question, a custom design in mind, or a bulk order to discuss — we are all ears. Every message lands in a real human inbox.
              </p>
            </div>
          </div>
        </section>

        {/* ── Editorial Divider ── */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-foreground-200 to-transparent"></div>
        </div>

        {/* ── Contact Form + Info ── */}
        <section className="bg-background-50 py-16 md:py-28">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-14 lg:gap-24">
              {/* Left — Form */}
              <div className="w-full lg:w-7/12">
                <form
                  data-readdy-form
                  id="contact-form"
                  action={CONTACT_FORM_SEO.submitAddr}
                  method="POST"
                  onSubmit={handleSubmit}
                  className="space-y-7"
                >
                  {/* Honeypot — anti-spam */}
                  <input
                    type="text"
                    name="phone_alt"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="honeypot-field"
                    value={formData.honeypot}
                    onChange={(e) => setFormData((prev) => ({ ...prev, honeypot: e.target.value }))}
                  />

                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Your full name"
                      className="w-full bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors"
                    />
                  </div>

                  {/* Inquiry Type — styled dropdown */}
                  <div>
                    <label htmlFor="inquiryType" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                      Inquiry Type
                    </label>
                    <div className="relative">
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        required
                        value={formData.inquiryType}
                        onChange={(e) => setFormData((prev) => ({ ...prev, inquiryType: e.target.value as InquiryType }))}
                        className="w-full appearance-none bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 focus:outline-none focus:border-primary-400 transition-colors cursor-pointer"
                      >
                        <option value="" disabled>
                          Select an inquiry type
                        </option>
                        {inquiryOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none text-foreground-300">
                        <i className="ri-arrow-down-s-line text-sm"></i>
                      </span>
                    </div>
                    {formData.inquiryType && (
                      <p className="mt-2 text-xs text-foreground-400 leading-relaxed">
                        {inquiryOptions.find((o) => o.value === formData.inquiryType)?.description}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="What is this about?"
                      className="w-full bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs uppercase tracking-[0.15em] text-foreground-400 font-label mb-2.5">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      maxLength={500}
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell us what is on your mind — the more detail the better..."
                      className="w-full bg-transparent border-b border-foreground-200 text-foreground-950 text-sm py-3.5 px-1 placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors resize-none"
                    ></textarea>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[11px] text-foreground-300">
                        {formData.message.length} / 500
                      </span>
                      {formData.message.length > 450 && (
                        <span className="text-[11px] text-primary-500">
                          Approaching limit
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitStatus === 'submitting'}
                      className="inline-flex items-center gap-3 bg-primary-500 text-background-50 text-sm md:text-base font-medium px-10 py-4 rounded-full hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed group"
                    >
                      {submitStatus === 'submitting' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-background-50/30 border-t-background-50 rounded-full animate-spin"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <span className="w-4 h-4 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                            <i className="ri-send-plane-line"></i>
                          </span>
                        </>
                      )}
                    </button>

                    {/* Status feedback */}
                    {submitStatus === 'success' && (
                      <div className="mt-4 flex items-center gap-3 text-sm text-secondary-700 bg-secondary-100/60 rounded-lg px-5 py-3.5">
                        <span className="w-5 h-5 flex items-center justify-center shrink-0">
                          <i className="ri-checkbox-circle-line"></i>
                        </span>
                        <span>Thank you! Your message has been sent. We will get back to you within 24 hours.</span>
                      </div>
                    )}
                    {submitStatus === 'error' && (
                      <div className="mt-4 flex items-center gap-3 text-sm text-primary-700 bg-primary-100/60 rounded-lg px-5 py-3.5">
                        <span className="w-5 h-5 flex items-center justify-center shrink-0">
                          <i className="ri-error-warning-line"></i>
                        </span>
                        <span>Something went wrong. Please try again or email us directly at hello@glowkraftee.com.</span>
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Right — Contact info sidebar */}
              <div className="w-full lg:w-5/12 lg:pt-2">
                <div className="lg:sticky lg:top-28 space-y-12">

                  {/* Email card */}
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-300 font-label">
                      Write to Us
                    </span>
                    <a
                      href="mailto:hello@glowkraftee.com"
                      className="mt-4 flex items-center gap-3 group cursor-pointer"
                    >
                      <span className="shrink-0 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-background-100">
                        <i className="ri-mail-line text-lg md:text-xl text-foreground-600"></i>
                      </span>
                      <span className="font-heading text-xl md:text-2xl font-light text-foreground-950 group-hover:text-primary-500 transition-colors">
                        hello@glowkraftee.com
                      </span>
                    </a>
                    <p className="mt-3 pl-[3.75rem] text-xs md:text-sm text-foreground-400 leading-relaxed">
                      Every message lands in a real human inbox — no bots, no ticket systems. We read and reply to everything personally.
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-foreground-100"></div>

                  {/* What to expect */}
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-300 font-label">
                      What to Expect
                    </span>
                    <div className="mt-4 space-y-4">
                      <div className="flex gap-3">
                        <span className="shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-secondary-100">
                          <i className="ri-time-line text-xs text-secondary-600"></i>
                        </span>
                        <div>
                          <h4 className="text-sm font-medium text-foreground-950 mb-1">Response within 24 hours</h4>
                          <p className="text-xs text-foreground-400 leading-relaxed">
                            We pride ourselves on fast, thoughtful replies — you will not be left waiting.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-accent-100">
                          <i className="ri-user-heart-line text-xs text-accent-600"></i>
                        </span>
                        <div>
                          <h4 className="text-sm font-medium text-foreground-950 mb-1">A real person, always</h4>
                          <p className="text-xs text-foreground-400 leading-relaxed">
                            No automated responses. Every message is read and answered by someone who genuinely cares.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-primary-100">
                          <i className="ri-lightbulb-line text-xs text-primary-600"></i>
                        </span>
                        <div>
                          <h4 className="text-sm font-medium text-foreground-950 mb-1">Custom requests welcome</h4>
                          <p className="text-xs text-foreground-400 leading-relaxed">
                            Got a specific vision? Share it. We love connecting you with the right artisan to bring it to life.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-foreground-100"></div>

                  {/* Studio address */}
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-300 font-label">
                      Our Studio
                    </span>
                    <div className="mt-4">
                      <div className="flex gap-3">
                        <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                          <i className="ri-map-pin-line text-foreground-400"></i>
                        </span>
                        <div>
                          <p className="text-sm text-foreground-600 leading-relaxed">
                            Gulberg III, Lahore<br />
                            Punjab 54660, Pakistan
                          </p>
                        </div>
                      </div>
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

        {/* ── Closing — Warm editorial CTA ── */}
        <section className="relative py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Warm%20inviting%20modern%20living%20room%20interior%20bathed%20in%20golden%20late%20afternoon%20sunlight%20featuring%20handcrafted%20artisan%20decor%20pieces%20woven%20wall%20hanging%20macrame%20textile%20ceramic%20vessels%20and%20carved%20wooden%20furniture%20arranged%20harmoniously%20on%20wooden%20surfaces%20cream%20beige%20terracotta%20earth%20tone%20color%20palette%20peaceful%20serene%20atmosphere%20lifestyle%20interior%20photography%20with%20soft%20natural%20window%20light%20and%20gentle%20shadows%20editorial%20quality&width=2000&height=1000&seq=contact-cta-v1&orientation=landscape"
              alt="A warm inviting living room filled with handcrafted artisan decor — golden afternoon light, peaceful and welcoming"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/60"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="font-heading text-2xl md:text-4xl font-light text-background-50 leading-tight text-balance">
                Real people.{' '}
                <span className="italic text-accent-300">Real craft.</span>
                <br />
                Real conversations.
              </h2>
              <p className="mt-5 text-xs md:text-sm text-background-100/80 leading-relaxed max-w-md mx-auto">
                We are here because we love what we do — and we love connecting with people who appreciate it. Do not overthink it. Just say hello.
              </p>
              <p className="mt-6 text-xs text-background-100/50 font-label italic tracking-wider">
                GlowKraftee — Light up the World, One Handcrafted Piece at a Time
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}