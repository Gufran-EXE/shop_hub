import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { AuthUser } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

/* ── Floating Label Input ─────────────────────────────── */
interface FloatInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  shake?: boolean;
  rightSlot?: React.ReactNode;
  autoComplete?: string;
}

const FloatInput: React.FC<FloatInputProps> = ({
  id, label, type = 'text', value, onChange, error, shake, rightSlot, autoComplete,
}) => {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <motion.div
      animate={shake ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
      className="relative"
    >
      <div className={`relative rounded-xl border transition-all duration-200 ${
        error
          ? 'border-rose-400 dark:border-rose-500 bg-rose-50/50 dark:bg-rose-500/5'
          : focused
          ? 'border-primary ring-2 ring-primary/10 bg-white dark:bg-slate-900'
          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60'
      }`}>
        <label
          htmlFor={id}
          className={`absolute left-4 font-medium pointer-events-none transition-all duration-200 ${
            floated
              ? 'top-1.5 text-[10px] text-primary'
              : 'top-1/2 -translate-y-1/2 text-sm text-slate-400'
          }`}
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent px-4 pt-5 pb-2 text-sm font-medium text-slate-900 dark:text-white outline-none rounded-xl pr-10"
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-xs text-rose-500 mt-1 ml-1 font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ── Password Strength Meter ──────────────────────────── */
const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6)  s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const label = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'][score] ?? '';
  const color = ['', 'bg-rose-500', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500', 'bg-emerald-600'][score] ?? '';
  const textColor = ['', 'text-rose-500', 'text-orange-400', 'text-yellow-500', 'text-emerald-500', 'text-emerald-600'][score] ?? '';

  if (!password) return null;

  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1 h-1">
        {[1,2,3,4,5].map((i) => (
          <div key={i} className="flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${i <= score ? color : ''}`}
              initial={{ width: 0 }}
              animate={{ width: i <= score ? '100%' : '0%' }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
            />
          </div>
        ))}
      </div>
      <p className={`text-[11px] font-semibold ${textColor}`}>{label}</p>
    </div>
  );
};

/* ── Submit Button ────────────────────────────────────── */
type BtnState = 'idle' | 'loading' | 'success';
const SubmitButton: React.FC<{ state: BtnState; label: string }> = ({ state, label }) => (
  <motion.button
    type="submit"
    whileTap={{ scale: 0.97 }}
    disabled={state !== 'idle'}
    className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-indigo-500/20 hover:bg-primary-dark transition-colors disabled:opacity-80 flex items-center justify-center gap-2"
  >
    <AnimatePresence mode="wait">
      {state === 'loading' && (
        <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Please wait…
        </motion.span>
      )}
      {state === 'success' && (
        <motion.span key="s" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          className="flex items-center gap-2">
          <Check className="w-4 h-4" /> Done!
        </motion.span>
      )}
      {state === 'idle' && (
        <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {label}
        </motion.span>
      )}
    </AnimatePresence>
  </motion.button>
);

/* ── Main Modal ───────────────────────────────────────── */
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { loginUser, addToast } = useApp();
  const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const tabRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0 });

  // Login state
  const [lEmail, setLEmail] = useState('');
  const [lPass, setLPass]   = useState('');
  const [lShowPass, setLShowPass] = useState(false);
  const [lErrors, setLErrors] = useState<Record<string, string>>({});
  const [lShake, setLShake]   = useState<Record<string, boolean>>({});
  const [lState, setLState]   = useState<BtnState>('idle');

  // Register state
  const [rName, setRName]   = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPass, setRPass]   = useState('');
  const [rConf, setRConf]   = useState('');
  const [rShowPass, setRShowPass] = useState(false);
  const [rErrors, setRErrors] = useState<Record<string, string>>({});
  const [rShake, setRShake]   = useState<Record<string, boolean>>({});
  const [rState, setRState]   = useState<BtnState>('idle');

  // Update sliding pill under active tab
  useEffect(() => {
    const el = tabRef.current[tab];
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const pRect = parent.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setPill({ left: eRect.left - pRect.left, width: eRect.width });
  }, [tab, isOpen]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setLEmail(''); setLPass(''); setLErrors({}); setLState('idle');
      setRName(''); setREmail(''); setRPass(''); setRConf(''); setRErrors({}); setRState('idle');
    }
  }, [isOpen, initialTab]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const shakeField = (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>, field: string) => {
    setter((s) => ({ ...s, [field]: true }));
    setTimeout(() => setter((s) => ({ ...s, [field]: false })), 500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLErrors({});
    if (!lEmail) { setLErrors({ email: 'Email is required.' }); shakeField(setLShake, 'email'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lEmail)) { setLErrors({ email: 'Enter a valid email address.' }); shakeField(setLShake, 'email'); return; }
    if (!lPass)  { setLErrors({ pass: 'Password is required.' }); shakeField(setLShake, 'pass'); return; }

    setLState('loading');
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lEmail, password: lPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLState('idle');
        const field = data.error?.toLowerCase().includes('password') ? 'pass' : 'email';
        setLErrors({ [field]: data.error });
        shakeField(setLShake, field);
        return;
      }
      setLState('success');
      const user: AuthUser = { id: data.id, name: data.name, email: data.email };
      if (data.token) localStorage.setItem('gufu_token', data.token);
      setTimeout(async () => {
        await loginUser(user);
        addToast(`Welcome back, ${user.name}!`, 'success');
        onClose();
      }, 600);
    } catch {
      setLState('idle');
      setLErrors({ email: 'Backend server is not running. Run npm run dev:server locally.' });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRErrors({});
    if (!rName)  { setRErrors({ name: 'Name is required.' }); shakeField(setRShake, 'name'); return; }
    if (!rEmail) { setRErrors({ email: 'Email is required.' }); shakeField(setRShake, 'email'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rEmail)) { setRErrors({ email: 'Enter a valid email address.' }); shakeField(setRShake, 'email'); return; }
    if (rPass.length < 6) { setRErrors({ pass: 'Minimum 6 characters.' }); shakeField(setRShake, 'pass'); return; }
    if (rPass !== rConf) { setRErrors({ conf: 'Passwords do not match.' }); shakeField(setRShake, 'conf'); return; }

    setRState('loading');
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: rName, email: rEmail, password: rPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRState('idle');
        const field = data.error?.toLowerCase().includes('email') ? 'email' : 'name';
        setRErrors({ [field]: data.error });
        shakeField(setRShake, field);
        return;
      }
      setRState('success');
      const user: AuthUser = { id: data.id, name: data.name, email: data.email };
      if (data.token) localStorage.setItem('gufu_token', data.token);
      setTimeout(async () => {
        await loginUser(user);
        addToast(`Welcome, ${user.name}! Account created.`, 'success');
        onClose();
      }, 600);
    } catch {
      setRState('idle');
      setRErrors({ name: 'Backend server is not running. Run npm run dev:server locally.' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ duration: 0.25, ease: [0.34, 1.1, 0.64, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
          >
            <div
              className="pointer-events-auto w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {tab === 'login' ? 'Welcome back' : 'Create account'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {tab === 'login' ? 'Sign in to your GUFU account' : 'Join GUFU — it\'s free'}
                  </p>
                </div>
                <button onClick={onClose}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab bar */}
              <div className="relative flex mx-6 mb-5 bg-slate-100 dark:bg-slate-800/60 rounded-xl p-1">
                <motion.span
                  className="absolute top-1 bottom-1 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
                  animate={{ left: pill.left, width: pill.width }}
                  transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                />
                {(['login', 'register'] as const).map((t) => (
                  <button
                    key={t}
                    ref={(el) => { tabRef.current[t] = el; }}
                    onClick={() => setTab(t)}
                    className={`relative z-10 flex-1 py-2 text-sm font-bold rounded-lg transition-colors duration-200 ${
                      tab === t ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {t === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              {/* Forms */}
              <div className="px-6 pb-6">
                <AnimatePresence mode="wait">
                  {tab === 'login' ? (
                    <motion.form key="login"
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}
                      onSubmit={handleLogin} className="space-y-3"
                    >
                      <FloatInput id="l-email" label="Email address" type="email" value={lEmail}
                        onChange={setLEmail} error={lErrors.email} shake={lShake.email} autoComplete="email" />
                      <FloatInput id="l-pass" label="Password" type={lShowPass ? 'text' : 'password'}
                        value={lPass} onChange={setLPass} error={lErrors.pass} shake={lShake.pass}
                        autoComplete="current-password"
                        rightSlot={
                          <button type="button" onClick={() => setLShowPass(!lShowPass)}
                            className="text-slate-400 hover:text-primary transition-colors" tabIndex={-1}>
                            {lShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        }
                      />
                      <div className="text-right">
                        <button type="button" className="text-xs text-primary font-semibold hover:underline">
                          Forgot password?
                        </button>
                      </div>
                      <SubmitButton state={lState} label="Sign In" />
                      <p className="text-center text-xs text-slate-400 pt-1">
                        Don't have an account?{' '}
                        <button type="button" onClick={() => setTab('register')}
                          className="text-primary font-bold hover:underline">Sign up</button>
                      </p>
                    </motion.form>
                  ) : (
                    <motion.form key="register"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                      onSubmit={handleRegister} className="space-y-3"
                    >
                      <FloatInput id="r-name" label="Full name" value={rName}
                        onChange={setRName} error={rErrors.name} shake={rShake.name} autoComplete="name" />
                      <FloatInput id="r-email" label="Email address" type="email" value={rEmail}
                        onChange={setREmail} error={rErrors.email} shake={rShake.email} autoComplete="email" />
                      <div>
                        <FloatInput id="r-pass" label="Password" type={rShowPass ? 'text' : 'password'}
                          value={rPass} onChange={setRPass} error={rErrors.pass} shake={rShake.pass}
                          autoComplete="new-password"
                          rightSlot={
                            <button type="button" onClick={() => setRShowPass(!rShowPass)}
                              className="text-slate-400 hover:text-primary transition-colors" tabIndex={-1}>
                              {rShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          }
                        />
                        <PasswordStrength password={rPass} />
                      </div>
                      <FloatInput id="r-conf" label="Confirm password" type="password"
                        value={rConf} onChange={setRConf} error={rErrors.conf} shake={rShake.conf}
                        autoComplete="new-password" />
                      <SubmitButton state={rState} label="Create Account" />
                      <p className="text-center text-xs text-slate-400 pt-1">
                        Already have an account?{' '}
                        <button type="button" onClick={() => setTab('login')}
                          className="text-primary font-bold hover:underline">Sign in</button>
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
