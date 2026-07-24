import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ShoppingCart, Zap, Heart, ChevronLeft, ChevronRight,
  Shield, RefreshCcw, Truck, CheckCircle2, Minus, Plus,
} from 'lucide-react';
import { products } from '../data/products';
import type { ProductReview } from '../data/products';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { productsApi } from '../lib/api';
import type { Product } from '../data/products';

/* ─────────────────────────────────────────────
   Sub-component: Image Gallery
───────────────────────────────────────────── */
const ImageGallery: React.FC<{ images: string[]; name: string }> = ({ images, name }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState('50% 50%');
  const mainRef = useRef<HTMLDivElement>(null);

  const switchTo = (idx: number) => {
    if (idx === activeIdx) return;
    setPrevIdx(activeIdx);
    setActiveIdx(idx);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = mainRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setBgPos(`${x}% ${y}%`);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image */}
      <div
        ref={mainRef}
        className="relative w-full aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 cursor-zoom-in select-none"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Previous image (fades out) */}
        <AnimatePresence>
          {prevIdx !== null && (
            <motion.img
              key={`prev-${prevIdx}`}
              src={images[prevIdx]}
              alt=""
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </AnimatePresence>

        {/* Active image (fades in) */}
        <motion.img
          key={`active-${activeIdx}`}
          src={images[activeIdx]}
          alt={name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Magnifier Lens */}
        {zoomed && (
          <div
            className="pointer-events-none absolute w-28 h-28 rounded-full border-2 border-white/80 shadow-2xl overflow-hidden z-20"
            style={{
              left: lensPos.x - 56,
              top: lensPos.y - 56,
              backgroundImage: `url(${images[activeIdx]})`,
              backgroundSize: '400%',
              backgroundPosition: bgPos,
            }}
          />
        )}

        {/* Arrow navigation (only when >1 image) */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => switchTo((activeIdx - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-md hover:scale-110 transition-transform"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            </button>
            <button
              onClick={() => switchTo((activeIdx + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-md hover:scale-110 transition-transform"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => switchTo(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                i === activeIdx
                  ? 'border-primary shadow-md shadow-indigo-500/20 scale-105'
                  : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Sub-component: Segmented Chip Selector
   (sliding highlight between chips)
───────────────────────────────────────────── */
interface ChipSelectorProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  isColor?: boolean;
}

const ChipSelector: React.FC<ChipSelectorProps> = ({ label, options, selected, onSelect, isColor }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const updateHighlight = useCallback((el: HTMLButtonElement) => {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setHighlightStyle({
      left: eRect.left - cRect.left,
      width: eRect.width,
      opacity: 1,
    });
  }, []);

  // Position highlight on mount and when selection changes
  useEffect(() => {
    if (!containerRef.current) return;
    const idx = options.indexOf(selected);
    if (idx < 0) return;
    const btn = containerRef.current.querySelectorAll('button')[idx] as HTMLButtonElement | undefined;
    if (btn) updateHighlight(btn);
  }, [selected, options, updateHighlight]);

  return (
    <div>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
        {label}
        {!isColor && <span className="ml-2 text-primary normal-case font-semibold">{selected}</span>}
      </p>
      <div ref={containerRef} className="relative flex flex-wrap gap-2">
        {/* Sliding highlight pill */}
        {!isColor && (
          <motion.span
            className="absolute top-0 h-full rounded-lg bg-primary/10 border border-primary/30 pointer-events-none z-0"
            animate={{ left: highlightStyle.left, width: highlightStyle.width, opacity: highlightStyle.opacity }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          />
        )}
        {options.map((opt) => (
          <button
            key={opt}
            onClick={(e) => {
              onSelect(opt);
              if (!isColor) updateHighlight(e.currentTarget);
            }}
            aria-pressed={selected === opt}
            className={`relative z-10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
              isColor
                ? `w-8 h-8 rounded-full border-2 shadow-sm hover:scale-110 ${
                    selected === opt
                      ? 'border-primary scale-110 shadow-md shadow-indigo-500/30'
                      : 'border-slate-300 dark:border-slate-600'
                  }`
                : 'px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light'
            }`}
            style={isColor ? { backgroundColor: opt } : {}}
            title={isColor ? opt : undefined}
          >
            {!isColor && opt}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Sub-component: Star Rating display
───────────────────────────────────────────── */
const StarRating: React.FC<{ rating: number; size?: string }> = ({ rating, size = 'w-4 h-4' }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`${size} ${
          s <= Math.floor(rating)
            ? 'text-amber-400 fill-amber-400'
            : s - 0.5 <= rating
            ? 'text-amber-400 fill-amber-200'
            : 'text-slate-200 dark:text-slate-700'
        }`}
      />
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   Sub-component: Review Card (whileInView)
───────────────────────────────────────────── */
const ReviewCard: React.FC<{ review: ProductReview; index: number }> = ({ review, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
    className="flex gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
  >
    <img
      src={review.avatar}
      alt={review.author}
      className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white dark:border-slate-800 shadow-sm"
    />
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <span className="font-bold text-sm text-slate-900 dark:text-white">{review.author}</span>
        {review.verified && (
          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> Verified Purchase
          </span>
        )}
        <span className="ml-auto text-[11px] text-slate-400">{review.date}</span>
      </div>
      <StarRating rating={review.rating} size="w-3.5 h-3.5" />
      <p className="mt-2 font-semibold text-sm text-slate-800 dark:text-slate-200">{review.title}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{review.body}</p>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Sub-component: Animated Tab Bar
───────────────────────────────────────────── */
type TabId = 'description' | 'specifications' | 'reviews';

interface TabBarProps {
  active: TabId;
  onChange: (t: TabId) => void;
  reviewCount: number;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'reviews', label: 'Reviews' },
];

const TabBar: React.FC<TabBarProps> = ({ active, onChange, reviewCount }) => {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const updateUnderline = useCallback((id: string) => {
    const el = tabRefs.current[id];
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const pRect = parent.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setUnderline({ left: eRect.left - pRect.left, width: eRect.width });
  }, []);

  useEffect(() => {
    updateUnderline(active);
  }, [active, updateUnderline]);

  return (
    <div className="relative flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => { tabRefs.current[tab.id] = el; }}
          onClick={() => onChange(tab.id)}
          className={`relative whitespace-nowrap px-5 py-3.5 text-sm font-semibold transition-colors duration-200 focus:outline-none ${
            active === tab.id
              ? 'text-primary dark:text-primary-light'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {tab.label}
          {tab.id === 'reviews' && reviewCount > 0 && (
            <span className="ml-1.5 text-[10px] font-black bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light px-1.5 py-0.5 rounded-full">
              {reviewCount}
            </span>
          )}
        </button>
      ))}
      {/* Animated underline */}
      <motion.span
        className="absolute bottom-0 h-0.5 bg-primary rounded-full"
        animate={{ left: underline.left, width: underline.width }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   Sub-component: Similar Products Carousel
───────────────────────────────────────────── */
const SimilarCarousel: React.FC<{ currentId: string; category: string }> = ({ currentId, category }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const similar = products
    .filter((p) => p.category === category && p.id !== currentId)
    .slice(0, 8);

  if (similar.length === 0) return null;

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">More Like This</span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">Similar Products</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary-light transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary-light transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto no-scrollbar pb-3 scroll-smooth"
      >
        {similar.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-64">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   Main Page Component
───────────────────────────────────────────── */
const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useApp();

  const [product, setProduct] = useState<Product | null | undefined>(undefined); // undefined = loading
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>('description');
  const [cartState, setCartState] = useState<'idle' | 'loading' | 'done'>('idle');

  // Fetch product from API, fall back to static data
  useEffect(() => {
    if (!id) return;
    setProduct(undefined);
    productsApi.get(id)
      .then((p) => {
        setProduct(p);
        setSelectedColor(p.colors?.[0] ?? '');
        setSelectedSize(p.sizes?.[0] ?? '');
      })
      .catch(() => {
        // Server unreachable — use static data
        const staticProduct = products.find((p) => p.id === id) ?? null;
        setProduct(staticProduct);
        setSelectedColor(staticProduct?.colors?.[0] ?? '');
        setSelectedSize(staticProduct?.sizes?.[0] ?? '');
      });
  }, [id]);

  const isWishlisted = product ? wishlist.includes(product.id) : false;

  // Loading skeleton
  if (product === undefined) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="aspect-square rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-4">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-10 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-24 w-full bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // 404 guard
  if (product === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-5xl font-extrabold text-slate-200 dark:text-slate-800">404</p>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">Product not found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (cartState !== 'idle') return;
    setCartState('loading');
    setTimeout(() => {
      for (let i = 0; i < quantity; i++) addToCart(product);
      setCartState('done');
      setTimeout(() => setCartState('idle'), 2000);
    }, 500);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/');
  };

  const changeQty = (delta: number) => {
    setQuantity((q) => Math.max(1, Math.min(99, q + delta)));
  };

  const reviewList = product.reviews ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 flex-wrap">
        <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Home</button>
        <span>/</span>
        <button
          onClick={() => navigate(`/category/${product.category.toLowerCase()}`)}
          className="hover:text-primary transition-colors"
        >
          {product.category}
        </button>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-300 font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Top section: Gallery + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
        {/* ── Gallery ── */}
        <ImageGallery images={product.images} name={product.name} />

        {/* ── Product Info ── */}
        <div className="flex flex-col gap-6">
          {/* Category tag + Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {product.category}
            </span>
            {!product.inStock && (
              <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-500/30">
                Out of Stock
              </span>
            )}
            {product.inStock && product.discount > 0 && (
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[11px] font-black text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20"
              >
                -{product.discount}% OFF
              </motion.span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {product.name}
          </h1>

          {/* Rating row */}
          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} size="w-5 h-5" />
            <span className="font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
            <button
              onClick={() => setActiveTab('reviews')}
              className="text-sm text-primary hover:underline font-semibold"
            >
              {product.reviewsCount.toLocaleString()} reviews
            </button>
          </div>

          {/* Price block */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Short description */}
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{product.description}</p>

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <ChipSelector
              label="Color"
              options={product.colors}
              selected={selectedColor}
              onSelect={setSelectedColor}
              isColor
            />
          )}

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <ChipSelector
              label="Size"
              options={product.sizes}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />
          )}

          {/* Quantity stepper */}
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Quantity
            </p>
            <div className="flex items-center gap-0">
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => changeQty(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <div className="w-12 h-10 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-sm text-slate-900 dark:text-white select-none">
                {quantity}
              </div>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => changeQty(1)}
                disabled={quantity >= 99}
                className="w-10 h-10 rounded-r-xl border border-l-0 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Desktop CTA buttons */}
          <div className="hidden sm:flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              disabled={!product.inStock || cartState !== 'idle'}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 border ${
                cartState === 'done'
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : !product.inStock
                  ? 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400 cursor-not-allowed'
                  : 'bg-primary/5 hover:bg-primary border-primary/25 hover:border-primary text-primary hover:text-white shadow-sm hover:shadow-md hover:shadow-indigo-500/15'
              }`}
            >
              <AnimatePresence mode="wait">
                {cartState === 'loading' ? (
                  <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding...
                  </motion.span>
                ) : cartState === 'done' ? (
                  <motion.span key="d" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Added to Cart
                  </motion.span>
                ) : (
                  <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white transition-colors shadow-md shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" /> Buy Now
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => toggleWishlist(product.id)}
              className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-200 ${
                isWishlisted
                  ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500 hover:border-rose-300'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            {[
              { icon: <Truck className="w-4 h-4" />, text: 'Free shipping over $50' },
              { icon: <RefreshCcw className="w-4 h-4" />, text: '30-day returns' },
              { icon: <Shield className="w-4 h-4" />, text: '2-year warranty' },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="text-primary">{b.icon}</span>
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs section ── */}
      <div className="mb-16">
        <TabBar active={activeTab} onChange={setActiveTab} reviewCount={reviewList.length} />

        <div className="pt-8">
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25 }}
                className="prose prose-sm dark:prose-invert max-w-none"
              >
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base mb-6">
                  {product.description}
                </p>
                {product.features.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {product.features.map((f) => (
                      <div key={f} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'specifications' && (
              <motion.div
                key="specifications"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25 }}
              >
                {product.specs && product.specs.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    {product.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 px-5 py-3.5 bg-white dark:bg-slate-900 even:bg-slate-50 dark:even:bg-slate-900/50"
                      >
                        <span className="w-44 flex-shrink-0 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide pt-0.5">
                          {spec.label}
                        </span>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No specifications available.</p>
                )}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25 }}
              >
                {/* Rating summary */}
                <div className="flex items-center gap-5 mb-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="text-center">
                    <p className="text-5xl font-extrabold text-slate-900 dark:text-white">{product.rating}</p>
                    <StarRating rating={product.rating} size="w-5 h-5" />
                    <p className="text-xs text-slate-400 mt-1">{product.reviewsCount.toLocaleString()} ratings</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 7 : star === 2 ? 2 : 1;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="w-3 text-right">{star}</span>
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-amber-400"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.7, delay: (5 - star) * 0.07 }}
                            />
                          </div>
                          <span className="w-6">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review cards */}
                {reviewList.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {reviewList.map((review, i) => (
                      <ReviewCard key={review.id} review={review} index={i} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No reviews yet. Be the first to review this product.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Similar Products Carousel ── */}
      <SimilarCarousel currentId={product.id} category={product.category} />

      {/* ── Sticky Mobile CTA bar ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/60 dark:border-slate-800/60 px-4 py-3 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAddToCart}
          disabled={!product.inStock || cartState !== 'idle'}
          className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 border ${
            cartState === 'done'
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : !product.inStock
              ? 'bg-slate-100 border-transparent text-slate-400 cursor-not-allowed'
              : 'bg-primary/5 hover:bg-primary border-primary/25 hover:border-primary text-primary hover:text-white'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {cartState === 'done' ? 'Added!' : cartState === 'loading' ? 'Adding...' : 'Add to Cart'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-primary text-white shadow-md shadow-indigo-500/20 disabled:opacity-40"
        >
          <Zap className="w-4 h-4" /> Buy Now
        </motion.button>
      </div>

      {/* Bottom spacing for mobile sticky bar */}
      <div className="sm:hidden h-20" />
    </motion.div>
  );
};

export default ProductDetailPage;
