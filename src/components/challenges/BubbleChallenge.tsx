import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CircleDot, CheckCircle2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { soundEffects } from '../../utils/sound';

interface BubbleChallengeProps {
  onComplete: () => void;
  isCompleted: boolean;
  soundEnabled: boolean;
}

export const BubbleChallenge: React.FC<BubbleChallengeProps> = ({
  onComplete,
  isCompleted,
  soundEnabled,
}) => {
  const [isPopped, setIsPopped] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [lastTouchDuration, setLastTouchDuration] = useState<number | null>(null);
  const [burstCount, setBurstCount] = useState(0);

  const touchStartTimeRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);

  // Limite estipulado de 500ms para toque rápido
  const MAX_TAP_DURATION_MS = 500;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (isPopped) return;

    touchStartTimeRef.current = Date.now();
    setIsShaking(false);
    setFeedbackMessage(null);

    // Se continuar segurando na bolha por mais de 500ms, dispara o aviso de pressão excessiva
    holdTimerRef.current = window.setTimeout(() => {
      setIsShaking(true);
      setFeedbackMessage('Não precisa segurar ou apertar com força! Dê apenas um toquezinho rápido.');
      if (soundEnabled) {
        soundEffects.playShakeWarning();
      }
    }, MAX_TAP_DURATION_MS);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (isPopped) return;

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (touchStartTimeRef.current === null) return;
    const duration = Date.now() - touchStartTimeRef.current;
    setLastTouchDuration(duration);
    touchStartTimeRef.current = null;

    if (duration <= MAX_TAP_DURATION_MS && !isShaking) {
      // Toque leve e rápido perfeito!
      setIsPopped(true);
      setIsShaking(false);
      setFeedbackMessage('Toque perfeito! Leve, rápido e certeiro!');
      setBurstCount((prev) => prev + 1);

      if (soundEnabled) {
        soundEffects.playPop();
      }

      if (!isCompleted) {
        onComplete();
      }
    } else {
      // Segurou muito tempo
      setIsShaking(true);
      setFeedbackMessage('Você segurou por muito tempo! Tente um toquezinho bem ligeiro.');
      if (soundEnabled) {
        soundEffects.playShakeWarning();
      }
    }
  };

  const resetBubble = () => {
    setIsPopped(false);
    setIsShaking(false);
    setFeedbackMessage(null);
    setLastTouchDuration(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center px-4 py-2 select-none">
      {/* Exercise Instructions Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-xl border border-white/60 w-full mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          <CircleDot className="w-4 h-4 text-sky-600" />
          <span>Exercício 3 · O Toque Leve</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Estourar a Bolha de Sabão
        </h1>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-md mx-auto">
          Dê um <strong>toque rápido e suave</strong> na bolha. Se você apertar com força ou segurar, ela vai tremer e não vai estourar!
        </p>
      </div>

      {/* Bubble Interaction Arena */}
      <div className="w-full max-w-sm min-h-[300px] bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/60 flex flex-col items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!isPopped ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className={`w-44 h-44 rounded-full flex flex-col items-center justify-center cursor-pointer transition-transform relative select-none touch-none ${
                  isShaking
                    ? 'animate-shake bg-gradient-to-br from-amber-300/80 via-orange-300/80 to-rose-300/80 ring-8 ring-amber-400/50'
                    : 'animate-float bg-gradient-to-br from-sky-200/90 via-teal-100/90 to-indigo-200/90 shadow-2xl shadow-sky-300/40 hover:scale-105 active:scale-95 ring-4 ring-white/80'
                }`}
              >
                {/* Gloss / Reflection Highlights */}
                <div className="absolute top-4 left-6 w-12 h-6 bg-white/70 rounded-full blur-[1px] -rotate-45" />
                <div className="absolute bottom-5 right-7 w-4 h-4 bg-white/50 rounded-full" />

                <div className="flex flex-col items-center gap-1 z-10 pointer-events-none">
                  <Sparkles
                    className={`w-8 h-8 ${
                      isShaking ? 'text-amber-700' : 'text-sky-700'
                    }`}
                  />
                  <span
                    className={`text-sm font-extrabold uppercase tracking-wider ${
                      isShaking ? 'text-amber-900' : 'text-sky-900'
                    }`}
                  >
                    {isShaking ? 'Apertou Forte!' : 'Toque Leve'}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600">
                    Toque e solte logo
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex flex-col items-center justify-center py-6 gap-3"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-12 h-12 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <span className="text-2xl font-extrabold text-emerald-800">
                POP! Estourou!
              </span>
              <p className="text-sm font-medium text-slate-600">
                Você usou a quantidade perfeita de suavidade.
              </p>

              <button
                onClick={resetBubble}
                className="mt-2 min-h-[48px] px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Estourar Outra Bolha</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Touch Duration & Teaching Feedback */}
        {feedbackMessage && (
          <div
            className={`w-full mt-3 p-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 text-left ${
              isPopped
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            {isPopped ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <span>{feedbackMessage}</span>
          </div>
        )}

        {lastTouchDuration !== null && (
          <span className="text-[11px] font-medium text-slate-500 mt-2">
            Tempo do seu toque: <strong>{lastTouchDuration}ms</strong> (ideal: até 500ms)
          </span>
        )}
      </div>

      {/* Completion Banner */}
      <div className="mt-6 w-full max-w-md">
        {isCompleted ? (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 rounded-2xl p-4 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm sm:text-base">Toque suave dominado!</p>
                <p className="text-xs sm:text-sm text-emerald-800">
                  Total estouradas: {burstCount}. Deslize para cima para o Desafio 4!
                </p>
              </div>
            </div>
            <button
              onClick={resetBubble}
              title="Praticar novamente"
              className="p-2 rounded-xl bg-white/80 hover:bg-white text-emerald-900 shadow-sm shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p className="text-sm font-semibold text-slate-600">
            Estoure a bolha com um toque leve para destravar o Desafio 4.
          </p>
        )}
      </div>
    </div>
  );
};
