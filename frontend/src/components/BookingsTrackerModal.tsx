import React, { useState, useEffect } from 'react';
import { X, Search, Video, Clock, CheckCircle2, Play, Download, AlertCircle } from 'lucide-react';
import { Booking } from '../types';
import { api } from '../api';

interface BookingsTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'USD' | 'ETB';
  onJoinLiveCall?: (booking: Booking) => void;
}

export const BookingsTrackerModal: React.FC<BookingsTrackerModalProps> = ({
  isOpen,
  onClose,
  onJoinLiveCall,
}) => {
  if (!isOpen) return null;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterEmail, setFilterEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const fetchBookings = async (email?: string) => {
    try {
      setIsLoading(true);
      const data = await api.getBookings(email ? { email } : undefined);
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready / Completed</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Recording Now</span>
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Declined (Refunded)</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Creator</span>
          </span>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-white border border-[#EAE4D7] rounded-3xl shadow-2xl overflow-hidden my-6 text-left max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EAE4D7] flex items-center justify-between bg-[#FAF7F2]">
          <div>
            <h2 className="text-xl font-black text-[#181818] tracking-tight">Order Tracking & Fan Inbox</h2>
            <p className="text-xs text-[#666666] mt-0.5">Track and play your personalized shoutouts & live meet appointments</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close orders"
            className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EBE1] border border-[#EAE4D7] text-[#666666] hover:text-[#181818] flex items-center justify-center transition shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search by email filter */}
        <div className="p-4 bg-[#FAF7F2]/60 border-b border-[#EAE4D7] flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              type="email"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
              placeholder="Search by your order email..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-[#E0DACE] text-xs text-[#181818] placeholder-[#999999] focus:outline-none focus:border-[#181818]"
            />
          </div>
          <button
            onClick={() => fetchBookings(filterEmail)}
            className="px-5 py-2.5 rounded-xl bg-[#181818] hover:bg-black text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Filter
          </button>
          {filterEmail && (
            <button
              onClick={() => {
                setFilterEmail('');
                fetchBookings('');
              }}
              className="px-3 py-2.5 rounded-xl bg-white border border-[#E0DACE] text-[#666666] hover:text-[#181818] text-xs font-semibold transition cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* Video Player overlay when user clicks play */}
        {activeVideoUrl && (
          <div className="p-4 bg-[#181818] border-b border-[#EAE4D7] relative">
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="max-w-lg mx-auto aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
              <video src={activeVideoUrl} controls autoPlay className="w-full h-full object-contain" />
            </div>
            <p className="text-center text-xs text-neutral-300 mt-2 font-medium">Personalized Video Delivery</p>
          </div>
        )}

        {/* Bookings List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-white">
          {isLoading ? (
            <div className="text-center py-12 text-[#777777] text-sm">
              Loading orders...
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-[#777777] space-y-2">
              <Video className="w-10 h-10 mx-auto text-[#B0A898]" />
              <p className="text-sm font-bold text-[#181818]">No bookings found.</p>
              <p className="text-xs text-[#777777]">Book your first shoutout with your favorite Ethiopian or international star!</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D7] space-y-3 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE4D7] pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={b.talent_avatar || '/stars/selam_tesfaye.jpg'}
                      alt={b.talent_name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
                      }}
                      className="w-11 h-11 rounded-xl object-cover border border-[#E0DACE]"
                    />
                    <div>
                      <h4 className="text-sm font-black text-[#181818]">{b.talent_name}</h4>
                      <span className="text-[11px] text-[#777777] font-mono">Order: {b.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(b.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#777777]">For: </span>
                    <strong className="text-[#181818]">{b.recipient_name}</strong> ({b.occasion})
                  </div>
                  <div>
                    <span className="text-[#777777]">Ordered by: </span>
                    <strong className="text-[#181818]">{b.customer_name}</strong>
                  </div>
                  <div className="sm:col-span-2 text-[#555555]">
                    <span className="text-[#777777]">Instructions: </span>
                    <span className="italic font-medium">"{b.instructions}"</span>
                  </div>
                </div>

                {b.booking_type === 'live_meet' && (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (onJoinLiveCall) onJoinLiveCall(b);
                      }}
                      className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5 animate-pulse" />
                      <span>Join Live 1-on-1 Video Call</span>
                    </button>
                  </div>
                )}

                {(b.completed_video_url || b.video_url) && (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setActiveVideoUrl((b.completed_video_url || b.video_url)!)}
                      className="px-4 py-2 rounded-full bg-[#181818] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Shoutout</span>
                    </button>
                    <a
                      href={b.completed_video_url || b.video_url}
                      download
                      className="px-3 py-2 rounded-full bg-white hover:bg-[#F5F1E8] border border-[#E0DACE] text-[#181818] text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
