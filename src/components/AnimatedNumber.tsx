import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  className?: string;
}

/**
 * Renders a number where each digit rolls up or down when the value changes,
 * like a mechanical odometer / slot machine.
 */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 2,
  prefix = '',
  className = '',
}) => {
  const formatted = value.toFixed(decimals);
  const prevRef = useRef(formatted);
  const [prev, setPrev] = useState(formatted);
  const [current, setCurrent] = useState(formatted);

  useEffect(() => {
    setPrev(prevRef.current);
    setCurrent(formatted);
    prevRef.current = formatted;
  }, [formatted]);

  const isUp = parseFloat(current) >= parseFloat(prev);

  // Split into individual characters so each digit animates independently
  const chars = current.split('');

  return (
    <span className={`inline-flex items-baseline overflow-hidden ${className}`}>
      {prefix && <span>{prefix}</span>}
      {chars.map((char, i) => (
        <span key={i} className="relative inline-block overflow-hidden" style={{ height: '1.2em' }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${i}-${char}`}
              initial={{ y: isUp ? '100%' : '-100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: isUp ? '-100%' : '100%', opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="block leading-none"
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
};
