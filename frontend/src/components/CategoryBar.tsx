import React from 'react';
import { Music, Film, Smile, Trophy, Sparkles, Crown, LayoutGrid, ArrowUpDown } from 'lucide-react';
import { Category } from '../types';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  sortOption: string;
  onSortChange: (sort: string) => void;
  filterFastDelivery: boolean;
  onToggleFastDelivery: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  sortOption,
  onSortChange,
  filterFastDelivery,
  onToggleFastDelivery,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'music': return <Music className="w-4 h-4" />;
      case 'film': return <Film className="w-4 h-4" />;
      case 'smile': return <Smile className="w-4 h-4" />;
      case 'trophy': return <Trophy className="w-4 h-4" />;
      case 'sparkles': return <Sparkles className="w-4 h-4" />;
      case 'crown': return <Crown className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-[#141414] border-b border-[#242424] sticky top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Scrollable category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <button
              onClick={() => onSelectCategory('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#FD3A73] text-white'
                  : 'bg-[#1c1c1c] text-neutral-300 hover:bg-[#252525] hover:text-white border border-[#2b2b2b]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Stars</span>
            </button>

            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#FD3A73] text-white'
                      : 'bg-[#1c1c1c] text-neutral-300 hover:bg-[#252525] hover:text-white border border-[#2b2b2b]'
                  }`}
                >
                  {getIcon(cat.icon)}
                  <span>{cat.name}</span>
                  {cat.talent_count ? (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/30 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                      {cat.talent_count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex items-center justify-between md:justify-end gap-2.5 pt-1 md:pt-0">
            {/* 24-hr Fast Delivery Filter toggle */}
            <button
              onClick={onToggleFastDelivery}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                filterFastDelivery
                  ? 'bg-[#262626] border-amber-400 text-amber-300'
                  : 'bg-[#1c1c1c] border-[#2b2b2b] text-neutral-300 hover:text-white'
              }`}
            >
              <span>⚡ 24hr Delivery</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#1c1c1c] border border-[#2b2b2b] rounded-full px-3 py-1.5 text-xs text-neutral-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value)}
                aria-label="Sort talents"
                className="bg-transparent text-xs text-neutral-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value="featured" className="bg-[#1c1c1c] text-white">Featured First</option>
                <option value="trending" className="bg-[#1c1c1c] text-white">Trending Stars</option>
                <option value="rating" className="bg-[#1c1c1c] text-white">Highest Rated ★</option>
                <option value="price_asc" className="bg-[#1c1c1c] text-white">Price: Low to High</option>
                <option value="price_desc" className="bg-[#1c1c1c] text-white">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
