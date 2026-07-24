import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickViewModal: React.FC = () => {
  const { activeQuickView, closeQuickView, addToCart, wishlist, toggleWishlist } = useApp();
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (activeQuickView) {
      setSelectedImage(activeQuickView.image);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeQuickView]);

  if (!activeQuickView) return null;

  const product = activeQuickView;
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Content Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row z-10"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Images Gallery */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-slate-50 dark:bg-slate-950/50">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 flex items-center justify-center">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1 no-scrollbar justify-start">
              {product.images.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 bg-white dark:bg-slate-900 flex-shrink-0 transition-all ${
                    selectedImage === imgUrl ? 'border-primary scale-105 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Product Details */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between max-h-[85svh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-primary tracking-wide uppercase px-2.5 py-1 rounded-full bg-primary/10">
                  {product.category}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3 leading-tight">
                  {product.name}
                </h3>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                    {product.rating}
                  </span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="text-sm text-slate-500 dark:text-slate-450 font-medium">
                  {product.reviewsCount} reviews
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  product.inStock 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450' 
                    : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-950 dark:text-white">
                  ${product.price}
                </span>
                <span className="text-lg text-slate-400 dark:text-slate-500 line-through">
                  ${product.originalPrice}
                </span>
                <span className="text-sm font-bold text-accent">
                  ({product.discount}% OFF)
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Key Features List */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">
                  Key Specifications
                </h4>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                      <span className="line-clamp-1">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Highlights badges */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-150 dark:border-slate-800">
                <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/30 text-center">
                  <ShieldCheck className="w-4 h-4 text-primary mb-1" />
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">1 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/30 text-center">
                  <Truck className="w-4 h-4 text-primary mb-1" />
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/30 text-center">
                  <RefreshCw className="w-4 h-4 text-primary mb-1" />
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">30 Day Return</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-150 dark:border-slate-800">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 flex-shrink-0 ${
                  isWishlisted 
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-sm shadow-rose-500/10' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
