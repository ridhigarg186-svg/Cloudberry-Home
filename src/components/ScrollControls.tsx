import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const ScrollControls: React.FC = () => {
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Show Up button if scrolled down more than 200px
      setShowUp(scrollY > 200);

      // Show Down button if there is still content below
      setShowDown(scrollY + windowHeight < docHeight - 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-1.5"
      aria-label="Page scroll controls"
    >
      {/* Scroll Up Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-[#FCFAF6] text-[#201610] shadow-md border border-[#E2D9CC] hover:bg-[#2A1E17] hover:text-[#FAF6F0] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer ${
          showUp ? 'opacity-100 translate-y-0' : 'opacity-40 hover:opacity-100'
        }`}
        title="Scroll to Top"
        aria-label="Scroll to top of page"
      >
        <ChevronUp className="h-4 w-4" />
      </button>

      {/* Scroll Down Button */}
      <button
        type="button"
        onClick={scrollToBottom}
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-[#FCFAF6] text-[#201610] shadow-md border border-[#E2D9CC] hover:bg-[#2A1E17] hover:text-[#FAF6F0] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer ${
          showDown ? 'opacity-100 translate-y-0' : 'opacity-40 hover:opacity-100'
        }`}
        title="Scroll to Bottom"
        aria-label="Scroll to bottom of page"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
};
