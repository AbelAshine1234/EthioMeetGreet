import React, { useState } from 'react';
import { X, Star, Video, PhoneCall, Zap, CheckCircle2, Globe, MessageSquare, Play } from 'lucide-react';
import { Talent } from '../types';

interface TalentDetailModalProps {
  talent: Talent | null;
  onClose: () => void;
  currency: 'USD' | 'ETB';
  onBookNow: (talent: Talent, type: 'video_shoutout' | 'live_meet') => void;
}

export const TalentDetailModal: React.FC<TalentDetailModalProps> = ({
  talent,
  onClose,
  currency,
  onBookNow,
}) => {
  if (!talent) return null;

  const [activeVideo, setActiveVideo] = useState<string>(talent.hero_video_url);

  const formatPrice = (usdAmount: number) => {
    if (currency === 'ETB') {
      const etb = Math.round(usdAmount * (talent.etb_rate || 120));
      return `${etb.toLocaleString()} ETB`;
    }
    return `$${usdAmount}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-white border border-[#EAE4D7] rounded-3xl shadow-2xl overflow-hidden my-6 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#181818] flex items-center justify-center border border-[#EAE4D7] transition shadow-md cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Video Player Header */}
        <div className="relative aspect-video w-full bg-[#181818]">
          <video
            key={activeVideo}
            src={activeVideo}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-xs border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 pointer-events-none">
            <Play className="w-3 h-3 fill-[#FDE047] text-[#FDE047]" />
            <span>Sample Video Preview</span>
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 sm:p-8 space-y-6 bg-white">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE4D7] pb-5">
            <div className="flex items-center gap-4">
              <img
                src={talent.avatar_url || talent.avatar}
                alt={talent.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                }}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm ring-2 ring-[#E0DACE]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-[#181818] tracking-tight">{talent.name}</h2>
                  {talent.verified && (
                    <CheckCircle2 className="w-5 h-5 text-[#181818]" />
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#555555] font-medium">{talent.title || talent.bio}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-[#666666]">
                  <span className="flex items-center gap-1 text-[#181818] font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    {talent.rating} ({talent.review_count || '1.2k'} reviews)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#181818] font-semibold">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    {talent.response_time}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Booking CTA */}
            <div className="flex sm:flex-col gap-2 justify-end">
              <button
                onClick={() => {
                  onClose();
                  onBookNow(talent, 'video_shoutout');
                }}
                className="flex-1 px-5 py-2.5 rounded-full bg-[#181818] hover:bg-black text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Book Video ({formatPrice(talent.price_video)})</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onBookNow(talent, 'live_meet');
                }}
                className="flex-1 px-4 py-2 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E0DACE] text-[#181818] font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>1-on-1 Meet ({formatPrice(talent.price_live_call)})</span>
              </button>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#777777]">About {talent.name}</h3>
            <p className="text-xs sm:text-sm text-[#444444] leading-relaxed whitespace-pre-line font-medium">{talent.bio}</p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E0DACE] text-xs font-medium text-[#555555]">
                <Globe className="w-3.5 h-3.5 text-[#181818]" />
                <span>Languages: {talent.languages.join(', ')}</span>
              </div>
              {talent.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E0DACE] text-xs font-semibold text-[#555555]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sample Videos Switcher if available */}
          {talent.sample_videos && talent.sample_videos.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#777777]">More Video Previews</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {talent.sample_videos.map((vid, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVideo(vid.url)}
                    className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                      activeVideo === vid.url
                        ? 'bg-[#FAF7F2] border-2 border-[#181818] shadow-xs'
                        : 'bg-white border-[#E0DACE] text-[#555555] hover:bg-[#FAF7F2] hover:text-[#181818]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#181818] flex items-center justify-center flex-shrink-0 text-white">
                      <Play className="w-3.5 h-3.5 ml-0.5 fill-white" />
                    </div>
                    <span className="text-xs font-bold line-clamp-2">{vid.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews Section */}
          <div className="space-y-3 pt-2 border-t border-[#EAE4D7]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#777777] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#181818]" />
                Recent Verified Reviews ({talent.reviews?.length || talent.review_count || '1.2k'})
              </h3>
              <span className="text-xs text-[#181818] font-bold">★ {talent.rating} / 5.0</span>
            </div>

            <div className="space-y-2.5">
              {talent.reviews && talent.reviews.length > 0 ? (
                talent.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E0DACE] space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#181818]">{rev.customer_name}</span>
                      <div className="flex items-center text-xs text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    {rev.occasion && (
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded-md bg-white text-[#555555] border border-[#E0DACE] font-semibold">
                        {rev.occasion}
                      </span>
                    )}
                    <p className="text-xs text-[#555555] leading-relaxed font-medium">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#888888] italic">No reviews yet for this creator.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
