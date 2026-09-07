import React, { useState, useEffect } from 'react';
import { X, Clock, UploadCloud, Video, DollarSign, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { Booking, Talent } from '../types';
import { api } from '../api';

interface CreatorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  talents: Talent[];
  currency: 'USD' | 'ETB';
  onTalentUpdated?: () => void;
  onStartLiveCall?: (booking: Booking, talent: Talent) => void;
}

export const CreatorStudioModal: React.FC<CreatorStudioModalProps> = ({
  isOpen,
  onClose,
  talents,
  onTalentUpdated,
  onStartLiveCall,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [selectedTalentId, setSelectedTalentId] = useState<string>(talents[0]?.id || '');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFulfillBooking, setActiveFulfillBooking] = useState<Booking | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const selectedTalent = talents.find((t) => t.id === selectedTalentId) || talents[0];

  // Profile Edit State
  const [editTitle, setEditTitle] = useState(selectedTalent?.title || '');
  const [editBio, setEditBio] = useState(selectedTalent?.bio || '');
  const [editPriceVideo, setEditPriceVideo] = useState(selectedTalent?.price_video || 50);
  const [editPriceLive, setEditPriceLive] = useState(selectedTalent?.price_live_call || 120);
  const [editResponseTime, setEditResponseTime] = useState(selectedTalent?.response_time || '⚡ Within 24 hours');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (selectedTalent) {
      setEditTitle(selectedTalent.title || '');
      setEditBio(selectedTalent.bio || '');
      setEditPriceVideo(selectedTalent.price_video || 50);
      setEditPriceLive(selectedTalent.price_live_call || 120);
      setEditResponseTime(selectedTalent.response_time || '⚡ Within 24 hours');
    }
  }, [selectedTalentId]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      await api.updateTalent(selectedTalentId, {
        title: editTitle.trim(),
        bio: editBio.trim(),
        price_video: Number(editPriceVideo),
        price_live_call: Number(editPriceLive),
        response_time: editResponseTime,
      });
      setActionSuccess('Star rates & profile updated in database!');
      setTimeout(() => setActionSuccess(''), 4000);
      onTalentUpdated?.();
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const fetchTalentBookings = async (talentId: string) => {
    try {
      setIsLoading(true);
      const data = await api.getBookings({ talent_id: talentId });
      setBookings(data);
    } catch (err) {
      console.error('Failed to load creator bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTalentId) {
      fetchTalentBookings(selectedTalentId);
    }
  }, [selectedTalentId]);

  const handleUpdateStatus = async (
    bookingId: string,
    status: 'accepted' | 'declined' | 'completed' | 'in_progress',
    videoUrl?: string,
    note?: string
  ) => {
    try {
      await api.updateBookingStatus(bookingId, {
        status,
        completed_video_url: videoUrl,
        talent_message: note,
      });

      setActionSuccess(`Booking updated to ${status}!`);
      setTimeout(() => setActionSuccess(''), 4000);

      fetchTalentBookings(selectedTalentId);
      setActiveFulfillBooking(null);
      setVideoUrlInput('');
      setMessageInput('');
    } catch (err: any) {
      alert(err.message || 'Failed to update booking');
    }
  };

  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
  const pendingCount = bookings.filter((b) => b.status === 'pending' || b.status === 'in_progress').length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white border border-[#EAE4D7] rounded-3xl shadow-2xl overflow-hidden my-6 text-left max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EAE4D7] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDE047] text-[#181818] border border-[#E0DACE] flex items-center justify-center font-black shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#181818] tracking-tight">Creator Studio & Fulfill Hub</h2>
              <p className="text-xs text-[#666666]">Accept fan requests, record personalized videos & track earnings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close creator studio"
            className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EBE1] border border-[#EAE4D7] text-[#666666] hover:text-[#181818] flex items-center justify-center transition shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Creator Selector & Stats */}
        <div className="p-5 bg-[#FAF7F2]/60 border-b border-[#EAE4D7] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#777777]">Active Creator:</label>
              <select
                value={selectedTalentId}
                onChange={(e) => setSelectedTalentId(e.target.value)}
                aria-label="Select active star"
                className="px-3.5 py-2 rounded-xl bg-white border border-[#E0DACE] text-xs font-bold text-[#181818] focus:outline-none focus:border-[#181818] shadow-xs cursor-pointer"
              >
                {talents.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.handle})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Stat Chips */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EAE4D7] flex items-center gap-2 text-xs shadow-xs">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="text-[#666666]">Earned:</span>
                <span className="font-black text-[#181818]">${totalEarnings.toLocaleString()}</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#EAE4D7] flex items-center gap-2 text-xs shadow-xs">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-[#666666]">Queue:</span>
                <span className="font-black text-[#181818]">{pendingCount}</span>
              </div>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#EAE4D7]">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#181818] text-white shadow-xs'
                  : 'bg-white text-[#555555] hover:text-[#181818] border border-[#E0DACE]'
              }`}
            >
              Requests Queue ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#181818] text-white shadow-xs'
                  : 'bg-white text-[#555555] hover:text-[#181818] border border-[#E0DACE]'
              }`}
            >
              Rates & Profile Info
            </button>
          </div>

          {actionSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccess}</span>
            </div>
          )}
        </div>

        {/* PROFILE EDIT TAB */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto flex-1 space-y-4 bg-white">
            <div className="max-w-2xl space-y-4">
              <h3 className="text-sm font-black text-[#181818]">
                Edit Rates & Details for {selectedTalent.name}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#444444] block mb-1">Headline / Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] focus:border-[#181818] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#444444] block mb-1">Response Turnaround</label>
                  <input
                    type="text"
                    value={editResponseTime}
                    onChange={(e) => setEditResponseTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] focus:border-[#181818] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#444444] block mb-1">Personal Video Shoutout ($ USD)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editPriceVideo}
                    onChange={(e) => setEditPriceVideo(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] focus:border-[#181818] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#444444] block mb-1">1-on-1 Live Meet ($ USD)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editPriceLive}
                    onChange={(e) => setEditPriceLive(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] focus:border-[#181818] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#444444] block mb-1">Bio & What You Love Creating for Fans</label>
                <textarea
                  rows={3}
                  required
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] focus:border-[#181818] outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-full bg-[#181818] text-white text-xs font-bold hover:bg-black transition flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#FDE047]" />
                  <span>{isSavingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Fulfill Modal Subform */}
        {activeTab === 'orders' && activeFulfillBooking && (
          <div className="p-5 bg-[#FAF7F2] border-b border-[#EAE4D7] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#181818] flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-[#181818]" />
                Deliver Video for {activeFulfillBooking.recipient_name}
              </h3>
              <button
                onClick={() => setActiveFulfillBooking(null)}
                className="text-xs font-semibold text-[#666666] hover:text-[#181818]"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#181818] block mb-1">
                  Completed Video URL (MP4 / Cloud Link)
                </label>
                <input
                  type="url"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  placeholder="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E0DACE] text-xs text-[#181818] placeholder-[#999999] focus:outline-none focus:border-[#181818]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#181818] block mb-1">
                  Optional Greeting Note
                </label>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Happy birthday! May your year be filled with blessings..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E0DACE] text-xs text-[#181818] placeholder-[#999999] focus:outline-none focus:border-[#181818]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setVideoUrlInput('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4')}
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#E0DACE] text-[#555555] hover:text-[#181818] text-xs font-semibold shadow-xs"
              >
                Use Sample Demo Video Link
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUpdateStatus(
                    activeFulfillBooking.id,
                    'completed',
                    videoUrlInput || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                    messageInput || 'Hope you enjoy your personalized video!'
                  )
                }
                className="px-5 py-2 rounded-full bg-[#181818] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit & Notify Fan</span>
              </button>
            </div>
          </div>
        )}

        {/* Requests Queue */}
        {activeTab === 'orders' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-white">
          {isLoading ? (
            <div className="text-center py-10 text-[#777777] text-sm font-medium">
              Loading requests...
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-[#777777] space-y-2">
              <Video className="w-10 h-10 mx-auto text-[#B0A898]" />
              <p className="text-sm font-bold text-[#181818]">No bookings currently for {selectedTalent.name}.</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D7] space-y-3 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE4D7] pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#FDE047] text-[#181818] px-2 py-0.5 rounded-md inline-block mb-1">
                      {b.occasion} ({b.booking_type === 'video_shoutout' ? 'Video' : 'Live Meet'})
                    </span>
                    <h4 className="text-base font-black text-[#181818]">
                      Recipient: <span>{b.recipient_name}</span>
                    </h4>
                    <span className="text-xs text-[#666666]">
                      Customer: {b.customer_name} ({b.customer_email})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      +${b.total_price}
                    </span>
                    <span className="text-xs font-medium text-[#666666]">
                      Status: <strong className="capitalize text-[#181818]">{b.status}</strong>
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#EAE4D7] text-xs text-[#444444] leading-relaxed">
                  <strong className="text-[#181818] block mb-0.5">Fan's Special Instructions:</strong>
                  "{b.instructions}"
                </div>

                {/* Actions: Accept, Decline, or Fulfill */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#EAE4D7]">
                  {b.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'declined')}
                        className="px-4 py-2 rounded-full bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold transition cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'in_progress')}
                        className="px-4 py-2 rounded-full bg-white border border-[#181818] text-[#181818] hover:bg-[#FAF7F2] text-xs font-bold transition cursor-pointer"
                      >
                        Accept Request
                      </button>
                    </>
                  )}

                  {b.booking_type === 'live_meet' && (
                    <button
                      onClick={() => {
                        if (onStartLiveCall) onStartLiveCall(b, selectedTalent);
                      }}
                      className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer animate-pulse"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Start Live Video Call</span>
                    </button>
                  )}

                  {b.booking_type === 'video_shoutout' && (b.status === 'pending' || b.status === 'in_progress') && (
                    <button
                      onClick={() => {
                        setActiveFulfillBooking(b);
                        setVideoUrlInput('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                      }}
                      className="px-5 py-2 rounded-full bg-[#181818] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Fulfill / Upload Video</span>
                    </button>
                  )}

                  {b.status === 'completed' && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Fulfilled & Delivered</span>
                    </span>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
        )}
      </div>
    </div>
  );
};
