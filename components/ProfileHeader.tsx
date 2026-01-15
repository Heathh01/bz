import React from 'react';
import { PersonaData } from '../types';
import { MapPin, BadgeCheck } from 'lucide-react';

interface ProfileHeaderProps {
  data: PersonaData;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ data }) => {
  // Deterministic banner and avatar based on name
  const bannerUrl = `https://picsum.photos/seed/${data.idName}banner/800/400`;
  const avatarUrl = `https://picsum.photos/seed/${data.idName}/200`;

  return (
    <div className="bg-luxury-900 text-white relative w-full">
      {/* 1. Cover Banner */}
      <div className="h-32 w-full overflow-hidden relative">
         <img src={bannerUrl} alt="Cover" className="w-full h-full object-cover opacity-60 contrast-125" />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-luxury-900/90"></div>
      </div>

      <div className="px-5 pb-6 -mt-12 relative z-10">
        {/* 2. Avatar & Actions Row */}
        <div className="flex justify-between items-end mb-3">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-[3px] border-luxury-900 overflow-hidden bg-gray-800 shadow-xl">
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                {/* Verified Badge */}
                <div className="absolute bottom-0 right-0 bg-gold-600 text-black rounded-full p-[2px] border-[3px] border-luxury-900 shadow-sm">
                    <BadgeCheck className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
            </div>
            
            {/* Fake Action Buttons */}
            <div className="flex gap-2 mb-1.5">
                <button className="px-5 py-1.5 bg-gold-600 text-luxury-900 text-xs font-bold rounded-full hover:bg-gold-500 transition-colors">
                  关注
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-white/5 text-white rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                  <span className="text-[10px]">▼</span>
                </button>
            </div>
        </div>

        {/* 3. Name & Identity */}
        <div className="mb-4">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-xl font-bold text-white font-serif tracking-wide">
                  {data.idName}
              </h2>
              <div className="text-xs text-gray-500 font-mono">
                小红书: netzhentan
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-3">
                 {/* Title Badge */}
                 <span className="px-2 py-0.5 bg-gold-600/10 text-gold-500 text-[10px] uppercase font-bold tracking-wider rounded border border-gold-600/20">
                    {data.title}
                 </span>
                 {/* Location */}
                 <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span>{data.location}</span>
                </div>
            </div>
        </div>

        {/* 4. Bio */}
        <div className="mb-4">
             <p className="text-sm text-gray-200 font-light leading-relaxed whitespace-pre-line border-l-2 border-gold-600/50 pl-3 py-1">
              {data.bio}
            </p>
        </div>

        {/* 5. Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
            {data.tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-white/5 text-gray-300 text-[10px] rounded hover:bg-white/10 transition-colors cursor-default">
                    #{tag}
                </span>
            ))}
        </div>

        {/* 6. Stats */}
        <div className="flex items-center gap-6 border-t border-white/5 pt-4">
            <div className="flex flex-col">
                <span className="font-bold text-base text-white font-sans">142</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">关注</span>
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-base text-white font-sans">10.2w</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">粉丝</span>
            </div>
             <div className="flex flex-col">
                <span className="font-bold text-base text-white font-sans">1.8m</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">获赞</span>
            </div>
        </div>
      </div>
    </div>
  );
};
