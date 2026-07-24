import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SlidersHorizontal, ChevronDown, Grid, List, Star, 
  ArrowUpDown, RefreshCw, X, ArrowLeft, HeartPulse, Smartphone, Shirt, Home, Bike, BookOpen, Sparkles, Coffee
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<'popularity' | 'priceAsc' | 'priceDesc' | 'newest'>('popularity');
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [loadedCount, setLoadedCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Accordion Expand/Collapse States
  const [openFilters, setOpenFilters] = useState({
    price: true,
    brand: true,
    rating: true,
    discount: true,
  });

  // Filter Values
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [minDiscount, setMinDiscount] = useState<number | null>(null);

  // Map slug to actual category label and get icon
  const getCategoryDetails = (s: string | undefined) => {
    const categoryName = s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
    let icon = <SlidersHorizontal className="w-5 h-5" />;
    
    const mapping: Record<string, { label: string; icon: React.ReactNode }> = {
      electronics: { label: "Electronics", icon: <Smartphone className="w-5 h-5 text-indigo-500" /> },
      fashion: { label: "Fashion", icon: <Shirt className="w-5 h-5 text-pink-500" /> },
      home: { label: "Home", icon: <Home className="w-5 h-5 text-amber-500" /> },
      wellness: { label: "Wellness", icon: <HeartPulse className="w-5 h-5 text-emerald-500" /> },
      sports: { label: "Sports", icon: <Bike className="w-5 h-5 text-sky-500" /> },
      books: { label: "Books", icon: <BookOpen className="w-5 h-5 text-teal-500" /> },
      beauty: { label: "Beauty", icon: <Sparkles className="w-5 h-5 text-purple-500" /> },
      gourmet: { label: "Gourmet", icon: <Coffee className="w-5 h-5 text-orange-500" /> },
    };

    return mapping[s?.toLowerCase() || ''] || { label: categoryName, icon };
  };

  const categoryDetails = getCategoryDetails(slug);
  const categoryLabel = categoryDetails.label;

  // Fetch products for this category from the API (falls back to static data)
  const { products: categoryProducts, loading: catLoading } = useProducts(
    slug ? { category: categoryLabel } : undefined
  );

  const availableBrands = Array.from(
    new Set(
      categoryProducts.map((p) => {
        // Extract brand name (e.g. AeroSound from AeroSound Pro Edition)
        return p.name.split(' ')[0];
      })
    )
  );

  // Toggle brand checkboxes
  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setMaxPrice(2000);
    setSelectedBrands([]);
    setMinRating(null);
    setMinDiscount(null);
  };

  // Simulate filter loading state on filter change
  useEffect(() => {
    setIsFilterLoading(true);
    setLoadedCount(6); // reset pagination
    const timer = setTimeout(() => {
      setIsFilterLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [maxPrice, selectedBrands, minRating, minDiscount, sortOption, slug]);

  // Apply filters
  const filteredList = categoryProducts.filter((product) => {
    if (product.price > maxPrice) return false;
    
    if (selectedBrands.length > 0) {
      const brandName = product.name.split(' ')[0];
      if (!selectedBrands.includes(brandName)) return false;
    }
    
    if (minRating !== null && product.rating < minRating) return false;
    
    if (minDiscount !== null && product.discount < minDiscount) return false;
    
    return true;
  });

  // Apply Sorting
  const sortedList = [...filteredList].sort((a, b) => {
    if (sortOption === 'priceAsc') return a.price - b.price;
    if (sortOption === 'priceDesc') return b.price - a.price;
    if (sortOption === 'newest') return b.discount - a.discount; // Mock Newest by discount scale
    return b.rating - a.rating; // default Popularity
  });

  // Load More logic
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setLoadedCount((prev) => prev + 4);
      setIsLoadingMore(false);
    }, 600);
  };

  const paginatedList = sortedList.slice(0, loadedCount);

  // Animations configuration
  const filterAccordionVariants: any = {
    open: { height: 'auto', opacity: 1, marginTop: 12, transition: { duration: 0.3, ease: 'easeInOut' } },
    collapsed: { height: 0, opacity: 0, marginTop: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const staggerContainerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const cardVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const sortLabels = {
    popularity: 'Popularity',
    priceAsc: 'Price: Low to High',
    priceDesc: 'Price: High to Low',
    newest: 'New Arrivals',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs & Navigation Back */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/" 
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-550 hover:text-primary transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">{categoryLabel}</span>
        </div>
      </div>

      {/* Category Page Title */}
      <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-200/40 dark:border-slate-800/40">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200/50 dark:border-slate-800/50">
          {categoryDetails.icon}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
            {categoryLabel} Collection
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Discover premium {categoryLabel.toLowerCase()} engineered for daily excellence.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Filters, Right Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Filter Sidebar - Accordions */}
        <aside className="lg:col-span-3 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              Filters
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Accordion 1: Price Slider */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-5 pt-2">
            <button
              onClick={() => setOpenFilters(prev => ({ ...prev, price: !prev.price }))}
              className="w-full flex items-center justify-between font-semibold text-sm text-slate-850 dark:text-slate-100"
            >
              <span>Price Range</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFilters.price ? 'rotate-180' : ''}`} />
            </button>
            <motion.div
              initial="open"
              animate={openFilters.price ? 'open' : 'collapsed'}
              variants={filterAccordionVariants}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-1">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                  <span>$0</span>
                  <span className="text-primary text-sm font-extrabold">Up to ${maxPrice}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Accordion 2: Brand Checks */}
          {availableBrands.length > 0 && (
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5 pt-2">
              <button
                onClick={() => setOpenFilters(prev => ({ ...prev, brand: !prev.brand }))}
                className="w-full flex items-center justify-between font-semibold text-sm text-slate-850 dark:text-slate-100"
              >
                <span>Brands</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFilters.brand ? 'rotate-180' : ''}`} />
              </button>
              <motion.div
                initial="open"
                animate={openFilters.brand ? 'open' : 'collapsed'}
                variants={filterAccordionVariants}
                className="overflow-hidden"
              >
                <div className="space-y-3 pt-1">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Accordion 3: Rating Filters */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-5 pt-2">
            <button
              onClick={() => setOpenFilters(prev => ({ ...prev, rating: !prev.rating }))}
              className="w-full flex items-center justify-between font-semibold text-sm text-slate-850 dark:text-slate-100"
            >
              <span>Ratings</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFilters.rating ? 'rotate-180' : ''}`} />
            </button>
            <motion.div
              initial="open"
              animate={openFilters.rating ? 'open' : 'collapsed'}
              variants={filterAccordionVariants}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-1">
                {[4.8, 4.6, 4.4].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(minRating === rating ? null : rating)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                      minRating === rating
                        ? 'bg-primary/10 text-primary border-primary/20 shadow-sm shadow-indigo-600/5'
                        : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span>{rating}+ Star Rating</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Accordion 4: Discount Filters */}
          <div className="pb-2 pt-2">
            <button
              onClick={() => setOpenFilters(prev => ({ ...prev, discount: !prev.discount }))}
              className="w-full flex items-center justify-between font-semibold text-sm text-slate-850 dark:text-slate-100"
            >
              <span>Discounts</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFilters.discount ? 'rotate-180' : ''}`} />
            </button>
            <motion.div
              initial="open"
              animate={openFilters.discount ? 'open' : 'collapsed'}
              variants={filterAccordionVariants}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-1">
                {[30, 25, 20].map((disc) => (
                  <button
                    key={disc}
                    onClick={() => setMinDiscount(minDiscount === disc ? null : disc)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                      minDiscount === disc
                        ? 'bg-primary/10 text-primary border-primary/20 shadow-sm'
                        : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{disc}% Off & More</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </aside>

        {/* Right Listing Area */}
        <section className="lg:col-span-9 space-y-6">
          
          {/* Top Bar Sort and Grid/List Toggles */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between flex-wrap gap-4">
            <div className="text-xs sm:text-sm font-bold text-slate-500">
              Showing <span className="text-slate-900 dark:text-white font-extrabold">{sortedList.length}</span> premium products
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-655 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 select-none"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
                  Sort By: {sortLabels[sortOption]}
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <>
                      {/* Invisible backdrop to dismiss sort */}
                      <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-950 border border-slate-200/55 dark:border-slate-800/55 rounded-2xl shadow-xl py-2 z-20"
                      >
                        {(Object.keys(sortLabels) as Array<keyof typeof sortLabels>).map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setSortOption(opt);
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${
                              sortOption === opt
                                ? 'bg-primary/10 text-primary'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {sortLabels[opt]}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Grid / List Toggles */}
              <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 bg-slate-50/50 dark:bg-slate-950/50 select-none">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Listing Grid/List with transitions */}
          {isFilterLoading || (catLoading && categoryProducts.length === 0) ? (
            /* Shimmering Skeleton Loader Section */
            <div className={`grid gap-6 ${
              viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'
            }`}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Product Cards Container using layout transitions */}
              <motion.div
                layout
                variants={staggerContainerVariants}
                initial="hidden"
                animate="show"
                className={`grid gap-6 ${
                  viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {paginatedList.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      variants={cardVariants}
                      exit={{ opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.25 } }}
                      className="w-full flex"
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* No results fallback */}
              {sortedList.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl">
                  <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center mb-4">
                    <X className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No matching products</h3>
                  <p className="text-sm text-slate-550 dark:text-slate-400 mt-1 max-w-[280px] mx-auto">
                    Try adjusting your filter settings (e.g. brand, max price, or ratings) to see more results.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg shadow-indigo-600/10 text-xs"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Load More Button */}
              {sortedList.length > paginatedList.length && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="py-3 px-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100 font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2.5 min-w-[160px] shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5"
                  >
                    {isLoadingMore ? (
                      <>
                        <svg className="animate-spin h-4.5 w-4.5 text-current" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span>Load More Products</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

// Shimmering Skeleton Loader Card component
interface SkeletonCardProps {
  viewMode: 'grid' | 'list';
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ viewMode }) => {
  const isList = viewMode === 'list';
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-4 flex gap-4 w-full animate-pulse ${
      isList ? 'flex-row' : 'flex-col'
    }`}>
      {/* Shimmer Image */}
      <div className={`bg-slate-100 dark:bg-slate-800 rounded-2xl flex-shrink-0 ${
        isList ? 'w-56 h-56' : 'w-full aspect-square'
      }`} />

      {/* Shimmer Details */}
      <div className="flex-grow flex flex-col justify-between py-1 gap-4">
        <div className="space-y-3">
          <div className="h-3 w-16 bg-slate-100 dark:bg-slate-850 rounded" />
          <div className="h-5 w-5/6 bg-slate-100 dark:bg-slate-850 rounded" />
          <div className="h-3 w-28 bg-slate-100 dark:bg-slate-850 rounded" />
          {isList && (
            <div className="space-y-1.5 pt-2">
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-850 rounded" />
              <div className="h-3 w-4/5 bg-slate-100 dark:bg-slate-850 rounded" />
            </div>
          )}
        </div>
        
        {/* Shimmer Pricing & Button */}
        <div className={`flex border-t border-slate-100 dark:border-slate-850 pt-4 mt-4 ${
          isList ? 'flex-row items-center justify-between' : 'flex-col gap-3'
        }`}>
          <div className="h-6 w-20 bg-slate-100 dark:bg-slate-850 rounded" />
          <div className={`h-9 bg-slate-100 dark:bg-slate-850 rounded-xl ${
            isList ? 'w-28' : 'w-full'
          }`} />
        </div>
      </div>
    </div>
  );
};
