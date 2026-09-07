import React, { useState, useEffect } from 'react';
import { Talent, Review, getTalentCategoryName } from '../types';
import { api } from '../api';
import confetti from 'canvas-confetti';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Play, 
  ShieldCheck, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  Star, 
  Zap, 
  Check,
  ArrowUpRight,
  Plus,
  Send
} from 'lucide-react';

interface TalentDetailPageProps {
  talent: Talent;
  currency: 'USD' | 'ETB';
  onBack: () => void;
  onBookPersonal: (talent: Talent, occasion?: string) => void;
  onBookBusiness: (talent: Talent) => void;
  onNavigateToBrowse: () => void;
}

export const TalentDetailPage: React.FC<TalentDetailPageProps> = ({
  talent,
  currency,
  onBack,
  onBookPersonal,
  onBookBusiness,
  onNavigateToBrowse,
}) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('Birthday');
  const [isFollowing, setIsFollowing] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerOccasion, setReviewerOccasion] = useState('Birthday');
  const [reviewerComment, setReviewerComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Fetch verified reviews for this talent
  useEffect(() => {
    async function loadTalentReviews() {
      if (!talent.id) return;
      try {
        const data = await api.getReviews({ talent_id: talent.id });
        setReviews(data);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    }
    loadTalentReviews();
  }, [talent.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    if (!reviewerName.trim()) {
      setReviewError('Please enter your name');
      return;
    }
    if (reviewerComment.trim().length < 5) {
      setReviewError('Please share at least a few words (at least 5 characters)');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const created = await api.submitReview({
        talent_id: talent.id,
        customer_name: reviewerName.trim(),
        rating: reviewerRating,
        occasion: reviewerOccasion,
        comment: reviewerComment.trim(),
      });

      setReviews((prev) => [created, ...prev]);
      setShowReviewForm(false);
      setReviewerName('');
      setReviewerComment('');
      setReviewSuccessMsg('Thank you! Your verified review has been published.');
      setTimeout(() => setReviewSuccessMsg(''), 4000);

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (err) {}
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatPrice = (usd: number, multiplier = 1) => {
    const totalUsd = usd * multiplier;
    if (currency === 'ETB') {
      const etb = Math.round(totalUsd * 120);
      return `ETB ${etb.toLocaleString()}+`;
    }
    return `$${totalUsd.toLocaleString()}+`;
  };

  const personalPriceFormatted = formatPrice(talent.price_video);
  const businessPriceFormatted = formatPrice(talent.price_video, 10);

  const occasions = [
    { label: 'Birthday', icon: '🎂' },
    { label: 'Fantasy football', icon: '🏈' },
    { label: 'Pep talk', icon: '🤗' },
    { label: 'Roast', icon: '🔥' },
    { label: 'Advice', icon: '💜' },
    { label: 'Question', icon: '❓' },
    { label: 'Other', icon: '💬' },
  ];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  return (
    <div className="w-full bg-[#FAF7F2] text-[#181818] min-h-screen pb-28 sm:pb-20">
      
      {/* Toast Notification */}
      {showShareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#181818] text-white px-5 py-3 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile link copied to clipboard!</span>
        </div>
      )}

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-6">
        
        {/* 1. Breadcrumbs (matches media_1788777324928.png) */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#777777] mb-5">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 hover:text-black transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Creators</span>
          </button>
          <span>&gt;</span>
          <button 
            onClick={onNavigateToBrowse}
            className="hover:text-black transition cursor-pointer capitalize"
          >
            {getTalentCategoryName(talent)}
          </button>
          <span>&gt;</span>
          <span className="text-[#181818] font-black">{talent.name}</span>
        </div>

        {/* 2. Main Profile Card Container (matches media_1788777324928.png structure with warm theme) */}
        <div className="bg-white border border-[#EAE4D7] rounded-3xl overflow-hidden shadow-sm">
          
          {/* Top Fan Favorite Badge */}
          <div className="w-full py-2.5 bg-[#FAF7F2] border-b border-[#EAE4D7] text-center">
            <span className="text-xs font-black text-[#181818] tracking-widest uppercase">
              {'{ FAN FAVORITE }'}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* Artist Header: Avatar, Name, Title, More */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#181818] bg-[#F5F1E8] flex-shrink-0 shadow-sm">
                  <img
                    src={talent.avatar_url || talent.avatar}
                    alt={talent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#181818] leading-tight">
                    {talent.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#666666] font-medium mt-0.5">
                    {talent.bio ? talent.bio.split('.')[0] : `${getTalentCategoryName(talent)} Star`}
                  </p>
                </div>
              </div>

              {/* Three dots / share */}
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-[#F0EBE1] text-[#181818] flex items-center justify-center transition border border-[#E0DACE] cursor-pointer shadow-sm"
                title="Share profile"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* 3. Horizontal Booking Cards / Carousel (matches media_1788777324928.png) */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar mb-6">
              
              {/* Card 1: Intro Video */}
              <div 
                onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                className="w-36 sm:w-40 aspect-[9/13] rounded-2xl overflow-hidden relative flex-shrink-0 border-2 border-[#EAE4D7] group cursor-pointer bg-black shadow-sm"
              >
                <img
                  src={talent.avatar_url || talent.avatar}
                  alt="Intro Video"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2.5 left-2.5 text-[11px] font-bold text-white drop-shadow">
                  Intro video
                </div>
              </div>

              {/* Card 2: SAY HAPPY BIRTHDAY */}
              <div className="w-36 sm:w-40 aspect-[9/13] rounded-2xl p-4 flex flex-col justify-between flex-shrink-0 bg-[#F3E8FF] border border-[#E9D5FF] text-[#581C87] shadow-sm">
                <div>
                  <div className="text-xl mb-2">🎂</div>
                  <div className="text-xs font-black uppercase tracking-tight leading-tight">
                    SAY HAPPY BIRTHDAY
                  </div>
                </div>
                <button
                  onClick={() => onBookPersonal(talent, 'Birthday')}
                  className="w-full py-2 rounded-full bg-purple-900 text-white hover:bg-purple-950 font-bold text-xs transition active:scale-95 shadow-sm"
                >
                  Book now
                </button>
              </div>

              {/* Card 3: ASK A QUESTION */}
              <div className="w-36 sm:w-40 aspect-[9/13] rounded-2xl p-4 flex flex-col justify-between flex-shrink-0 bg-[#FFE4E6] border border-[#FECDD3] text-[#881337] shadow-sm">
                <div>
                  <div className="text-xl mb-2">🙋</div>
                  <div className="text-xs font-black uppercase tracking-tight leading-tight">
                    ASK A QUESTION
                  </div>
                </div>
                <button
                  onClick={() => onBookPersonal(talent, 'Question')}
                  className="w-full py-2 rounded-full bg-rose-900 text-white hover:bg-rose-950 font-bold text-xs transition active:scale-95 shadow-sm"
                >
                  Book now
                </button>
              </div>

              {/* Card 4: RECEIVE A PEP TALK */}
              <div className="w-36 sm:w-40 aspect-[9/13] rounded-2xl p-4 flex flex-col justify-between flex-shrink-0 bg-[#CCFBF1] border border-[#99F6E4] text-[#115E59] shadow-sm">
                <div>
                  <div className="text-xl mb-2">💪</div>
                  <div className="text-xs font-black uppercase tracking-tight leading-tight">
                    RECEIVE A PEP TALK
                  </div>
                </div>
                <button
                  onClick={() => onBookPersonal(talent, 'Pep talk')}
                  className="w-full py-2 rounded-full bg-teal-900 text-white hover:bg-teal-950 font-bold text-xs transition active:scale-95 shadow-sm"
                >
                  Book now
                </button>
              </div>

              {/* Card 5: ROAST A FRIEND */}
              <div className="w-36 sm:w-40 aspect-[9/13] rounded-2xl p-4 flex flex-col justify-between flex-shrink-0 bg-[#FEF3C7] border border-[#FDE68A] text-[#78350F] shadow-sm">
                <div>
                  <div className="text-xl mb-2">🔥</div>
                  <div className="text-xs font-black uppercase tracking-tight leading-tight">
                    ROAST A FRIEND
                  </div>
                </div>
                <button
                  onClick={() => onBookPersonal(talent, 'Roast')}
                  className="w-full py-2 rounded-full bg-amber-900 text-white hover:bg-amber-950 font-bold text-xs transition active:scale-95 shadow-sm"
                >
                  Book now
                </button>
              </div>

            </div>

            {/* Video Modal Player if activated */}
            {isPlayingVideo && (
              <div className="mb-6 rounded-2xl overflow-hidden border border-[#E0DACE] bg-black p-3 relative shadow-lg">
                <button
                  onClick={() => setIsPlayingVideo(false)}
                  className="absolute top-5 right-5 z-10 w-7 h-7 rounded-full bg-white/80 text-black font-bold text-xs flex items-center justify-center hover:bg-white"
                >
                  ✕
                </button>
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  controls
                  autoPlay
                  className="w-full rounded-xl aspect-video object-contain"
                />
              </div>
            )}

            {/* 4. Stats & Social Proof (matches media_1788777324928.png) */}
            <div className="mb-6">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-3">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>15+ people booked today</span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-[#FAF7F2] rounded-2xl border border-[#E0DACE] text-left">
                <div>
                  <span className="text-[11px] text-[#777777] block font-medium">Price</span>
                  <span className="text-xs sm:text-sm font-black text-[#181818]">{personalPriceFormatted}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#777777] block font-medium">Delivery</span>
                  <span className="text-xs sm:text-sm font-bold text-[#181818] flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-600 fill-current" />
                    <span>24hr delivery</span>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#777777] block font-medium">Reviews</span>
                  <span className="text-xs sm:text-sm font-bold text-[#181818] flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{talent.rating || '5.00'} ({talent.reviews_count || '3.5K'})</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Primary CTAs (matches media_1788777324928.png) */}
            <div className="space-y-3 mb-8">
              {/* Book Personal Video */}
              <button
                onClick={() => onBookPersonal(talent, selectedReason)}
                className="w-full py-4 rounded-full bg-[#181818] hover:bg-black text-white font-black text-sm sm:text-base transition shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#FDE047]" />
                <span>Book a personal video {personalPriceFormatted}</span>
              </button>

              {/* Book Business Video */}
              <button
                onClick={() => onBookBusiness(talent)}
                className="w-full py-3.5 rounded-full bg-[#FAF7F2] hover:bg-[#F0EBE1] text-[#181818] font-bold text-xs sm:text-sm border border-[#E0DACE] transition flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer shadow-sm"
              >
                <Briefcase className="w-4 h-4 text-[#555555]" />
                <span>Book a business video {businessPriceFormatted}</span>
                <ArrowUpRight className="w-4 h-4 text-[#777777]" />
              </button>
            </div>

            {/* 6. Reasons to get a video (matches media_1788777324928.png) */}
            <div className="border-t border-[#EAE4D7] pt-6 mb-6">
              <h3 className="text-xs font-bold text-[#777777] uppercase tracking-wider mb-3">
                Reasons to get a video
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ.label}
                    onClick={() => setSelectedReason(occ.label)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition border cursor-pointer ${
                      selectedReason === occ.label
                        ? 'bg-[#181818] text-white border-[#181818] shadow-sm'
                        : 'bg-[#FAF7F2] text-[#555555] border-[#E0DACE] hover:text-[#181818]'
                    }`}
                  >
                    <span>{occ.icon}</span>
                    <span>{occ.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Bio & Details (matches media_1788777324928.png) */}
            <div className="border-t border-[#EAE4D7] pt-6 mb-6 text-left">
              <p className={`text-xs sm:text-sm text-[#555555] leading-relaxed ${isBioExpanded ? '' : 'line-clamp-3'}`}>
                {talent.bio || `Whether it's a milestone birthday, an anniversary, or a long-awaited reunion, make it unforgettable with a one-of-a-kind Meet and Greet video from ${talent.name}. You'll have the chance to customize your request for ${talent.name}, like asking them to mention inside jokes, share words of encouragement, or celebrate an upcoming big moment.`}
              </p>
              <button
                onClick={() => setIsBioExpanded(!isBioExpanded)}
                className="text-xs font-bold text-[#181818] hover:underline mt-1.5 block cursor-pointer"
              >
                {isBioExpanded ? 'Read less' : 'Read more'}
              </button>

              {/* Video stats */}
              <div className="mt-4 space-y-1 text-xs text-[#777777]">
                <div className="flex items-center gap-1.5">
                  <span>★</span>
                  <span>Average video length: <strong className="text-[#181818] font-bold">01:37</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>★</span>
                  <span>Last completed video: <strong className="text-[#181818] font-bold">today at 06:12 AM</strong></span>
                </div>
              </div>
            </div>

            {/* 8. What to expect (matches media_1788777332618.png) */}
            <div className="border-t border-[#EAE4D7] pt-6 mb-6 text-left">
              <h3 className="text-xs font-bold text-[#777777] uppercase tracking-wider mb-4">
                What to expect
              </h3>
              
              <div className="space-y-2.5 text-xs text-[#444444] font-medium">
                <div className="flex items-center gap-2.5">
                  <span>✍️</span>
                  <span>Write a short set of instructions</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span>📹</span>
                  <span>Get your video</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span>✨</span>
                  <span>Share the magic</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#EAE4D7]">
                <span className="text-xs text-[#555555] underline cursor-pointer hover:text-black">
                  Money back guarantee
                </span>
                <div className="flex items-center gap-2 text-[10px] text-[#888888] font-bold">
                  <span>AMEX</span>
                  <span>DISCOVER</span>
                  <span>MC</span>
                  <span>VISA</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 9. Other ways to connect (matches media_1788777332618.png) */}
        <div className="mt-6 bg-white border border-[#EAE4D7] rounded-3xl p-6 shadow-sm text-left">
          <h3 className="text-sm font-bold text-[#181818] text-center mb-4">
            Other ways to connect
          </h3>
          
          <div className="space-y-2.5">
            <button
              onClick={() => setMessageSent(true)}
              className="w-full py-3 px-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-[#E0DACE] text-xs font-bold text-[#181818] flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#666666]" />
              <span>{messageSent ? 'Message sent!' : 'Send a message'}</span>
            </button>

            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className="w-full py-3 px-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-[#E0DACE] text-xs font-bold text-[#181818] flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Bell className={`w-4 h-4 ${isFollowing ? 'text-amber-500 fill-current' : 'text-[#666666]'}`} />
              <span>{isFollowing ? 'Following for updates' : 'Follow for updates'}</span>
            </button>
          </div>
        </div>

        {/* 10. More about Artist (matches media_1788777332618.png) */}
        <div className="mt-6 bg-white border border-[#EAE4D7] rounded-3xl p-6 shadow-sm text-left">
          <h3 className="text-sm font-bold text-[#181818] mb-2">
            More about {talent.name}
          </h3>
          <p className="text-xs text-[#666666] mb-4">
            Welcome to the fan community! Connecting with fans worldwide.
          </p>
          <div className="text-[11px] text-[#777777] mb-4 font-medium">
            Joined Meet and Greet: May 9, 2024
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-[#FAF7F2] border border-[#E0DACE] rounded-full text-[11px] font-bold text-[#555555]">
              {getTalentCategoryName(talent)}
            </span>
            <span className="px-3 py-1 bg-[#FAF7F2] border border-[#E0DACE] rounded-full text-[11px] font-bold text-[#555555]">
              Creator
            </span>
          </div>
        </div>

        {/* 11. Recent reviews (matches media_1788777339988.png) */}
        <div className="mt-6 bg-white border border-[#EAE4D7] rounded-3xl p-6 sm:p-8 shadow-sm text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#181818]">Recent reviews</h3>
              <p className="text-xs text-[#777777] mt-0.5">Verified fan feedback & ratings</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-bold text-[#181818]">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{talent.rating ? Number(talent.rating).toFixed(2) : '5.00'} ({reviews.length > 0 ? reviews.length : talent.reviews_count || 12})</span>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3.5 py-1.5 rounded-full bg-[#181818] text-white text-xs font-bold hover:bg-black transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showReviewForm ? 'Cancel' : 'Write Review'}</span>
              </button>
            </div>
          </div>

          {/* Review Success Alert */}
          {reviewSuccessMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{reviewSuccessMsg}</span>
            </div>
          )}

          {/* Interactive Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D7] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#181818]">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewerRating(star)}
                      className="p-1 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= reviewerRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-[#CCCCCC]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#666666] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. Almaz Kebede"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E0DACE] text-xs text-[#181818] focus:border-[#181818] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#666666] mb-1">Occasion</label>
                  <select
                    value={reviewerOccasion}
                    onChange={(e) => setReviewerOccasion(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E0DACE] text-xs text-[#181818] focus:border-[#181818] outline-none"
                  >
                    <option value="Birthday">🎂 Birthday</option>
                    <option value="Pep Talk">🤗 Pep Talk</option>
                    <option value="Roast">🔥 Roast</option>
                    <option value="Advice">💜 Advice</option>
                    <option value="Anniversary">💍 Anniversary</option>
                    <option value="Just Because">✨ Just Because</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#666666] mb-1">Your Review</label>
                <textarea
                  required
                  rows={2}
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder="How was your video shoutout? What made it special?"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E0DACE] text-xs text-[#181818] focus:border-[#181818] outline-none resize-none"
                />
              </div>

              {reviewError && (
                <p className="text-xs font-semibold text-rose-600">{reviewError}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2 rounded-full bg-[#181818] text-white text-xs font-bold hover:bg-black transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {reviews.length > 0 ? (
              reviews.slice(0, 4).map((rev) => (
                <div key={rev.id} className="bg-[#FAF7F2] border border-[#E0DACE] rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#181818]">{rev.customer_name}</div>
                    <div className="flex text-amber-400 text-xs my-1">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current inline-block" />
                      ))}
                    </div>
                    <div className="text-[10px] text-[#777777] mb-2 font-medium">
                      {new Date(rev.created_at).toLocaleDateString()} · {rev.occasion || 'Shoutout'}
                    </div>
                    <p className="text-xs text-[#555555] line-clamp-3 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Showcase Fallback 1 */}
                <div className="bg-[#FAF7F2] border border-[#E0DACE] rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#181818]">Selamawit D.</div>
                    <div className="flex text-amber-400 text-xs my-1">★★★★★</div>
                    <div className="text-[10px] text-[#777777] mb-2 font-medium">September 7, 2026 · Birthday</div>
                    <p className="text-xs text-[#555555] line-clamp-3 leading-relaxed">
                      "This was incredible! I gave a few details and received the best video for my sister. We can't stop replaying it!"
                    </p>
                  </div>
                </div>

                {/* Showcase Fallback 2 */}
                <div className="bg-[#FAF7F2] border border-[#E0DACE] rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#181818]">Dawit A.</div>
                    <div className="flex text-amber-400 text-xs my-1">★★★★★</div>
                    <div className="text-[10px] text-[#777777] mb-2 font-medium">September 7, 2026 · Pep talk</div>
                    <p className="text-xs text-[#555555] line-clamp-3 leading-relaxed">
                      "Another amazing Cameo! Absolute 10/10, couldn't be more perfect. The delivery flowed naturally and inspired everyone."
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => alert(`Showing verified reviews for ${talent.name}.`)}
            className="w-full py-3 rounded-full bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-[#E0DACE] text-xs font-bold text-[#181818] transition cursor-pointer text-center"
          >
            See all reviews ({reviews.length > 0 ? reviews.length : 12})
          </button>
        </div>

        {/* 12. Promote your business with Artist (matches media_1788777345276.png) */}
        <div 
          onClick={() => onBookBusiness(talent)}
          className="mt-6 bg-white border border-[#EAE4D7] hover:border-[#181818] rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4 cursor-pointer transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E0DACE] flex items-center justify-center text-xl">
              💼
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#181818] group-hover:underline transition">
                Promote your business with {talent.name}
              </h4>
              <p className="text-xs text-[#666666]">
                License commercial shoutouts for marketing, socials, or team pep talks.
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#888888] group-hover:text-black transition flex-shrink-0" />
        </div>

      </div>

      {/* Mobile Sticky Bottom Booking CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#EAE4D7] p-3.5 z-40 sm:hidden flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div>
          <span className="text-[10px] text-[#777777] block font-semibold uppercase tracking-wider">Video shoutout</span>
          <span className="text-sm font-black text-[#181818]">{personalPriceFormatted}</span>
        </div>
        <button
          onClick={() => onBookPersonal(talent, selectedReason)}
          className="px-5 py-2.5 rounded-full bg-[#181818] text-white font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-[#FDE047]" />
          <span>Book Now</span>
        </button>
      </div>
    </div>
  );
};
