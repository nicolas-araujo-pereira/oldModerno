import React, { useState, useRef, useEffect } from 'react';
import { Layers, Palette, BatteryCharging, CircleDot, CheckCircle2, Hand, Sparkles, RefreshCw, Trophy } from 'lucide-react';
import { THEMES } from '../../constants';
import { ThemeColor } from '../../types';
import { soundEffects } from '../../utils/sound';

interface PlaygroundChallengeProps {
  currentTheme: ThemeColor;
  onSelectTheme: (theme: ThemeColor) => void;
  onComplete: () => void;
  isCompleted: boolean;
  soundEnabled: boolean;
}

export const PlaygroundChallenge: React.FC<PlaygroundChallengeProps> = ({
  currentTheme,
  onSelectTheme,
  onComplete,
  isCompleted,
  soundEnabled,
}) => {
  // 1. Charge Bar State
  const [barProgress, setBarProgress] = useState(0);
  const [isHoldingBar, setIsHoldingBar] = useState(false);
  const [isDrainingBar, setIsDrainingBar] = useState(false);
  const barTimerRef = useRef<number | null>(null);

  // 2. Bubble State
  const [bubbleCount, setBubbleCount] = useState(3);
  const [bubbleShaking, setBubbleShaking] = useState(false);

  // 3. Touch Meter State
  const [lastTouchMs, setLastTouchMs] = useState<number | null>(null);
  const [touchGrade, setTouchGrade] = useState<'perfect' | 'good' | 'heavy' | null>(null);

  const touchStartTimeRef = useRef<number | null>(null);
  const bubbleHoldTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (barTimerRef.current) clearInterval(barTimerRef.current);
      if (bubbleHoldTimeoutRef.current) clearTimeout(bubbleHoldTimeoutRef.current);
    };
  }, []);

  // Charge Bar Handlers
  const handleBarDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (isDrainingBar) return;

    setIsHoldingBar(true);
    barTimerRef.current = window.setInterval(() => {
      setBarProgress((prev) => {
        const next = prev + 3;
        if (soundEnabled && Math.floor(next) % 20 === 0) {
          soundEffects.playChargeStep(next / 100);
        }
        if (next >= 100) {
          if (barTimerRef.current) clearInterval(barTimerRef.current);
          setIsDrainingBar(true);
          setIsHoldingBar(false);
          if (soundEnabled) soundEffects.playSuccessChime();

          const drain = window.setInterval(() => {
            setBarProgress((curr) => {
              if (curr <= 0) {
                clearInterval(drain);
                setIsDrainingBar(false);
                return 0;
              }
              return Math.max(0, curr - 5);
            });
          }, 35);

          return 100;
        }
        return next;
      });
    }, 40);
  };

  const handleBarUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (isDrainingBar) return;
    setIsHoldingBar(false);
    if (barTimerRef.current) {
      clearInterval(barTimerRef.current);
      barTimerRef.current = null;
    }
  };

  // Bubble Handlers
  const handleBubbleDown = (e: React.PointerEvent) => {
    e.preventDefault();
    touchStartTimeRef.current = Date.now();
    setBubbleShaking(false);

    bubbleHoldTimeoutRef.current = window.setTimeout(() => {
      setBubbleShaking(true);
      setTouchGrade('heavy');
      if (soundEnabled) soundEffects.playShakeWarning();
    }, 500);
  };

  const handleBubbleUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (bubbleHoldTimeoutRef.current) {
      clearTimeout(bubbleHoldTimeoutRef.current);
      bubbleHoldTimeoutRef.current = null;
    }

    if (touchStartTimeRef.current === null) return;
    const duration = Date.now() - touchStartTimeRef.current;
    setLastTouchMs(duration);
    touchStartTimeRef.current = null;

    if (duration <= 500 && !bubbleShaking) {
      if (duration < 250) {
        setTouchGrade('perfect');
      } else {
        setTouchGrade('good');
      }
      setBubbleCount((prev) => Math.max(0, prev - 1));
      if (soundEnabled) soundEffects.playPop();

      if (!isCompleted) {
        onComplete();
      }
    } else {
      setBubbleShaking(true);
      setTouchGrade('heavy');
      if (soundEnabled) soundEffects.playShakeWarning();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center px-4 py-1 select-none">
      {/* Title */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-white/60 w-full mb-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Exercício 5 · Espaço Integrado</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
          Parquinho de Prática Livre
        </h1>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-lg mx-auto">
          Todos os exercícios reunidos! Mude a cor do aplicativo, pratique o toque na barra e treine toques leves nas bolhas.
        </p>
      </div>

      {/* Grid of the combined exercises */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module 1: Color Themes (Swipe Exercise) */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-md border border-white/60 flex flex-col items-center">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            <Palette className="w-4 h-4 text-sky-600" />
            <span>1. Escolher Cor de Fundo</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Toque para alterar a cor de todo o aplicativo
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme);
                  if (soundEnabled) soundEffects.playSwipe();
                }}
                className={`py-2 px-3 rounded-xl border-2 flex items-center gap-2 transition active:scale-95 cursor-pointer ${
                  currentTheme.id === theme.id
                    ? 'border-slate-900 shadow-md scale-105'
                    : 'border-white hover:border-slate-300 opacity-80'
                }`}
                style={{ backgroundColor: theme.hex }}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <span className="text-xs font-bold text-slate-800">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Module 2: Charge Bar (Hold Exercise) */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-md border border-white/60 flex flex-col items-center">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            <BatteryCharging className="w-4 h-4 text-emerald-600" />
            <span>2. Barra de Energia</span>
          </div>
          <div className="w-full flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
            <span>Segurar até o topo:</span>
            <span className="tabular-nums font-extrabold text-sm">{Math.round(barProgress)}%</span>
          </div>
          <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 mb-3">
            <div
              className={`h-full rounded-full transition-all duration-75 ${
                isDrainingBar ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${barProgress}%` }}
            />
          </div>
          <button
            onPointerDown={handleBarDown}
            onPointerUp={handleBarUp}
            onPointerCancel={handleBarUp}
            onPointerLeave={handleBarUp}
            disabled={isDrainingBar}
            className={`w-full min-h-[48px] py-2.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer ${
              isHoldingBar
                ? 'bg-emerald-700 text-white'
                : isDrainingBar
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Hand className="w-4 h-4" />
            <span>{isHoldingBar ? 'Carregando...' : 'Segure para Carregar'}</span>
          </button>
        </div>

        {/* Module 3: Light Touch Bubble (Tap Exercise) */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-md border border-white/60 flex flex-col items-center md:col-span-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            <CircleDot className="w-4 h-4 text-purple-600" />
            <span>3. Bolhas e Medidor de Força</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Dê um toque leve e rápido na bolha abaixo. Veja a duração exata do seu toque!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-around w-full gap-6">
            {/* Bubble Trigger */}
            <div className="flex flex-col items-center">
              <div
                onPointerDown={handleBubbleDown}
                onPointerUp={handleBubbleUp}
                onPointerCancel={handleBubbleUp}
                onPointerLeave={handleBubbleUp}
                className={`w-32 h-32 rounded-full flex flex-col items-center justify-center cursor-pointer transition select-none touch-none ${
                  bubbleShaking
                    ? 'animate-shake bg-gradient-to-br from-amber-300 to-rose-300 ring-4 ring-amber-400'
                    : 'animate-float bg-gradient-to-br from-sky-200 via-indigo-100 to-pink-200 shadow-xl ring-4 ring-white/90 hover:scale-105 active:scale-95'
                }`}
              >
                <Sparkles className="w-6 h-6 text-indigo-700 mb-1" />
                <span className="text-xs font-extrabold text-indigo-900 uppercase">
                  {bubbleShaking ? 'Forte!' : 'Toque Leve'}
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-2">
                Restam: {bubbleCount} bolhas
              </span>
            </div>

            {/* Live Touch Speedometer */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center justify-center min-w-[200px]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Velocidade do Toque
              </span>
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {lastTouchMs !== null ? `${lastTouchMs}ms` : '--'}
              </span>

              <div className="mt-2 text-xs font-bold px-3 py-1 rounded-full">
                {touchGrade === 'perfect' && (
                  <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    Toque Perfeito (Muito Suave!)
                  </span>
                )}
                {touchGrade === 'good' && (
                  <span className="text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
                    Toque Bom (Dentro do Limite)
                  </span>
                )}
                {touchGrade === 'heavy' && (
                  <span className="text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    Segurou Forte (Tente mais rápido)
                  </span>
                )}
                {touchGrade === null && (
                  <span className="text-slate-500">Toque na bolha para medir</span>
                )}
              </div>
            </div>
          </div>

          {bubbleCount === 0 && (
            <button
              onClick={() => setBubbleCount(3)}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Colocar Mais Bolhas</span>
            </button>
          )}
        </div>
      </div>

      {/* Completion Trophy Card */}
      <div className="mt-4 w-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-950 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg">Parabéns! Trilha Concluída!</h2>
            <p className="text-xs sm:text-sm text-emerald-900">
              Você aprendeu todos os movimentos essenciais: deslizar, toque suave rápido e segurar com calma.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-emerald-900 uppercase">
            Mestre do Toque
          </span>
        </div>
      </div>
    </div>
  );
};
