import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextProps {
  cart: CartItem[];
  wishlist: string[]; // array of product IDs
  searchQuery: string;
  activeQuickView: Product | null;
  toasts: ToastMessage[];
  isDark: boolean;
  setSearchQuery: (query: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  clearCart: () => void;
  toggleDark: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickView, setActiveQuickView] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dark mode — read from localStorage, fallback to system preference
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  // Add toast helper
  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Add item to cart
  const addToCart = (product: Product) => {
    if (!product.inStock) {
      addToast(`${product.name} is currently out of stock.`, 'error');
      return;
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        addToast(`Incremented ${product.name} quantity in cart.`, 'success');
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      addToast(`Added ${product.name} to cart.`, 'success');
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const target = prevCart.find((item) => item.product.id === productId);
      if (target) {
        addToast(`Removed ${target.product.name} from cart.`, 'info');
      }
      return prevCart.filter((item) => item.product.id !== productId);
    });
  };

  // Update cart item quantity
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Toggle wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      const isWishlisted = prevWishlist.includes(productId);
      if (isWishlisted) {
        addToast("Removed from wishlist", 'info');
        return prevWishlist.filter((id) => id !== productId);
      } else {
        addToast("Added to wishlist", 'success');
        return [...prevWishlist, productId];
      }
    });
  };

  const openQuickView = (product: Product) => {
    setActiveQuickView(product);
  };

  const closeQuickView = () => {
    setActiveQuickView(null);
  };

  const clearCart = () => {
    setCart([]);
    addToast("Cart cleared", 'info');
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        searchQuery,
        activeQuickView,
        toasts,
        isDark,
        setSearchQuery,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        openQuickView,
        closeQuickView,
        addToast,
        removeToast,
        clearCart,
        toggleDark,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
