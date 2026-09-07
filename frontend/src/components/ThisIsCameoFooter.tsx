import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: any) => void;
}

export const ThisIsCameoFooter: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <footer className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] border-t border-[#EAE4D7] text-left text-[#181818]">
      <div className="max-w-[1440px] mx-auto space-y-12">
        
        {/* "This is Meet and Greet" 3-Column Section */}
        <div>
          <h3 className="text-xl font-black text-[#181818] mb-6">
            This is <span className="highlight-yellow relative z-0">Meet and Greet</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#181818]">
                Gifts as unique as the people you're gifting to
              </h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                Every video is personalized for the person receiving it, creating one-of-a-kind connections between celebrities and the people they inspire.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#181818]">
                Perfect for every occasion (or just because)
              </h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                From birthdays to holidays and friendly roasts, Meet and Greet is here to help you bring magic into everyday moments both big and small.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#181818]">
                Someone for every fan
              </h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                Everyone is welcome here. With hundreds of stars, there's a star for every kind of fan on Meet and Greet.
              </p>
            </div>
          </div>
        </div>

        {/* Cameo Footer Links & Newsletter Row (matches media_1788777345276.png) */}
        <div className="pt-8 border-t border-[#EAE4D7] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Newsletter / Mailing List */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-black text-[#181818]">Join our mailing list</h4>
            <p className="text-xs text-[#666666]">
              Be the first to know about the newest stars and best deals on Meet and Greet.
            </p>
            
            <form onSubmit={handleSubscribe} className="relative max-w-sm">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-4 pr-12 py-3 bg-white border border-[#E0DACE] rounded-full text-xs text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#181818] shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#181818] hover:bg-black text-white flex items-center justify-center transition shadow-sm cursor-pointer"
              >
                {subscribed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>
            {subscribed && (
              <span className="text-[11px] text-emerald-700 font-bold block">Subscribed successfully!</span>
            )}
          </div>

          {/* Columns */}
          <div className="lg:col-span-8 grid grid-cols-3 gap-6 text-xs">
            <div>
              <h5 className="font-bold text-[#181818] mb-3">Company</h5>
              <ul className="space-y-2 text-[#666666]">
                <li><button onClick={() => onNavigate && onNavigate('how-it-works')} className="hover:text-black transition">About us</button></li>
                <li><button className="hover:text-black transition">Team</button></li>
                <li><button className="hover:text-black transition">Jobs</button></li>
                <li><button className="hover:text-black transition">Blog</button></li>
                <li><button className="hover:text-black transition">Press</button></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-[#181818] mb-3">Support</h5>
              <ul className="space-y-2 text-[#666666]">
                <li><button className="hover:text-black transition">Help</button></li>
                <li><button className="hover:text-black transition">Accessibility</button></li>
                <li><button className="hover:text-black transition">Refunds & returns</button></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-[#181818] mb-3">Shop</h5>
              <ul className="space-y-2 text-[#666666]">
                <li><button onClick={() => onNavigate && onNavigate('browse')} className="hover:text-black transition">Gift cards</button></li>
                <li><button onClick={() => onNavigate && onNavigate('business')} className="hover:text-black transition">For business</button></li>
                <li><button onClick={() => onNavigate && onNavigate('browse')} className="hover:text-black transition">For kids</button></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Buttons Row: Join as talent, Become a partner */}
        <div className="pt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate && onNavigate('join-talent')}
            className="px-6 py-2.5 rounded-full bg-[#181818] hover:bg-black text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            Join as talent
          </button>
          <button
            onClick={() => onNavigate && onNavigate('business')}
            className="px-6 py-2.5 rounded-full bg-white hover:bg-[#F5F1E8] border border-[#E0DACE] text-[#181818] text-xs font-bold transition shadow-sm cursor-pointer"
          >
            Become a partner
          </button>
        </div>

        {/* Bottom copyright & Country/Currency */}
        <div className="pt-6 border-t border-[#EAE4D7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777777]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#181818] lowercase text-sm">meet and greet</span>
            <span>© 2026 Meet and Greet Platform. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-5">
            <button className="hover:text-black transition">Privacy Policy</button>
            <button className="hover:text-black transition">Terms of Service</button>
            <span className="font-bold text-[#181818]">🌐 EN · Ethiopia · ETB</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
