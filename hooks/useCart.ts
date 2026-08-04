import { createContext, useContext, useState, useEffect, useCallback, ReactNode, createElement } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CART_KEY = 'glowkraftee_cart';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

interface CartContextValue {
  items: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [cartOpen, setCartOpen] = useState(false);

  // Listen for external cart changes (e.g. other tabs)
  useEffect(() => {
    const handler = () => setItems(loadCart());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  const addItem = useCallback((item: CartItem) => {
    const current = loadCart();
    const existing = current.find((i) => i.productId === item.productId);
    let updated: CartItem[];
    if (existing) {
      updated = current.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      updated = [...current, item];
    }
    saveCart(updated);
    setItems(updated);
    window.dispatchEvent(new Event('cart-updated'));
  }, []);

  const removeItem = useCallback((productId: number) => {
    const updated = loadCart().filter((i) => i.productId !== productId);
    saveCart(updated);
    setItems(updated);
    window.dispatchEvent(new Event('cart-updated'));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    const updated = loadCart().map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    );
    saveCart(updated);
    setItems(updated);
    window.dispatchEvent(new Event('cart-updated'));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    saveCart([]);
    setItems([]);
    window.dispatchEvent(new Event('cart-updated'));
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value: CartContextValue = {
    items,
    cartOpen,
    setCartOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  };

  return createElement(CartContext.Provider, { value }, children);
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a <CartProvider>. Wrap your app in <CartProvider> (see src/App.tsx).');
  }
  return ctx;
}
