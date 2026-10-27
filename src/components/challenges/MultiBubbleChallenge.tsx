import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { soundEffects } from '../../utils/sound';

interface BubbleItem {
  id: number;
  size: number; // in px: 70, 90, 115, etc.
  xPercent: number; // 10% to 75%
  yPercent: number; // 10% to 70%
  colorGradient: string;
}

const INITIAL_BUBBLES: BubbleItem[] = [
  { id: 1, size: 100, xPercent: 15, yPercent: 12, colorGradient: 'from-sky-200/90 to-blue-300/80' },
  { id: 2, size: 80, xPercent: 62, yPercent: 15, colorGradient: 'from-purple-200/90 to-pink-300/80' },
  { id: 3, size: 110, xPercent: 35, yPercent: 42, colorGradient: 'from-teal-200/90 to-emerald-300/80' },
  { id: 4, size: 75, xPercent: 10, yPercent: 65, colorGradient: 'from-amber-200/90 to-orange-300/80' },
  { id: 5, size: 90, xPercent: 64, yPercent: 60, colorGradient: 'from-rose-200/90 to-pink-300/80' },
];

interface MultiBubbleChallengeProps {
  onComplete: () => void;
  isCompleted: boolean;
  soundEnabled: boolean;
}

export const MultiBubbleChallenge: React.FC<MultiBubbleChallengeProps> = ({
  onComplete,
  isCompleted,
  soundEnabled,
}) => {
  const [bubbles, setBubbles] = useState<BubbleItem[]>(INITIAL_BUBBLES);
  const [shakingBubbleId, setShakingBubbleId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [poppedCount, setPoppedCount] = useState(0);

  const touchStartTimeRef = useRef<{ id: number; time: number } | null>(null);
  const holdTimeoutRef = useRef<number | null>(null);

  const MAX_TAP_DURATION_MS = 500;

  const handlePointerDown = (bubbleId: number, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    touchStartTimeRef.current = { id: bubbleId, time: Date.now() };
    setShakingBubbleId(null);
    setFeedback(null);

    holdTimeoutRef.current = window.setTimeout(() => {
      setShakingBubbleId(bubbleId);
      setFeedback('Você segurou forte! Dê apenas um toquezinho rápido.');
      if (soundEnabled) soundEffects.playShakeWarning();
    }, MAX_TAP_DURATION_MS);
  };

  const handlePointerUp = (bubbleId: number, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    if (!touchStartTimeRef.current || touchStartTimeRef.current.id !== bubbleId) return;

    const duration = Date.now() - touchStartTimeRef.current.time;
    touchStartTimeRef.current = null;

    if (duration <= MAX_TAP_DURATION_MS && shakingBubbleId !== bubbleId) {
      // Estourou a bolha com toque leve!
      setBubbles((prev) => prev.filter((b) => b.id !== bubbleId));
      setPoppedCount((prev) => prev + 1);
      setFeedback('Toque suave e perfeito!');

      if (soundEnabled) soundEffects.playPop();

      // Se todas foram estouradas (ou restam 0), conclui o desafio
      if (bubbles.length <= 1 && !isCompleted) {
        onComplete();
      }
    } else {
      setShakingBubbleId(bubbleId);
      setFeedback('Muito tempo segurando! Tente um toque leve e retire o dedo rápido.');
      if (soundEnabled) soundEffects.playShakeWarning();
    }
  };

  const resetAllBubbles = () => {
    setBubbles(INITIAL_BUBBLES);
    setShakingBubbleId(null);
    setFeedback(null);
  };

  const remaining = bubbles.length;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center px-4 py-2 select-none">
      {/* Exercise Instructions Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-xl border border-white/60 w-full mb-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Exercício 4 · Agilidade Gentil</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Estourar Várias Bolhas
        </h1>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-md mx-auto">
          Toque levemente em cada bolha de sabão. Repare que elas têm tamanhos diferentes. <strong>Toque rápido e solte!</strong>
        </p>

        {/* Counter Pill */}
        <div className="mt-3 flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
          <span>Restam: <strong>{remaining}</strong></span>
          <span>·</span>
          <span>Estouradas: <strong className="text-emerald-700">{poppedCount}</strong></span>
        </div>
      </div>

      {/* Multi-bubble arena */}
      <div className="w-full max-w-md h-[340px] sm:h-[380px] bg-white/70 backdrop-blur-sm rounded-3xl p-4 shadow-xl border border-white/60 relative overflow-hidden flex items-center justify-center">
        {bubbles.map((b) => {
          const isShaking = shakingBubbleId === b.id;

          return (
            <div
              key={b.id}
              onPointerDown={(e) => handlePointerDown(b.id, e)}
              onPointerUp={(e) => handlePointerUp(b.id, e)}
              onPointerCancel={(e) => handlePointerUp(b.id, e)}
              onPointerLeave={(e) => handlePointerUp(b.id, e)}
              style={{
                width: `${b.size}px`,
                height: `${b.size}px`,
                left: `${b.xPercent}%`,
                top: `${b.yPercent}%`,
              }}
              className={`absolute rounded-full cursor-pointer flex items-center justify-center transition-transform select-none touch-none ${
                isShaking
                  ? 'animate-shake bg-gradient-to-br from-amber-300 via-orange-300 to-rose-300 ring-4 ring-amber-400'
                  : `animate-float bg-gradient-to-br ${b.colorGradient} shadow-lg ring-2 ring-white/90 hover:scale-105 active:scale-95`
              }`}
            >
              {/* Bubble shine */}
              <div className="absolute top-2 left-3 w-5 h-2.5 bg-white/70 rounded-full -rotate-45" />
              <div className="absolute bottom-2 right-3 w-2 h-2 bg-white/50 rounded-full" />
              <span className="text-[10px] font-bold text-slate-700 opacity-70 pointer-events-none">
                {isShaking ? 'Forte!' : 'Toque'}
              </span>
            </div>
          );
        })}

        {/* Empty state when all are burst */}
        <AnimatePresence>
          {remaining === 0 && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center p-6 gap-3 z-20 bg-white/95 rounded-3xl shadow-2xl border border-emerald-100"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Todas Estouradas!
              </h2>
              <p className="text-sm text-slate-600 max-w-xs">
                Excelente precisão! Seu toque está incrivelmente suave e natural.
              </p>
              <button
                onClick={resetAllBubbles}
                className="mt-2 min-h-[48px] px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Colocar Mais Bolhas</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warning or Success Toast in Arena */}
        {feedback && remaining > 0 && (
          <div
            className={`absolute bottom-3 left-4 right-4 p-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm ${
              shakingBubbleId !== null
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}
          >
            {shakingBubbleId !== null ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Completion Banner */}
      <div className="mt-4 w-full max-w-md">
        {isCompleted ? (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 rounded-2xl p-4 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm sm:text-base">Múltiplas bolhas dominadas!</p>
                <p className="text-xs sm:text-sm text-emerald-800">
                  Deslize para cima para o Desafio Final: Espaço Integrado!
                </p>
              </div>
            </div>
            <button
              onClick={resetAllBubbles}
              title="Praticar novamente"
              className="p-2 rounded-xl bg-white/80 hover:bg-white text-emerald-900 shadow-sm shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p className="text-sm font-semibold text-slate-600">
            Estoure todas as bolhas para destravar o Espaço Integrado.
          </p>
        )}
      </div>
    </div>
  );
};
