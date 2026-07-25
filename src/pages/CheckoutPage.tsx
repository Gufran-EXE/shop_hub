import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, MapPin, CreditCard, ClipboardList,
  Check, Lock, Loader2, Truck, Smartphone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AnimatedNumber } from '../components/AnimatedNumber';

/* ─── Razorpay global type ─── */
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

/* ─── Types ─── */
interface AddressForm {
  fullName: string; email: string; phone: string;
  line1: string; line2: string; city: string;
  state: string; zip: string; country: string;
}

type PaymentMethod = 'razorpay' | 'cod';

const STEPS = [
  { id: 0, label: 'Address', icon: MapPin },
  { id: 1, label: 'Payment', icon: CreditCard },
  { id: 2, label: 'Review',  icon: ClipboardList },
];

/* ─── Shared field ─── */
const Field: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; span?: boolean;
}> = ({ label, value, onChange, placeholder, type = 'text', span }) => (
  <div className={span ? 'sm:col-span-2' : ''}>
    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
    />
  </div>
);

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useApp();
  const navigate = useNavigate();

  const [step, setStep]               = useState(0);
  const [direction, setDirection]     = useState(1);
  const [payMethod, setPayMethod]     = useState<PaymentMethod>('razorpay');
  const [payLoading, setPayLoading]   = useState(false);
  const [address, setAddress]         = useState<AddressForm>({
    fullName: '', email: '', phone: '', line1: '', line2: '',
    city: '', state: '', zip: '', country: '',
  });

  const subtotal = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total    = subtotal + shipping;

  const API = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  /* ── COD handler ── */
  const handleCOD = async () => {
    setPayLoading(true);
    try {
      const token = localStorage.getItem('gufu_token');
      await fetch(`${API}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: cart.map((i) => ({
            productId: i.product.id,
            name:      i.product.name,
            image:     i.product.image,
            price:     i.product.price,
            quantity:  i.quantity,
          })),
          shippingAddress: address,
          subtotal, shipping, discount: 0, total,
          paymentMethod: 'cod',
        }),
      });
    } catch { /* offline fallback — still proceed */ }
    clearCart();
    navigate('/order-success');
  };

  /* ── Razorpay handler ── */
  const handleRazorpay = async () => {
    setPayLoading(true);
    try {
      // 1. Create order on backend
      const res  = await fetch(`${API}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, currency: 'INR' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to create order');

      // 2. Load Razorpay SDK
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s   = document.createElement('script');
          s.src     = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload  = () => resolve();
          s.onerror = () => reject(new Error('Razorpay SDK failed to load'));
          document.body.appendChild(s);
        });
      }

      // 3. Open Razorpay modal
      const rzp = new window.Razorpay({
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        name:        'GUFU Store',
        description: `Order · ${cart.length} item${cart.length !== 1 ? 's' : ''}`,
        order_id:    data.orderId,
        prefill: {
          name:    address.fullName,
          email:   address.email,
          contact: address.phone,
        },
        theme: { color: '#4f46e5' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // 4. Verify + save order
          const token     = localStorage.getItem('gufu_token');
          const verifyRes = await fetch(`${API}/payments/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              ...response,
              items: cart.map((i) => ({
                productId: i.product.id,
                name:      i.product.name,
                image:     i.product.image,
                price:     i.product.price,
                quantity:  i.quantity,
              })),
              shippingAddress: address,
              subtotal, shipping, discount: 0, total,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.error ?? 'Verification failed');
          clearCart();
          navigate('/order-success');
        },
        modal: { ondismiss: () => setPayLoading(false) },
      });

      rzp.open();
    } catch (err) {
      console.error('Razorpay error:', err);
      setPayLoading(false);
    }
  };

  const handlePlaceOrder = () =>
    payMethod === 'razorpay' ? handleRazorpay() : handleCOD();

  const progressPct = (step / (STEPS.length - 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-8">
        Checkout
      </h1>

      {/* ── Progress bar ── */}
      <div className="mb-10">
        <div className="relative h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
        <div className="flex justify-between">
          {STEPS.map((s) => {
            const Icon   = s.icon;
            const done   = step > s.id;
            const active = step === s.id;
            return (
              <button
                key={s.id}
                onClick={() => step > s.id && goTo(s.id)}
                disabled={step <= s.id}
                className="flex flex-col items-center gap-1.5 disabled:cursor-default"
              >
                <motion.div
                  animate={{
                    backgroundColor: done || active ? '#4f46e5' : 'transparent',
                    borderColor:      done || active ? '#4f46e5' : '#cbd5e1',
                    scale:            active ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                >
                  {done
                    ? <Check className="w-4 h-4 text-white" />
                    : <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  }
                </motion.div>
                <span className={`text-xs font-bold hidden sm:block ${
                  active ? 'text-primary' : done ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Wizard ── */}
        <div className="lg:col-span-2 overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">

            {/* STEP 0 — Address */}
            {step === 0 && (
              <motion.div key="address" custom={direction} variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28, ease: 'easeInOut' }}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 space-y-5">
                  <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" value={address.fullName} onChange={(v) => setAddress(a => ({ ...a, fullName: v }))} placeholder="Jane Smith" span />
                    <Field label="Email" type="email" value={address.email} onChange={(v) => setAddress(a => ({ ...a, email: v }))} placeholder="jane@example.com" />
                    <Field label="Phone" type="tel" value={address.phone} onChange={(v) => setAddress(a => ({ ...a, phone: v }))} placeholder="+91 98765 43210" />
                    <Field label="Address Line 1" value={address.line1} onChange={(v) => setAddress(a => ({ ...a, line1: v }))} placeholder="123 Main St" span />
                    <Field label="Address Line 2 (optional)" value={address.line2} onChange={(v) => setAddress(a => ({ ...a, line2: v }))} placeholder="Apt 4B" span />
                    <Field label="City" value={address.city} onChange={(v) => setAddress(a => ({ ...a, city: v }))} placeholder="Mumbai" />
                    <Field label="State" value={address.state} onChange={(v) => setAddress(a => ({ ...a, state: v }))} placeholder="Maharashtra" />
                    <Field label="PIN Code" value={address.zip} onChange={(v) => setAddress(a => ({ ...a, zip: v }))} placeholder="400001" />
                    <Field label="Country" value={address.country} onChange={(v) => setAddress(a => ({ ...a, country: v }))} placeholder="India" />
                  </div>
                  <div className="flex justify-end pt-2">
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => goTo(1)}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-md shadow-indigo-500/20 hover:bg-primary-dark transition-colors">
                      Continue to Payment <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 1 — Payment Method */}
            {step === 1 && (
              <motion.div key="payment" custom={direction} variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28, ease: 'easeInOut' }}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 space-y-5">
                  <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Razorpay option */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setPayMethod('razorpay')}
                      className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${
                        payMethod === 'razorpay'
                          ? 'border-primary bg-primary/5 shadow-md shadow-indigo-500/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'
                      }`}
                    >
                      {payMethod === 'razorpay' && (
                        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </span>
                      )}
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-sm text-slate-900 dark:text-white">Pay Online</p>
                        <p className="text-xs text-slate-400 mt-0.5">UPI · Card · Netbanking · Wallet</p>
                      </div>
                      {/* Razorpay badge */}
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                        Powered by Razorpay
                      </div>
                    </motion.button>

                    {/* Cash on Delivery option */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setPayMethod('cod')}
                      className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 ${
                        payMethod === 'cod'
                          ? 'border-emerald-500 bg-emerald-500/5 shadow-md shadow-emerald-500/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400/40'
                      }`}
                    >
                      {payMethod === 'cod' && (
                        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </span>
                      )}
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                        <Truck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-sm text-slate-900 dark:text-white">Cash on Delivery</p>
                        <p className="text-xs text-slate-400 mt-0.5">Pay when your order arrives</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                        No extra charges
                      </div>
                    </motion.button>
                  </div>

                  {/* Info note */}
                  <AnimatePresence mode="wait">
                    {payMethod === 'razorpay' ? (
                      <motion.p key="rp" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        Razorpay's secure checkout will open after you review your order.
                        Supports UPI, cards, netbanking and wallets.
                      </motion.p>
                    ) : (
                      <motion.p key="cod" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        Pay in cash when your order is delivered. No online payment needed.
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between pt-2">
                    <button onClick={() => goTo(0)}
                      className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors">
                      Back
                    </button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => goTo(2)}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-md shadow-indigo-500/20 hover:bg-primary-dark transition-colors">
                      Review Order <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Review */}
            {step === 2 && (
              <motion.div key="review" custom={direction} variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28, ease: 'easeInOut' }}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 space-y-5">
                  <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" /> Review & Place Order
                  </h2>

                  {/* Address summary */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Shipping To</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{address.fullName || '—'}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {[address.line1, address.city, address.state, address.zip, address.country].filter(Boolean).join(', ') || '—'}
                    </p>
                  </div>

                  {/* Payment method summary */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Payment</p>
                    <div className="flex items-center gap-2">
                      {payMethod === 'razorpay'
                        ? <><Smartphone className="w-4 h-4 text-primary" /><span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Razorpay (Online Payment)</span></>
                        : <><Truck className="w-4 h-4 text-emerald-500" /><span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Cash on Delivery</span></>
                      }
                    </div>
                  </div>

                  {/* Cart items */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-3 items-center">
                        <img src={item.product.image} alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button onClick={() => goTo(1)}
                      className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors">
                      Back
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handlePlaceOrder}
                      disabled={payLoading}
                      className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-md transition-colors disabled:opacity-70 text-white ${
                        payMethod === 'razorpay'
                          ? 'bg-primary hover:bg-primary-dark shadow-indigo-500/20'
                          : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                      }`}
                    >
                      {payLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                      ) : payMethod === 'razorpay' ? (
                        <><Smartphone className="w-4 h-4" /> Pay with Razorpay</>
                      ) : (
                        <><Truck className="w-4 h-4" /> Place Order (COD)</>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Order Summary sidebar ── */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 space-y-4 lg:sticky lg:top-24">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Order Summary</h3>
          <div className="space-y-3 text-sm">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between gap-2">
                <span className="text-slate-600 dark:text-slate-400 line-clamp-1 flex-1">
                  {item.product.name} ×{item.quantity}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white flex-shrink-0">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Subtotal</span>
              <AnimatedNumber value={subtotal} prefix="$" className="font-semibold text-slate-900 dark:text-white" />
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Shipping</span>
              {shipping === 0
                ? <span className="font-semibold text-emerald-500">FREE</span>
                : <AnimatedNumber value={shipping} prefix="$" className="font-semibold text-slate-900 dark:text-white" />
              }
            </div>
            <div className="flex justify-between font-extrabold text-base text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Total</span>
              <AnimatedNumber value={total} prefix="$" className="text-primary" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
