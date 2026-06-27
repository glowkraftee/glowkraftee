import { Link } from 'react-router-dom';

export default function Footer() {
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
            <form
              data-readdy-form
              id="newsletter-form"
              action="https://readdy.ai/api/form/d8t08vob9jno5e72bft0"
              method="POST"
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                name="website_alt"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="honeypot-field"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="Your email address"
                className="flex-1 bg-transparent border-b border-foreground-600 text-background-50 text-sm py-3 px-1 placeholder:text-foreground-500 focus:outline-none focus:border-accent-400 transition-colors"
              />
              <button
                type="submit"
                className="whitespace-nowrap bg-background-50 text-foreground-950 text-sm font-medium px-6 py-3 rounded-full hover:bg-accent-200 transition-colors cursor-pointer flex items-center gap-2 justify-center"
              >
                Subscribe
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-arrow-right-line text-sm"></i>
                </span>
              </button>
            </form>
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
              <p>hello@glowkraftee.com</p>
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