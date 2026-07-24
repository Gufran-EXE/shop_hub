import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Home } from 'lucide-react';

/* ─── Particle burst ─── */
interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const COLORS = ['#4f46e5', '#f97316', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6'];

const generateParticles = (count: number): Particle[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 10,
    y: 30 + (Math.random() - 0.5) * 10,
    angle: (i / count) * 360 + (Math.random() - 0.5) * 30,
    distance: 80 + Math.random() * 140,
    size: 5 + Math.random() * 8,
    color: COLORS[i % COLORS.length],
    duration: 0.8 + Math.random() * 0.7,
    delay: Math.random() * 0.3,
  }));

const PARTICLES = generateParticles(40);

const Burst: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
    {PARTICLES.map((p) => {
      const rad = (p.angle * Math.PI) / 180;
      const tx = Math.cos(rad) * p.distance;
      const ty = Math.sin(rad) * p.distance;
      return (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: tx, y: ty, scale: 0.2 }}
          transition={{ duration: p.duration, delay: p.delay + 0.4, ease: [0.2, 0.8, 0.4, 1] }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            backgroundColor: p.color,
          }}
        />
      );
    })}
  </div>
);

/* ─── SVG Checkmark draw-in ─── */
const AnimatedCheck: React.FC = () => (
  <div className="relative w-24 h-24 mx-auto">
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/30"
    >
      <svg viewBox="0 0 52 52" className="w-12 h-12" fill="none" stroke="white" strokeWidth="4"
        strokeLinecap="round" strokeLinejoin="round">
        <motion.path
          d="M14 27 L22 35 L38 18"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35, ease: 'easeInOut' }}
        />
      </svg>
    </motion.div>
    {/* Ripple rings */}
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="absolute inset-0 rounded-full border-2 border-emerald-400"
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 2.2 + i * 0.5, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.4 + i * 0.2, ease: 'easeOut', repeat: 0 }}
      />
    ))}
  </div>
);

/* ─── Order number generator ─── */
const orderNum = `GUFU-${Date.now().toString(36).toUpperCase().slice(-6)}`;

export const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  // Auto-redirect to home after 10s
  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        navigate('/');
      }
    }, 10000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center overflow-hidden"
    >
      <Burst />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.1, 0.64, 1] }}
        className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl p-8 flex flex-col items-center gap-6"
      >
        <AnimatedCheck />

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white"
          >
            Order Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-slate-500 dark:text-slate-400 mt-2 text-sm"
          >
            Thank you for your purchase. We'll send a confirmation email shortly.
          </motion.p>
        </div>

        {/* Order summary card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-3 text-sm"
        >
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Order number</span>
            <span className="font-extrabold text-primary font-mono">{orderNum}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Estimated delivery</span>
            <span className="font-semibold text-slate-900 dark:text-white">3–5 business days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Shipping</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Free</span>
          </div>
          <div className="pt-1 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            You'll receive tracking info by email once your order ships.
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3 w-full"
        >
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold shadow-md shadow-indigo-500/20 hover:bg-primary-dark transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:border-primary hover:text-primary transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </button>
        </motion.div>

        {/* Auto-redirect hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-xs text-slate-400"
        >
          Redirecting to home in 10 seconds…
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
