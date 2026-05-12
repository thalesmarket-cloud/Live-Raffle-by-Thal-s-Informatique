import React, { useState, useEffect } from 'react';
import { RaffleBackground } from './components/RaffleBackground.tsx';
import { Header } from './components/Header.tsx';
import { ImportPanel } from './components/ImportPanel.tsx';
import { RaffleStage } from './components/RaffleStage.tsx';
import { WinnersHistory } from './components/WinnersHistory.tsx';
import { Participant } from './types.ts';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, Trophy } from 'lucide-react';

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [view, setView] = useState<'setup' | 'draw'>('setup');

  // Load from local storage
  useEffect(() => {
    const savedParticipants = localStorage.getItem('thales-raffle-participants');
    const savedWinners = localStorage.getItem('thales-raffle-winners');
    if (savedParticipants) setParticipants(JSON.parse(savedParticipants));
    if (savedWinners) setWinners(JSON.parse(savedWinners));
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('thales-raffle-participants', JSON.stringify(participants));
    localStorage.setItem('thales-raffle-winners', JSON.stringify(winners));
  }, [participants, winners]);

  const handleImport = (newParticipants: Participant[]) => {
    setParticipants(prev => [...prev, ...newParticipants]);
  };

  const handleAddManual = (name: string) => {
    const newP: Participant = { id: `manual-${Date.now()}`, name };
    setParticipants(prev => [...prev, newP]);
  };

  const handleRemove = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleResetList = () => {
    if (confirm('Voulez-vous vraiment réinitialiser la liste complète ?')) {
      setParticipants([]);
    }
  };

  const onDrawComplete = (winner: Participant) => {
    setWinners(prev => [...prev, winner]);
    // Optionally remove winner from pool for next draw
    // setParticipants(prev => prev.filter(p => p.id !== winner.id));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen relative selection:bg-blue-500 selection:text-white">
      <RaffleBackground />
      
      <Header 
        participantCount={participants.length}
        winnerCount={winners.length}
        isMuted={isMuted}
        toggleMute={() => setIsMuted(!isMuted)}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />

      <main className="relative z-10 py-8 space-y-8">
        {/* View Switcher Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass p-1 rounded-2xl flex items-center">
            <button 
              onClick={() => setView('setup')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'setup' ? 'bg-white/15 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
            >
              <Settings2 size={16} />
              Configuration
            </button>
            <button 
              onClick={() => setView('draw')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'draw' ? 'bg-white/15 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
            >
              <Trophy size={16} />
              Tirage Live
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'setup' ? (
            <motion.div
              key="setup-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Welcome Card */}
              <div className="max-w-7xl mx-auto px-6">
                <div className="glass px-10 py-12 rounded-[2rem] text-center space-y-4">
                  <h2 className="text-4xl font-black tracking-tight">Bienvenue à l'Espace Tirage</h2>
                  <p className="opacity-60 max-w-xl mx-auto">Préparez votre événement en important vos listes de participants ou en les ajoutant manuellement ci-dessous.</p>
                </div>
              </div>

              <ImportPanel 
                participants={participants}
                onParticipantsImported={handleImport}
                onRemoveParticipant={handleRemove}
                onAddParticipant={handleAddManual}
                onReset={handleResetList}
              />
            </motion.div>
          ) : (
            <motion.div
              key="draw-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-12"
            >
              <RaffleStage 
                participants={participants}
                isDrawing={isDrawing}
                setIsDrawing={setIsDrawing}
                onDrawComplete={onDrawComplete}
                isMuted={isMuted}
              />
              
              {!isDrawing && (
                <WinnersHistory 
                  winners={winners} 
                  onClear={() => setWinners([])}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-12 px-6 text-center opacity-30 text-xs tracking-[0.2em] uppercase">
        Powered by Thales Informatique x Factorial • 2026
      </footer>

      {/* Decorative Blur Bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-thales/50 to-transparent pointer-events-none -z-10" />
    </div>
  );
}
