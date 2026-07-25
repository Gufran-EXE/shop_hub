import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../data/products';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  showTimer?: boolean;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showTimer = false,
  viewMode = 'grid'
}) => {
  const { addToCart, toggleWishlist, wishlist, openQuickView } = useApp();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<number>(product.dealTimer || 0);
  const [cartState, setCartState] = useState<'default' | 'loading' | 'added'>('default');

  const isWishlisted = wishlist.includes(product.id);

  // Countdown timer effect
  useEffect(() => {
    if (!showTimer || !product.dealTimer) return;

    const randomShift = Math.floor(Math.random() * 3600); // offset up to 1hr
    setTimeLeft(product.dealTimer + randomShift);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showTimer, product.dealTimer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartState !== 'default') return;

    setCartState('loading');
    setTimeout(() => {
      addToCart(product);
      setCartState('added');
      setTimeout(() => {
        setCartState('default');
      }, 2000);
    }, 600);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    openQuickView(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Determine ribbon text and styling based on inventory or features
  let ribbonText = "";
  let ribbonBg = "";
  if (!product.inStock) {
    ribbonText = "Out of Stock";
    ribbonBg = "bg-slate-800 text-slate-100 border-slate-700/50 shadow-slate-950/20";
  } else if (product.id === "prod-1" || product.id === "prod-2" || product.id === "prod-8") {
    ribbonText = "Bestseller";
    ribbonBg = "bg-amber-500 text-slate-950 border-amber-400/50 font-black shadow-amber-500/10";
  } else if (product.id === "prod-11" || product.id === "prod-16") {
    ribbonText = "Low Stock";
    ribbonBg = "bg-rose-600 text-white border-rose-500/50 font-extrabold shadow-rose-600/10";
  } else if (product.id === "prod-3" || product.id === "prod-12") {
    ribbonText = "Popular";
    ribbonBg = "bg-indigo-600 text-white border-indigo-500/50 font-extrabold shadow-indigo-600/10";
  }

  // Star animations
  const starContainerVariants: any = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const singleStarVariants: any = {
    hidden: { scale: 0, opacity: 0 },
    show: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      } 
    }
  };

  const isList = viewMode === 'list';

  return (
    <motion.div
      layout
      whileHover={{ y: isList ? 0 : -6, scale: isList ? 1.01 : 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onClick={handleCardClick}
      className={`group relative flex bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-sm transition-all duration-300 ease-in-out cursor-pointer w-full select-none hover:border-indigo-500/30 dark:hover:border-indigo-400/30 hover:shadow-[0_0_20px_rgba(79,70,229,0.1)] dark:hover:shadow-[0_0_20px_rgba(79,70,229,0.08)] ${
        isList ? 'flex-col sm:flex-row p-3 gap-2 sm:gap-6' : 'flex-col'
      }`}
    >
      {/* Product Image Panel */}
      <motion.div 
        layout 
        className={`relative overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center rounded-2xl border border-slate-100 dark:border-slate-850 flex-shrink-0 ${
          isList ? 'w-full sm:w-56 aspect-video sm:aspect-square' : 'w-full aspect-square'
        }`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-in-out"
          loading="lazy"
        />

        {/* Rotated Ribbon Tag */}
        {ribbonText && (
          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none select-none">
            <div className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg shadow-md -rotate-6 transform origin-top-left border ${ribbonBg}`}>
              {ribbonText}
            </div>
          </div>
        )}

        {/* Hover Controls Overlay (Quick View & Wishlist together) */}
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex items-center justify-center gap-3 z-10">
          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleQuickView(e);
            }}
            className="p-3 rounded-full bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 shadow-md hover:scale-110 hover:text-primary dark:hover:text-primary transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 ease-in-out"
            title="Quick View"
          >
            <Eye className="w-5 h-5" />
          </button>
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`p-3 rounded-full shadow-md hover:scale-110 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 ease-in-out ${
              isWishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-500 hover:text-rose-500'
            }`}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Deals Countdown Timer Overlay */}
        {showTimer && timeLeft > 0 && (
          <div className="absolute bottom-3 left-3 right-3 py-1.5 px-3 rounded-xl bg-slate-950/80 dark:bg-slate-900/90 text-white backdrop-blur-md flex items-center justify-between border border-white/10 text-xs shadow-sm select-none z-10">
            <div className="flex items-center gap-1.5 text-accent-light font-bold">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>Ends In:</span>
            </div>
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        )}
      </motion.div>

      {/* Product Content Details */}
      <motion.div layout className="flex-1 flex flex-col justify-between py-1 px-1 sm:px-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {product.category}
            </span>
            
            {/* Pulsing Discount Badge - top right in list view */}
            {isList && product.discount > 0 && (
              <motion.span
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                className="text-[9px] font-black px-2 py-0.5 bg-accent/15 text-accent dark:bg-accent/20 dark:text-accent-light rounded border border-accent/20"
              >
                -{product.discount}% OFF
              </motion.span>
            )}
          </div>
          
          <motion.h4 layout className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </motion.h4>
          
          {/* Rating stars with sequential fill animation */}
          <div className="flex items-center gap-1.5">
            <motion.div 
              variants={starContainerVariants}
              initial="hidden"
              animate="show"
              className="flex items-center gap-0.5"
            >
              {[0, 1, 2, 3, 4].map((index) => {
                const isFilled = index < Math.floor(product.rating);
                return (
                  <motion.div key={index} variants={singleStarVariants}>
                    <Star className={`w-3.5 h-3.5 ${isFilled ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                  </motion.div>
                );
              })}
            </motion.div>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 pt-0.5">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Render description inside list view for premium layouts */}
          {isList && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pt-1 font-normal leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Pricing & Morphing Add to Cart Button */}
        <motion.div layout className={`flex pt-3 border-t border-slate-100 dark:border-slate-900 mt-4 ${
          isList ? 'flex-row items-center justify-between gap-4' : 'flex-col gap-3'
        }`}>
          <div className={`flex items-baseline ${isList ? 'gap-3' : 'justify-between'}`}>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white">
                ₹{product.price}
              </span>
              {product.discount > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            
            {/* Pulsing Discount Badge - grid view display */}
            {!isList && product.discount > 0 && (
              <motion.span
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                className="text-[9px] font-black px-2 py-0.5 bg-accent/15 text-accent dark:bg-accent/20 dark:text-accent-light rounded border border-accent/20"
              >
                -{product.discount}% OFF
              </motion.span>
            )}
          </div>

          <motion.button
            layout
            disabled={!product.inStock || cartState !== 'default'}
            onClick={handleAddToCartClick}
            className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border ${
              isList ? 'w-auto px-6' : 'w-full'
            } ${
              cartState === 'added'
                ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                : !product.inStock
                  ? 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-primary/5 hover:bg-primary border-primary/20 hover:border-primary text-primary hover:text-white shadow-sm hover:shadow-md hover:shadow-indigo-500/10'
            }`}
          >
            <AnimatePresence mode="wait">
              {cartState === 'loading' ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1.5"
                >
                  <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Adding...</span>
                </motion.div>
              ) : cartState === 'added' ? (
                <motion.div
                  key="added"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Added</span>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
