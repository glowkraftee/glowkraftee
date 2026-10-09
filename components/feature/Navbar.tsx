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

// One menu for every page: solid cream bar with dark text, so it is readable
// on both light pages and photo heroes. It sits in the page flow (sticky), so
// it never covers page content.
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setCartOpen } = useCart();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const badge = totalItems > 0 && (
    <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 flex items-center justify-center bg-foreground-950 text-white text-xs font-bold rounded-full ring-2 ring-background-50">
      {totalItems > 9 ? '9+' : totalItems}
    </span>
  );

  return (
    <nav className="sticky top-0 z-50 bg-background-50 border-b border-background-200 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="font-heading text-2xl md:text-3xl font-semibold tracking-wide whitespace-nowrap text-foreground-950"
          >
            GlowKraftee
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-base font-medium whitespace-nowrap transition-colors duration-200 border-b-2 pb-0.5 ${
                    active
                      ? 'text-primary-600 border-primary-500'
                      : 'text-foreground-800 border-transparent hover:text-primary-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-base font-semibold px-5 py-2.5 rounded-full shadow-sm transition-colors duration-200 cursor-pointer whitespace-nowrap"
              aria-label={`Open cart, ${totalItems} item${totalItems === 1 ? '' : 's'}`}
            >
              <i className="ri-shopping-bag-3-line text-xl leading-none"></i>
              Cart
              {badge}
            </button>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-11 h-11 rounded-full bg-primary-500 text-white"
              aria-label={`Open cart, ${totalItems} item${totalItems === 1 ? '' : 's'}`}
            >
              <i className="ri-shopping-bag-3-line text-xl leading-none"></i>
              {badge}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-center w-11 h-11 rounded-md text-foreground-950"
              aria-label="Toggle menu"
            >
              <i className={`text-2xl ${mobileOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-background-50 border-t border-background-200 px-4 py-3 flex flex-col">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-base font-medium py-3 whitespace-nowrap border-b border-background-200 last:border-b-0 ${
                location.pathname === link.href ? 'text-primary-600' : 'text-foreground-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/cart"
            className="text-base font-semibold py-3 whitespace-nowrap text-primary-600 flex items-center gap-2"
          >
            <i className="ri-shopping-bag-3-line text-xl"></i>
            View Cart{totalItems > 0 ? ` (${totalItems})` : ''}
          </Link>
        </div>
      </div>

      {/* Mini Cart Drawer */}
      <MiniCart />
    </nav>
  );
}
