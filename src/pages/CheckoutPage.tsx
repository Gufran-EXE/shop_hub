import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin, CreditCard, ClipboardList, Check, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AnimatedNumber } from '../components/AnimatedNumber';

/* ─── Types ─── */
interface AddressForm {
  fullName: string; email: string; phone: string;
  line1: string; line2: string; city: string; state: string; zip: string; country: string;
}
interface PaymentForm {
  cardName: string; cardNumber: string; expiry: string; cvv: string;
}

const STEPS = [
  { id: 0, label: 'Address',  icon: MapPin },
  { id: 1, label: 'Payment',  icon: CreditCard },
  { id: 2, label: 'Review',   icon: ClipboardList },
];

/* ─── Shared field component ─── */
const Field: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; maxLength?: number; span?: boolean;
}> = ({ label, value, onChange, placeholder, type = 'text', maxLength, span }) => (
  <div className={span ? 'sm:col-span-2' : ''}>
    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
    />
  </div>
);

/* ─── Step slide variants ─── */
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [address, setAddress] = useState<AddressForm>({
    fullName: '', email: '', phone: '', line1: '', line2: '',
    city: '', state: '', zip: '', country: '',
  });
  const [payment, setPayment] = useState<PaymentForm>({
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });

  const subtotal = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handlePlaceOrder = () => {
    clearCart();
    navigate('/order-success');
  };

  /* ─── Format helpers ─── */
  const fmtCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExpiry = (v: string) =>
    v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');

  const progressPct = ((step) / (STEPS.length - 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-8">Checkout</h1>

      {/* ── Progress bar ── */}
      <div className="mb-10">
        <div className="relative h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <div className="flex justify-between">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <button
                key={s.id}
                onClick={() => step > s.id && goTo(s.id)}
                disabled={step <= s.id}
                className="flex flex-col items-center gap-1.5 group disabled:cursor-default"
              >
                <motion.div
                  animate={{
                    backgroundColor: done ? '#4f46e5' : active ? '#4f46e5' : 'transparent',
                    borderColor: done || active ? '#4f46e5' : '#cbd5e1',
                    scale: active ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                >
                  {done
                    ? <Check className="w-4 h-4 text-white" />
                    : <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  }
                </motion.div>
                <span className={`text-xs font-bold hidden sm:block ${active ? 'text-primary' : done ? 'text-slate-500' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Wizard panels ── */}
        <div className="lg:col-span-2 overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            {/* STEP 0 — Address */}
            {step === 0 && (
              <motion.div key="address"
                custom={direction} variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 space-y-5">
                  <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" value={address.fullName} onChange={(v) => setAddress(a => ({ ...a, fullName: v }))} placeholder="Jane Smith" span />
                    <Field label="Email" type="email" value={address.email} onChange={(v) => setAddress(a => ({ ...a, email: v }))} placeholder="jane@example.com" />
                    <Field label="Phone" type="tel" value={address.phone} onChange={(v) => setAddress(a => ({ ...a, phone: v }))} placeholder="+1 555 000 0000" />
                    <Field label="Address Line 1" value={address.line1} onChange={(v) => setAddress(a => ({ ...a, line1: v }))} placeholder="123 Main St" span />
                    <Field label="Address Line 2 (optional)" value={address.line2} onChange={(v) => setAddress(a => ({ ...a, line2: v }))} placeholder="Apt 4B" span />
                    <Field label="City" value={address.city} onChange={(v) => setAddress(a => ({ ...a, city: v }))} placeholder="New York" />
                    <Field label="State / Province" value={address.state} onChange={(v) => setAddress(a => ({ ...a, state: v }))} placeholder="NY" />
                    <Field label="ZIP / Postal Code" value={address.zip} onChange={(v) => setAddress(a => ({ ...a, zip: v }))} placeholder="10001" />
                    <Field label="Country" value={address.country} onChange={(v) => setAddress(a => ({ ...a, country: v }))} placeholder="United States" />
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

            {/* STEP 1 — Payment */}
            {step === 1 && (
              <motion.div key="payment"
                custom={direction} variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 space-y-5">
                  <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" /> Payment Details
                  </h2>

                  {/* Card preview */}
                  <div className="relative h-44 rounded-2xl bg-gradient-to-br from-primary to-indigo-800 p-6 text-white shadow-xl shadow-indigo-500/30 overflow-hidden select-none">
                    <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
                    <div className="absolute -bottom-10 -left-6 w-48 h-48 rounded-full bg-white/5" />
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-6">Credit Card</p>
                    <p className="font-mono text-lg tracking-widest">
                      {(payment.cardNumber || '•••• •••• •••• ••••')}
                    </p>
                    <div className="flex justify-between items-end mt-4">
                      <div>
                        <p className="text-[10px] opacity-60 uppercase tracking-wider">Card Holder</p>
                        <p className="font-semibold text-sm">{payment.cardName || 'YOUR NAME'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] opacity-60 uppercase tracking-wider">Expires</p>
                        <p className="font-semibold text-sm">{payment.expiry || 'MM/YY'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Cardholder Name" value={payment.cardName}
                      onChange={(v) => setPayment(p => ({ ...p, cardName: v }))}
                      placeholder="Jane Smith" span />
                    <Field label="Card Number" value={payment.cardNumber}
                      onChange={(v) => setPayment(p => ({ ...p, cardNumber: fmtCard(v) }))}
                      placeholder="1234 5678 9012 3456" maxLength={19} span />
                    <Field label="Expiry Date" value={payment.expiry}
                      onChange={(v) => setPayment(p => ({ ...p, expiry: fmtExpiry(v) }))}
                      placeholder="MM/YY" maxLength={5} />
                    <Field label="CVV" value={payment.cvv}
                      onChange={(v) => setPayment(p => ({ ...p, cvv: v.replace(/\D/g, '').slice(0, 4) }))}
                      placeholder="•••" type="password" maxLength={4} />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Lock className="w-3.5 h-3.5" /> Your payment is encrypted and secure.
                  </div>

                  <div className="flex justify-between pt-2">
                    <button onClick={() => goTo(0)} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors">
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
              <motion.div key="review"
                custom={direction} variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 space-y-5">
                  <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" /> Review & Place Order
                  </h2>

                  {/* Address summary */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Shipping To</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{address.fullName || 'No name entered'}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{[address.line1, address.city, address.state, address.zip, address.country].filter(Boolean).join(', ') || '—'}</p>
                  </div>

                  {/* Payment summary */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Paying With</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {payment.cardNumber ? `•••• •••• •••• ${payment.cardNumber.replace(/\s/g, '').slice(-4)}` : 'No card entered'}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-3 items-center">
                        <img src={item.product.image} alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button onClick={() => goTo(1)} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors">
                      Back
                    </button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={handlePlaceOrder}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20 transition-colors">
                      <Lock className="w-4 h-4" /> Place Order
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
                <span className="text-slate-600 dark:text-slate-400 line-clamp-1 flex-1">{item.product.name} ×{item.quantity}</span>
                <span className="font-semibold text-slate-900 dark:text-white flex-shrink-0">${(item.product.price * item.quantity).toFixed(2)}</span>
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
