import React, { useState, useRef, useEffect } from 'react';
import { BatteryCharging, CheckCircle2, RefreshCw, Hand } from 'lucide-react';
import { soundEffects } from '../../utils/sound';

interface HoldBarChallengeProps {
  onComplete: () => void;
  isCompleted: boolean;
  soundEnabled: boolean;
}

export const HoldBarChallenge: React.FC<HoldBarChallengeProps> = ({
  onComplete,
  isCompleted,
  soundEnabled,
}) => {
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isHolding, setIsHolding] = useState(false);
  const [isDraining, setIsDraining] = useState(false);
  const [fullCompletions, setFullCompletions] = useState(0);

  const fillTimerRef = useRef<number | null>(null);
  const drainTimerRef = useRef<number | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (fillTimerRef.current) clearInterval(fillTimerRef.current);
      if (drainTimerRef.current) clearInterval(drainTimerRef.current);
    };
  }, []);

  const startDraining = () => {
    setIsDraining(true);
    setIsHolding(false);
    if (fillTimerRef.current) {
      clearInterval(fillTimerRef.current);
      fillTimerRef.current = null;
    }

    if (soundEnabled) soundEffects.playSuccessChime();

    setFullCompletions((prev) => {
      const updated = prev + 1;
      if (!isCompleted) onComplete();
      return updated;
    });

    // Animate smoothly draining down
    drainTimerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          if (drainTimerRef.current) clearInterval(drainTimerRef.current);
          drainTimerRef.current = null;
          setIsDraining(false);
          return 0;
        }
        return Math.max(0, prev - 4);
      });
    }, 40);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (isDraining) return; // Wait until drained

    setIsHolding(true);
    if (drainTimerRef.current) {
      clearInterval(drainTimerRef.current);
      drainTimerRef.current = null;
    }

    fillTimerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2.5; // ~1.5s to reach 100%
        if (soundEnabled && Math.floor(next) % 15 === 0) {
          soundEffects.playChargeStep(next / 100);
        }

        if (next >= 100) {
          startDraining();
          return 100;
        }
        return next;
      });
    }, 40);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (isDraining) return;

    setIsHolding(false);
    if (fillTimerRef.current) {
      clearInterval(fillTimerRef.current);
      fillTimerRef.current = null;
    }

    // Se soltou antes de 100%, diminui aos poucos
    if (progress < 100) {
      drainTimerRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            if (drainTimerRef.current) clearInterval(drainTimerRef.current);
            drainTimerRef.current = null;
            return 0;
          }
          return Math.max(0, prev - 6);
        });
      }, 40);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center px-4 py-2 select-none">
      {/* Instructions Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-xl border border-white/60 w-full mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          <BatteryCharging className="w-4 h-4 text-emerald-600" />
          <span>Exercício 2 · Pousar e Segurar</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Carregar a Barra de Energia
        </h1>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-md mx-auto">
          Pouse o dedo no grande botão abaixo e <strong>segure sem soltar</strong>. Quando a barra chegar a 100%, ela começará a esvaziar sozinha!
        </p>
      </div>

      {/* Vertical / Horizontal Progress Bar Display */}
      <div className="w-full max-w-sm bg-white/90 rounded-3xl p-6 shadow-xl border border-white/60 flex flex-col items-center gap-4">
        {/* Progress Value Header */}
        <div className="flex items-center justify-between w-full px-2">
          <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">
            Carga da Barra
          </span>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-8 bg-slate-100 rounded-2xl overflow-hidden p-1 shadow-inner border border-slate-200">
          <div
            className={`h-full rounded-xl transition-all duration-75 flex items-center justify-end pr-2 text-[10px] font-bold text-white shadow-sm ${
              isDraining
                ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status prompt */}
        <p className="text-sm font-semibold min-h-[24px]">
          {isDraining ? (
            <span className="text-amber-700 font-bold">
              Chegou ao topo! Agora ela está esvaziando...
            </span>
          ) : isHolding ? (
            <span className="text-emerald-700 font-bold">
              Muito bem! Continue segurando com calma...
            </span>
          ) : progress > 0 ? (
            <span className="text-slate-600">
              Soltou o dedo! Pressione e segure até o final.
            </span>
          ) : (
            <span className="text-slate-500">
              Toque e segure no botão redondo abaixo
            </span>
          )}
        </p>

        {/* Large Senior-Friendly Hold Trigger Button */}
        <button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          disabled={isDraining}
          className={`w-36 h-36 rounded-full flex flex-col items-center justify-center gap-2 transition-all duration-150 cursor-pointer shadow-xl select-none touch-none ${
            isHolding
              ? 'scale-95 bg-emerald-600 text-white ring-8 ring-emerald-300/60 shadow-emerald-700/30'
              : isDraining
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95 shadow-emerald-500/30 hover:shadow-2xl'
          }`}
        >
          <Hand className={`w-10 h-10 ${isHolding ? 'scale-110' : ''}`} />
          <span className="text-sm font-extrabold uppercase tracking-wider">
            {isHolding ? 'Segurando!' : 'Segure Aqui'}
          </span>
        </button>
      </div>

      {/* Completion Banner */}
      <div className="mt-6 w-full max-w-md">
        {isCompleted ? (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 rounded-2xl p-4 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm sm:text-base">Barra carregada com sucesso!</p>
                <p className="text-xs sm:text-sm text-emerald-800">
                  Você dominou o toque sustentado. Deslize para cima para o Desafio 3!
                </p>
              </div>
            </div>
            <button
              onClick={() => setProgress(0)}
              title="Praticar novamente"
              className="p-2 rounded-xl bg-white/80 hover:bg-white text-emerald-900 shadow-sm shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p className="text-sm font-semibold text-slate-600">
            Segure até o topo para desbloquear o próximo desafio.
          </p>
        )}
      </div>
    </div>
  );
};
