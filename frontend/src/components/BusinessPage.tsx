import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Talent, getTalentCategoryName } from '../types';
import { api } from '../api';

interface BusinessPageProps {
  talents?: Talent[];
}

export const BusinessPage: React.FC<BusinessPageProps> = ({ talents = [] }) => {
  const [activeTalents, setActiveTalents] = useState<Talent[]>(talents);

  useEffect(() => {
    if (talents && talents.length > 0) {
      setActiveTalents(talents);
    } else {
      api.getTalents().then((data) => {
        if (data && data.length > 0) setActiveTalents(data);
      }).catch(console.error);
    }
  }, [talents]);

  const signupRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);

  // Business Sign up form state
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [subscribeNews, setSubscribeNews] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scrollToSignup = () => {
    signupRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !workEmail) return;
    setIsSubmitted(true);
  };

  // Dynamic business reels exclusively driven by real backend talents from database
  const badgeColors = [
    'bg-[#002d62] text-white',
    'bg-[#d92228] text-white',
    'bg-[#1f2937] text-white',
    'bg-[#0f766e] text-white',
    'bg-[#8b5cf6] text-white',
    'bg-[#f97316] text-white',
    'bg-[#eab308] text-black',
    'bg-[#0284c7] text-white',
    'bg-[#181818] text-[#FDE047]'
  ];

  const featuredTalent = 
    activeTalents.find((t) => t.id === selectedTalentId) ||
    activeTalents.find((t) => t.featured) || 
    activeTalents[0];

  const businessVideos = (activeTalents && activeTalents.length > 0 ? activeTalents : []).map((t, idx) => {
    const categoryName = getTalentCategoryName(t);
    return {
      id: t.id,
      brand: `${categoryName.toUpperCase()} & ENTERPRISE`,
      brandSub: t.title || 'Official Brand Endorsement',
      celeb: t.name,
      headline: t.bio ? t.bio.split('.')[0] : `Engage millions with authentic endorsements from ${t.name}`,
      image: t.avatar_url || t.avatar || '/stars/teddy_afro.jpg',
      badgeColor: badgeColors[idx % badgeColors.length],
    };
  });

  // Duplicate items array so continuous marquee scrolls smoothly without popping
  const repeatedVideos = [...businessVideos, ...businessVideos];

  return (
    <div className="w-full bg-[#FAF7F2] text-[#181818] min-h-screen">
      
      {/* 1. Hero Section: Find influencers and celebrities, the easy way. (matches media_1788777099577.png layout) */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-[#181818]">
          Find influencers and celebrities, <br />
          the <span className="highlight-yellow relative z-0">easy way.</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-[#555555] max-w-2xl mx-auto font-normal leading-relaxed mb-8">
          Tap into a direct relationship with <strong className="text-[#181818] font-bold">thousands of major celebs and influencers</strong>, partner with the perfect face for your brand, and captivate your audience through short-form video.
        </p>

        <button
          onClick={scrollToSignup}
          className="px-8 py-3.5 rounded-full bg-[#181818] hover:bg-black text-white font-bold text-sm sm:text-base transition shadow-xl active:scale-95 cursor-pointer"
        >
          Get started
        </button>
      </section>

      {/* 2. Horizontal Reel of Video Cards: Auto-scrolling smoothly to the left! (matches user request & media_1788777119647.png) */}
      <section className="py-6 sm:py-8 overflow-hidden relative group">
        
        {/* Manual scroll buttons on hover */}
        <button
          onClick={() => handleManualScroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-[#E0DACE] text-[#181818] flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleManualScroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-[#E0DACE] text-[#181818] flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scrolling container with left marquee animation */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto no-scrollbar scroll-smooth"
        >
          <div className="animate-marquee-left flex gap-4 sm:gap-5 px-4 py-2">
            {repeatedVideos.map((video, idx) => {
              const isSelected = featuredTalent?.id === video.id;
              return (
                <div
                  key={`${video.id}-${idx}`}
                  onClick={() => {
                    setSelectedTalentId(video.id);
                    signupRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-[210px] sm:w-[240px] aspect-[9/16] rounded-3xl overflow-hidden bg-white border-2 transition-all duration-300 relative flex-shrink-0 group/card shadow-md hover:shadow-xl cursor-pointer ${
                    isSelected ? 'border-[#181818] ring-4 ring-[#181818]/10 scale-[1.02]' : 'border-[#EAE4D7] hover:border-[#181818]'
                  }`}
                  title={`Click to preview ${video.celeb} in business mockup`}
                >
                  {/* Background Image / Video Poster */}
                  <img
                    src={video.image}
                    alt={video.celeb}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition duration-500"
                  />

                  {/* Top Brand Logo / Banner */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                    <div className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider shadow-md ${video.badgeColor}`}>
                      {video.brand}
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full bg-[#181818] text-[#FDE047] text-[9px] font-bold shadow">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Subtle gradient overlay for captions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                    {/* Headline quote */}
                    <p className="text-xs font-bold text-white leading-snug mb-1 drop-shadow-md line-clamp-2">
                      "{video.headline}"
                    </p>
                    
                    {/* Celeb and sub */}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-[#f0f0f0] font-medium drop-shadow truncate pr-2">
                        {video.celeb}
                      </span>
                      <span className="text-[10px] font-bold text-white/80 lowercase whitespace-nowrap">
                        meet & greet
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Direction hint */}
        <div className="text-center mt-3 text-[11px] text-[#777777]">
          ← Auto-scrolling brand campaigns (click any star to preview in mockup)
        </div>
      </section>

      {/* 3. Get Started Business Sign Up Section (matches media_1788777129205.png layout with warm theme) */}
      <section ref={signupRef} className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[#EAE4D7] mt-8">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Phone Mockup with "this could be your brand" */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            
            {/* Real Backend Talent Selector Pills */}
            <div className="w-full max-w-sm mb-5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block mb-2">
                Live Backend Endorsement Preview
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {activeTalents.slice(0, 6).map((talent) => {
                  const isActive = featuredTalent?.id === talent.id;
                  return (
                    <button
                      key={talent.id}
                      type="button"
                      onClick={() => setSelectedTalentId(talent.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-[#181818] text-white shadow'
                          : 'bg-white text-neutral-700 border border-[#E0DACE] hover:border-[#181818]'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#FDE047]' : 'bg-neutral-400'}`} />
                      {talent.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Phone Case Frame */}
            <div className="relative w-[280px] sm:w-[320px] aspect-[9/18] rounded-[42px] p-3 bg-white border-4 border-[#181818] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden">
              
              {/* Phone Speaker Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#181818] rounded-full z-20" />

              {/* Inside Screen Video / Image from Backend */}
              <div className="w-full h-full rounded-[32px] overflow-hidden relative bg-black">
                {featuredTalent?.hero_video_url ? (
                  <video
                    key={featuredTalent.id}
                    src={featuredTalent.hero_video_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    key={featuredTalent?.id}
                    src={featuredTalent?.avatar_url || featuredTalent?.avatar || '/stars/teddy_afro.jpg'}
                    alt={featuredTalent?.name || 'Featured Brand Endorsement'}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Product Floating Overlay in the Video (100% Backend-driven) */}
                <div className="absolute bottom-16 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-xl flex items-center justify-between border border-neutral-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-10 bg-amber-400 rounded flex items-center justify-center font-black text-[9px] text-amber-950 uppercase rotate-3 shadow-inner">
                      {featuredTalent?.name ? featuredTalent.name.slice(0, 2).toUpperCase() : 'ET'}
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-black leading-tight flex items-center gap-1">
                        {featuredTalent?.name?.toUpperCase()}
                        {featuredTalent?.verified && (
                          <span className="text-sky-600 text-[10px]" title="Verified">✓</span>
                        )}
                      </div>
                      <div className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wide">
                        {getTalentCategoryName(featuredTalent)} PARTNER
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-emerald-700">
                      ★ {featuredTalent?.rating ? String(featuredTalent.rating) : '5.0'}
                    </div>
                    <div className="text-[8px] font-bold text-neutral-400">
                      ${featuredTalent?.price_video || 150} / booking
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Handwritten "this could be your brand" Annotation with Arrow */}
            <div className="absolute -bottom-6 left-2 sm:left-6 flex items-center gap-2 select-none">
              <span className="text-base sm:text-lg font-serif italic text-[#181818] font-bold">
                this could be your brand
              </span>
              <span className="text-2xl transform -rotate-12">↗</span>
            </div>

            {/* Brand Credit from Backend */}
            <div className="mt-10 text-center max-w-sm">
              <div className="text-lg sm:text-xl font-black text-[#0f766e] tracking-wider uppercase">
                {featuredTalent?.title || 'Brand Endorsement'}
              </div>
              <div className="text-xs text-[#555555] font-semibold tracking-tight mt-1">
                {featuredTalent?.name} • {featuredTalent?.response_time || '⚡ Within 24 hours'}
              </div>
              {featuredTalent?.tags && featuredTalent.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                  {featuredTalent.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAE4D7] text-[#181818] font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: "Get started" Business Form */}
          <div className="lg:col-span-6 max-w-[480px] w-full mx-auto bg-white border border-[#EAE4D7] rounded-3xl p-8 sm:p-10 shadow-sm">
            <h2 className="text-3xl sm:text-4xl font-black text-[#181818] mb-8 tracking-tight">
              Get started
            </h2>

            {isSubmitted ? (
              <div className="bg-[#FAF7F2] border border-[#E0DACE] rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#181818] mb-2">Thank you, {fullName}!</h3>
                <p className="text-sm text-[#555555] mb-6">
                  Our Business Brand Partnerships team will reach out to <span className="text-[#181818] font-bold">{workEmail}</span> within 24 hours to match you with the ideal talent.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFullName('');
                    setWorkEmail('');
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#181818] text-white font-bold text-xs hover:bg-black transition"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                
                {/* Full name input */}
                <div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#E0DACE] rounded-xl text-sm text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#181818] transition"
                  />
                </div>

                {/* Work email input */}
                <div>
                  <input
                    type="email"
                    required
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="Work email"
                    className="w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#E0DACE] rounded-xl text-sm text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#181818] transition"
                  />
                </div>

                {/* Newsletter Checkbox */}
                <div className="flex items-center gap-3 pt-1">
                  <input
                    id="business-newsletter"
                    type="checkbox"
                    checked={subscribeNews}
                    onChange={(e) => setSubscribeNews(e.target.checked)}
                    className="w-4 h-4 rounded border-[#DCD5C6] text-[#181818] focus:ring-0 cursor-pointer accent-[#181818]"
                  />
                  <label htmlFor="business-newsletter" className="text-xs text-[#555555] cursor-pointer select-none">
                    Email me the latest Meet and Greet for Business news
                  </label>
                </div>

                {/* Sign up Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#181818] hover:bg-black text-white font-bold text-sm transition shadow-md active:scale-[0.99] cursor-pointer"
                >
                  Sign up
                </button>

                {/* Sign in link */}
                <div className="text-left pt-1">
                  <button
                    type="button"
                    onClick={() => alert('Sign in modal: Enter existing business credentials.')}
                    className="text-xs text-[#666666] hover:text-[#181818] underline transition"
                  >
                    Sign in to an existing account
                  </button>
                </div>

                {/* Terms agreement */}
                <p className="text-[11px] text-[#777777] leading-relaxed pt-2">
                  By creating an account, you agree to Meet and Greet's <span className="text-[#181818] font-bold underline cursor-pointer">Terms of Service</span>, including its <span className="text-[#181818] font-bold underline cursor-pointer">Terms for Business Videos</span>, as well as any applicable <span className="text-[#181818] font-bold underline cursor-pointer">Additional Terms</span>, and our <span className="text-[#181818] font-bold underline cursor-pointer">Privacy Policy</span>.
                </p>

              </form>
            )}

            {/* Trusted by thousands of brands logo ribbon */}
            <div className="mt-10 pt-6 border-t border-[#EAE4D7]">
              <p className="text-xs text-[#777777] font-bold mb-4 uppercase tracking-wider">
                Trusted by thousands of brands
              </p>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 items-center opacity-80">
                <span className="text-xs font-black tracking-widest text-[#181818]">DIAGEO</span>
                <span className="text-xs font-bold text-[#333333]">McDonald's</span>
                <span className="text-xs font-semibold tracking-tight text-[#181818]">dream+</span>
                <span className="text-xs font-bold lowercase tracking-wider text-[#181818]">allbirds</span>
                <span className="text-xs font-bold text-[#181818] flex items-center gap-0.5">
                  <span className="text-emerald-600">🛍</span> shopify
                </span>
                <span className="text-xs font-black tracking-widest text-[#181818]">HONDA</span>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
