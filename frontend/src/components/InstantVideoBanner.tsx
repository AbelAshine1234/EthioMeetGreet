import React from 'react';
import { Zap } from 'lucide-react';

interface InstantVideoBannerProps {
  onShopInstant: () => void;
}

export const InstantVideoBanner: React.FC<InstantVideoBannerProps> = ({ onShopInstant }) => {
  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
      <div className="max-w-[1440px] mx-auto">
        <div className="relative rounded-[32px] bg-[#FEFCE8] border border-[#FEF08A] p-8 sm:p-12 text-center overflow-hidden shadow-sm">
          
          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-[#181818] tracking-tight">
              Need a video in under an hour?
            </h2>

            <div className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#854D0E] bg-white px-3.5 py-1 rounded-full border border-[#FDE047] shadow-sm">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>0-60 min delivery</span>
            </div>

            <div className="pt-2">
              <button
                onClick={onShopInstant}
                className="px-8 py-3 rounded-full bg-[#181818] hover:bg-black text-white text-xs sm:text-sm font-bold transition active:scale-95 shadow-md"
              >
                Shop Instant videos
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
