import React, { useState } from 'react';
import { X, Video, PhoneCall, Zap, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Talent, Occasion, Booking } from '../types';
import { api } from '../api';

interface BookingModalProps {
  talent: Talent | null;
  initialType: 'video_shoutout' | 'live_meet';
  occasions: Occasion[];
  currency: 'USD' | 'ETB';
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  talent,
  initialType,
  occasions,
  currency,
  onClose,
  onBookingSuccess,
}) => {
  if (!talent) return null;

  const [bookingType, setBookingType] = useState<'video_shoutout' | 'live_meet'>(initialType);
  const [targetFor, setTargetFor] = useState<'someone_else' | 'myself' | 'business'>('someone_else');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Birthday Shoutout');
  const [recipientName, setRecipientName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [instructions, setInstructions] = useState('');
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'rush_24h'>('standard');
  const [scheduledDate, setScheduledDate] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate pricing
  const basePrice = bookingType === 'video_shoutout' ? talent.price_video : talent.price_live_call;
  const rushFee = deliverySpeed === 'rush_24h' ? 20 : 0;
  const totalPriceUsd = basePrice + rushFee;

  const formatPrice = (usdAmount: number) => {
    if (currency === 'ETB') {
      const etb = Math.round(usdAmount * (talent.etb_rate || 120));
      return `${etb.toLocaleString()} ETB`;
    }
    return `$${usdAmount}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!recipientName.trim()) {
      setErrorMessage('Please provide recipient name.');
      return;
    }
    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMessage('Please provide your name and email address.');
      return;
    }
    if (instructions.trim().length < 10) {
      setErrorMessage('Please provide detailed instructions (at least 10 characters).');
      return;
    }

    try {
      setIsSubmitting(true);
      const booking = await api.createBooking({
        talent_id: talent.id,
        customer_name: customerName,
        customer_email: customerEmail,
        recipient_name: recipientName,
        booking_type: bookingType,
        occasion: selectedOccasion,
        instructions,
        delivery_speed: deliverySpeed,
        scheduled_date: bookingType === 'live_meet' ? scheduledDate : undefined,
      });

      setCompletedBooking(booking);
      onBookingSuccess(booking);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white border border-[#EAE4D7] rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 text-left transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF7F2] px-6 py-5 border-b border-[#EAE4D7] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={talent.avatar_url || talent.avatar}
                alt={talent.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                }}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm ring-2 ring-[#E0DACE]"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FDE047] text-[#181818] text-[10px] font-black uppercase tracking-wider mb-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Booking Request</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#181818] tracking-tight">{talent.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close booking modal"
            className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EBE1] border border-[#EAE4D7] text-[#666666] hover:text-[#181818] flex items-center justify-center transition shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Confirmation Screen */}
        {completedBooking ? (
          <div className="p-8 sm:p-10 text-center space-y-6 bg-white">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-black text-[#181818]">Booking Request Placed!</h3>
              <p className="text-sm text-[#666666] max-w-md mx-auto font-medium">
                {talent.name} has received your request. Updates & download link will be emailed to <strong className="text-[#181818]">{customerEmail}</strong>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D7] max-w-md mx-auto text-left space-y-2.5 text-xs shadow-xs">
              <div className="flex justify-between text-[#666666]">
                <span className="font-medium">Order Reference:</span>
                <span className="text-[#181818] font-mono font-bold">{completedBooking.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span className="font-medium">Service Type:</span>
                <span className="text-[#181818] font-bold">
                  {completedBooking.booking_type === 'video_shoutout' ? 'Personalized Video' : '1-on-1 Live Meet'}
                </span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span className="font-medium">Recipient:</span>
                <span className="text-[#181818] font-bold">{completedBooking.recipient_name}</span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span className="font-medium">Occasion:</span>
                <span className="text-[#181818] font-bold bg-[#F5F1E8] px-2 py-0.5 rounded-md">{completedBooking.occasion}</span>
              </div>
              <div className="flex justify-between border-t border-[#EAE4D7] pt-2.5 text-sm font-black text-[#181818]">
                <span>Total Reserved:</span>
                <span className="text-[#181818] font-black">{formatPrice(completedBooking.total_price)}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-[#181818] hover:bg-black text-white font-bold text-xs shadow-md transition hover:scale-105 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form Content in Clean Warm Light Theme */
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-5 bg-white max-h-[calc(85vh-90px)] overflow-y-auto">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Service Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBookingType('video_shoutout')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                  bookingType === 'video_shoutout'
                    ? 'bg-[#FAF7F2] border-2 border-[#181818] shadow-sm'
                    : 'bg-white border-[#E0DACE] text-[#666666] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 transition ${
                  bookingType === 'video_shoutout' ? 'bg-[#181818] text-white' : 'bg-[#F0EBE1] text-[#666666]'
                }`}>
                  <Video className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-black block text-[#181818]">Personalized Video</span>
                <span className="text-[11px] text-[#666666] block font-medium">Custom recorded HD shoutout</span>
                <span className="text-xs sm:text-sm font-black text-[#181818] mt-2 inline-block bg-white px-2 py-0.5 rounded-lg border border-[#EAE4D7]">
                  {formatPrice(talent.price_video)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBookingType('live_meet')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                  bookingType === 'live_meet'
                    ? 'bg-[#FAF7F2] border-2 border-[#181818] shadow-sm'
                    : 'bg-white border-[#E0DACE] text-[#666666] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 transition ${
                  bookingType === 'live_meet' ? 'bg-[#181818] text-white' : 'bg-[#F0EBE1] text-[#666666]'
                }`}>
                  <PhoneCall className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-black block text-[#181818]">1-on-1 Live Meet</span>
                <span className="text-[11px] text-[#666666] block font-medium">10-min private live video call</span>
                <span className="text-xs sm:text-sm font-black text-[#181818] mt-2 inline-block bg-white px-2 py-0.5 rounded-lg border border-[#EAE4D7]">
                  {formatPrice(talent.price_live_call)}
                </span>
              </button>
            </div>

            {/* Target Audience: Who is this for? */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block">
                Who is this for?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'someone_else', label: 'Someone Else' },
                  { id: 'myself', label: 'Myself' },
                  { id: 'business', label: 'A Business / Brand' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTargetFor(item.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      targetFor === item.id
                        ? 'bg-[#181818] border-[#181818] text-white shadow-xs'
                        : 'bg-white border-[#E0DACE] text-[#555555] hover:bg-[#FAF7F2] hover:text-[#181818]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasions Picker */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block">
                Select the Occasion
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {occasions.map((occ) => {
                  const isSelected = selectedOccasion === occ.name;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setSelectedOccasion(occ.name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#181818] border-[#181818] text-white shadow-xs'
                          : 'bg-[#FAF7F2] border-[#E0DACE] text-[#555555] hover:bg-white hover:border-[#181818] hover:text-[#181818]'
                      }`}
                    >
                      {occ.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipient Details & Speed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-[#181818] block mb-1">
                  Recipient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g., Selamawit or Dad"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs font-medium text-[#181818] placeholder-[#999999] focus:bg-white focus:outline-none focus:border-[#181818] focus:ring-1 focus:ring-[#181818] transition"
                />
              </div>

              {bookingType === 'live_meet' ? (
                <div>
                  <label className="text-xs font-bold text-[#181818] block mb-1">
                    Preferred Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs font-medium text-[#181818] focus:bg-white focus:outline-none focus:border-[#181818] focus:ring-1 focus:ring-[#181818] transition"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-[#181818] block mb-1">
                    Delivery Speed
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDeliverySpeed('standard')}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold border text-center transition cursor-pointer ${
                        deliverySpeed === 'standard'
                          ? 'bg-[#181818] border-[#181818] text-white shadow-xs'
                          : 'bg-white border-[#E0DACE] text-[#555555] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      Standard (3-5d)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliverySpeed('rush_24h')}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold border text-center transition flex items-center justify-center gap-1 cursor-pointer ${
                        deliverySpeed === 'rush_24h'
                          ? 'bg-[#181818] border-[#181818] text-white shadow-xs'
                          : 'bg-white border-[#E0DACE] text-[#555555] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <Zap className={`w-3.5 h-3.5 ${deliverySpeed === 'rush_24h' ? 'text-[#FDE047] fill-current' : 'text-amber-500'}`} />
                      <span>24h (+{formatPrice(20)})</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div>
              <label className="text-xs font-bold text-[#181818] block mb-1">
                Instructions for {talent.name} <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Include memories, hobbies, inside jokes, or specific quotes you would love them to say..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs font-medium text-[#181818] placeholder-[#999999] focus:bg-white focus:outline-none focus:border-[#181818] focus:ring-1 focus:ring-[#181818] transition resize-none"
              />
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="text-xs font-bold text-[#181818] block mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs font-medium text-[#181818] placeholder-[#999999] focus:bg-white focus:outline-none focus:border-[#181818] focus:ring-1 focus:ring-[#181818] transition"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#181818] block mb-1">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs font-medium text-[#181818] placeholder-[#999999] focus:bg-white focus:outline-none focus:border-[#181818] focus:ring-1 focus:ring-[#181818] transition"
                />
              </div>
            </div>

            {/* Bottom Toolbar: Total Due & Submit Button */}
            <div className="pt-5 border-t border-[#EAE4D7] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left w-full sm:w-auto">
                <span className="text-xs font-bold text-[#777777] uppercase tracking-wider block">Total Due:</span>
                <span className="text-2xl sm:text-3xl font-black text-[#181818] tracking-tight">
                  {formatPrice(totalPriceUsd)}
                </span>
                {deliverySpeed === 'rush_24h' && (
                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 mt-0.5">
                    <Zap className="w-3 h-3 fill-current" />
                    Includes 24hr priority rush delivery
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-full border border-[#E0DACE] bg-white hover:bg-[#FAF7F2] text-[#555555] hover:text-[#181818] text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none px-7 py-3 rounded-full bg-[#181818] hover:bg-black text-white text-xs sm:text-sm font-black shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>Complete Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Satisfaction Guarantee */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#666666] font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full refund guarantee if {talent.name} cannot fulfill your request.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
