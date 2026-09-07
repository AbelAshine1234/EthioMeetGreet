import React from 'react';
import { Sparkles, Zap, ShieldCheck, Video, Star } from 'lucide-react';

interface HeroBannerProps {
  onSelectTag: (tag: string) => void;
  totalStars: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectTag, totalStars }) => {
  const trendingTags = ['Teddy Afro', 'Rophnan', 'Danayit', 'Meskerem Abera', 'Haile Gebrselassie', 'New Year'];

  return (
    <div className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#242424] bg-[#111111]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1c1c] border border-[#2e2e2e] text-xs font-semibold text-[#FD3A73]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The #1 Ethiopian Cameo & Meet Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Book personal videos <br />
              <span className="text-[#FD3A73]">
                and live meets
              </span> <br />
              with your icons.
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 max-w-xl font-normal leading-relaxed">
              Surprise your loved ones with unforgettable personalized video shoutouts, birthday songs, holiday blessings, or 1-on-1 virtual meet & greets.
            </p>

            {/* Value badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm text-neutral-300 font-medium">
              <div className="flex items-center gap-1.5 bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#2b2b2b]">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>24-Hour Fast Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#2b2b2b]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#2b2b2b]">
                <Video className="w-4 h-4 text-[#FD3A73]" />
                <span>HD Video Downloads</span>
              </div>
            </div>

            {/* Trending shortcuts */}
            <div className="pt-2 flex items-center flex-wrap gap-2">
              <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider mr-1">Trending:</span>
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSelectTag(tag)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#1a1a1a] border border-[#2b2b2b] text-neutral-300 hover:text-white hover:border-[#FD3A73] transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right Hero Spotlight Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md p-4 rounded-2xl bg-[#171717] border border-[#292929]">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live & Booking Now</span>
                </div>
                <span className="text-xs font-bold text-neutral-400">{totalStars}+ Stars Active</span>
              </div>

              {/* Sample featured shoutout preview */}
              <div className="mt-4 rounded-xl overflow-hidden relative aspect-[4/5] bg-neutral-900 border border-neutral-800 group">
                <img
                  src="/stars/teddy_afro.jpg"
                  alt="Teddy Afro preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlays */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 border border-neutral-700 text-xs font-semibold text-white flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.98 (312)</span>
                </div>

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#FD3A73] text-white text-[11px] font-bold">
                  POPULAR
                </div>

                <div className="absolute bottom-0 inset-x-0 p-4 bg-black/80 text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="text-xl font-bold text-white">Teddy Afro</h3>
                    <div className="w-4 h-4 rounded-full bg-[#FD3A73] text-white flex items-center justify-center text-[9px] font-bold">✓</div>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-1 mb-2">Legendary Singer & National Icon</p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-700">
                    <div>
                      <span className="text-[10px] text-neutral-400 block uppercase">Personal Video</span>
                      <span className="text-base font-extrabold text-[#FD3A73]">$120</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block uppercase">1-on-1 Meet</span>
                      <span className="text-base font-extrabold text-white">$290</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick stats ribbon */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-neutral-300">
                <div className="bg-[#1c1c1c] p-2 rounded-xl border border-[#2b2b2b]">
                  <span className="font-extrabold text-white block text-sm">4.9★</span>
                  <span className="text-[10px] text-neutral-500">Avg Rating</span>
                </div>
                <div className="bg-[#1c1c1c] p-2 rounded-xl border border-[#2b2b2b]">
                  <span className="font-extrabold text-[#FD3A73] block text-sm">&lt;24h</span>
                  <span className="text-[10px] text-neutral-500">Response</span>
                </div>
                <div className="bg-[#1c1c1c] p-2 rounded-xl border border-[#2b2b2b]">
                  <span className="font-extrabold text-emerald-400 block text-sm">100%</span>
                  <span className="text-[10px] text-neutral-500">Completed</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
