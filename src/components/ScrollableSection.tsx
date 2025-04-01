
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ScrollableSectionProps {
  title: string;
  viewAllText: string;
  viewAllLink: string;
  isLoading: boolean;
  skeletonCount?: number;
  hasMore?: boolean;
  children: React.ReactNode;
}

const ScrollableSection: React.FC<ScrollableSectionProps> = ({
  title,
  viewAllText,
  viewAllLink,
  isLoading,
  skeletonCount = 3,
  hasMore = false,
  children
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const checkArrows = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5); // 5px threshold
      }
    };
    
    checkArrows();
    
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkArrows);
      window.addEventListener('resize', checkArrows);
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkArrows);
      }
      window.removeEventListener('resize', checkArrows);
    };
  }, [children, isLoading]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold font-darker">{title}</h2>
        <a 
          href={viewAllLink}
          className="text-tango-primary font-medium flex items-center text-sm hover:underline"
        >
          {viewAllText}
          <ChevronRight size={16} className="ml-1" />
        </a>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(skeletonCount)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="relative">
          {showLeftArrow && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center focus:outline-none"
              style={{ marginLeft: '-12px' }}
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          {showRightArrow && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center focus:outline-none"
              style={{ marginRight: '-12px' }}
            >
              <ChevronRight size={24} />
            </button>
          )}
          
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide space-x-6 py-2 px-1"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
            }}
          >
            {/* Adjust card sizes to ensure partial visibility of next card */}
            {React.Children.map(children, child => (
              <div className={`flex-none ${isMobile ? 'w-[75%]' : 'w-full md:w-1/3 lg:w-1/3'} min-w-[240px]`}>
                {child}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollableSection;
