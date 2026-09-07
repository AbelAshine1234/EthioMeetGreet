import React from 'react';
import { Occasion } from '../types';

interface OccasionsCardsProps {
  occasions?: Occasion[];
  onSelectOccasion: (tag: string) => void;
}

const CARD_THEMES = [
  {
    bg: "bg-[#EBF3FB] border border-[#D3E3F5]",
    textColor: "text-[#1E3A8A]",
    subColor: "text-[#3B82F6]",
    fallbackIcon: "🎂"
  },
  {
    bg: "bg-[#FAF0E6] border border-[#F2DAC4]",
    textColor: "text-[#7C2D12]",
    subColor: "text-[#C2410C]",
    fallbackIcon: "🚀"
  },
  {
    bg: "bg-[#FAECEF] border border-[#F3CBD4]",
    textColor: "text-[#881337]",
    subColor: "text-[#BE123C]",
    fallbackIcon: "🔥"
  },
  {
    bg: "bg-[#F5EDFA] border border-[#E8D0F5]",
    textColor: "text-[#581C87]",
    subColor: "text-[#7E22CE]",
    fallbackIcon: "✨"
  },
];

export const OccasionsCards: React.FC<OccasionsCardsProps> = ({ occasions = [], onSelectOccasion }) => {
  // Use occasions from PostgreSQL DB, or default to top 4 occasions
  const displayOccasions = occasions.length > 0 
    ? occasions.slice(0, 4)
    : [
        { id: '1', name: "Cameo's Picks", icon: '🚀', description: 'Personalized videos from top stars' },
        { id: '2', name: 'Birthday Shoutout', icon: '🎂', description: 'Make their special day unforgettable' },
        { id: '3', name: 'Pep Talk & Motivation', icon: '⚡', description: 'Inspiring words before the big moment' },
        { id: '4', name: 'Roasts & Celebrations', icon: '🔥', description: 'Hilarious greetings and memories' },
      ];

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
      <div className="max-w-[1440px] mx-auto text-left">
        <h3 className="text-base sm:text-lg font-black text-[#181818] mb-4">
          Personalized videos for every occasion
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayOccasions.map((occ, idx) => {
            const theme = CARD_THEMES[idx % CARD_THEMES.length];
            return (
              <div
                key={occ.id || idx}
                onClick={() => onSelectOccasion(occ.name)}
                className={`${theme.bg} rounded-3xl p-6 h-48 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1 relative overflow-hidden select-none`}
              >
                <div>
                  <span className={`text-xs font-bold ${theme.subColor} block mb-1 uppercase tracking-wider`}>
                    Personalized video for
                  </span>
                  <h4 className={`text-xl font-black ${theme.textColor} leading-tight`}>
                    {occ.name}
                  </h4>
                </div>

                {/* 3D Icon */}
                <div className="self-end text-5xl sm:text-6xl drop-shadow-sm">
                  {occ.icon || theme.fallbackIcon}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
