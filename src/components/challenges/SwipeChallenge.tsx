import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Palette, CheckCircle2, RefreshCw } from 'lucide-react';
import { THEMES } from '../../constants';
import { ThemeColor } from '../../types';
import { soundEffects } from '../../utils/sound';

interface SwipeChallengeProps {
  currentTheme: ThemeColor;
  onSelectTheme: (theme: ThemeColor) => void;
  onComplete: () => void;
  isCompleted: boolean;
  soundEnabled: boolean;
}

export const SwipeChallenge: React.FC<SwipeChallengeProps> = ({
  currentTheme,
  onSelectTheme,
  onComplete,
  isCompleted,
  soundEnabled,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = THEMES.findIndex((t) => t.id === currentTheme.id);
    return idx >= 0 ? idx : 0;
  });
  const [swipedCount, setSwipedCount] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  const handleSelectIndex = (newIndex: number) => {
    const boundedIndex = (newIndex + THEMES.length) % THEMES.length;
    setCurrentIndex(boundedIndex);
    const selectedTheme = THEMES[boundedIndex];
    onSelectTheme(selectedTheme);
    if (soundEnabled) soundEffects.playSwipe();

    const newCount = swipedCount + 1;
    setSwipedCount(newCount);
    // Completes after exploring at least 2 transitions
    if (newCount >= 2 && !isCompleted) {
      onComplete();
    }
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchStartXRef.current = clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartXRef.current === null) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const deltaX = clientX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        // Deslizou para a esquerda -> próximo
        handleSelectIndex(currentIndex + 1);
      } else {
        // Deslizou para a direita -> anterior
        handleSelectIndex(currentIndex - 1);
      }
    }
  };

  const activeTheme = THEMES[currentIndex];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center px-4 py-2 select-none">
      {/* Exercise Header Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-xl border border-white/60 w-full mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          <Palette className="w-4 h-4 text-sky-600" />
          <span>Exercício 1 · Deslize Lateral</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Deslize a Tela para o Lado
        </h1>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-md mx-auto">
          Arraste o cartão com o dedo para a esquerda ou direita. Repare como a cor de todo o aplicativo muda suavemente!
        </p>
      </div>

      {/* Swipeable Color Card Container */}
      <div
        className="w-full relative flex items-center justify-center py-2"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTheme.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm rounded-3xl p-7 shadow-2xl border-4 border-white flex flex-col items-center justify-center min-h-[260px] cursor-grab active:cursor-grabbing text-slate-800 transition-colors"
            style={{ backgroundColor: activeTheme.hex }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 shadow-md"
              style={{ backgroundColor: activeTheme.accentColor }}
            >
              <Palette className="w-8 h-8" />
            </div>

            <span className="text-2xl sm:text-3xl font-extrabold mb-1">
              {activeTheme.name}
            </span>
            <p className="text-sm sm:text-base font-medium opacity-80 max-w-xs text-center mb-4">
              {activeTheme.description}
            </p>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/70 shadow-sm text-slate-700">
              Cor Ativa no Aplicativo
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Large Accessible Arrow Controls */}
        <button
          onClick={() => handleSelectIndex(currentIndex - 1)}
          aria-label="Cor anterior"
          className="absolute left-0 sm:-left-4 p-3 rounded-2xl bg-white shadow-lg text-slate-700 hover:bg-slate-50 transition active:scale-95 min-h-[52px] min-w-[52px] flex items-center justify-center cursor-pointer z-10"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        <button
          onClick={() => handleSelectIndex(currentIndex + 1)}
          aria-label="Próxima cor"
          className="absolute right-0 sm:-right-4 p-3 rounded-2xl bg-white shadow-lg text-slate-700 hover:bg-slate-50 transition active:scale-95 min-h-[52px] min-w-[52px] flex items-center justify-center cursor-pointer z-10"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      {/* Mini Color Dots for Direct Selection */}
      <div className="flex items-center justify-center gap-3 mt-4">
        {THEMES.map((theme, idx) => (
          <button
            key={theme.id}
            onClick={() => handleSelectIndex(idx)}
            aria-label={`Escolher cor ${theme.name}`}
            className={`w-9 h-9 rounded-full transition-all duration-200 border-2 ${
              currentIndex === idx
                ? 'scale-125 border-slate-900 shadow-md ring-2 ring-white'
                : 'border-white opacity-70 hover:opacity-100'
            }`}
            style={{ backgroundColor: theme.hex }}
          />
        ))}
      </div>

      {/* Completion & Encouragement Banner */}
      <div className="mt-6 w-full max-w-md">
        {isCompleted ? (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 rounded-2xl p-4 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm sm:text-base">Ótimo trabalho!</p>
                <p className="text-xs sm:text-sm text-emerald-800">
                  Você aprendeu a deslizar a tela! Deslize para cima para o próximo desafio.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSwipedCount(0);
                handleSelectIndex(currentIndex + 1);
              }}
              title="Praticar novamente"
              className="p-2 rounded-xl bg-white/80 hover:bg-white text-emerald-900 shadow-sm shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p className="text-sm font-semibold text-slate-600">
            Experimente deslizar mais uma vez para destravar o próximo desafio!
          </p>
        )}
      </div>
    </div>
  );
};
