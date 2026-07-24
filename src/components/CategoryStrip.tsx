import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Shirt, Home, HeartPulse, Bike, BookOpen, Sparkles, Coffee } from 'lucide-react';

interface Category {
  name: string;
  label: string;
  icon: React.ReactNode;
}

interface CategoryStripProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryStrip: React.FC<CategoryStripProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories: Category[] = [
    { name: "Electronics", label: "Electronics", icon: <Smartphone className="w-5 h-5" /> },
    { name: "Fashion", label: "Fashion", icon: <Shirt className="w-5 h-5" /> },
    { name: "Home", label: "Home & Decor", icon: <Home className="w-5 h-5" /> },
    { name: "Wellness", label: "Health & Care", icon: <HeartPulse className="w-5 h-5" /> },
    { name: "Sports", label: "Sports & Fit", icon: <Bike className="w-5 h-5" /> },
    { name: "Books", label: "Books & Station", icon: <BookOpen className="w-5 h-5" /> },
    { name: "Beauty", label: "Beauty & Style", icon: <Sparkles className="w-5 h-5" /> },
    { name: "Gourmet", label: "Gourmet & Cafe", icon: <Coffee className="w-5 h-5" /> },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200/40 dark:border-slate-800/40 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {/* 'All Products' category */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative flex-shrink-0 ${
              selectedCategory === null
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
            }`}
          >
            <span>All Collections</span>
            {selectedCategory === null && (
              <motion.div
                layoutId="activeCategoryUnderline"
                className="absolute bottom-[-1px] left-3 right-3 h-0.5 bg-primary rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative flex-shrink-0 hover:-translate-y-0.5 ${
                  isSelected
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <div className={`p-1 rounded-lg ${isSelected ? 'text-primary' : 'text-slate-400'}`}>
                  {cat.icon}
                </div>
                <span>{cat.label}</span>
                
                {/* Underline Indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryUnderline"
                    className="absolute bottom-[-1px] left-3 right-3 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
