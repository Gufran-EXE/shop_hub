import React, { useRef, useState, useEffect } from 'react';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../data/products';
import { ProductCard } from './ProductCard';

interface DealsSectionProps {
  products: Product[];
}

export const DealsSection: React.FC<DealsSectionProps> = ({ products }) => {
  const deals = products.filter((p) => p.isDeal);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollLimits = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollLimits);
      // Run once initially
      checkScrollLimits();
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScrollLimits);
      }
    };
  }, [deals]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340; // width of card + gap approx
      const currentScroll = scrollRef.current.scrollLeft;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (deals.length === 0) return null;

  return (
    <section className="relative py-12 border-b border-slate-200/40 dark:border-slate-800/40" id="deals">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-accent">
            <Flame className="w-5 h-5 fill-current animate-bounce" />
            <span className="text-xs font-black tracking-widest uppercase">Flash Sale</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Deals of the Day
          </h2>
        </div>

        {/* Scroll Arrows */}
        <div className="flex gap-2">
          <button
            onClick={() => handleScroll('left')}
            disabled={!showLeftArrow}
            className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-655 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-slate-450`}
            title="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!showRightArrow}
            className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-655 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-slate-450`}
            title="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {deals.map((product) => (
          <div
            key={product.id}
            className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start snap-always"
          >
            <ProductCard product={product} showTimer={true} />
          </div>
        ))}
      </div>
    </section>
  );
};
