import React from 'react';
import { Talent } from '../types';
import { CheckCircle2, Share2, Upload, MessageCircle } from 'lucide-react';

interface FeaturedCoachBannerProps {
  talent?: Talent;
  onBookNow: (talent: Talent) => void;
}

export const FeaturedCoachBanner: React.FC<FeaturedCoachBannerProps> = ({ talent, onBookNow }) => {
  if (!talent) return null;

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Exact Replica of Braintrust Featured Card from screenshot */}
        <div className="relative rounded-[32px] bg-white border border-[#EAE4D7] overflow-hidden shadow-sm text-left">
          
          {/* Top Banner Image with soft minimalist interior */}
          <div className="relative h-44 sm:h-52 w-full bg-[#F4EFE6] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&auto=format&fit=crop&q=80"
              alt="Studio banner"
              className="w-full h-full object-cover opacity-90"
            />
            {/* Nav pills in banner */}
            <div className="absolute bottom-3 right-6 hidden sm:flex items-center gap-5 text-xs font-semibold text-[#444444]">
              <span className="hover:text-black cursor-pointer">My Story</span>
              <span className="hover:text-black cursor-pointer">Skills</span>
              <span className="hover:text-black cursor-pointer">Reels</span>
              <span className="hover:text-black cursor-pointer">Experience</span>
            </div>
          </div>

          {/* Avatar overlapping banner with soft pastel pink ring */}
          <div className="relative px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-5">
              
              {/* Profile Avatar */}
              <div className="relative inline-block">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#FCE7F3] p-1.5 shadow-md">
                  <img
                    src={talent.avatar_url || talent.avatar || '/stars/teddy_afro.jpg'}
                    alt={talent.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/stars/teddy_afro.jpg';
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons: upload, share, and black pill Book/Message button */}
              <div className="flex items-center gap-3">
                <button
                  title="Share profile"
                  className="w-10 h-10 rounded-full border border-[#E0DACE] bg-white hover:bg-[#F5F1E8] flex items-center justify-center text-[#444444] transition shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  title="Upload / Details"
                  className="w-10 h-10 rounded-full border border-[#E0DACE] bg-white hover:bg-[#F5F1E8] flex items-center justify-center text-[#444444] transition shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onBookNow(talent)}
                  className="px-7 py-2.5 rounded-full bg-[#181818] hover:bg-black text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-sm active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Book now</span>
                </button>
              </div>

            </div>

            {/* Star Name with Yellow Highlighter Marker Stroke */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-3xl sm:text-4xl font-black text-[#181818] tracking-tight">
                  <span className="highlight-yellow relative z-0">{talent.name}</span>
                </h3>
                {/* Yellow sunburst verified badge */}
                <div className="w-6 h-6 rounded-full bg-[#FEF08A] text-[#854D0E] flex items-center justify-center text-xs font-bold ring-2 ring-white">
                  ✓
                </div>
              </div>

              {/* Star / Tag Pills */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3.5 py-1 rounded-full bg-[#F4EFE6] border border-[#E5DFD3] text-xs font-semibold text-[#181818] flex items-center gap-1.5">
                  <span>★</span>
                  <span>{talent.tags[0] || 'Vocal Pioneer'}</span>
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#F4EFE6] border border-[#E5DFD3] text-xs font-semibold text-[#181818] flex items-center gap-1.5">
                  <span>★</span>
                  <span>{talent.tags[1] || 'National Icon'}</span>
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#F4EFE6] border border-[#E5DFD3] text-xs font-semibold text-[#181818] flex items-center gap-1.5">
                  <span>★</span>
                  <span>Personalized Greetings</span>
                </span>
              </div>
            </div>

            {/* 4-Column Metadata Grid matching the theme screenshot */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-[#EAE4D7] text-xs">
              <div>
                <span className="text-[#888888] font-medium block mb-1">Role</span>
                <strong className="text-[#181818] font-bold block">{talent.title}</strong>
              </div>
              <div>
                <span className="text-[#888888] font-medium block mb-1">Location</span>
                <strong className="text-[#181818] font-bold block">Addis Ababa, Ethiopia</strong>
              </div>
              <div>
                <span className="text-[#888888] font-medium block mb-1">Supported Languages</span>
                <strong className="text-[#181818] font-bold block">{talent.languages.join(', ')}</strong>
              </div>
              <div>
                <span className="text-[#888888] font-medium block mb-1">Experience & Delivery</span>
                <strong className="text-[#181818] font-bold block">{talent.response_time}</strong>
              </div>
            </div>

          </div>

          {/* Diagonal stripe texture in bottom-left corner */}
          <div className="absolute bottom-0 left-0 w-24 h-12 diagonal-stripes pointer-events-none opacity-40" />

        </div>

      </div>
    </section>
  );
};
