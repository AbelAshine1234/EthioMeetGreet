import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { api } from '../api';
import { Review } from '../types';

export const RecentReviewsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [liveReviews, setLiveReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await api.getReviews({ limit: 10 });
        if (data && data.length > 0) {
          setLiveReviews(data);
        }
      } catch (err) {
        // Fallback to presets silently
      }
    }
    loadReviews();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const presetReviews = [
    {
      title: "Birthday from Teddy Afro",
      stars: 5,
      recipient: "For Selamawit",
      quote: "We cannot thank you enough! Selam was beyond thrilled to get your song snippet and message. It brought tears of happiness to our whole living room in DC!"
    },
    {
      title: "Advice from Haile Gebrselassie",
      stars: 5,
      recipient: "For Dawit",
      quote: "I surprised my marathon running buddy with Haile's pep talk before his big race. Haile's energy was incredible and gave him the ultimate motivation!"
    },
    {
      title: "Birthday from Danayit Mekbib",
      stars: 5,
      recipient: "For Tsion",
      quote: "Danayit was so warm, cheerful, and genuine! She mentioned every single inside joke and made my little sister's 21st birthday unforgettable."
    },
    {
      title: "Motivation from Aster Aweke",
      stars: 5,
      recipient: "For Mom (Eileen)",
      quote: "She absolutely loved the sweet melody and kind blessings you sent her! She replayed the video at least ten times and sent it to all her friends!"
    }
  ];

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
      <div className="max-w-[1440px] mx-auto text-left">
        
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-black text-[#181818]">
            Recent <span className="highlight-yellow relative z-0">reviews</span>
          </h3>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-full bg-white hover:bg-[#F4EFE6] border border-[#E0DACE] flex items-center justify-center text-[#333333] transition shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-full bg-white hover:bg-[#F4EFE6] border border-[#E0DACE] flex items-center justify-center text-[#333333] transition shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel of Reviews */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
        >
          {/* Live Reviews from Database */}
          {liveReviews.map((rev) => (
            <div
              key={rev.id}
              className="w-72 sm:w-80 flex-shrink-0 rounded-[24px] bg-white border border-[#EAE4D7] p-6 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {rev.talent_avatar && (
                    <img
                      src={rev.talent_avatar}
                      alt={rev.talent_name || 'Star'}
                      className="w-6 h-6 rounded-full object-cover border border-[#EAE4D7]"
                    />
                  )}
                  <h4 className="text-sm font-black text-[#181818] truncate">
                    {rev.occasion || 'Shoutout'} from {rev.talent_name || 'Star'}
                  </h4>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500 mb-2">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-[#888888] block mb-2 font-bold">
                  Verified Fan: {rev.customer_name}
                </span>
                <p className="text-xs text-[#444444] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            </div>
          ))}

          {/* Showcase Reviews */}
          {presetReviews.map((rev, idx) => (
            <div
              key={`preset-${idx}`}
              className="w-72 sm:w-80 flex-shrink-0 rounded-[24px] bg-white border border-[#EAE4D7] p-6 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition"
            >
              <div>
                <h4 className="text-sm font-black text-[#181818] mb-1">{rev.title}</h4>
                <div className="flex items-center gap-0.5 text-amber-500 mb-2">
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-[#888888] block mb-2 font-bold">{rev.recipient}</span>
                <p className="text-xs text-[#444444] leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
