import React from 'react';
import { Award, ArrowUp, RefreshCw, X } from 'lucide-react';
import { CHALLENGES } from '../../constants';

interface CongratsModalProps {
  step: number;
  isOpen: boolean;
  onClose: () => void;
  onPracticeAgain: () => void;
  onNextChallenge: () => void;
}

export const CongratsModal: React.FC<CongratsModalProps> = ({
  step,
  isOpen,
  onClose,
  onPracticeAgain,
  onNextChallenge,
}) => {
  if (!isOpen) return null;

  const challenge = CHALLENGES.find((c) => c.id === step) || CHALLENGES[0];
  const isLast = step === 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative">
        <button
          onClick={onClose}
          aria-label="Fechar janela"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon & Sparkle */}
        <div className="w-20 h-20 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 shadow-inner">
          <Award className="w-12 h-12" />
        </div>

        <span className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-1">
          Exercício Concluído!
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Muito Bem!
        </h2>
        <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
          Você completou com sucesso: <strong className="text-slate-800">{challenge.title}</strong>. Seu toque está cada vez mais suave e seguro!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={onPracticeAgain}
            className="flex-1 min-h-[52px] py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-base flex items-center justify-center gap-2 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-5 h-5 text-slate-500" />
            <span>Praticar Novamente</span>
          </button>

          <button
            onClick={onNextChallenge}
            className="flex-1 min-h-[52px] py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition active:scale-95 cursor-pointer"
          >
            {isLast ? (
              <span>Finalizar Treino</span>
            ) : (
              <>
                <span>Próximo Desafio</span>
                <ArrowUp className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
