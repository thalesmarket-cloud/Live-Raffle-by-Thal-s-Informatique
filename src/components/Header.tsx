import React from 'react';
import { LayoutPanelLeft, Users, Trophy, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/src/lib/utils.ts';

interface HeaderProps {
  participantCount: number;
  winnerCount: number;
  isMuted: boolean;
  toggleMute: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  participantCount,
  winnerCount,
  isMuted,
  toggleMute,
  isFullscreen,
  toggleFullscreen
}) => {
  return (
    <header className="w-full flex items-center justify-between px-6 py-2 glass sticky top-0 z-50">
      <div className="flex items-center gap-8">
        {/* Logos Container */}
        <div className="flex flex-col gap-0.5 border-r border-white/20 pr-8">
          <div className="flex items-center w-full px-1">
            <span className="text-[8px] uppercase tracking-widest opacity-40 font-bold min-w-[90px]">Organisateur</span>
            <span className="text-[8px] uppercase tracking-widest opacity-40 font-bold ml-12">En partenariat avec</span>
          </div>
          <img 
            src="https://res.cloudinary.com/diptsoc4h/image/upload/v1778626384/all_logo_combined_bo2zkn.png" 
            alt="Thalès Informatique x Partenaires" 
            className="h-16 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Title */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-medium tracking-wide uppercase opacity-80 italic">Innovation & RH</h1>
              <div className="flex items-center gap-1 bg-red-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold text-red-500 animate-pulse">
                <div className="w-1 h-1 bg-red-500 rounded-full" />
                LIVE
              </div>
            </div>
            <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Tirage au Sort Premium</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Stats */}
        <div className="hidden sm:flex items-center gap-6 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-400" />
            <span className="font-semibold">{participantCount}</span>
            <span className="opacity-60">Participants</span>
          </div>
          <div className="w-[1px] h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-yellow-400" />
            <span className="font-semibold">{winnerCount}</span>
            <span className="opacity-60">Gagnants</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMute}
            className="p-2.5 rounded-full hover:bg-white/10 transition-colors border border-white/10"
            title={isMuted ? "Activer le son" : "Couper le son"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full hover:bg-white/10 transition-colors border border-white/10"
            title={isFullscreen ? "Quitter plein écran" : "Plein écran"}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
