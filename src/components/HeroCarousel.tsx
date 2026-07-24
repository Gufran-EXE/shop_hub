import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  badge: string;
  colorScheme: 'dark' | 'light';
}

export const HeroCarousel: React.FC = () => {
  const slides: Slide[] = [
    {
      id: 1,
      badge: "NEW ARRIVAL",
      title: "The Sound of Luxury",
      subtitle: "AeroSound Pro Edition",
      description: "Enjoy acoustic purity with hybrid active noise cancellation, smart adaptive spatial audio, and an ultra-premium carbon finish.",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1600&auto=format&fit=crop&q=80",
      ctaText: "Explore Collection",
      ctaLink: "#deals",
      colorScheme: 'dark',
    },
    {
      id: 2,
      badge: "EXQUISITE TIMEPIECES",
      title: "Timeless Sophistication",
      subtitle: "ChronoLux Chronograph",
      description: "Handcrafted automatic movements, sapphire dome crystal glass, and full-grain Italian leather strap designed for the discerning explorer.",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&auto=format&fit=crop&q=80",
      ctaText: "Shop Watches",
      ctaLink: "#deals",
      colorScheme: 'light',
    },
    {
      id: 3,
      badge: "FUTURE OF PLAY",
      title: "Enter the NebulaCore",
      subtitle: "Virtual Reality System",
      description: "Dive into ultra-realistic metaverse environments with stunning 5K screen output, spatial sound drivers, and precision body tracking.",
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=1600&auto=format&fit=crop&q=80",
      ctaText: "Discover VR",
      ctaLink: "#deals",
      colorScheme: 'dark',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const timerRef = useRef<any>(null);

  const startAutoSlide = () => {
    stopAutoSlide();
    timerRef.current = setInterval(() => {
      setDirection('right');
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const handlePrev = () => {
    stopAutoSlide();
    setDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    startAutoSlide();
  };

  const handleNext = () => {
    stopAutoSlide();
    setDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    startAutoSlide();
  };

  const handleDotClick = (index: number) => {
    stopAutoSlide();
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
    startAutoSlide();
  };

  const slideVariants: any = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 220, damping: 26 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 220, damping: 26 },
        opacity: { duration: 0.3 }
      }
    }),
  };

  const textContainerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const textItemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const currentSlide = slides[currentIndex];

  return (
    <section 
      className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden bg-slate-900 group"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image with subtle overlay for contrast */}
          <div className="absolute inset-0 w-full h-full select-none">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover scale-105"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${
              currentSlide.colorScheme === 'dark'
                ? 'from-slate-950/85 via-slate-900/65 to-transparent'
                : 'from-white/85 via-slate-100/60 to-transparent'
            }`} />
          </div>

          {/* Slide Text Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <motion.div
                variants={textContainerVariants}
                initial="hidden"
                animate="show"
                className="max-w-xl space-y-4 sm:space-y-6"
              >
                {/* Badge Banner */}
                <motion.span
                  variants={textItemVariants}
                  className={`inline-block text-xs font-black tracking-widest px-3 py-1.5 rounded-full ${
                    currentSlide.colorScheme === 'dark'
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-indigo-600 text-white shadow-md'
                  }`}
                >
                  {currentSlide.badge}
                </motion.span>

                {/* Subtitle / Collection */}
                <motion.h1
                  variants={textItemVariants}
                  className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
                    currentSlide.colorScheme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {currentSlide.title}
                  <span className={`block text-xl sm:text-2xl font-bold mt-1 text-primary`}>
                    {currentSlide.subtitle}
                  </span>
                </motion.h1>

                {/* Short Paragraph Description */}
                <motion.p
                  variants={textItemVariants}
                  className={`text-sm sm:text-base font-normal leading-relaxed ${
                    currentSlide.colorScheme === 'dark' ? 'text-slate-300' : 'text-slate-650'
                  }`}
                >
                  {currentSlide.description}
                </motion.p>

                {/* CTA Action button */}
                <motion.div variants={textItemVariants} className="pt-2 sm:pt-4">
                  <a
                    href={currentSlide.ctaLink}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark shadow-lg shadow-indigo-600/20 hover:shadow-xl transition-all duration-200 group/btn"
                  >
                    {currentSlide.ctaText}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons (Left/Right Arrows) */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 text-white backdrop-blur-sm border border-white/10 hover:scale-105 transition-all opacity-0 group-hover:opacity-100 z-10 hidden sm:block"
        title="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 text-white backdrop-blur-sm border border-white/10 hover:scale-105 transition-all opacity-0 group-hover:opacity-100 z-10 hidden sm:block"
        title="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Index Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-indigo-500 shadow-md shadow-indigo-500/25' : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
            title={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
