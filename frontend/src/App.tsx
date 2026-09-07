import React, { useState, useEffect } from 'react';
import { Navbar, AppView } from './components/Navbar';
import { CategoryCircles } from './components/CategoryCircles';
import { OccasionsCards } from './components/OccasionsCards';
import { FeaturedCoachBanner } from './components/FeaturedCoachBanner';
import { TopTenCameo } from './components/TopTenCameo';
import { CharityGoals } from './components/CharityGoals';
import { InstantVideoBanner } from './components/InstantVideoBanner';
import { HowCameoWorksSection } from './components/HowCameoWorksSection';
import { RecentReviewsSection } from './components/RecentReviewsSection';
import { ThisIsCameoFooter } from './components/ThisIsCameoFooter';

// New Page Views matching Cameo structure
import { BrowsePage } from './components/BrowsePage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { JoinTalentPage } from './components/JoinTalentPage';
import { BusinessPage } from './components/BusinessPage';
import { TalentDetailPage } from './components/TalentDetailPage';
import { AdminPage } from './components/AdminPage';

// Modals
import { BookingModal } from './components/BookingModal';
import { BookingsTrackerModal } from './components/BookingsTrackerModal';
import { CreatorStudioModal } from './components/CreatorStudioModal';
import { JoinTalentModal } from './components/JoinTalentModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { LiveMeetRoomModal } from './components/LiveMeetRoomModal';

import { Talent, Category, Occasion, Booking } from './types';
import { api } from './api';

export function App() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active View Navigation State
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedTalentForDetail, setSelectedTalentForDetail] = useState<Talent | null>(null);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currency, setCurrency] = useState<'USD' | 'ETB'>('ETB');

  // Modals
  const [bookingTalent, setBookingTalent] = useState<Talent | null>(null);
  const [bookingType, setBookingType] = useState<'video_shoutout' | 'live_meet'>('video_shoutout');
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCreatorStudioOpen, setIsCreatorStudioOpen] = useState(false);
  const [isJoinTalentOpen, setIsJoinTalentOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLiveMeetOpen, setIsLiveMeetOpen] = useState(false);
  const [liveMeetRole, setLiveMeetRole] = useState<'fan' | 'creator'>('fan');
  const [liveMeetTalent, setLiveMeetTalent] = useState<Talent | null>(null);
  const [liveMeetRoomId, setLiveMeetRoomId] = useState('ethio-meet-101');

  // User Bookings Cache
  const [myOrders, setMyOrders] = useState<Booking[]>([]);

  // Initial load
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [cats, occs, talentsData, initialOrders] = await Promise.all([
        api.getCategories(),
        api.getOccasions(),
        api.getTalents(),
        api.getBookings()
      ]);
      setCategories(cats);
      setOccasions(occs);
      setTalents(talentsData);
      setMyOrders(initialOrders);
    } catch (err) {
      console.error('Initial data load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Hash-based deep link support (#admin, #browse, etc.)
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin') setCurrentView('admin');
      else if (hash === 'browse') setCurrentView('browse');
      else if (hash === 'how-it-works') setCurrentView('how-it-works');
      else if (hash === 'join-talent') setCurrentView('join-talent');
      else if (hash === 'business') setCurrentView('business');
      else if (hash === '' || hash === 'home') setCurrentView('home');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Filter talents when search or category changes
  useEffect(() => {
    async function loadFiltered() {
      try {
        const data = await api.getTalents({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery || undefined,
        });
        setTalents(data);
      } catch (err) {
        console.error('Filtering error:', err);
      }
    }

    const t = setTimeout(() => {
      loadFiltered();
    }, 200);
    return () => clearTimeout(t);
  }, [selectedCategory, searchQuery]);

  const handleOpenBooking = (talent: Talent, type: 'video_shoutout' | 'live_meet' = 'video_shoutout') => {
    setBookingTalent(talent);
    setBookingType(type);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setMyOrders((prev) => [newBooking, ...prev]);
  };

  const handleTalentCreated = (newTalent: Talent) => {
    setTalents((prev) => [newTalent, ...prev]);
    setIsJoinTalentOpen(false);
  };

  const handleSelectTalent = (talent: Talent) => {
    setSelectedTalentForDetail(talent);
    setCurrentView('talent-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    window.location.hash = view === 'home' ? '' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredTalent = talents.find((t) => t.featured) || talents[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#181818] flex flex-col font-sans selection:bg-[#FDE047] selection:text-[#181818]">
      {/* 1. Navbar with warm theme matching user request */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
          if (currentView !== 'browse') handleNavigate('browse');
        }}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenCreatorStudio={() => setIsCreatorStudioOpen(true)}
        onOpenAdminPanel={() => handleNavigate('admin')}
        onOpenLiveMeet={() => {
          setLiveMeetRole('fan');
          setIsLiveMeetOpen(true);
        }}
        currency={currency}
        onToggleCurrency={() => setCurrency((c) => (c === 'USD' ? 'ETB' : 'USD'))}
        ordersCount={myOrders.length}
      />

      <main className="flex-1 w-full bg-[#FAF7F2]">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <>
            {/* Circular Category Selector */}
            <CategoryCircles
              selectedCategory={selectedCategory}
              categories={categories}
              talents={talents}
              onSelectCategory={(slug) => {
                setSelectedCategory(slug);
                handleNavigate('browse');
              }}
              onViewAll={() => handleNavigate('browse')}
            />

            {/* 4 Themed Occasions Cards */}
            <OccasionsCards
              occasions={occasions}
              onSelectOccasion={() => handleNavigate('browse')}
            />

            {/* Featured Coach / Star Banner */}
            {featuredTalent && (
              <FeaturedCoachBanner
                talent={featuredTalent}
                onBookNow={(t) => handleOpenBooking(t, 'video_shoutout')}
              />
            )}

            {/* Top 10 on Meet and Greet */}
            <TopTenCameo
              talents={talents}
              currency={currency}
              onSelectTalent={handleSelectTalent}
              onViewAll={() => handleNavigate('browse')}
            />

            {/* Stars earning towards a goal (Charity Row) */}
            <CharityGoals
              talents={talents}
              onSelectCause={() => handleNavigate('browse')}
              onViewAll={() => handleNavigate('browse')}
              currency={currency}
            />

            {/* Promo Banner */}
            <InstantVideoBanner
              onShopInstant={() => {
                if (talents.length > 0) handleSelectTalent(talents[0]);
              }}
            />

            {/* How Cameo Works in 4 cards */}
            <HowCameoWorksSection />

            {/* Recent Reviews */}
            <RecentReviewsSection />

            {/* Bottom Category Circles */}
            <div className="pt-4 border-t border-[#EAE4D7]">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-left mb-2">
                <h3 className="text-lg sm:text-xl font-bold text-[#181818]">Categories</h3>
              </div>
              <CategoryCircles
                selectedCategory={selectedCategory}
                categories={categories}
                talents={talents}
                onSelectCategory={(slug) => {
                  setSelectedCategory(slug);
                  handleNavigate('browse');
                }}
                onViewAll={() => handleNavigate('browse')}
              />
            </div>
          </>
        )}

        {/* VIEW 2: BROWSE ALL CATEGORIES PAGE (matches media_1788777004106.png structure) */}
        {currentView === 'browse' && (
          <BrowsePage
            talents={talents}
            categories={categories}
            currency={currency}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectTalent={handleSelectTalent}
          />
        )}

        {/* VIEW 3: HOW IT WORKS PAGE (matches media_1788777024826.png structure) */}
        {currentView === 'how-it-works' && (
          <HowItWorksPage
            onBrowseStars={() => handleNavigate('browse')}
          />
        )}

        {/* VIEW 4: JOIN AS TALENT ENROLLMENT PAGE (matches media_1788777049263.png structure) */}
        {currentView === 'join-talent' && (
          <JoinTalentPage
            onTalentCreated={handleTalentCreated}
          />
        )}

        {/* VIEW 5: FOR BUSINESS PAGE (matches media_1788777099577.png & media_1788777119647.png structure with left scrolling reel) */}
        {currentView === 'business' && (
          <BusinessPage talents={talents} />
        )}

        {/* VIEW 6: ARTIST DETAIL PAGE (matches media_1788777324928.png structure) */}
        {currentView === 'talent-detail' && (
          <TalentDetailPage
            talent={selectedTalentForDetail || talents[0] || {} as Talent}
            currency={currency}
            onBack={() => handleNavigate('browse')}
            onBookPersonal={(t) => handleOpenBooking(t, 'video_shoutout')}
            onBookBusiness={() => handleNavigate('business')}
            onNavigateToBrowse={() => handleNavigate('browse')}
          />
        )}

        {/* VIEW 7: DEDICATED ADMIN WEBPAGE (Full Admin Panel Webpage with Star Creator workspace) */}
        {currentView === 'admin' && (
          <AdminPage
            talents={talents}
            categories={categories}
            currency={currency}
            onTalentUpdated={loadData}
            onNavigateHome={() => handleNavigate('home')}
            onSelectTalent={handleSelectTalent}
          />
        )}

      </main>

      {/* Meet and Greet Warm Footer */}
      <ThisIsCameoFooter onNavigate={handleNavigate} />

      {/* Global Modals */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        talents={talents}
        categories={categories}
        currency={currency}
        onTalentUpdated={loadData}
        onOpenJoinTalent={() => setIsJoinTalentOpen(true)}
      />

      <BookingModal
        talent={bookingTalent}
        initialType={bookingType}
        occasions={occasions}
        currency={currency}
        onClose={() => setBookingTalent(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      <BookingsTrackerModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        currency={currency}
        onJoinLiveCall={(booking) => {
          const t = talents.find(x => x.id === booking.talent_id) || talents[0];
          setLiveMeetTalent(t);
          setLiveMeetRole('fan');
          setLiveMeetRoomId(booking.id || 'ethio-meet-101');
          setIsOrdersOpen(false);
          setIsLiveMeetOpen(true);
        }}
      />

      <CreatorStudioModal
        isOpen={isCreatorStudioOpen}
        onClose={() => setIsCreatorStudioOpen(false)}
        talents={talents}
        currency={currency}
        onTalentUpdated={loadData}
        onStartLiveCall={(booking, talent) => {
          setLiveMeetTalent(talent);
          setLiveMeetRole('creator');
          setLiveMeetRoomId(booking.id || 'ethio-meet-101');
          setIsCreatorStudioOpen(false);
          setIsLiveMeetOpen(true);
        }}
      />

      <JoinTalentModal
        isOpen={isJoinTalentOpen}
        onClose={() => setIsJoinTalentOpen(false)}
        categories={categories}
        onTalentCreated={handleTalentCreated}
      />

      <LiveMeetRoomModal
        isOpen={isLiveMeetOpen}
        onClose={() => setIsLiveMeetOpen(false)}
        talents={talents}
        initialTalent={liveMeetTalent || talents[0]}
        initialRole={liveMeetRole}
        initialRoomId={liveMeetRoomId}
        customerName="Abel Ashine (Fan)"
      />
    </div>
  );
}

export default App;
