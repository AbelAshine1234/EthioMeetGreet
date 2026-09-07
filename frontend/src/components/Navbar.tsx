import React, { useState } from 'react';
import { Search, ChevronDown, ShoppingBag, ShieldCheck, Menu, X, Video } from 'lucide-react';
import { Category } from '../types';

export type AppView = 'home' | 'browse' | 'how-it-works' | 'join-talent' | 'business' | 'talent-detail' | 'admin';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categories: Category[];
  onSelectCategory: (slug: string) => void;
  onOpenOrders: () => void;
  onOpenCreatorStudio: () => void;
  onOpenAdminPanel: () => void;
  onOpenLiveMeet: () => void;
  currency: 'USD' | 'ETB';
  onToggleCurrency: () => void;
  ordersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  categories,
  onSelectCategory,
  onOpenOrders,
  onOpenCreatorStudio,
  onOpenAdminPanel,
  onOpenLiveMeet,
  currency,
  onToggleCurrency,
  ordersCount,
}) => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNav = (view: AppView, categorySlug?: string) => {
    if (categorySlug) onSelectCategory(categorySlug);
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE4D7] text-[#181818]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Left: Hamburger (Mobile) + Logo */}
          <div className="flex items-center gap-3 sm:gap-7">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#181818] hover:bg-[#F5F1E8] transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <div 
              className="cursor-pointer flex items-center gap-2 group select-none"
              onClick={() => {
                onSelectCategory('all');
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="text-[22px] sm:text-[26px] font-black tracking-tight text-[#181818] lowercase font-['Plus_Jakarta_Sans']">
                meet and <span className="highlight-yellow relative z-0">greet</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#555555]">
              
              {/* Categories dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    onNavigate('browse');
                    setCategoriesOpen(!categoriesOpen);
                  }}
                  className={`flex items-center gap-1 transition cursor-pointer ${
                    currentView === 'browse' ? 'text-[#181818] font-bold' : 'hover:text-[#181818]'
                  }`}
                >
                  <span>Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#777777]" />
                </button>

                {categoriesOpen && (
                  <div className="absolute top-full left-0 mt-3 w-56 bg-white border border-[#EAE4D7] rounded-2xl shadow-xl py-2 z-50">
                    <button
                      onClick={() => {
                        onSelectCategory('all');
                        onNavigate('browse');
                        setCategoriesOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#181818] hover:bg-[#F5F1E8] font-bold"
                    >
                      All Categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelectCategory(c.slug);
                          onNavigate('browse');
                          setCategoriesOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#555555] hover:bg-[#F5F1E8] hover:text-[#181818] font-medium"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* For kids */}
              <button 
                onClick={() => {
                  onSelectCategory('all');
                  onNavigate('browse');
                }} 
                className="hover:text-[#181818] transition cursor-pointer"
              >
                For kids
              </button>

              {/* For business */}
              <button 
                onClick={() => onNavigate('business')} 
                className={`transition cursor-pointer ${
                  currentView === 'business' ? 'text-[#181818] font-bold underline underline-offset-4 decoration-[#FDE047] decoration-2' : 'hover:text-[#181818]'
                }`}
              >
                For business
              </button>

              {/* How it works */}
              <button 
                onClick={() => onNavigate('how-it-works')} 
                className={`transition cursor-pointer ${
                  currentView === 'how-it-works' ? 'text-[#181818] font-bold underline underline-offset-4 decoration-[#FDE047] decoration-2' : 'hover:text-[#181818]'
                }`}
              >
                How it works
              </button>

              {/* Join as talent */}
              <button 
                onClick={() => onNavigate('join-talent')} 
                className={`transition cursor-pointer ${
                  currentView === 'join-talent' ? 'text-[#181818] font-bold underline underline-offset-4 decoration-[#FDE047] decoration-2' : 'hover:text-[#181818]'
                }`}
              >
                Join as talent
              </button>
            </nav>
          </div>

          {/* Center Search Bar (Desktop) */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#888888]">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onFocus={() => {
                  if (currentView !== 'browse') onNavigate('browse');
                }}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentView !== 'browse') onNavigate('browse');
                }}
                placeholder="Search stars, comedians, musicians..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E0DACE] rounded-full text-xs text-[#181818] placeholder-[#999999] focus:outline-none focus:border-[#181818] transition shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#777777] hover:text-black"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Currency toggle */}
            <button
              onClick={onToggleCurrency}
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white border border-[#E0DACE] text-xs font-bold text-[#333333] hover:text-black transition shadow-sm cursor-pointer"
            >
              {currency === 'ETB' ? 'ETB' : '$ USD'}
            </button>

            {/* Test Live Video Chat button */}
            <button
              onClick={onOpenLiveMeet}
              className="flex px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer bg-red-600 hover:bg-red-700 text-white animate-pulse"
              title="Test Live Video & Audio Call Room"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Chat</span>
            </button>

            {/* Admin Panel Button (Dedicated Webpage View) */}
            <button
              onClick={() => onNavigate('admin')}
              className={`hidden sm:flex px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-[#FDE047] text-[#181818] ring-2 ring-[#181818]'
                  : 'text-white bg-[#181818] hover:bg-black'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>

            {/* Creator Studio trigger */}
            <button
              onClick={onOpenCreatorStudio}
              className="hidden md:inline-block px-3.5 py-2 rounded-full text-xs font-bold text-[#333333] hover:text-black bg-white border border-[#E0DACE] transition shadow-sm cursor-pointer"
            >
              Creator Hub
            </button>

            {/* Cart / Orders with badge */}
            <button
              onClick={onOpenOrders}
              className="relative p-2 rounded-full text-[#333333] hover:text-black transition cursor-pointer"
              aria-label="View orders"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#181818] text-white text-[10px] font-bold flex items-center justify-center">
                {ordersCount > 0 ? ordersCount : '1'}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#888888]">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onFocus={() => {
                if (currentView !== 'browse') onNavigate('browse');
              }}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentView !== 'browse') onNavigate('browse');
              }}
              placeholder="Search stars, comedians, singers..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E0DACE] rounded-full text-xs text-[#181818] placeholder-[#999999] focus:outline-none focus:border-[#181818] shadow-sm"
            />
          </div>
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE4D7] py-4 space-y-2 bg-[#FAF7F2] animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => handleMobileNav('home')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                currentView === 'home' ? 'bg-white shadow-sm text-black' : 'text-[#555555] hover:bg-white/50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleMobileNav('browse', 'all')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                currentView === 'browse' ? 'bg-white shadow-sm text-black' : 'text-[#555555] hover:bg-white/50'
              }`}
            >
              All Categories & Stars
            </button>

            <button
              onClick={() => handleMobileNav('business')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                currentView === 'business' ? 'bg-white shadow-sm text-black' : 'text-[#555555] hover:bg-white/50'
              }`}
            >
              For Business
            </button>

            <button
              onClick={() => handleMobileNav('how-it-works')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                currentView === 'how-it-works' ? 'bg-white shadow-sm text-black' : 'text-[#555555] hover:bg-white/50'
              }`}
            >
              How It Works
            </button>

            <button
              onClick={() => handleMobileNav('join-talent')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                currentView === 'join-talent' ? 'bg-white shadow-sm text-black' : 'text-[#555555] hover:bg-white/50'
              }`}
            >
              Join as Talent
            </button>

            <div className="pt-2 border-t border-[#EAE4D7] space-y-2 px-2">
              <button
                onClick={() => {
                  onOpenLiveMeet();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-red-600 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Video className="w-4 h-4" />
                <span>Test Live Video & Audio Chat</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm transition ${
                    currentView === 'admin'
                      ? 'bg-[#FDE047] text-[#181818]'
                      : 'bg-[#181818] text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Panel</span>
                </button>

                <button
                  onClick={() => {
                    onOpenCreatorStudio();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-[#E0DACE] text-[#181818] text-xs font-bold text-center shadow-sm"
                >
                  Creator Hub
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
