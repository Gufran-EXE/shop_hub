import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    setEmail('');
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  const socialLinks = [
    { icon: <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>, href: "#instagram", label: "Instagram" },
    { icon: <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>, href: "#twitter", label: "Twitter" },
    { icon: <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>, href: "#facebook", label: "Facebook" },
    { icon: <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163c-.272-1.02-.1-9-.1-9s0-4.07-.53-5.837c-.272-1.127-1.159-2.014-2.287-2.183C19.7 4.7 12 4.7 12 4.7s-7.7 0-9.47.28c-1.128.183-2.015 1.07-2.287 2.183C0 7.93 0 12 0 12s0 4.07.53 5.837c.272 1.127 1.159 2.014 2.287 2.183C4.3 20.3 12 20.3 12 20.3s7.7 0 9.47-.28c1.128-.183 2.015-1.07 2.287-2.183C24 16.07 24 12 24 12s0-4.07-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, href: "#youtube", label: "Youtube" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Promise Band */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-primary">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Free Express Shipping</h4>
              <p className="text-xs text-slate-500 mt-0.5">On all orders over $150. Delivery within 2-4 days.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-primary">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-500 mt-0.5">30-day money back guarantee, no questions asked.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Secure Payment Gateway</h4>
              <p className="text-xs text-slate-500 mt-0.5">256-bit encryption ensuring secure transactions.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">A</span>
              </div>
              <span className="text-lg font-black tracking-wider text-white">AURA</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Elevating your daily experience with carefully curated tech gadgets, premium lifestyle accessories, and wellness goods.
            </p>
            
            {/* Socials */}
            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ y: -5, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-primary hover:text-white flex items-center justify-center text-slate-400 transition-colors shadow-sm"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Cols */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-6">
            <div className="space-y-4">
              <h5 className="text-xs font-black tracking-widest text-white uppercase">Shop</h5>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#collections" className="hover:text-white transition-colors">Electronics</a></li>
                <li><a href="#collections" className="hover:text-white transition-colors">Fashion Apparel</a></li>
                <li><a href="#collections" className="hover:text-white transition-colors">Home & Decor</a></li>
                <li><a href="#collections" className="hover:text-white transition-colors">Wellness</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h5 className="text-xs font-black tracking-widest text-white uppercase">Company</h5>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#journal" className="hover:text-white transition-colors">Our Journal</a></li>
                <li><a href="#press" className="hover:text-white transition-colors">Press Kit</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-black tracking-widest text-white uppercase">Support</h5>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#shipping" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Col */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="text-xs font-black tracking-widest text-white uppercase">Newsletter</h5>
            <p className="text-sm text-slate-500 leading-relaxed">
              Subscribe to unlock early access to new collections and exclusive discounts.
            </p>

            <form onSubmit={handleSubmit} className="relative pt-2">
              <div className="flex items-center gap-2 pb-2 relative group">
                <Mail className="w-4 h-4 text-slate-500 group-focus-within:text-white flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-transparent text-sm w-full border-none outline-none text-white placeholder-slate-600 focus:placeholder-slate-500"
                  required
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex-shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Underline grow animation on focus */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800" />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-300" />
              </div>
            </form>

            <AnimatePresence>
              {isSubmitted && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-emerald-500 font-semibold"
                >
                  Subscription success! Check your inbox soon.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom copyright and payments */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-medium">
          <p>© {new Date().getFullYear()} Aura E-Commerce. All rights reserved.</p>
          
          {/* Payment Badges */}
          <div className="flex items-center gap-3 select-none">
            <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400">Visa</span>
            <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400">Mastercard</span>
            <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400">Apple Pay</span>
            <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400">PayPal</span>
            <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400">Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
