import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AnimatedNumber } from '../components/AnimatedNumber';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity } = useApp();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal - discount + shipping;

  const handleCoupon = () => {
    if (coupon.trim().toUpperCase() === 'GUFU10') {
      setCouponApplied(true);
    }
  };

  /* ── Empty state ── */
  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 text-center"
      >
        {/* Friendly illustration */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
          className="w-28 h-28 rounded-full bg-primary/8 dark:bg-primary/10 flex items-center justify-center"
        >
          <ShoppingCart className="w-14 h-14 text-primary/40 dark:text-primary/50" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Your cart is empty</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
            Looks like you haven't added anything yet. Explore our collection and find something you'll love.
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-indigo-500/25 hover:bg-primary-dark transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Start Shopping
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-8">
        Shopping Cart
        <span className="ml-3 text-lg font-semibold text-slate-400">({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Cart Items List ── */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence initial={false}>
            {cart.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: -24, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{
                  opacity: 0,
                  x: 60,
                  height: 0,
                  marginBottom: 0,
                  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="flex gap-4 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                  {/* Product image */}
                  <button
                    onClick={() => navigate(`/product/${item.product.id}`)}
                    className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </button>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.product.category}</span>
                      <h3
                        className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 mt-0.5 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigate(`/product/${item.product.id}`)}
                      >
                        {item.product.name}
                      </h3>
                      {item.product.discount > 0 && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                          {item.product.discount}% off · save ₹{((item.product.originalPrice - item.product.price) * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                      {/* Qty stepper */}
                      <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </motion.button>
                        <span className="w-9 text-center font-bold text-sm text-slate-900 dark:text-white select-none">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Line price */}
                        <span className="font-extrabold text-base text-slate-900 dark:text-white">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        {/* Remove */}
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Order Summary ── */}
        <motion.div
          layout
          className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm p-6 space-y-5 lg:sticky lg:top-24"
        >
          <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Order Summary</h2>

          {/* Coupon */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCoupon()}
                placeholder="Coupon code"
                disabled={couponApplied}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
              />
            </div>
            <button
              onClick={handleCoupon}
              disabled={couponApplied}
              className="px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
            >
              {couponApplied ? '✓' : 'Apply'}
            </button>
          </div>
          {couponApplied && (
            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 -mt-2">
              10% discount applied!
            </motion.p>
          )}

          {/* Line items */}
          <div className="space-y-3 text-sm border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Subtotal</span>
              <AnimatedNumber value={subtotal} prefix="₹" className="font-semibold text-slate-900 dark:text-white" />
            </div>
            {couponApplied && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Coupon (GUFU10)</span>
                <AnimatedNumber value={-discount} prefix="-$" className="font-semibold" />
              </div>
            )}
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Shipping</span>
              {shipping === 0
                ? <span className="font-semibold text-emerald-600 dark:text-emerald-400">FREE</span>
                : <AnimatedNumber value={shipping} prefix="₹" className="font-semibold text-slate-900 dark:text-white" />
              }
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between font-extrabold text-base text-slate-900 dark:text-white">
              <span>Total</span>
              <AnimatedNumber value={total} prefix="₹" className="text-primary text-lg" />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 hover:bg-primary-dark transition-colors group"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
          <button
            onClick={() => navigate('/')}
            className="w-full text-center text-xs font-semibold text-slate-400 hover:text-primary transition-colors pt-1"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
