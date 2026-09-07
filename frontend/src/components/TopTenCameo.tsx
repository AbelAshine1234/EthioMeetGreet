import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Zap, Star } from 'lucide-react';
import { Talent, getTalentCategoryName } from '../types';

interface TopTenCameoProps {
  talents: Talent[];
  currency: 'USD' | 'ETB';
  onSelectTalent: (talent: Talent) => void;
  onViewAll?: () => void;
}

export const TopTenCameo: React.FC<TopTenCameoProps> = ({
  talents,
  currency,
  onSelectTalent,
  onViewAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const formatPrice = (usd: number) => {
    if (currency === 'ETB') {
      const etb = Math.round(usd * 120);
      return `ETB ${etb.toLocaleString()}+`;
    }
    return `$${usd}+`;
  };

  const topTenList = talents.slice(0, 10);

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] border-t border-[#EAE4D7]">
      <div className="max-w-[1440px] mx-auto text-left">
        
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-[#181818]">
            Top 10 on <span className="highlight-yellow relative z-0">Meet and Greet</span>
          </h3>

          <div className="flex items-center gap-3">
            <button 
              onClick={onViewAll}
              className="text-xs font-bold text-[#666666] hover:text-black transition cursor-pointer"
            >
              View all
            </button>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll('left')}
                className="w-9 h-9 rounded-full bg-white hover:bg-[#F5F1E8] border border-[#E0DACE] flex items-center justify-center text-[#181818] transition shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-9 h-9 rounded-full bg-white hover:bg-[#F5F1E8] border border-[#E0DACE] flex items-center justify-center text-[#181818] transition shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
        >
          {topTenList.map((talent, index) => {
            const isHovered = hoveredId === talent.id;
            return (
              <div
                key={talent.id}
                onMouseEnter={() => setHoveredId(talent.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectTalent(talent)}
                className="w-48 sm:w-56 md:w-60 flex-shrink-0 rounded-[28px] overflow-hidden bg-white border border-[#EAE4D7] cursor-pointer group relative flex flex-col justify-end aspect-[3/4.6] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Background Photo */}
                <img
                  src={talent.avatar_url || talent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                  alt={talent.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Gradient dark bottom scrim for readable text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Top badges: Rank & Lightning */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                  <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-neutral-200 text-[#181818] font-bold text-xs shadow-sm">
                    <span>🌾</span>
                    <span>{index + 1}</span>
                    <span>🌾</span>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-white/95 backdrop-blur-sm border border-neutral-200 flex items-center justify-center text-amber-500 shadow-sm">
                    <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="relative z-10 p-4 text-center text-white">
                  <h4 className="text-base sm:text-lg font-black leading-tight truncate">
                    {talent.name}
                  </h4>
                  <p className="text-[11px] text-neutral-200 line-clamp-1 mt-0.5 font-medium">
                    {talent.bio || talent.title || getTalentCategoryName(talent)}
                  </p>

                  <div className="mt-2.5 pt-2.5 border-t border-white/20 flex items-center justify-between text-xs">
                    <span className="font-bold text-white text-[11px] bg-black/50 px-2 py-0.5 rounded-md">
                      {formatPrice(talent.price_video)}
                    </span>
                    <span className="flex items-center gap-1 text-white text-[11px] font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {talent.rating || 5.0}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
