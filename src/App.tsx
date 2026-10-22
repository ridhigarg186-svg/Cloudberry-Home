import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { CategoriesSection } from './components/CategoriesSection';
import { FeaturedEditSection } from './components/FeaturedEditSection';
import { RoomInspirationSection } from './components/RoomInspirationSection';
import { SpecialCollectionsSection } from './components/SpecialCollectionsSection';
import { OurStorySection } from './components/OurStorySection';
import { Footer } from './components/Footer';

// Modals & Drawers
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { QuickViewModal } from './components/QuickViewModal';
import { ShopThisLookModal } from './components/ShopThisLookModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ScrollControls } from './components/ScrollControls';

// Dedicated Views
import { ShopView } from './views/ShopView';
import { RoomsView } from './views/RoomsView';
import { CollectionsView } from './views/CollectionsView';
import { StoryView } from './views/StoryView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { AccountView } from './views/AccountView';
import { AdminDashboardView } from './views/AdminDashboardView';

const MainContent: React.FC = () => {
  const { currentView, toastMessage } = useShop();

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF6F0] text-[#483D35]">
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSlider />
            <CategoriesSection />
            <FeaturedEditSection />
            <RoomInspirationSection />
            <SpecialCollectionsSection />
            <OurStorySection />
          </>
        )}

        {currentView === 'shop' && <ShopView />}
        {currentView === 'rooms' && <RoomsView />}
        {currentView === 'collections' && <CollectionsView />}
        {currentView === 'story' && <StoryView />}
        {currentView === 'product-detail' && <ProductDetailView />}
        {currentView === 'cart' && <CartView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'account' && <AccountView />}
        {currentView === 'admin' && <AdminDashboardView />}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <SearchModal />
      <AuthModal />
      <QuickViewModal />
      <ShopThisLookModal />

      {/* AI Interior Stylist Assistant & Floating Scroll Controls */}
      <AiAssistantModal />
      <ScrollControls />

      {/* Elegant Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-[#1E1610] text-[#FCFAF6] px-5 py-3 rounded-sm shadow-xl border border-[#C8A46B]/40 text-xs tracking-wide flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-300">
          <span className="h-2 w-2 rounded-full bg-[#C8A46B] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
