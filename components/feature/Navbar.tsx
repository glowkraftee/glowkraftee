import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import MiniCart from '@/components/feature/MiniCart';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  { label: 'Our Story', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Orders', href: '/orders' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background-50/95 backdrop-blur-md border-b border-background-200/70'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="font-heading text-2xl md:text-3xl font-semibold tracking-wide whitespace-nowrap"
            style={{
              color: scrolled
                ? 'oklch(var(--foreground-950))'
                : 'oklch(1 0 0)',
              textShadow: scrolled ? 'none' : '0 1px 4px rgba(0,0,0,0.3)',
            }}
          >
            GlowKraftee
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 hover:text-accent-400 ${
                  scrolled
                    ? 'text-foreground-700'
                    : 'text-white/90'
                } ${
                  location.pathname === link.href
                    ? scrolled
                      ? 'text-primary-500'
                      : 'text-accent-300'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setCartOpen(true)}
              className={`relative flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                scrolled ? 'text-foreground-700 hover:text-primary-500' : 'text-white/90 hover:text-accent-300'
              }`}
              aria-label="Open cart"
            >
              <span className="relative w-5 h-5 flex items-center justify-center">
                <i className="ri-shopping-bag-line"></i>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-primary-500 text-background-50 text-[10px] font-bold rounded-full">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </span>
              Cart
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md"
            aria-label="Toggle menu"
            style={{ color: scrolled ? 'oklch(var(--foreground-950))' : 'white' }}
          >
            <i className={`text-xl ${mobileOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-background-50/98 backdrop-blur-md border-t border-background-200/70 px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium py-2 whitespace-nowrap ${
                location.pathname === link.href
                  ? 'text-primary-500'
                  : 'text-foreground-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/cart"
            className="text-sm font-medium py-2 whitespace-nowrap text-foreground-700 flex items-center gap-2"
          >
            <span className="relative w-5 h-5 flex items-center justify-center">
              <i className="ri-shopping-bag-line"></i>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-primary-500 text-background-50 text-[10px] font-bold rounded-full">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </span>
            Cart
          </Link>
        </div>
      </div>

      {/* Mini Cart Drawer */}
      <MiniCart />
    </nav>
  );
}