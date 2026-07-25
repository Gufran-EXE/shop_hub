import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AppContextProps {
  cart: CartItem[];
  wishlist: string[]; // array of product IDs
  searchQuery: string;
  activeQuickView: Product | null;
  toasts: ToastMessage[];
  isDark: boolean;
  currentUser: AuthUser | null;
  authLoading: boolean;
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
  setCurrentUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  loginUser: (user: AuthUser) => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickView, setActiveQuickView] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ── Cart ↔ MongoDB sync ────────────────────────────────────────────────
  // Serialize cart items into the shape the API expects
  const serializeCart = (items: CartItem[]) =>
    items.map((i) => ({
      productId:     i.product.id,
      name:          i.product.name,
      image:         i.product.image,
      price:         i.product.price,
      originalPrice: i.product.originalPrice,
      discount:      i.product.discount,
      quantity:      i.quantity,
    }));

  // Push cart to API — debounced via useEffect below
  const syncCartToServer = (items: CartItem[]) => {
    fetch(`${API_BASE}/cart`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: serializeCart(items) }),
    }).catch(() => {});
  };

  // Load cart from server — called after login / hydration
  const loadCartFromServer = async () => {
    try {
      const res = await fetch(`${API_BASE}/cart`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      if (!data.items?.length) return;

      // Re-hydrate into CartItem[] shape — match productId back to full product
      // We only store what we need so we can reconstruct a lightweight Product stub
      const hydrated: CartItem[] = data.items.map((i: {
        productId: string; name: string; image: string;
        price: number; originalPrice: number; discount: number; quantity: number;
      }) => ({
        quantity: i.quantity,
        product: {
          id: i.productId,
          name: i.name,
          image: i.image,
          images: [i.image],
          price: i.price,
          originalPrice: i.originalPrice,
          discount: i.discount,
          rating: 0,
          reviewsCount: 0,
          description: '',
          category: '',
          isDeal: false,
          inStock: true,
          features: [],
        },
      }));
      setCart(hydrated);
    } catch {
      // Server unreachable — keep current local state
    }
  };

  const API_BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

  // Hydrate auth state from the server cookie on mount
  useEffect(() => {
    const stored = localStorage.getItem('gufu_token');
    const headers: Record<string, string> = stored
      ? { Authorization: `Bearer ${stored}` }
      : {};
    fetch(`${API_BASE}/auth/me`, { credentials: 'include', headers })
      .then((r) => r.ok ? r.json() : null)
      .then(async (user) => {
        if (user) {
          setCurrentUser(user);
          await loadCartFromServer();
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  // Debounce-sync cart to MongoDB whenever it changes (only when logged in)
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!currentUser) return;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => syncCartToServer(cart), 800);
    return () => { if (syncTimerRef.current) clearTimeout(syncTimerRef.current); };
  }, [cart, currentUser]);

  const logout = async () => {
    const stored = localStorage.getItem('gufu_token');
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: stored ? { Authorization: `Bearer ${stored}` } : {},
    }).catch(() => {});
    localStorage.removeItem('gufu_token');
    setCurrentUser(null);
    setCart([]);
  };

  // Expose setCurrentUser so AuthModal can call loadCartFromServer after login
  const loginUser = async (user: AuthUser) => {
    setCurrentUser(user);
    await loadCartFromServer();
  };

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
        currentUser,
        authLoading,
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
        setCurrentUser,
        logout,
        loginUser,
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
