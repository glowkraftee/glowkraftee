import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { CONTACT_EMAIL } from '@/lib/siteConfig';

type NewsletterStatus = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function Footer() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<NewsletterStatus>('idle');
  const [newsletterError, setNewsletterError] = useState('');

  const handleNewsletterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();

    // Bots fill the hidden field; pretend success and do nothing.
    if (honeypot.trim() !== '') {
      setNewsletterStatus('success');
      return;
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setNewsletterError('Please enter a valid email address.');
      setNewsletterStatus('error');
      return;
    }

    setNewsletterStatus('submitting');
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: trimmed, source: 'footer' });

    // 23505 = already subscribed; treat as success.
    if (error && error.code !== '23505') {
      console.error('Newsletter signup failed:', error);
      setNewsletterError('Sorry, something went wrong. Please try again in a moment.');
      setNewsletterStatus('error');
      return;
    }

    setEmail('');
    setNewsletterStatus('success');
  };

  return (
    <footer className="bg-foreground-950 text-background-50">
      {/* Upper Section */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Left — Subscribe */}
          <div className="md:col-span-5">
            <h3 className="font-heading text-3xl md:text-4xl font-light mb-3 text-background-50">
              Stay in the loop
            </h3>
            <p className="text-foreground-300 text-sm leading-relaxed mb-8 max-w-sm">
              Join our newsletter for artisan stories, new collection drops, and exclusive early access.
            </p>
            {newsletterStatus === 'success' ? (
              <div className="flex items-start gap-3 text-sm text-background-50" role="status">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-accent-300/20 text-accent-300 shrink-0">
                  <i className="ri-check-line"></i>
                </span>
                <p className="leading-relaxed">
                  Thank you for subscribing! We'll share artisan stories and new collections with you soon.
                </p>
              </div>
            ) : (
              <form
                id="newsletter-form"
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-3"
                noValidate
              >
                <input
                  type="text"
                  name="website_alt"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="honeypot-field"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (newsletterStatus === 'error') setNewsletterStatus('idle');
                  }}
                  placeholder="Your email address"
                  className="flex-1 bg-transparent border-b border-foreground-600 text-background-50 text-sm py-3 px-1 placeholder:text-foreground-500 focus:outline-none focus:border-accent-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'submitting'}
                  className="whitespace-nowrap bg-background-50 text-foreground-950 text-sm font-medium px-6 py-3 rounded-full hover:bg-accent-200 transition-colors cursor-pointer flex items-center gap-2 justify-center disabled:opacity-60 disabled:cursor-wait"
                >
                  {newsletterStatus === 'submitting' ? 'Subscribing…' : 'Subscribe'}
                  <span className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-arrow-right-line text-sm"></i>
                  </span>
                </button>
              </form>
            )}
            {newsletterStatus === 'error' && newsletterError && (
              <p className="mt-3 text-xs text-red-300" role="alert">{newsletterError}</p>
            )}
          </div>

          {/* Middle — Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-widest text-foreground-400 mb-5 font-label">
              Explore
            </h4>
            <nav className="flex flex-col gap-3">
              <Link to="/products" className="text-sm text-foreground-300 hover:text-accent-300 transition-colors whitespace-nowrap underline decoration-foreground-600/40 underline-offset-4">
                Shop All
              </Link>
              <Link to="/products?category=home-decor" className="text-sm text-foreground-300 hover:text-accent-300 transition-colors whitespace-nowrap underline decoration-foreground-600/40 underline-offset-4">
                Home Decor
              </Link>
              <Link to="/products?category=personalized-gifts" className="text-sm text-foreground-300 hover:text-accent-300 transition-colors whitespace-nowrap underline decoration-foreground-600/40 underline-offset-4">
                Personalized Gifts
              </Link>
              <Link to="/products?category=accessories" className="text-sm text-foreground-300 hover:text-accent-300 transition-colors whitespace-nowrap underline decoration-foreground-600/40 underline-offset-4">
                Accessories
              </Link>
            </nav>
          </div>

          {/* Right — Contact */}
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-widest text-foreground-400 mb-5 font-label">
              Contact
            </h4>
            <div className="space-y-2 text-sm text-foreground-300">
              <p><a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-accent-300 transition-colors">{CONTACT_EMAIL}</a></p>
            </div>
            <div className="mt-8">
              <h4 className="text-xs uppercase tracking-widest text-foreground-400 mb-3 font-label">
                Studio
              </h4>
              <p className="text-sm text-foreground-300 leading-relaxed">
                Gulberg III, Lahore<br />
                Punjab 54660, Pakistan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-foreground-800">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a href="https://instagram.com" target="_blank" rel="nofollow noopener noreferrer" className="text-xs text-foreground-400 hover:text-accent-300 transition-colors whitespace-nowrap underline decoration-foreground-600/40 underline-offset-4">
              Instagram
            </a>
            <a href="https://pinterest.com" target="_blank" rel="nofollow noopener noreferrer" className="text-xs text-foreground-400 hover:text-accent-300 transition-colors whitespace-nowrap underline decoration-foreground-600/40 underline-offset-4">
              Pinterest
            </a>
            <a href="https://facebook.com" target="_blank" rel="nofollow noopener noreferrer" className="text-xs text-foreground-400 hover:text-accent-300 transition-colors whitespace-nowrap underline decoration-foreground-600/40 underline-offset-4">
              Facebook
            </a>
          </div>
          <p className="text-xs text-foreground-500">
            &copy; {new Date().getFullYear()} GlowKraftee. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/faq" className="text-xs text-foreground-400 hover:text-accent-300 transition-colors whitespace-nowrap underline decoration-foreground-600/40 underline-offset-4">
              Shipping Policy
            </Link>
            <a href="#" className="text-xs text-foreground-400 hover:text-accent-300 transition-colors whitespace-nowrap underline decoration-foreground-600/40 underline-offset-4">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}