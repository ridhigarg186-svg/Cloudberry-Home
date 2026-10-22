import React, { useState, useEffect } from 'react';
import {
  Search,
  User as UserIcon,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useShop, ViewType } from '../context/ShopContext';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setSelectedCategory,
    setSelectedCollection,
    cartCount,
    wishlist,
    setIsCartDrawerOpen,
    setIsSearchOpen,
    setIsAuthModalOpen,
    currentUser,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: ViewType, categorySlug?: string | null, colSlug?: string | null) => {
    if (categorySlug !== undefined) setSelectedCategory(categorySlug);
    if (colSlug !== undefined) setSelectedCollection(colSlug);
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ease-out ${
        isScrolled
          ? 'bg-[#F5F0E6]/98 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(32,22,16,0.08)] border-b border-[#E2D9CC]'
          : 'bg-[#F5F0E6]/92 backdrop-blur-sm border-b border-[#E2D9CC]/70'
      }`}
    >
      {/* Slim Promotional Announcement Bar */}
      <div className="bg-[#1E1610] text-[#FAF6F0] text-center text-xs py-2 px-4 font-normal tracking-wide flex items-center justify-center gap-2 border-b border-[#2A1E17]">
        <Sparkles className="h-3 w-3 text-[#C8A46B] animate-pulse" />
        <span>
          Complimentary express delivery across India on orders over ₹1,999 · Use code{' '}
          <strong className="text-[#C8A46B] tracking-wider font-semibold">CLOUDBERRY10</strong> for 10% off
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-18 sm:h-20' : 'h-20 sm:h-24'}`}>
          {/* LEFT SIDE: Website Name & Brand Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
            {/* Mobile menu toggle button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-[#201610] hover:text-[#483D35] hover:bg-[#EDE7DE] rounded-sm transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Cloudberry Home Brand Logo on the LEFT SIDE */}
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer text-left select-none focus-visible:outline-none transition-transform duration-300 hover:scale-[1.015]"
              aria-label="Cloudberry Home - Return to Homepage"
            >
              {/* Artisanal Botanical Seal Emblem */}
              <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-[#FCFAF6] via-[#F5F0E6] to-[#E2D9CC] border border-[#C8A46B]/60 shadow-2xs group-hover:border-[#C8A46B] group-hover:shadow-sm transition-all duration-300 shrink-0">
                <svg
                  className="w-4 h-4 sm:w-5.5 sm:h-5.5 text-[#483D35] group-hover:text-[#201610] transition-transform duration-500 group-hover:scale-108"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3.8C8.5 7 7.5 10.5 12 13.8C16.5 10.5 15.5 7 12 3.8Z"
                    fill="#C8A46B"
                    fillOpacity="0.45"
                    stroke="currentColor"
                    strokeWidth="1.15"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="7.2" r="1.6" fill="#C8A46B" stroke="#483D35" strokeWidth="0.8" />
                  <circle cx="9.6" cy="9.6" r="1.4" fill="#E8D7BE" stroke="#483D35" strokeWidth="0.8" />
                  <circle cx="14.4" cy="9.6" r="1.4" fill="#E8D7BE" stroke="#483D35" strokeWidth="0.8" />
                  <circle cx="12" cy="11.8" r="1.5" fill="#C8A46B" stroke="#483D35" strokeWidth="0.8" />
                  <path d="M12 13.8V20" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  <path d="M12 16.5C10 15.8 8.5 16.5 7.5 17.5" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
                  <path d="M12 17.5C14 16.8 15.5 17.5 16.5 18.5" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
                </svg>
              </div>

              {/* Website Name Typography */}
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl md:text-[26px] font-normal tracking-[0.2em] text-[#201610] leading-tight uppercase group-hover:text-[#3E2D22] transition-colors">
                  Cloudberry
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                  <span className="h-[0.5px] w-3 sm:w-4 bg-[#C8A46B]" />
                  <span className="font-sans text-[8px] sm:text-[9.5px] tracking-[0.45em] uppercase text-[#483D35] font-semibold leading-none">
                    H O M E
                  </span>
                  <span className="h-[0.5px] w-3 sm:w-4 bg-[#C8A46B]" />
                </div>
              </div>
            </button>
          </div>

          {/* CENTER: Navigation Links with Animated Underlines */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center z-10">
            <nav
              className="flex items-center space-x-6 xl:space-x-8 text-xs font-medium tracking-[0.2em] text-[#483D35]"
              aria-label="Main Navigation"
            >
              <button
                type="button"
                onClick={() => handleNavClick('home')}
                className={`whitespace-nowrap py-2 nav-link-underline cursor-pointer ${
                  currentView === 'home'
                    ? 'text-[#201610] font-semibold active'
                    : 'hover:text-[#201610]'
                }`}
              >
                HOME
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('shop', null)}
                className={`whitespace-nowrap py-2 nav-link-underline cursor-pointer ${
                  currentView === 'shop'
                    ? 'text-[#201610] font-semibold active'
                    : 'hover:text-[#201610]'
                }`}
              >
                SHOP
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('rooms')}
                className={`whitespace-nowrap py-2 nav-link-underline cursor-pointer ${
                  currentView === 'rooms'
                    ? 'text-[#201610] font-semibold active'
                    : 'hover:text-[#201610]'
                }`}
              >
                ROOMS
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('collections')}
                className={`whitespace-nowrap py-2 nav-link-underline cursor-pointer ${
                  currentView === 'collections'
                    ? 'text-[#201610] font-semibold active'
                    : 'hover:text-[#201610]'
                }`}
              >
                COLLECTIONS
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('story')}
                className={`whitespace-nowrap py-2 nav-link-underline cursor-pointer ${
                  currentView === 'story'
                    ? 'text-[#201610] font-semibold active'
                    : 'hover:text-[#201610]'
                }`}
              >
                OUR STORY
              </button>

              {/* Admin shortcut if logged in as admin */}
              {currentUser?.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => handleNavClick('admin')}
                  className="whitespace-nowrap flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-[#6D7E69] font-semibold hover:text-[#52634E] py-2 cursor-pointer transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" />
                  ADMIN
                </button>
              )}
            </nav>
          </div>

          {/* RIGHT SIDE: Action Buttons with Gentle Hover Elevation */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 text-[#201610] shrink-0">
            {/* Search */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-[#201610] hover:text-[#3E2D22] hover:bg-[#EDE7DE] hover:-translate-y-0.5 rounded-full transition-all duration-200 relative cursor-pointer active:scale-95"
              aria-label="Search products"
              title="Search products"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Customer Account */}
            <button
              type="button"
              onClick={() => {
                if (currentUser) {
                  setCurrentView('account');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="p-2.5 text-[#201610] hover:text-[#3E2D22] hover:bg-[#EDE7DE] hover:-translate-y-0.5 rounded-full transition-all duration-200 relative cursor-pointer active:scale-95"
              aria-label="Customer Account"
              title={currentUser ? `Signed in as ${currentUser.name}` : 'Sign In'}
            >
              <UserIcon className="h-5 w-5" />
              {currentUser && (
                <span className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-[#6D7E69] ring-2 ring-[#F5F0E6]" />
              )}
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => handleNavClick('account')}
              className="p-2.5 text-[#201610] hover:text-[#3E2D22] hover:bg-[#EDE7DE] hover:-translate-y-0.5 rounded-full transition-all duration-200 relative cursor-pointer active:scale-95"
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C8A46B] text-[10px] font-semibold text-white tabular-nums shadow-xs animate-in zoom-in-50 duration-200">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag */}
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2.5 text-[#201610] hover:text-[#3E2D22] hover:bg-[#EDE7DE] hover:-translate-y-0.5 rounded-full transition-all duration-200 relative cursor-pointer active:scale-95 group"
              aria-label="Shopping Bag"
              title="Cart"
            >
              <ShoppingBag className="h-5 w-5 transition-transform duration-200 group-hover:scale-108" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2A1E17] text-[10px] font-semibold text-[#FAF6F0] tabular-nums shadow-xs animate-in zoom-in-50 duration-200">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown with smooth slide & blur */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F5F0E6]/98 backdrop-blur-md border-b border-[#E2D9CC] px-6 py-6 space-y-4 animate-in slide-in-from-top-4 fade-in duration-200 shadow-lg">
          <nav className="flex flex-col space-y-3 text-xs tracking-[0.2em] font-medium text-[#201610]">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`text-left py-2.5 border-b border-[#E2D9CC] transition-colors ${
                currentView === 'home' ? 'text-[#C8A46B] font-semibold' : 'hover:text-[#3E2D22]'
              }`}
            >
              HOME
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('shop', null)}
              className={`text-left py-2.5 border-b border-[#E2D9CC] transition-colors ${
                currentView === 'shop' ? 'text-[#C8A46B] font-semibold' : 'hover:text-[#3E2D22]'
              }`}
            >
              SHOP
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('rooms')}
              className={`text-left py-2.5 border-b border-[#E2D9CC] transition-colors ${
                currentView === 'rooms' ? 'text-[#C8A46B] font-semibold' : 'hover:text-[#3E2D22]'
              }`}
            >
              ROOMS
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('collections')}
              className={`text-left py-2.5 border-b border-[#E2D9CC] transition-colors ${
                currentView === 'collections' ? 'text-[#C8A46B] font-semibold' : 'hover:text-[#3E2D22]'
              }`}
            >
              COLLECTIONS
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('story')}
              className={`text-left py-2.5 border-b border-[#E2D9CC] transition-colors ${
                currentView === 'story' ? 'text-[#C8A46B] font-semibold' : 'hover:text-[#3E2D22]'
              }`}
            >
              OUR STORY
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('account')}
              className="text-left py-2.5 border-b border-[#E2D9CC] hover:text-[#3E2D22] transition-colors"
            >
              {currentUser ? `MY ACCOUNT (${currentUser.name.toUpperCase()})` : 'SIGN IN / REGISTER'}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className="text-left py-2.5 text-[#483D35] flex items-center gap-1.5 hover:text-[#201610] transition-colors"
            >
              <Shield className="h-4 w-4" />
              ADMIN DASHBOARD
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
