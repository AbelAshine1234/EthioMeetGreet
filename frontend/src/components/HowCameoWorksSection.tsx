import React from 'react';
import { ChevronDown } from 'lucide-react';

export const HowCameoWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
      <div className="max-w-[1440px] mx-auto text-left">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-[#181818]">
            How <span className="highlight-yellow relative z-0">Meet and Greet</span> works
          </h3>
          <button className="text-xs font-bold text-[#666666] hover:text-black transition">
            Learn more
          </button>
        </div>

        {/* 4 Themed How it works cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Browse 50,000+ stars */}
          <div className="rounded-[28px] bg-white border border-[#EAE4D7] p-6 flex flex-col justify-between h-[420px] shadow-sm hover:shadow-md transition">
            <div className="flex-1 flex items-center justify-center relative overflow-hidden py-4">
              <div className="relative w-full max-w-[200px] h-40 flex items-center justify-center">
                <div className="w-24 h-32 rounded-2xl overflow-hidden shadow-xl z-20 border-2 border-white scale-110">
                  <img
                    src="/stars/selam_tesfaye.jpg"
                    alt="Selam Tesfaye"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-20 h-28 rounded-2xl overflow-hidden shadow-md absolute -left-2 top-4 z-10 border border-neutral-100 opacity-80">
                  <img
                    src="/stars/haile_gebrselassie.jpg"
                    alt="Haile Gebrselassie"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-20 h-28 rounded-2xl overflow-hidden shadow-md absolute -right-2 top-4 z-10 border border-neutral-100 opacity-80">
                  <img
                    src="/stars/teddy_afro.jpg"
                    alt="Teddy Afro"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-base font-black text-[#181818] mb-1.5">
                Browse 50,000+ stars
              </h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                Birthdays, milestones, or even a well-deserved roast, the perfect celebrity is only a search away.
              </p>
            </div>
          </div>

          {/* Card 2: Write the script */}
          <div className="rounded-[28px] bg-white border border-[#EAE4D7] p-6 flex flex-col justify-between h-[420px] shadow-sm hover:shadow-md transition">
            <div className="flex-1 flex flex-col justify-center py-4">
              <div className="w-full rounded-2xl bg-[#F8F5EE] border border-[#E5DFD3] p-4 text-left space-y-2.5">
                <div>
                  <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block mb-1">Occasion</span>
                  <div className="px-3 py-2 rounded-xl bg-white border border-[#E0DACE] text-xs text-[#181818] font-bold flex items-center justify-between shadow-sm">
                    <span>Birthday</span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block mb-1">Instructions</span>
                  <div className="p-2.5 rounded-xl bg-white border border-[#E0DACE] text-[11px] text-[#444444] leading-relaxed shadow-sm">
                    "Our mom is a lifelong fan. Please wish her a happy birthday and tell her some fun stories from the show!!"
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-base font-black text-[#181818] mb-1.5">
                Write the script
              </h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                A few sentences is all it takes. Name, occasion, a couple of inside jokes. We even help with the wording if you're stuck.
              </p>
            </div>
          </div>

          {/* Card 3: Get your personalized video */}
          <div className="rounded-[28px] bg-white border border-[#EAE4D7] p-6 flex flex-col justify-between h-[420px] shadow-sm hover:shadow-md transition">
            <div className="flex-1 flex items-center justify-center py-4 relative">
              <div className="relative w-36 h-48 rounded-2xl overflow-hidden border-2 border-white shadow-xl">
                <img
                  src="/stars/danayit_mekbib.jpg"
                  alt="Danayit Mekbib video"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Notification */}
                <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#E0DACE] text-left space-y-0.5 shadow-md">
                  <span className="text-[10px] font-bold text-[#181818] block">
                    Your video is ready!
                  </span>
                  <span className="text-[9px] text-[#555555] block line-clamp-2 leading-tight">
                    Danayit's personalized shoutout is ready to be shared
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-base font-black text-[#181818] mb-1.5">
                Get your personalized video
              </h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                We'll send you your personalized video message via email and in the app when it's ready (typically within 7 days).
              </p>
            </div>
          </div>

          {/* Card 4: Share the magic */}
          <div className="rounded-[28px] bg-white border border-[#EAE4D7] p-6 flex flex-col justify-between h-[420px] shadow-sm hover:shadow-md transition">
            <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
              <div className="relative w-44 h-40 rounded-2xl overflow-hidden border-2 border-white shadow-xl">
                <img
                  src="/stars/aster_aweke.jpg"
                  alt="Aster Aweke fan joy"
                  className="w-full h-full object-cover"
                />
                
                {/* Speech bubble */}
                <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-full bg-[#181818] text-white font-black text-[11px] shadow-lg text-center">
                  OMG!!!! I'm crying!
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-base font-black text-[#181818] mb-1.5">
                Share the magic
              </h4>
              <p className="text-xs text-[#666666] leading-relaxed">
                Text it, share it over dinner, put it on a big screen. The best part isn't the video, it's watching them watch it.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
