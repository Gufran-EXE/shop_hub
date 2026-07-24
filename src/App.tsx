import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { CategoryStrip } from './components/CategoryStrip';
import { HeroCarousel } from './components/HeroCarousel';
import { DealsSection } from './components/DealsSection';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastContainer } from './components/Toast';
import { NavigationProgress } from './components/NavigationProgress';
import { useApp } from './context/AppContext';
import { useProducts } from './hooks/useProducts';
import { CategoryPage } from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';

/* ─── Page transition variants ─── */
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -10 },
};
const pageTransition = { duration: 0.28, ease: 'easeInOut' as const };

/** Wraps a page element so every route gets the same fade+slide */
const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

/* ─── Home view ─── */
const HomeView: React.FC = () => {
  const { searchQuery } = useApp();

  // Fetch all products from API (falls back to static data if server is down)
  const { products: allProducts, loading } = useProducts(
    searchQuery ? { search: searchQuery } : undefined
  );
  const { products: dealProducts } = useProducts({ deals: true });

  const recommendedProducts = allProducts.filter((p) => !p.isDeal);
  const trendingProducts    = allProducts.filter((p) => p.rating >= 4.7 && !p.isDeal);

  return (
    <>
      {!searchQuery && <HeroCarousel />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {searchQuery && (
          <div className="py-8 border-b border-slate-200/40 dark:border-slate-800/40 mb-8">
            <span className="text-xs font-bold text-primary tracking-widest uppercase bg-primary/10 px-3 py-1 rounded-full">
              Search Results
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Showing results for <span className="text-primary">"{searchQuery}"</span>
            </h1>
          </div>
        )}

        {!searchQuery && <DealsSection products={dealProducts} />}

        <section className="py-12 border-b border-slate-200/40 dark:border-slate-800/40" id="recommended">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5 fill-current" />
                <span className="text-xs font-black tracking-widest uppercase">For You</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Recommended for you
              </h2>
            </div>
          </div>
          <ProductGrid
            products={recommendedProducts}
            loading={loading}
            emptyMessage={
              searchQuery
                ? "We couldn't find any products matching your search term. Try another keyword."
                : 'No recommended products found.'
            }
          />
        </section>

        <section className="py-12" id="trending">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-accent">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xs font-black tracking-widest uppercase">Popular Now</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Trending Collections
              </h2>
            </div>
          </div>
          <ProductGrid
            products={trendingProducts}
            loading={loading}
            emptyMessage="No trending items found matching your filters."
          />
        </section>
      </div>
    </>
  );
};

/* ─── Root App ─── */
const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hide category strip on cart / checkout / success pages
  const hideStrip = ['/cart', '/checkout', '/order-success'].some((p) =>
    location.pathname.startsWith(p)
  );

  const getSelectedCategory = () => {
    if (location.pathname.startsWith('/category/')) {
      const slug = location.pathname.split('/category/')[1];
      const mapping: Record<string, string> = {
        electronics: 'Electronics', fashion: 'Fashion', home: 'Home',
        wellness: 'Wellness', sports: 'Sports', books: 'Books',
        beauty: 'Beauty', gourmet: 'Gourmet',
      };
      return mapping[slug.toLowerCase()] || null;
    }
    return null;
  };

  const handleSelectCategory = (category: string | null) => {
    if (category === null) {
      navigate('/');
    } else {
      const mapping: Record<string, string> = {
        Electronics: 'electronics', Fashion: 'fashion', Home: 'home',
        Wellness: 'wellness', Sports: 'sports', Books: 'books',
        Beauty: 'beauty', Gourmet: 'gourmet',
      };
      const slug = mapping[category];
      if (slug) navigate(`/category/${slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top loading progress bar */}
      <NavigationProgress />

      {/* Sticky Navbar */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {/* Category strip — hidden on checkout flow */}
      {!hideStrip && (
        <CategoryStrip
          selectedCategory={getSelectedCategory()}
          onSelectCategory={handleSelectCategory}
        />
      )}

      {/* Animated page routes */}
      <main className="flex-grow">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageShell><HomeView /></PageShell>} />
            <Route path="/category/:slug" element={<PageShell><CategoryPage /></PageShell>} />
            <Route path="/product/:id" element={<PageShell><ProductDetailPage /></PageShell>} />
            <Route path="/cart" element={<PageShell><CartPage /></PageShell>} />
            <Route path="/checkout" element={<PageShell><CheckoutPage /></PageShell>} />
            <Route path="/order-success" element={<PageShell><OrderSuccessPage /></PageShell>} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <QuickViewModal />
      <ToastContainer />
    </div>
  );
};

export default App;
