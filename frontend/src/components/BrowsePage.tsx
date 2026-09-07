import React, { useState, useMemo } from 'react';
import { Talent, Category, getTalentCategoryName, getTalentCategorySlug } from '../types';
import { Zap, SlidersHorizontal, ChevronDown, ChevronUp, Search, Flame, X } from 'lucide-react';

interface BrowsePageProps {
  talents: Talent[];
  categories: Category[];
  currency: 'USD' | 'ETB';
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  onSelectTalent: (talent: Talent) => void;
}

export const BrowsePage: React.FC<BrowsePageProps> = ({
  talents,
  categories,
  currency,
  selectedCategory,
  onSelectCategory,
  onSelectTalent,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [only24h, setOnly24h] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [showFilters, setShowFilters] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('all');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [customMin, setCustomMin] = useState('');
  const [customMax, setCustomMax] = useState('');
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);

  // 10 Exact Categories from Cameo "All categories" with 100% Habesha star photos
  const categoryCircles = [
    { slug: 'actors', name: 'Actors', avatar: '/stars/selam_tesfaye.jpg', fallback: '/stars/selam_tesfaye.jpg' },
    { slug: 'reality-tv', name: 'TV Hosts', avatar: '/stars/danayit_mekbib.jpg', fallback: '/stars/danayit_mekbib.jpg' },
    { slug: 'athletes', name: 'Athletes', avatar: '/stars/haile_gebrselassie.jpg', fallback: '/stars/haile_gebrselassie.jpg' },
    { slug: 'comedians', name: 'Comedians', avatar: '/stars/eshete_eshetu.jpg', fallback: '/stars/eshete_eshetu.jpg' },
    { slug: 'creators', name: 'Creators', avatar: '/stars/kidus_diaspora.jpg', fallback: '/stars/kidus_diaspora.jpg' },
    { slug: 'musicians', name: 'Musicians', avatar: '/stars/aster_aweke.jpg', fallback: '/stars/aster_aweke.jpg' },
    { slug: 'harry-potter', name: 'Movies & Cinema', avatar: '/stars/sayat_demissie.jpg', fallback: '/stars/sayat_demissie.jpg' },
    { slug: 'football', name: 'Distance Legends', avatar: '/stars/kenenisa_bekele.jpg', fallback: '/stars/kenenisa_bekele.jpg' },
    { slug: 'bravo', name: 'Heritage & Jazz', avatar: '/stars/mahmoud_ahmed.jpg', fallback: '/stars/mahmoud_ahmed.jpg' },
    { slug: 'christmas', name: 'Holiday Blessings', avatar: '/stars/teddy_afro.jpg', fallback: '/stars/teddy_afro.jpg' },
  ];

  // Filtered & Sorted Talents with Smart Category Matching
  const filteredTalents = useMemo(() => {
    return talents.filter((t) => {
      // Category Match
      if (selectedCategory !== 'all') {
        const cat = selectedCategory.toLowerCase();
        const talentCat = getTalentCategorySlug(t);
        
        let match = talentCat === cat;
        if (!match) {
          if (cat === 'actors' || cat === 'acting' || cat === 'harry-potter') {
            match = talentCat.includes('act') || talentCat.includes('cinema');
          } else if (cat === 'reality-tv' || cat === 'bravo') {
            match = talentCat.includes('reality') || talentCat.includes('tv') || talentCat.includes('act');
          } else if (cat === 'athletes' || cat === 'sports' || cat === 'football') {
            match = talentCat.includes('sport') || talentCat.includes('ath') || talentCat.includes('coach') || talentCat.includes('football');
          } else if (cat === 'comedians' || cat === 'comedy') {
            match = talentCat.includes('comed');
          } else if (cat === 'musicians' || cat === 'music') {
            match = talentCat.includes('music') || talentCat.includes('singer');
          } else if (cat === 'creators' || cat === 'influencers') {
            match = talentCat.includes('creat') || talentCat.includes('tiktok') || talentCat.includes('influenc');
          } else if (cat === 'christmas') {
            match = true;
          }
        }
        if (!match) return false;
      }

      // 24 Hour filter
      if (only24h && !t.response_time?.includes('24')) {
        return false;
      }

      // Search Filter
      if (searchFilter) {
        const query = searchFilter.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(query);
        const matchesBio = t.bio?.toLowerCase().includes(query);
        const matchesHandle = t.handle?.toLowerCase().includes(query);
        if (!matchesName && !matchesBio && !matchesHandle) return false;
      }

      // Price Tier Filter
      const price = t.price_video;
      if (selectedPriceTier === '0-25' && !(price <= 25)) return false;
      if (selectedPriceTier === '25-50' && !(price > 25 && price <= 50)) return false;
      if (selectedPriceTier === '50-75' && !(price > 50 && price <= 75)) return false;
      if (selectedPriceTier === '75-100' && !(price > 75 && price <= 100)) return false;
      if (selectedPriceTier === '100+' && !(price > 100)) return false;

      // Custom Range Filter
      if (customMin && price < Number(customMin)) return false;
      if (customMax && price > Number(customMax)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price_video - b.price_video;
      if (sortBy === 'price_desc') return b.price_video - a.price_video;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [talents, selectedCategory, only24h, searchFilter, selectedPriceTier, customMin, customMax, sortBy]);

  const formatPrice = (usd: number) => {
    if (currency === 'ETB') {
      const etb = Math.round(usd * 120);
      return `ETB ${etb.toLocaleString()}+`;
    }
    return `$${usd}+`;
  };

  const filteredCategoriesList = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-[#FAF7F2] text-[#181818] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* 1. All Categories Header & Circles Row */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#181818] mb-4 sm:mb-6 font-['Plus_Jakarta_Sans'] tracking-tight">
            All categories
          </h1>

          {/* Horizontal category circles row */}
          <div className="flex items-center gap-3.5 sm:gap-6 overflow-x-auto pb-3 sm:pb-4 no-scrollbar">
            {categoryCircles.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => onSelectCategory(isActive ? 'all' : cat.slug)}
                  className="flex flex-col items-center gap-2 group flex-shrink-0 cursor-pointer"
                >
                  <div
                    className={`w-15 h-15 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 bg-white transition-all duration-200 ${
                      isActive
                        ? 'border-[#181818] ring-4 ring-[#FDE047] scale-105 shadow-md'
                        : 'border-[#EAE4D7] group-hover:border-[#181818] group-hover:scale-105 shadow-sm'
                    }`}
                  >
                    <img
                      src={cat.avatar}
                      alt={cat.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = cat.fallback;
                      }}
                      className="w-full h-full object-cover group-hover:brightness-105 transition duration-300"
                    />
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-bold whitespace-nowrap transition ${
                      isActive ? 'text-[#181818] font-black underline underline-offset-4 decoration-[#FDE047] decoration-2' : 'text-[#555555] group-hover:text-[#181818]'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Toolbar Row: Results Count, Sort, 24h Filter, Hide Filters Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 py-3 sm:py-4 mb-6 border-b border-[#EAE4D7]">
          <div className="text-xs sm:text-sm font-semibold text-[#666666]">
            <span className="text-[#181818] font-black">{filteredTalents.length.toLocaleString()}</span> results
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white hover:bg-[#F5F1E8] text-[#181818] border border-[#E0DACE] rounded-full pl-3.5 pr-8 sm:px-4 sm:pr-8 py-2 text-xs font-bold cursor-pointer transition focus:outline-none shadow-xs"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#777777] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* 24 Hour Delivery Pill */}
            <button
              onClick={() => setOnly24h(!only24h)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition border shadow-xs cursor-pointer ${
                only24h
                  ? 'bg-[#181818] text-white border-[#181818]'
                  : 'bg-white text-[#181818] border-[#E0DACE] hover:bg-[#F5F1E8]'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${only24h ? 'text-[#FDE047] fill-current' : 'text-amber-500'}`} />
              <span>24 hour</span>
            </button>

            {/* Hide/Show Filters Button */}
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileFilterOpen(true);
                } else {
                  setShowFilters(!showFilters);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold bg-white hover:bg-[#F5F1E8] text-[#181818] border border-[#E0DACE] transition shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#666666]" />
              <span className="hidden sm:inline">{showFilters ? 'Hide filters' : 'Filters'}</span>
              <span className="sm:hidden">Filters</span>
            </button>
          </div>
        </div>

        {/* 3. Main Body: Grid of Star Cards + Collapsible Filter Sidebar */}
        <div className="flex gap-8 items-start">
          
          {/* Left / Main: Star Cards Grid */}
          <div className="flex-1">
            {filteredTalents.length === 0 ? (
              <div className="py-16 text-center text-[#777777] bg-white rounded-3xl border border-[#EAE4D7] p-8 shadow-xs">
                <p className="text-base sm:text-lg font-bold text-[#181818] mb-2">No stars match your filter criteria</p>
                <p className="text-xs">Try clearing price filters or resetting your category choice.</p>
                <button
                  onClick={() => {
                    setSelectedPriceTier('all');
                    setCustomMin('');
                    setCustomMax('');
                    setOnly24h(false);
                    onSelectCategory('all');
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#181818] hover:bg-black text-white rounded-full text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${
                showFilters 
                  ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' 
                  : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
              }`}>
                {filteredTalents.map((talent) => (
                  <div
                    key={talent.id}
                    onClick={() => onSelectTalent(talent)}
                    className="group flex flex-col cursor-pointer transition duration-200 hover:-translate-y-1"
                  >
                    {/* Portrait Photo with Hot Today Badge */}
                    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#F0EBE1] border border-[#EAE4D7] mb-2 shadow-xs group-hover:shadow-md transition">
                      <img
                        src={talent.avatar_url || talent.avatar}
                        alt={talent.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                        }}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />

                      {/* Hot today flame badge */}
                      <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#ea580c] text-white text-[10px] sm:text-[11px] font-bold shadow-md">
                        <Flame className="w-3 h-3 fill-current" />
                        <span>Hot today</span>
                      </div>
                    </div>

                    {/* Talent Info */}
                    <h3 className="font-black text-sm sm:text-base text-[#181818] line-clamp-1 group-hover:text-amber-800 transition">
                      {talent.name}
                    </h3>

                    <p className="text-xs text-[#666666] line-clamp-1 mb-1 font-medium">
                      {talent.bio || talent.title || getTalentCategoryName(talent)}
                    </p>

                    {/* Rating and Response Speed */}
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#555555] mb-1">
                      <span className="flex items-center text-[#181818] font-bold">
                        ★ {talent.rating || 5.0} <span className="text-[#888888] font-normal ml-0.5">({talent.review_count || talent.reviews_count || '1.2k'})</span>
                      </span>
                      {talent.response_time && (
                        <span className="flex items-center text-[#181818] font-semibold text-[11px]">
                          ⚡ {talent.response_time.includes('24') ? '24h' : talent.response_time}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-sm font-black text-[#181818]">
                      {formatPrice(talent.price_video)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Filter Sidebar (Desktop) */}
          {showFilters && (
            <aside className="w-72 flex-shrink-0 bg-white border border-[#EAE4D7] rounded-3xl p-6 hidden lg:block shadow-sm">
              <h2 className="text-base font-black text-[#181818] mb-6">Filters</h2>

              {/* Category Filter Section */}
              <div className="border-b border-[#EAE4D7] pb-6 mb-6">
                <button
                  onClick={() => setCategoryExpanded(!categoryExpanded)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#666666] hover:text-[#181818] uppercase tracking-wider mb-4 cursor-pointer"
                >
                  <span>Category</span>
                  {categoryExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {categoryExpanded && (
                  <div>
                    <div className="relative mb-3">
                      <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search categories"
                        value={categorySearchQuery}
                        onChange={(e) => setCategorySearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-[#FAF7F2] border border-[#E0DACE] rounded-xl text-xs text-[#181818] placeholder-[#888888] focus:outline-none focus:bg-white focus:border-[#181818]"
                      />
                    </div>

                    <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                      <label className="flex items-center justify-between text-xs text-[#555555] hover:text-[#181818] cursor-pointer select-none">
                        <span>All Categories</span>
                        <input
                          type="checkbox"
                          checked={selectedCategory === 'all'}
                          onChange={() => onSelectCategory('all')}
                          className="w-4 h-4 rounded border-[#DCD5C6] text-[#181818] focus:ring-0 cursor-pointer accent-[#181818]"
                        />
                      </label>
                      {filteredCategoriesList.map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center justify-between text-xs text-[#555555] hover:text-[#181818] cursor-pointer select-none"
                        >
                          <span>{cat.name}</span>
                          <input
                            type="checkbox"
                            checked={selectedCategory === cat.slug}
                            onChange={() => onSelectCategory(selectedCategory === cat.slug ? 'all' : cat.slug)}
                            className="w-4 h-4 rounded border-[#DCD5C6] text-[#181818] focus:ring-0 cursor-pointer accent-[#181818]"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Filter Section */}
              <div className="pb-2">
                <button
                  onClick={() => setPriceExpanded(!priceExpanded)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#666666] hover:text-[#181818] uppercase tracking-wider mb-4 cursor-pointer"
                >
                  <span>Price</span>
                  {priceExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {priceExpanded && (
                  <div className="space-y-2.5">
                    {[
                      { id: 'all', label: 'All Prices' },
                      { id: '0-25', label: '$0 - $25' },
                      { id: '25-50', label: '$25 - $50' },
                      { id: '50-75', label: '$50 - $75' },
                      { id: '75-100', label: '$75 - $100' },
                      { id: '100+', label: '$100+' },
                    ].map((tier) => (
                      <label
                        key={tier.id}
                        className="flex items-center gap-3 text-xs text-[#555555] hover:text-[#181818] cursor-pointer select-none"
                      >
                        <input
                          type="radio"
                          name="price-tier"
                          checked={selectedPriceTier === tier.id}
                          onChange={() => setSelectedPriceTier(tier.id)}
                          className="w-4 h-4 text-[#181818] border-[#DCD5C6] focus:ring-0 cursor-pointer accent-[#181818]"
                        />
                        <span>{tier.label}</span>
                      </label>
                    ))}

                    <div className="pt-3">
                      <span className="text-[11px] text-[#777777] block mb-2 font-medium">Custom range</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={customMin}
                          onChange={(e) => setCustomMin(e.target.value)}
                          className="w-20 px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E0DACE] rounded-lg text-xs text-[#181818] placeholder-[#888888] focus:outline-none focus:bg-white focus:border-[#181818]"
                        />
                        <span className="text-[#888888]">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={customMax}
                          onChange={(e) => setCustomMax(e.target.value)}
                          className="w-20 px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E0DACE] rounded-lg text-xs text-[#181818] placeholder-[#888888] focus:outline-none focus:bg-white focus:border-[#181818]"
                        />
                        <button
                          onClick={() => {}}
                          className="w-8 h-8 rounded-lg bg-[#181818] hover:bg-black flex items-center justify-center text-white text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}

        </div>
      </div>

      {/* 4. Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D7] mb-4">
                <h3 className="text-lg font-black text-[#181818]">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full hover:bg-[#F5F1E8]"
                >
                  <X className="w-5 h-5 text-[#555555]" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-[#777777] uppercase tracking-wider mb-2">Category</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <label className="flex items-center justify-between text-xs text-[#555555]">
                    <span>All Categories</span>
                    <input
                      type="checkbox"
                      checked={selectedCategory === 'all'}
                      onChange={() => onSelectCategory('all')}
                      className="accent-[#181818]"
                    />
                  </label>
                  {filteredCategoriesList.map((c) => (
                    <label key={c.id} className="flex items-center justify-between text-xs text-[#555555]">
                      <span>{c.name}</span>
                      <input
                        type="checkbox"
                        checked={selectedCategory === c.slug}
                        onChange={() => onSelectCategory(c.slug)}
                        className="accent-[#181818]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="text-xs font-bold text-[#777777] uppercase tracking-wider mb-2">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: '0-25', label: '$0 - $25' },
                    { id: '25-50', label: '$25 - $50' },
                    { id: '50-75', label: '$50 - $75' },
                    { id: '75-100', label: '$75 - $100' },
                    { id: '100+', label: '$100+' },
                  ].map((tier) => (
                    <label key={tier.id} className="flex items-center gap-2 text-xs text-[#555555]">
                      <input
                        type="radio"
                        name="mobile-price"
                        checked={selectedPriceTier === tier.id}
                        onChange={() => setSelectedPriceTier(tier.id)}
                        className="accent-[#181818]"
                      />
                      <span>{tier.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-[#181818] text-white rounded-full text-xs font-bold shadow-md cursor-pointer"
            >
              Apply Filters ({filteredTalents.length})
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
