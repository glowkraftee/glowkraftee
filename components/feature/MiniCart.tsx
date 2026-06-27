import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';

export default function MiniCart() {
  const { items, cartOpen, setCartOpen, removeItem, updateQuantity, totalItems, subtotal } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [cartOpen]);

  const closeDrawer = () => setCartOpen(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  return (
    <>
      {/* Dark overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-foreground-950/40 backdrop-blur-sm transition-opacity duration-400 ${
          cartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-[420px] bg-background-50 flex flex-col transition-transform duration-400 ease-out ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-background-200/70">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center">
              <i className="ri-shopping-bag-line text-foreground-800 text-lg"></i>
            </span>
            <h2 className="font-heading text-xl font-semibold text-foreground-950">
              Your Cart
            </h2>
            {totalItems > 0 && (
              <span className="text-sm text-foreground-500 font-label">
                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            className="w-9 h-9 flex items-center justify-center rounded-md text-foreground-500 hover:text-foreground-800 hover:bg-background-100 transition-colors duration-200"
            aria-label="Close cart"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 pt-12">
              <span className="w-16 h-16 flex items-center justify-center rounded-full bg-background-100">
                <i className="ri-shopping-bag-3-line text-foreground-300 text-2xl"></i>
              </span>
              <p className="font-heading text-lg text-foreground-700">Your cart is empty</p>
              <p className="text-sm text-foreground-500 max-w-[280px]">
                Discover handcrafted treasures from our artisan collection.
              </p>
              <Link
                to="/products"
                onClick={closeDrawer}
                className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-primary-500 text-background-50 text-sm font-medium font-label whitespace-nowrap hover:bg-primary-600 transition-colors duration-200"
              >
                Browse Collection
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-arrow-right-line"></i>
                </span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 pb-4 border-b border-background-200/60 last:border-0 last:pb-0"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.productId}`}
                    onClick={closeDrawer}
                    className="shrink-0 w-20 h-20 rounded-md overflow-hidden bg-background-100 cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        to={`/product/${item.productId}`}
                        onClick={closeDrawer}
                        className="block font-heading text-sm font-semibold text-foreground-900 leading-snug truncate hover:text-primary-500 transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-foreground-500 font-label mt-0.5">
                        {formatPrice(item.price)} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-0 rounded-md border border-background-300/60 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-foreground-500 hover:text-foreground-800 hover:bg-background-100 transition-colors duration-150 text-sm"
                          aria-label="Decrease quantity"
                        >
                          <i className="ri-subtract-line"></i>
                        </button>
                        <span className="w-8 text-center text-sm font-label text-foreground-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-foreground-500 hover:text-foreground-800 hover:bg-background-100 transition-colors duration-150 text-sm"
                          aria-label="Increase quantity"
                        >
                          <i className="ri-add-line"></i>
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold font-label text-foreground-900 whitespace-nowrap">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="w-6 h-6 flex items-center justify-center text-foreground-400 hover:text-primary-500 transition-colors duration-150"
                          aria-label="Remove item"
                        >
                          <i className="ri-delete-bin-line text-sm"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-background-200/70 px-5 py-4 flex flex-col gap-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-600 font-label">Subtotal</span>
              <span className="font-heading text-lg font-semibold text-foreground-950">
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Customs note */}
            {subtotal < 800 && (
              <p className="text-xs text-foreground-500 leading-relaxed">
                Add {formatPrice(800 - subtotal)} more for free shipping. Orders under $800 enter the US duty-free under Section 321 de minimis.
              </p>
            )}
            {subtotal >= 800 && (
              <p className="text-xs text-secondary-700 leading-relaxed bg-secondary-100/70 rounded-md px-3 py-2">
                <span className="w-3 h-3 flex items-center justify-center inline-block mr-1 align-middle">
                  <i className="ri-checkbox-circle-fill text-secondary-600 text-xs"></i>
                </span>
                You've unlocked free shipping on this order!
              </p>
            )}

            {/* CTA */}
            <Link
              to="/checkout"
              onClick={closeDrawer}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary-500 text-background-50 text-sm font-semibold font-label whitespace-nowrap hover:bg-primary-600 transition-colors duration-200"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-lock-line"></i>
              </span>
              Proceed to Checkout
            </Link>

            <Link
              to="/cart"
              onClick={closeDrawer}
              className="w-full text-center text-sm text-foreground-500 font-label hover:text-foreground-800 transition-colors duration-200 whitespace-nowrap"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}