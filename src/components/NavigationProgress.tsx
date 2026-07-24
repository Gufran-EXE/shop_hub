import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * YouTube/Notion-style top loading bar.
 * Fills quickly to ~85%, then completes when the new route renders.
 */
export const NavigationProgress: React.FC = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathRef = useRef(location.pathname);

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (location.pathname === prevPathRef.current) return;
    prevPathRef.current = location.pathname;

    clear();
    setProgress(0);
    setVisible(true);

    // Tick up quickly to ~85%
    let current = 0;
    intervalRef.current = setInterval(() => {
      current += Math.random() * 18;
      if (current >= 85) {
        current = 85;
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      setProgress(current);
    }, 80);

    // After 120ms complete to 100% and hide
    timerRef.current = setTimeout(() => {
      clear();
      setProgress(100);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 320);
    }, 120);

    return clear;
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
          aria-hidden
        >
          <motion.div
            className="h-full bg-primary rounded-r-full shadow-[0_0_8px_rgba(79,70,229,0.7)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: progress === 100 ? 0.2 : 0.08, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
