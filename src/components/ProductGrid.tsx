import React from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import type { Product } from '../data/products';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  loading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  emptyMessage = "No products found matching your criteria.",
}) => {
  // Skeleton cards while loading
  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 animate-pulse">
            <div className="aspect-square bg-slate-200 dark:bg-slate-800" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (products.length === 0) {
    return (
      <div className="py-16 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};
