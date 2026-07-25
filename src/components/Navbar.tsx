import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Heart, User, Sparkles, LogOut, Package, Settings, ChevronDown, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AuthModal } from './AuthModal';

interface NavbarProps {
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart: _onOpenCart }) => {
  const { cart, wishlist, searchQuery, setSearchQuery, isDark, toggleDark, currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Monitor scrolling to apply glassmorphic backdrop
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-slate-100/10'
          : 'bg-transparent border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-primary to-accent bg-clip-text text-transparent dark:from-white dark:via-indigo-400 dark:to-orange-400">
            ShopHub
          </span>
        </Link>

        {/* Search Bar - Center */}
        <div className="flex-1 max-w-lg relative group hidden sm:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search premium products..."
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium placeholder-slate-400 text-slate-900 dark:text-white outline-none transition-all duration-300 focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 focus:shadow-[0_0_15px_rgba(79,70,229,0.15)]"
          />
        </div>

        {/* Action Controls - Right */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDark}
            className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-indigo-400 transition-colors overflow-hidden"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="block"
                >
                  <Sun className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="block"
                >
                  <Moon className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Wishlist Button */}
          <a
            href="#wishlist"
            className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-655 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-rose-500 text-[10px] font-extrabold text-white flex items-center justify-center border border-white dark:border-slate-950 shadow-sm"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </a>

          {/* Cart Button */}
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-655 hover:text-primary dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            <AnimatePresence>
              {totalCartItems > 0 && (
                <motion.span
                  key={totalCartItems} // triggers keyframes on count update
                  initial={{ scale: 0.6 }}
                  animate={{
                    scale: [0.6, 1.2, 1],
                    y: [0, -4, 0]
                  }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-[10px] font-extrabold text-white flex items-center justify-center border border-white dark:border-slate-950 shadow-sm"
                >
                  {totalCartItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                if (currentUser) {
                  setShowProfileMenu(!showProfileMenu);
                } else {
                  setAuthTab('login');
                  setAuthOpen(true);
                }
              }}
              className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 transition-all duration-200"
            >
              {currentUser ? (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-xs font-extrabold shadow-sm">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary/10 to-accent/10 flex items-center justify-center border border-primary/20">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-550 hidden sm:block" />
            </button>

            <AnimatePresence>
              {showProfileMenu && currentUser && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2.5 w-52 bg-white/90 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl py-2 z-20"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-900 mb-1.5">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-400 font-medium truncate">{currentUser.email}</p>
                    </div>
                    <a href="#profile" onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-655 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <User className="w-4 h-4" /> Your Profile
                    </a>
                    <a href="#orders" onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-655 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <Package className="w-4 h-4" /> Track Orders
                    </a>
                    <a href="#settings" onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-655 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </a>
                    <div className="border-t border-slate-100 dark:border-slate-900 my-1.5" />
                    <button
                      onClick={() => { setShowProfileMenu(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-500 hover:bg-rose-500/5 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Auth Modal */}
          <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialTab={authTab} />
        </div>
      </div>

      {/* Mobile Search Bar - displayed only under navbar on mobile */}
      <div className="px-4 pb-3 sm:hidden">
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search premium products..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium placeholder-slate-400 text-slate-900 dark:text-white outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
          />
        </div>
      </div>
    </header>
  );
};
