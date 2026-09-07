import React from 'react';
import { ArrowRight, Search, MessageSquare, Video, ShieldCheck } from 'lucide-react';
import { Talent } from '../types';

interface HowItWorksPageProps {
  onBrowseStars: () => void;
  talents?: Talent[];
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onBrowseStars, talents = [] }) => {
  // Real registered stars positioned around the hero
  const floatingStars = [
    {
      id: 1,
      name: 'Aster Aweke',
      image: '/stars/aster_aweke.jpg',
      pos: 'top-10 left-[8%] md:left-[12%]',
      size: 'w-16 h-16 sm:w-20 sm:h-20',
      rot: '-rotate-3',
    },
    {
      id: 2,
      name: 'Haile Gebrselassie',
      image: '/stars/haile_gebrselassie.jpg',
      pos: 'top-8 left-[30%] md:left-[32%]',
      size: 'w-16 h-16 sm:w-20 sm:h-20',
      rot: 'rotate-2',
    },
    {
      id: 3,
      name: 'Selam Tesfaye',
      image: '/stars/selam_tesfaye.jpg',
      pos: 'top-6 right-[30%] md:right-[34%]',
      size: 'w-14 h-14 sm:w-18 sm:h-18',
      rot: 'rotate-3',
    },
    {
      id: 4,
      name: 'Teddy Afro',
      image: '/stars/teddy_afro.jpg',
      pos: 'top-12 right-[8%] md:right-[14%]',
      size: 'w-16 h-16 sm:w-22 sm:h-22',
      rot: '-rotate-2',
    },
    {
      id: 5,
      name: 'Danayit Mekbib',
      image: '/stars/danayit_mekbib.jpg',
      pos: 'top-[35%] left-[6%] md:left-[14%]',
      size: 'w-16 h-16 sm:w-22 sm:h-22',
      rot: 'rotate-6',
    },
    {
      id: 6,
      name: 'Bofem',
      image: '/stars/bofem.jpg',
      pos: 'top-[28%] right-[18%] md:right-[22%]',
      size: 'w-14 h-14 sm:w-16 sm:h-16',
      rot: '-rotate-6',
    },
    {
      id: 7,
      name: 'Rophnan',
      image: '/stars/rophnan.jpg',
      pos: 'top-[42%] right-[8%] md:right-[18%]',
      size: 'w-14 h-14 sm:w-18 sm:h-18',
      rot: 'rotate-3',
    },
    {
      id: 8,
      name: 'Kenenisa Bekele',
      image: '/stars/kenenisa_bekele.jpg',
      pos: 'top-[54%] left-[10%] md:left-[13%]',
      size: 'w-14 h-14 sm:w-20 sm:h-20',
      rot: '-rotate-4',
    },
    {
      id: 9,
      name: 'Derartu Tulu',
      image: '/stars/derartu_tulu.jpg',
      pos: 'top-[60%] left-[20%] md:left-[24%]',
      size: 'w-16 h-16 sm:w-20 sm:h-20',
      rot: 'rotate-2',
    },
    {
      id: 10,
      name: 'Mulatu Astatke',
      image: '/stars/mulatu_astatke.jpg',
      pos: 'top-[52%] right-[8%] md:right-[15%]',
      size: 'w-14 h-14 sm:w-20 sm:h-20',
      rot: '-rotate-2',
    },
    {
      id: 11,
      name: 'Mahmoud Ahmed',
      image: '/stars/mahmoud_ahmed.jpg',
      pos: 'bottom-[12%] right-[18%] md:right-[20%]',
      size: 'w-16 h-16 sm:w-20 sm:h-20',
      rot: 'rotate-4',
    },
    {
      id: 12,
      name: 'Meklit Hadero',
      image: '/stars/meklit_hadero.jpg',
      pos: 'bottom-[10%] left-[12%] md:left-[16%]',
      size: 'w-16 h-16 sm:w-22 sm:h-22',
      rot: '-rotate-3',
    },
  ];

  return (
    <div className="w-full bg-[#FAF7F2] text-[#181818] min-h-screen">
      
      {/* 1. Hero Section with Floating Celebrities (structure matches media_1788777024826.png) */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-36 flex flex-col items-center justify-center min-h-[85vh] border-b border-[#EAE4D7]">
        
        {/* Floating Stars Around the Hero */}
        <div className="absolute inset-0 pointer-events-none select-none max-w-[1400px] mx-auto hidden sm:block">
          {floatingStars.map((star) => (
            <div
              key={star.id}
              className={`absolute ${star.pos} ${star.rot} transition-all duration-700 hover:scale-110 pointer-events-auto cursor-pointer`}
            >
              <div className={`${star.size} rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-white ring-1 ring-[#EAE4D7]`}>
                <img
                  src={star.image}
                  alt={star.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Center Hero Copy */}
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 sm:px-6">
          
          {/* Logo with star icon */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-xl">✨</span>
            <span className="text-2xl font-black lowercase tracking-tight text-[#181818] font-['Plus_Jakarta_Sans']">
              meet and <span className="highlight-yellow relative z-0">greet</span>
            </span>
          </div>

          {/* Headline matching screenshot layout */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] mb-6 text-[#181818]">
            Personalized video messages <br />
            from <span className="highlight-yellow relative z-0">50,000+ stars</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#555555] max-w-xl mx-auto font-normal leading-relaxed mb-8">
            Filmed by them, on their phone, sent straight to whoever you love. No film crew. No agency. Just them, their phone, and the ability to make someone's whole week.
          </p>

          {/* CTA Button */}
          <button
            onClick={onBrowseStars}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#181818] text-white font-bold text-sm sm:text-base hover:bg-black transition shadow-xl active:scale-95 cursor-pointer"
          >
            <span>Browse our stars</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Phone Video Card Peek */}
        <div className="mt-16 sm:mt-24 relative z-10 w-64 sm:w-72 aspect-[9/14] rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-black">
          <img
            src="/stars/teddy_afro.jpg"
            alt="Teddy Afro video shoutout"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
            <div>
              <div className="text-xs font-bold text-white">Teddy Afro</div>
              <div className="text-[11px] text-neutral-300">Personal birthday message</div>
            </div>
          </div>
        </div>

      </section>

      {/* 2. Step by Step: How it works in 3 easy steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-black text-[#181818] mb-3">
            How it works in 3 simple steps
          </h2>
          <p className="text-[#666666] text-sm sm:text-base max-w-lg mx-auto">
            Booking an unforgettable moment takes less than two minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-white border border-[#EAE4D7] rounded-3xl p-8 flex flex-col items-start hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#181818] mb-6 border border-[#E0DACE]">
              <Search className="w-6 h-6 text-[#181818]" />
            </div>
            <span className="text-xs font-bold text-[#888888] tracking-widest uppercase mb-1">Step 1</span>
            <h3 className="text-xl font-bold text-[#181818] mb-3">Find your star</h3>
            <p className="text-sm text-[#555555] leading-relaxed">
              Explore thousands of actors, musicians, sports stars, creators, and comedians ready to record for you.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-[#EAE4D7] rounded-3xl p-8 flex flex-col items-start hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#181818] mb-6 border border-[#E0DACE]">
              <MessageSquare className="w-6 h-6 text-[#181818]" />
            </div>
            <span className="text-xs font-bold text-[#888888] tracking-widest uppercase mb-1">Step 2</span>
            <h3 className="text-xl font-bold text-[#181818] mb-3">Tell them what to say</h3>
            <p className="text-sm text-[#555555] leading-relaxed">
              Provide instructions for birthdays, pep talks, congratulations, wedding roasts, or just a personalized hello.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-[#EAE4D7] rounded-3xl p-8 flex flex-col items-start hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#181818] mb-6 border border-[#E0DACE]">
              <Video className="w-6 h-6 text-[#181818]" />
            </div>
            <span className="text-xs font-bold text-[#888888] tracking-widest uppercase mb-1">Step 3</span>
            <h3 className="text-xl font-bold text-[#181818] mb-3">Receive your video</h3>
            <p className="text-sm text-[#555555] leading-relaxed">
              Within 7 days (or 24 hours with rush delivery), get a full-resolution HD video to download, share, and cherish forever.
            </p>
          </div>

        </div>

        {/* Guarantee Banner */}
        <div className="mt-14 bg-white border border-[#EAE4D7] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#181818]">100% Money-Back Guarantee</h4>
              <p className="text-xs text-[#666666]">If your star doesn't complete the video within the deadline, you get an immediate full refund.</p>
            </div>
          </div>
          <button
            onClick={onBrowseStars}
            className="px-6 py-2.5 rounded-full bg-[#181818] text-white text-xs font-bold hover:bg-black transition cursor-pointer whitespace-nowrap"
          >
            Start Browsing
          </button>
        </div>

      </section>

    </div>
  );
};
