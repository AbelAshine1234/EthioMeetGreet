import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Category, Talent } from '../types';
import { api } from '../api';

interface JoinTalentModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onTalentCreated: (talent: Talent) => void;
}

export const JoinTalentModal: React.FC<JoinTalentModalProps> = ({
  isOpen,
  onClose,
  categories,
  onTalentCreated,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 1);
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [priceVideo, setPriceVideo] = useState(50);
  const [priceLiveCall, setPriceLiveCall] = useState(120);
  const [tags, setTags] = useState('Addis Ababa, Music');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      setIsSubmitting(true);
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
      const newTalent = await api.createTalent({
        name,
        handle: handle.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase(),
        title,
        category_id: categoryId,
        bio,
        avatar_url: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
        price_video: Number(priceVideo),
        price_live_call: Number(priceLiveCall),
        tags: tagList,
        languages: ['Amharic', 'English']
      });

      setSuccess(true);
      onTalentCreated(newTalent);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create creator profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white border border-[#EAE4D7] rounded-3xl shadow-2xl overflow-hidden my-6 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EAE4D7] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDE047] text-[#181818] border border-[#E0DACE] flex items-center justify-center font-black shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#181818] tracking-tight">Join Meet and Greet as a Star</h2>
              <p className="text-xs text-[#666666]">Enroll your celebrity or creator profile to start receiving fan requests</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EBE1] border border-[#EAE4D7] text-[#666666] hover:text-[#181818] flex items-center justify-center transition shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#181818]">Welcome to Meet and Greet!</h3>
            <p className="text-xs text-[#666666] max-w-md mx-auto">
              Your creator profile has been published. Fans can now book personalized videos and 1-on-1 meets with you.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#181818] text-white text-xs font-bold hover:bg-black transition cursor-pointer shadow-sm"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-[#444444] block mb-1">Full Name / Stage Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aster Aweke"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] placeholder-[#999999] focus:outline-none focus:border-[#181818]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#444444] block mb-1">Handle / Username</label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. asteraweke"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] placeholder-[#999999] focus:outline-none focus:border-[#181818]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-[#444444] block mb-1">Title / Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Vocalist & Songwriter"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] placeholder-[#999999] focus:outline-none focus:border-[#181818]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#444444] block mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] focus:outline-none focus:border-[#181818]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#444444] block mb-1">Profile Photo Image URL or /stars/ path</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="/stars/aster_aweke.jpg or https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] placeholder-[#999999] focus:outline-none focus:border-[#181818]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#444444] block mb-1">Bio & What You Offer Fans</label>
              <textarea
                rows={3}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell your fans what kind of greetings, birthday wishes, songs, or advice you love creating..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] placeholder-[#999999] focus:outline-none focus:border-[#181818] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-[#444444] block mb-1">Video Shoutout ($ USD)</label>
                <input
                  type="number"
                  min="5"
                  required
                  value={priceVideo}
                  onChange={(e) => setPriceVideo(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] focus:outline-none focus:border-[#181818]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#444444] block mb-1">1-on-1 Meet ($ USD)</label>
                <input
                  type="number"
                  min="10"
                  required
                  value={priceLiveCall}
                  onChange={(e) => setPriceLiveCall(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] focus:outline-none focus:border-[#181818]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#444444] block mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. Comedy, Standup, Addis Ababa"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] placeholder-[#999999] focus:outline-none focus:border-[#181818]"
              />
            </div>

            <div className="pt-3 border-t border-[#EAE4D7] flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-[#E0DACE] text-[#444444] text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-[#181818] hover:bg-black text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {isSubmitting ? 'Registering...' : 'Enroll Profile'}
                <ArrowRight className="w-3.5 h-3.5 text-[#FDE047]" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
