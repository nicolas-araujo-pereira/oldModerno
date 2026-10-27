import React from 'react';
import { ChevronUp, ChevronDown, Lock, CheckCircle2 } from 'lucide-react';
import { CHALLENGES } from '../../constants';

interface VerticalNavigationProps {
  currentStep: number;
  unlockedStep: number;
  completedSteps: number[];
  onSelectStep: (step: number) => void;
  onNext: () => void;
  onPrev: () => void;
  canAdvance: boolean;
}

export const VerticalNavigation: React.FC<VerticalNavigationProps> = ({
  currentStep,
  unlockedStep,
  completedSteps,
  onSelectStep,
  onNext,
  onPrev,
  canAdvance,
}) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 flex flex-col items-center gap-2">
      {/* Step Pills / Trackers */}
      <div className="flex items-center justify-center gap-2 w-full">
        {CHALLENGES.map((challenge) => {
          const isCurrent = challenge.id === currentStep;
          const isUnlocked = challenge.id <= unlockedStep;
          const isCompleted = completedSteps.includes(challenge.id);

          return (
            <button
              key={challenge.id}
              onClick={() => isUnlocked && onSelectStep(challenge.id)}
              disabled={!isUnlocked}
              className={`flex-1 py-2 px-1 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                isCurrent
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                  : isUnlocked
                  ? 'bg-white/80 hover:bg-white text-slate-800 border-white/60'
                  : 'bg-black/5 text-slate-400 border-transparent cursor-not-allowed opacity-60'
              }`}
              title={
                !isUnlocked
                  ? `Complete o Desafio ${challenge.id - 1} para desbloquear`
                  : challenge.title
              }
            >
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold">{challenge.id}</span>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                {!isUnlocked && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Swipe up hint and Quick Navigation Arrows */}
      <div className="w-full flex items-center justify-between pt-1 text-slate-700">
        <button
          onClick={onPrev}
          disabled={currentStep <= 1}
          className={`flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg bg-white/70 hover:bg-white transition active:scale-95 min-h-[44px] ${
            currentStep <= 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 select-none">
          <span className="hidden sm:inline">Deslize para cima</span>
          <ChevronUp className="w-4 h-4 animate-bounce text-slate-800" />
        </div>

        <button
          onClick={onNext}
          disabled={!canAdvance}
          className={`flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg transition active:scale-95 min-h-[44px] ${
            canAdvance
              ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm cursor-pointer'
              : 'bg-black/10 text-slate-400 cursor-not-allowed opacity-50'
          }`}
          title={!canAdvance ? 'Complete o exercício para avançar' : 'Ir para o próximo desafio'}
        >
          <span>Próximo</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
