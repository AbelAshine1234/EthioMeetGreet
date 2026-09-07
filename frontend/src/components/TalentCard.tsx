import React, { useState, useRef } from 'react';
import { Star, Video, PhoneCall, Zap, Play, CheckCircle2 } from 'lucide-react';
import { Talent } from '../types';

interface TalentCardProps {
  talent: Talent;
  currency: 'USD' | 'ETB';
  onSelect: (talent: Talent) => void;
  onBookNow: (talent: Talent, type: 'video_shoutout' | 'live_meet') => void;
}

export const TalentCard: React.FC<TalentCardProps> = ({
  talent,
  currency,
  onSelect,
  onBookNow,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatPrice = (usdAmount: number) => {
    if (currency === 'ETB') {
      const etb = Math.round(usdAmount * (talent.etb_rate || 120));
      return `${etb.toLocaleString()} ETB`;
    }
    return `$${usdAmount}`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-[#181818] border border-[#282828] hover:border-[#444444] rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 flex flex-col cursor-pointer"
      onClick={() => onSelect(talent)}
    >
      {/* Visual Image / Video Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
        {/* Still photo */}
        <img
          src={talent.avatar_url}
          alt={talent.name}
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            isHovered && talent.hero_video_url ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Hover preview video */}
        {talent.hero_video_url && (
          <video
            ref={videoRef}
            src={talent.hero_video_url}
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 pointer-events-none ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Badges on top */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {talent.trending && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#FD3A73] text-white">
              Trending
            </span>
          )}
          {talent.featured && !talent.trending && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#2a2a2a] text-neutral-200 border border-[#3d3d3d]">
              Featured
            </span>
          )}

          {/* Rating chip */}
          <div className="ml-auto px-2 py-0.5 rounded-full bg-black/80 border border-neutral-700 text-[11px] font-bold text-white flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{talent.rating}</span>
            <span className="text-neutral-400 font-normal">({talent.review_count})</span>
          </div>
        </div>

        {/* Video preview indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <Play className="w-4 h-4 fill-white text-white ml-0.5" />
        </div>

        {/* Fast response badge at bottom of image */}
        <div className="absolute bottom-2 left-2.5 flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded-md border border-neutral-700 text-[10px] text-amber-300 font-semibold">
          <Zap className="w-3 h-3" />
          <span>{talent.response_time}</span>
        </div>
      </div>

      {/* Talent Info details */}
      <div className="p-4 flex-1 flex flex-col justify-between text-left">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-base font-bold text-white group-hover:text-[#FD3A73] transition-colors truncate">
              {talent.name}
            </h3>
            {talent.verified && (
              <CheckCircle2 className="w-4 h-4 text-[#FD3A73] flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-neutral-400 truncate mb-2.5">
            {talent.title}
          </p>

          {/* Tags pills */}
          <div className="flex flex-wrap gap-1 mb-3">
            {talent.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-[#222222] text-neutral-300 border border-[#303030]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing options & Action buttons */}
        <div className="pt-2.5 border-t border-[#262626] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 block">Video Shoutout</span>
              <span className="text-sm font-extrabold text-[#FD3A73]">
                {formatPrice(talent.price_video)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block">1-on-1 Live Meet</span>
              <span className="text-sm font-extrabold text-white">
                {formatPrice(talent.price_live_call)}
              </span>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookNow(talent, 'video_shoutout');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#FD3A73] hover:bg-[#e02860] text-white text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95"
            >
              <Video className="w-3 h-3" />
              <span>Video</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookNow(talent, 'live_meet');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#242424] hover:bg-[#2e2e2e] border border-[#353535] text-white text-xs font-semibold transition flex items-center justify-center gap-1 active:scale-95"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>Live Call</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
