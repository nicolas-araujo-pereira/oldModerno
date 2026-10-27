import React from 'react';
import { X, Feather, Check, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col text-slate-800 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Fechar ajuda"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Feather className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              O Segredo do Toque Leve
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Dicas especiais para usar o celular com facilidade
            </p>
          </div>
        </div>

        <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed mb-6">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-3">
            <Check className="w-6 h-6 text-sky-600 shrink-0 mt-0.5" />
            <p>
              <strong>A tela não é mecânica:</strong> Os celulares modernos sentem o calor e a eletricidade natural do seu dedo, não a força muscular.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Toque e solte logo:</strong> Para abrir aplicativos ou clicar em links, apenas dê um toquezinho rápido e retire o dedo. Se você segurar o dedo na tela, ela acha que você quer selecionar texto ou mover ícones.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
            <Feather className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Relaxe a mão:</strong> Segure o aparelho confortavelmente com uma mão e use a ponta suave do dedo indicador da outra mão.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full min-h-[52px] py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition active:scale-95 cursor-pointer shadow-md"
        >
          Entendi! Quero Praticar
        </button>
      </div>
    </div>
  );
};
