import React from 'react';
import { History as HistoryIcon, Clock, Trash2 } from 'lucide-react';
import { Participant } from '@/src/types.ts';
import { motion } from 'motion/react';

interface WinnersHistoryProps {
  winners: Participant[];
  onClear: () => void;
}

export const WinnersHistory: React.FC<WinnersHistoryProps> = ({ winners, onClear }) => {
  if (winners.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <HistoryIcon size={18} className="text-yellow-400" />
            Historique des gagnants
          </h3>
          <button 
            onClick={onClear}
            className="text-xs opacity-50 hover:opacity-100 flex items-center gap-1 transition-opacity"
          >
            <Trash2 size={12} />
            Effacer l'historique
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {winners.map((winner, idx) => (
            <motion.div 
              key={`${winner.id}-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400 font-bold">
                {winners.length - idx}
              </div>
              <div className="flex-1">
                <div className="font-bold">{winner.name}</div>
                {winner.company && <div className="text-xs text-blue-300 font-medium">{winner.company}</div>}
                <div className="text-[10px] uppercase opacity-40 flex items-center gap-1 mt-1">
                  <Clock size={10} />
                  Gagné récemment
                </div>
              </div>
            </motion.div>
          )).reverse()}
        </div>
      </div>
    </div>
  );
};
