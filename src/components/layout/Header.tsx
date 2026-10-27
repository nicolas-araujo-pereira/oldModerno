import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle } from 'lucide-react';
import { CHALLENGES } from '../../constants';

interface HeaderProps {
  currentStep: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetProgress: () => void;
  onOpenHelp: () => void;
  contrastText: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  soundEnabled,
  onToggleSound,
  onResetProgress,
  onOpenHelp,
  contrastText,
}) => {
  const currentChallenge = CHALLENGES.find((c) => c.id === currentStep) || CHALLENGES[0];

  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4 transition-colors duration-500">
      {/* Brand & Step Info */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-extrabold tracking-tight ${contrastText}`}>
              OldModeno
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-black/10 text-slate-800">
              Desafio {currentStep} de 5
            </span>
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-700 truncate max-w-[200px] sm:max-w-xs">
            {currentChallenge.title}
          </span>
        </div>
      </div>

      {/* Controls: Sound, Help, Restart */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onOpenHelp}
          aria-label="Como funciona o aplicativo"
          className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 shadow-sm transition active:scale-95 flex items-center justify-center cursor-pointer"
          title="Instruções de uso"
        >
          <HelpCircle className="w-5 h-5 text-slate-700" />
        </button>

        <button
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Silenciar som' : 'Ativar som'}
          className={`min-h-[44px] min-w-[44px] p-2 rounded-xl bg-white/80 hover:bg-white shadow-sm transition active:scale-95 flex items-center justify-center cursor-pointer ${
            soundEnabled ? 'text-emerald-700' : 'text-slate-400'
          }`}
          title={soundEnabled ? 'Som ativado' : 'Som silenciado'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        <button
          onClick={onResetProgress}
          aria-label="Reiniciar progresso do início"
          className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-white/80 hover:bg-white text-slate-600 shadow-sm transition active:scale-95 flex items-center justify-center cursor-pointer"
          title="Recomeçar do Desafio 1"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
