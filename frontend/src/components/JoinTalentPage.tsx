import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';
import { api } from '../api';
import { Talent } from '../types';

interface JoinTalentPageProps {
  onTalentCreated?: (newTalent: Talent) => void;
}

export const JoinTalentPage: React.FC<JoinTalentPageProps> = ({ onTalentCreated }) => {
  // Form State
  const [legalName, setLegalName] = useState('');
  const [pronoun, setPronoun] = useState<'He/him' | 'She/her' | 'They/them'>('He/him');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+251');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('Ethiopia');
  const [largestPlatform, setLargestPlatform] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [bioNotes, setBioNotes] = useState('');

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Accordion open indices
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!displayName || !email || !username) {
      setErrorMessage('Please fill in required fields (Display name, email, and username).');
      return;
    }

    try {
      setIsSubmitting(true);
      const newStar = await api.createTalent({
        name: displayName,
        handle: username.startsWith('@') ? username : `@${username}`,
        category: 'creators',
        price_video: 75,
        price_live: 150,
        currency: 'USD',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        bio: bioNotes || `${displayName} on Meet and Greet. Connecting with fans directly!`,
        response_time: '24 hours',
        tags: ['New Star', 'Creator'],
        social_following: '100K+'
      });

      setSubmitSuccess(true);
      if (onTalentCreated) {
        onTalentCreated(newStar);
      }
    } catch (err: any) {
      console.error('Talent enrollment error:', err);
      setErrorMessage(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How much do I earn?',
      a: 'You set your own prices and keep 75% of your earnings on every booking. Meet and Greet takes a 25% fee to cover hosting, streaming, customer support, and payment processing. You can adjust your prices anytime in your Creator Hub.'
    },
    {
      q: 'How can I use Meet and Greet?',
      a: 'Offer personalized video shoutouts, 10-minute live 1-on-1 video calls, business brand campaigns, and direct messaging tips. You choose which offerings you want active.'
    },
    {
      q: 'What is Meet and Greet?',
      a: 'Meet and Greet is the premier video platform connecting fans and businesses directly with actors, athletes, musicians, and creators for authentic personalized video messages.'
    },
    {
      q: 'How does it work?',
      a: 'Fans place a request detailing who the video is for and instructions on what to say. You receive a notification on your phone, record the video directly in our app within your turnaround deadline, and tap Send. The fan receives it immediately.'
    },
    {
      q: 'How do I get paid?',
      a: 'Earnings are automatically transferred to your registered bank account or Telebirr/CBE account within 48 hours of completing a request.'
    },
    {
      q: 'How many days do I have to complete requests?',
      a: 'Standard requests give you up to 7 days to complete. If you activate 24-hour rush delivery, fans pay an added premium for priority completion within 24 hours.'
    },
    {
      q: 'What is a 24H delivery?',
      a: '24-hour delivery is an optional rush feature that allows urgent fan requests (e.g., last-minute birthday gifts). You receive an extra rush fee for completing these orders within 24 hours.'
    },
    {
      q: "What's the best way to get orders?",
      a: 'Add your Meet and Greet profile link to your Instagram, TikTok, and YouTube bios. Share reaction clips from thrilled fans to your stories to drive continuous demand.'
    },
    {
      q: 'How should I set my price?',
      a: 'We recommend starting at an approachable price (e.g., $30 - $60 or 3,500 - 7,000 ETB) to quickly build 5-star reviews and video examples, then increasing your price as demand grows.'
    },
    {
      q: 'Do I receive tips on Meet and Greet?',
      a: 'Yes! Fans frequently add generous tips after watching high-energy, thoughtful videos. You keep 100% of all fan tips.'
    },
    {
      q: 'How do I complete orders?',
      a: 'Simply open the Meet and Greet site or mobile app, go to your Creator Hub orders queue, click Record Video, deliver your personalized shoutout, and submit. It takes just 1-2 minutes per order!'
    }
  ];

  return (
    <div className="w-full bg-[#FAF7F2] text-[#181818] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      
      {/* 1. Form Section: Start Earning Today (matches media_1788777068773.png & media_1788777062951.png structure) */}
      <div className="max-w-[560px] mx-auto bg-white border border-[#EAE4D7] rounded-3xl p-6 sm:p-10 shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-black text-center text-[#181818] mb-2 tracking-tight">
          Start earning today
        </h1>
        <p className="text-center text-xs text-[#666666] mb-8">
          Join verified creators and stars on <span className="font-bold text-[#181818]">Meet and Greet</span>
        </p>

        {submitSuccess ? (
          <div className="bg-[#FAF7F2] border border-[#E0DACE] rounded-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-[#181818] mb-2">Welcome to the talent family!</h2>
            <p className="text-sm text-[#555555] mb-6">
              Your talent profile for <span className="text-[#181818] font-bold">{displayName}</span> ({username}) has been activated. You can now accept fan bookings and set your pricing.
            </p>
            <button
              onClick={() => {
                setSubmitSuccess(false);
                setDisplayName('');
                setEmail('');
                setUsername('');
              }}
              className="px-6 py-2.5 bg-[#181818] hover:bg-black text-white rounded-full text-xs font-bold transition shadow-sm"
            >
              Submit another profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Legal Name */}
            <div>
              <label className="block text-xs font-bold text-[#181818] mb-2">
                Legal name
              </label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#E0DACE] rounded-xl text-sm text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#181818] transition"
              />
            </div>

            {/* Pronouns */}
            <div>
              <label className="block text-xs font-bold text-[#181818] mb-2">
                Pronouns
              </label>
              <div className="flex items-center gap-2.5">
                {(['He/him', 'She/her', 'They/them'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPronoun(p)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition border cursor-pointer ${
                      pronoun === p
                        ? 'bg-[#181818] border-[#181818] text-white shadow-sm'
                        : 'bg-[#FAF7F2] border-[#E0DACE] text-[#666666] hover:text-[#181818]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-[#181818] mb-1">
                Display name
              </label>
              <p className="text-[11px] text-[#777777] mb-2">This appears on your profile</p>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How fans will see your name"
                className="w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#E0DACE] rounded-xl text-sm text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#181818] transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#181818] mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#E0DACE] rounded-xl text-sm text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#181818] transition"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-[#181818] mb-1">
                Username
              </label>
              <p className="text-[11px] text-[#777777] mb-2">Use only letters, numbers, underscores, hyphens, and periods</p>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your.username"
                className="w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#E0DACE] rounded-xl text-sm text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#181818] transition"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-bold text-[#181818] mb-2">
                Date of birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#E0DACE] rounded-xl text-sm text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#181818] transition cursor-pointer"
              />
            </div>

            {/* Phone Number with +251 country pill */}
            <div>
              <label className="block text-xs font-bold text-[#181818] mb-2">
                Phone number
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-shrink-0">
                  <select
                    value={phonePrefix}
                    onChange={(e) => setPhonePrefix(e.target.value)}
                    className="appearance-none bg-[#FAF7F2] border border-[#E0DACE] text-[#181818] rounded-xl py-3.5 pl-3.5 pr-7 text-xs font-bold focus:outline-none focus:border-[#181818] cursor-pointer"
                  >
                    <option value="+251">🇪🇹 +251</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+254">🇰🇪 +254</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#888888] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Your phone number"
                  className="w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#E0DACE] rounded-xl text-sm text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#181818] transition"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs font-bold text-[#181818] mb-2">
                Country
              </label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full appearance-none px-4 py-3.5 bg-[#FAF7F2] border border-[#E0DACE] rounded-xl text-sm text-[#181818] focus:outline-none focus:border-[#181818] transition cursor-pointer"
                >
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Kenya">Kenya</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="Germany">Germany</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#888888] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Where is your largest following? */}
            <div>
              <label className="block text-xs font-bold text-[#181818] mb-2">
                Where is your largest following?
              </label>
              <div className="relative">
                <select
                  value={largestPlatform}
                  onChange={(e) => setLargestPlatform(e.target.value)}
                  className="w-full appearance-none px-4 py-3.5 bg-[#FAF7F2] border border-[#E0DACE] rounded-xl text-sm text-[#181818] focus:outline-none focus:border-[#181818] transition cursor-pointer"
                >
                  <option value="">Select a platform</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter/X">Twitter / X</option>
                  <option value="Twitch">Twitch</option>
                  <option value="TV & Film">TV & Film</option>
                  <option value="Sports">Sports / Athletics</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#888888] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Referral code (optional) */}
            <div>
              <label className="block text-xs font-bold text-[#181818] mb-2">
                Referral code <span className="text-[#777777] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Enter code"
                className="w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#E0DACE] rounded-xl text-sm text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#181818] transition"
              />
            </div>

            {/* Anything else we should know about you? (optional) */}
            <div>
              <label className="block text-xs font-bold text-[#181818] mb-2">
                Anything else we should know about you? <span className="text-[#777777] font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={bioNotes}
                onChange={(e) => setBioNotes(e.target.value)}
                placeholder="Tell us more about yourself"
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E0DACE] rounded-xl text-sm text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#181818] transition resize-none"
              />
            </div>

            {/* Terms and Privacy Disclaimer */}
            <p className="text-[11px] text-[#666666] text-center leading-relaxed">
              By applying to enroll as talent on Meet and Greet, you agree to Meet and Greet's <span className="text-[#181818] font-bold underline">Talent Terms of Service</span> and <span className="text-[#181818] font-bold underline">Privacy Policy</span>.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-[#181818] hover:bg-black text-white font-bold text-sm transition shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Application...' : 'Continue'}
            </button>

          </form>
        )}
      </div>

      {/* 2. Got questions? FAQ Accordion (matches Cameo structure with warm theme) */}
      <div className="max-w-[720px] mx-auto mt-20 pb-16">
        <h2 className="text-3xl font-black text-center text-[#181818] mb-10 tracking-tight">
          Got questions?
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-[#EAE4D7] rounded-2xl overflow-hidden transition hover:shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer select-none"
                >
                  <span className="text-sm font-bold text-[#181818] pr-4">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#888888] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#888888] flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#555555] leading-relaxed border-t border-[#F5F1E8]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
