import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Activity, Cpu, ShieldCheck, Terminal, Zap } from 'lucide-react';
import { Participant } from '@/src/types.ts';
import { cn } from '@/src/lib/utils.ts';
import confetti from 'canvas-confetti';

interface RaffleStageProps {
  participants: Participant[];
  onDrawComplete: (winner: Participant) => void;
  isDrawing: boolean;
  setIsDrawing: (val: boolean) => void;
  isMuted: boolean;
}

const AI_STEPS = [
  "Initializing AI Core...",
  "Accessing participant database...",
  "Running neural pattern scan...",
  "Filtering duplicate nodes...",
  "Applying Thales security protocols...",
  "Analyzing engagement heuristics...",
  "Calculating winner probability...",
  "Finalizing selection..."
];

export const RaffleStage: React.FC<RaffleStageProps> = ({
  participants,
  onDrawComplete,
  isDrawing,
  setIsDrawing,
  isMuted
}) => {
  const [currentName, setCurrentName] = useState<string>('???');
  const [winner, setWinner] = useState<Participant | null>(null);
  const [progress, setProgress] = useState(0);
  const [aiStep, setAiStep] = useState(AI_STEPS[0]);

  const handleDraw = async () => {
    if (participants.length < 2 || isDrawing) return;

    setIsDrawing(true);
    setWinner(null);
    setProgress(0);

    const duration = 8000; // 8 seconds for a more epic feel
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);

      // Update AI message based on progress
      const stepIndex = Math.floor((currentProgress / 100) * AI_STEPS.length);
      setAiStep(AI_STEPS[Math.min(stepIndex, AI_STEPS.length - 1)]);

      // Rapidly change names for visual intensity
      const randomIndex = Math.floor(Math.random() * participants.length);
      setCurrentName(participants[randomIndex].name);

      if (elapsed >= duration) {
        clearInterval(interval);
        const finalWinnerIndex = Math.floor(Math.random() * participants.length);
        const finalWinner = participants[finalWinnerIndex];
        
        setCurrentName(finalWinner.name);
        setWinner(finalWinner);
        setIsDrawing(false);
        fireConfetti();
        onDrawComplete(finalWinner);
      }
    }, 60);
  };

  const fireConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#1b3769', '#ffffff', '#ff4c4c']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#1b3769', '#ffffff', '#ff4c4c']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 text-center relative">
      <AnimatePresence mode="wait">
        {!isDrawing && !winner ? (
          <motion.div
            key="start-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="space-y-12 relative"
          >
            <div className="space-y-4">
              <div className="flex justify-center gap-4 mb-4">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-2 border-dashed border-blue-400 group-hover:border-blue-300 rounded-full flex items-center justify-center"
                >
                  <Cpu className="text-blue-400" size={32} />
                </motion.div>
              </div>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white">
                AI Selection System
              </h2>
              <p className="text-xl font-mono text-blue-300/60 uppercase tracking-[0.3em]">Ready for neural processing</p>
            </div>

            <button
              onClick={handleDraw}
              disabled={participants.length < 2}
              className={cn(
                "group relative inline-flex items-center gap-6 px-16 py-8 bg-[#1b3769] border border-blue-400/30 rounded-2xl font-bold text-2xl shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] transition-all hover:bg-blue-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
                participants.length < 2 && "grayscale pointer-events-none"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Play fill="currentColor" size={24} />
              <span className="font-mono tracking-widest uppercase">Initiate Scan</span>
            </button>
            
            {participants.length < 2 && (
              <p className="text-red-400/80 font-mono text-xs mt-4 flex items-center justify-center gap-2">
                <ShieldCheck size={14} /> NO_DATA_AVAILABLE: MINIMUM 2 ENTITIES REQUIRED
              </p>
            )}
          </motion.div>
        ) : isDrawing ? (
          <motion.div
            key="drawing-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl space-y-12 relative"
          >
            {/* Background HUD elements */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-20 pointer-events-none">
              <div className="w-12 h-64 border-l-2 border-y-2 border-blue-400 rounded-l-2xl" />
              <div className="w-12 h-64 border-r-2 border-y-2 border-blue-400 rounded-r-2xl" />
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-blue-400 font-mono text-sm tracking-widest uppercase mb-4">
                  <Activity size={16} className="animate-pulse" />
                  Processing Entities...
                </div>
                
                {/* Visual Scanner Box */}
                <div className="relative glass-dark p-12 rounded-3xl w-full max-h-[300px] overflow-hidden border border-blue-500/30 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]">
                  {/* Scan line */}
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent z-20 shadow-[0_0_15px_rgba(96,165,250,0.8)]"
                  />
                  
                  <div className="text-4xl md:text-7xl font-mono font-black text-blue-100 tracking-tight truncate">
                    {currentName}
                  </div>
                  
                  {/* Random data floating icons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="w-1 h-1 bg-blue-400 animate-ping" />
                    <div className="w-1 h-1 bg-blue-400 animate-ping delay-75" />
                    <div className="w-1 h-1 bg-blue-400 animate-ping delay-150" />
                  </div>
                </div>
              </div>

              {/* Progress Bar & AI Messages */}
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="flex justify-between items-end font-mono text-xs tracking-wider uppercase opacity-60">
                  <span className="flex items-center gap-2">
                    <Terminal size={14} /> {aiStep}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                  />
                </div>
                <div className="flex justify-between px-1 opacity-20 font-mono text-[8px] uppercase tracking-widest">
                  <span>Neural_Core_v2.0</span>
                  <span>Factorial_Integration_active</span>
                  <span>Latency: 12ms</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="winner-screen"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-12"
          >
            <div className="relative">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-blue-500 blur-[150px] opacity-30 rounded-full scale-150" />
              
              <motion.div 
                animate={{ 
                  scale: [1, 1.02, 1],
                  filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative glass-dark p-16 rounded-[4rem] border-2 border-blue-400/50 shadow-[0_0_100px_-20px_rgba(59,130,246,0.5)] flex flex-col items-center gap-6"
              >
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-500 text-white rounded-full font-mono text-sm tracking-widest uppercase mb-4 shadow-lg shadow-blue-500/20">
                  <Zap size={14} fill="currentColor" /> Match Found
                </div>
                
                <h3 className="text-xl font-mono text-blue-300 font-medium uppercase tracking-[0.4em]">Participant sélectionné</h3>
                
                <div className="text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                  {winner?.name}
                </div>

                {winner?.company && (
                  <div className="text-2xl md:text-4xl font-bold text-blue-400/90 uppercase tracking-wider mt-2">
                    {winner.company}
                  </div>
                )}

                <div className="mt-8 flex items-center gap-8 text-blue-300/40">
                  <div className="h-[1px] w-12 bg-current" />
                  <div className="text-[10px] font-mono tracking-widest uppercase">Verified Entity</div>
                  <div className="h-[1px] w-12 bg-current" />
                </div>
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center relative z-20">
              <button
                onClick={handleDraw}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 border border-blue-400/30 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl shadow-blue-600/20"
              >
                Réinitialiser & Analyser
              </button>
              <button
                onClick={() => setWinner(null)}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl font-bold transition-all"
              >
                Menu principal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
