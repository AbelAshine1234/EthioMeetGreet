import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Category, Talent } from '../types';

interface CategoryCirclesProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  onViewAll?: () => void;
  categories?: Category[];
  talents?: Talent[];
}

const DEFAULT_AVATARS: Record<string, string> = {
  music: '/stars/teddy_afro.jpg',
  acting: '/stars/selam_tesfaye.jpg',
  comedy: '/stars/eshete_eshetu.jpg',
  sports: '/stars/haile_gebrselassie.jpg',
  creators: '/stars/danayit_mekbib.jpg',
  culture: '/stars/gash_girma.jpg',
};

const getTalentCategorySlug = (t: Talent): string => {
  if (t.category_slug) return String(t.category_slug).toLowerCase();
  if (typeof (t as any).category === 'object' && (t as any).category?.slug) {
    return String((t as any).category.slug).toLowerCase();
  }
  if (typeof t.category === 'string') return t.category.toLowerCase();
  return '';
};

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  selectedCategory,
  onSelectCategory,
  onViewAll,
  categories = [],
  talents = [],
}) => {
  // Dynamically resolve circles from database categories with matching real star photos from DB
  const circles = categories.length > 0
    ? categories.map((cat) => {
        const catSlug = (cat.slug || '').toLowerCase();
        const matchingTalent = talents.find((t) => {
          if (t.category_id === cat.id) return true;
          const tSlug = getTalentCategorySlug(t);
          return tSlug === catSlug;
        });
        const image = matchingTalent?.avatar_url || DEFAULT_AVATARS[catSlug] || '/stars/aster_aweke.jpg';
        return {
          name: cat.name.split('&')[0].trim(),
          slug: cat.slug,
          image,
          fallback: '/stars/selam_tesfaye.jpg',
        };
      })
    : [
        { name: 'Actors', slug: 'acting', image: '/stars/selam_tesfaye.jpg', fallback: '/stars/selam_tesfaye.jpg' },
        { name: 'Athletes', slug: 'sports', image: '/stars/haile_gebrselassie.jpg', fallback: '/stars/haile_gebrselassie.jpg' },
        { name: 'Comedians', slug: 'comedy', image: '/stars/eshete_eshetu.jpg', fallback: '/stars/eshete_eshetu.jpg' },
        { name: 'Musicians', slug: 'music', image: '/stars/teddy_afro.jpg', fallback: '/stars/teddy_afro.jpg' },
        { name: 'Creators', slug: 'creators', image: '/stars/danayit_mekbib.jpg', fallback: '/stars/danayit_mekbib.jpg' },
        { name: 'Heritage', slug: 'culture', image: '/stars/gash_girma.jpg', fallback: '/stars/gash_girma.jpg' },
      ];

  return (
    <section className="pt-6 pb-8 sm:pt-8 sm:pb-10 px-4 sm:px-6 lg:px-8 text-center bg-transparent text-[#181818]">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#181818] mb-6 sm:mb-8 tracking-tight font-['Plus_Jakarta_Sans']">
          Personalized videos from your favorite stars
        </h2>

        {/* Horizontal Row of Circular Category Items */}
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-7 overflow-x-auto pb-3 no-scrollbar">
          {circles.map((item, idx) => {
            const isActive = selectedCategory === item.slug;
            return (
              <button
                key={idx}
                onClick={() => {
                  onSelectCategory(item.slug);
                  if (onViewAll) onViewAll();
                }}
                className="flex flex-col items-center gap-2.5 group flex-shrink-0 cursor-pointer"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full overflow-hidden border-2 bg-white transition-all duration-200 group-hover:scale-105 shadow-sm ${
                  isActive
                    ? 'border-[#181818] ring-4 ring-[#FDE047] scale-105'
                    : 'border-[#EAE4D7] group-hover:border-[#181818] group-hover:shadow-md'
                }`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = item.fallback;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <span className={`text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  isActive ? 'text-[#181818] font-black underline underline-offset-4 decoration-[#FDE047] decoration-2' : 'text-[#444444] group-hover:text-[#181818]'
                }`}>
                  {item.name}
                </span>
              </button>
            );
          })}

          {/* View all circle */}
          <button
            onClick={() => {
              onSelectCategory('all');
              if (onViewAll) onViewAll();
            }}
            className="flex flex-col items-center gap-2.5 group flex-shrink-0 cursor-pointer"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full bg-white border-2 border-[#EAE4D7] hover:border-[#181818] hover:bg-[#F5F1E8] flex items-center justify-center transition-all duration-200 group-hover:scale-105 text-[#181818] shadow-sm">
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition group-hover:translate-x-0.5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#666666] group-hover:text-[#181818] whitespace-nowrap">
              View all
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
