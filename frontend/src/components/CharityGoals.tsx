import React from 'react';
import { Heart } from 'lucide-react';
import { Talent } from '../types';

interface CharityGoalsProps {
  onSelectCause: (cause: string) => void;
  currency: 'USD' | 'ETB';
  onViewAll?: () => void;
  talents?: Talent[];
}

export const CharityGoals: React.FC<CharityGoalsProps> = ({ 
  onSelectCause, 
  currency, 
  onViewAll,
  talents = [],
}) => {
  const formatPrice = (usd: number) => {
    if (currency === 'ETB') {
      const etb = Math.round(usd * 120);
      return `ETB ${etb.toLocaleString()}+`;
    }
    return `$${usd}+`;
  };

  // Find real stars from the database API
  const haile = talents.find(t => t.id === 'talent_haile_gebrselassie') || talents.find(t => t.name.includes('Haile'));
  const teddy = talents.find(t => t.id === 'talent_teddy_afro') || talents.find(t => t.name.includes('Teddy'));
  const aster = talents.find(t => t.id === 'talent_aster_aweke') || talents.find(t => t.name.includes('Aster'));
  const selam = talents.find(t => t.id === 'talent_selam_tesfaye') || talents.find(t => t.name.includes('Selam'));

  const charityCards = [
    {
      name: haile?.name || 'Haile Gebrselassie',
      title: haile?.title || '2x Olympic Champion & Marathon Legend',
      price: formatPrice(haile?.price_video || 110),
      image: haile?.avatar_url || '/stars/haile_gebrselassie.jpg',
      foundation: 'Ethiopian Youth Athletics & Running Fund',
      progress: 78,
      goal: currency === 'ETB' ? 'ETB 1,800,000' : '$15,000',
      tags: ['Athletics', 'Youth', 'Olympic Hope']
    },
    {
      name: teddy?.name || 'Teddy Afro',
      title: teddy?.title || 'Legendary Singer & National Icon',
      price: formatPrice(teddy?.price_video || 120),
      image: teddy?.avatar_url || '/stars/teddy_afro.jpg',
      foundation: 'Tikur Anbessa Children Hospital Relief',
      progress: 92,
      goal: currency === 'ETB' ? 'ETB 3,000,000' : '$25,000',
      tags: ['Health', 'Children', 'Community']
    },
    {
      name: aster?.name || 'Aster Aweke',
      title: aster?.title || 'Queen of Ethiopian Soul',
      price: formatPrice(aster?.price_video || 95),
      image: aster?.avatar_url || '/stars/aster_aweke.jpg',
      foundation: 'Ethiopian Girls Education & Arts Trust',
      progress: 64,
      goal: currency === 'ETB' ? 'ETB 1,200,000' : '$10,000',
      tags: ['Education', 'Girls', 'Music']
    },
    {
      name: selam?.name || 'Selam Tesfaye',
      title: selam?.title || 'Top Ethiopian Film Star',
      price: formatPrice(selam?.price_video || 85),
      image: selam?.avatar_url || '/stars/selam_tesfaye.jpg',
      foundation: 'Addis Ababa Creative Youth Theater',
      progress: 45,
      goal: currency === 'ETB' ? 'ETB 960,000' : '$8,000',
      tags: ['Cinema', 'Youth', 'Arts']
    }
  ];

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
      <div className="max-w-[1440px] mx-auto text-left">
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-black text-[#181818]">
            Stars earning towards a goal
          </h3>
          <button 
            onClick={onViewAll}
            className="text-xs font-bold text-[#666666] hover:text-black transition cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {charityCards.map((card, idx) => (
            <div
              key={idx}
              className="rounded-3xl overflow-hidden bg-white border border-[#EAE4D7] flex flex-col group cursor-pointer hover:shadow-md transition duration-200"
              onClick={() => onSelectCause(card.tags[0])}
            >
              {/* Photo with Charity badge */}
              <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Charity Badge Top Right */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#181818] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                  <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
                  <span>Charity</span>
                </div>
              </div>

              {/* Info Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-base font-bold text-[#181818]">{card.name}</h4>
                  <p className="text-xs text-[#666666] line-clamp-1">{card.title}</p>
                  <span className="text-xs font-black text-[#181818] block mt-1">{card.price}</span>
                </div>

                {/* Foundation & Progress */}
                <div className="space-y-1.5 pt-2 border-t border-[#EAE4D7]">
                  <div className="flex items-center gap-1.5 text-xs text-[#333333] font-semibold">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span className="truncate">{card.foundation}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-[#F4EFE6] overflow-hidden">
                    <div
                      className="h-full bg-[#FDE047] rounded-full"
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#777777] block font-medium">
                    {card.progress}% of the way to {card.goal} goal
                  </span>
                </div>

                {/* Cause tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {card.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F5F1E8] text-[#555555]">
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
