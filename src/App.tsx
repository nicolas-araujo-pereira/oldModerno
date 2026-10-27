import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { THEMES, CHALLENGES } from './constants';
import { ThemeColor, AppProgress } from './types';
import { storage, DEFAULT_PROGRESS } from './utils/storage';
import { soundEffects } from './utils/sound';

import { Header } from './components/layout/Header';
import { VerticalNavigation } from './components/layout/VerticalNavigation';
import { CongratsModal } from './components/layout/CongratsModal';
import { HelpModal } from './components/layout/HelpModal';

import { SwipeChallenge } from './components/challenges/SwipeChallenge';
import { HoldBarChallenge } from './components/challenges/HoldBarChallenge';
import { BubbleChallenge } from './components/challenges/BubbleChallenge';
import { MultiBubbleChallenge } from './components/challenges/MultiBubbleChallenge';
import { PlaygroundChallenge } from './components/challenges/PlaygroundChallenge';

export default function App() {
  const [progress, setProgress] = useState<AppProgress>(() => storage.getProgress());
  const [currentStep, setCurrentStep] = useState<number>(() => progress.unlockedStep || 1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [congratsModalOpen, setCongratsModalOpen] = useState<boolean>(false);
  const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);
  const [lockedToast, setLockedToast] = useState<string | null>(null);

  // Background Theme: inherited from progress or Challenge 1
  const activeTheme = THEMES.find((t) => t.id === progress.activeThemeId) || THEMES[0];

  // Auto-save on progress changes
  useEffect(() => {
    storage.saveProgress(progress);
  }, [progress]);

  // Touch start Y for vertical swipe navigation (arrastar a tela para cima)
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null || touchStartXRef.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartYRef.current = null;
    touchStartXRef.current = null;

    // Detect vertical swipe only if vertical movement is dominant
    if (Math.abs(deltaY) > 55 && Math.abs(deltaY) > Math.abs(deltaX) * 1.3) {
      if (deltaY < 0) {
        // Deslizou para CIMA -> próximo exercício
        attemptGoToStep(currentStep + 1);
      } else {
        // Deslizou para BAIXO -> exercício anterior
        if (currentStep > 1) {
          goToStep(currentStep - 1);
        }
      }
    }
  };

  const attemptGoToStep = (targetStep: number) => {
    if (targetStep > 5) return;
    if (targetStep <= progress.unlockedStep) {
      goToStep(targetStep);
    } else {
      // Locked challenge feedback
      setLockedToast(`Complete o Desafio ${currentStep} para desbloquear o próximo!`);
      if (soundEnabled) soundEffects.playShakeWarning();
      setTimeout(() => setLockedToast(null), 3000);
    }
  };

  const goToStep = (step: number) => {
    if (step < 1 || step > 5) return;
    setCurrentStep(step);
    if (soundEnabled) soundEffects.playSwipe();
  };

  const handleSelectTheme = (theme: ThemeColor) => {
    setProgress((prev) => ({
      ...prev,
      activeThemeId: theme.id,
    }));
  };

  const handleChallengeComplete = (stepId: number) => {
    setProgress((prev) => {
      const alreadyCompleted = prev.completedSteps.includes(stepId);
      const newCompleted = alreadyCompleted ? prev.completedSteps : [...prev.completedSteps, stepId];
      const nextUnlocked = Math.max(prev.unlockedStep, Math.min(5, stepId + 1));

      return {
        ...prev,
        completedSteps: newCompleted,
        unlockedStep: nextUnlocked,
      };
    });

    if (soundEnabled) {
      soundEffects.playSuccessChime();
    }
    setCongratsModalOpen(true);
  };

  const handleResetProgress = () => {
    if (window.confirm('Deseja recomeçar a trilha desde o Desafio 1?')) {
      const reset = storage.resetProgress();
      setProgress(reset);
      setCurrentStep(1);
    }
  };

  const isCurrentCompleted = progress.completedSteps.includes(currentStep);
  const canAdvance = currentStep < 5 && progress.unlockedStep > currentStep;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen w-full transition-colors duration-700 flex flex-col justify-between overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif]"
      style={{ backgroundColor: activeTheme.hex }}
    >
      {/* Top Header */}
      <Header
        currentStep={currentStep}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onResetProgress={handleResetProgress}
        onOpenHelp={() => setHelpModalOpen(true)}
        contrastText={activeTheme.contrastText}
      />

      {/* Main Challenge Stage with Animated Transitions */}
      <main className="flex-1 flex flex-col items-center justify-center py-2 px-2 w-full max-w-4xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center justify-center"
          >
            {currentStep === 1 && (
              <SwipeChallenge
                currentTheme={activeTheme}
                onSelectTheme={handleSelectTheme}
                onComplete={() => handleChallengeComplete(1)}
                isCompleted={isCurrentCompleted}
                soundEnabled={soundEnabled}
              />
            )}

            {currentStep === 2 && (
              <HoldBarChallenge
                onComplete={() => handleChallengeComplete(2)}
                isCompleted={isCurrentCompleted}
                soundEnabled={soundEnabled}
              />
            )}

            {currentStep === 3 && (
              <BubbleChallenge
                onComplete={() => handleChallengeComplete(3)}
                isCompleted={isCurrentCompleted}
                soundEnabled={soundEnabled}
              />
            )}

            {currentStep === 4 && (
              <MultiBubbleChallenge
                onComplete={() => handleChallengeComplete(4)}
                isCompleted={isCurrentCompleted}
                soundEnabled={soundEnabled}
              />
            )}

            {currentStep === 5 && (
              <PlaygroundChallenge
                currentTheme={activeTheme}
                onSelectTheme={handleSelectTheme}
                onComplete={() => handleChallengeComplete(5)}
                isCompleted={isCurrentCompleted}
                soundEnabled={soundEnabled}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Locked Notification Toast */}
        <AnimatePresence>
          {lockedToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-24 left-4 right-4 max-w-md mx-auto z-40 bg-slate-900 text-white text-center py-3 px-4 rounded-2xl shadow-xl font-bold text-sm"
            >
              {lockedToast}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Vertical Navigation & Bottom Actions */}
      <footer className="w-full pb-4">
        <VerticalNavigation
          currentStep={currentStep}
          unlockedStep={progress.unlockedStep}
          completedSteps={progress.completedSteps}
          onSelectStep={(step) => goToStep(step)}
          onNext={() => attemptGoToStep(currentStep + 1)}
          onPrev={() => currentStep > 1 && goToStep(currentStep - 1)}
          canAdvance={canAdvance}
        />
      </footer>

      {/* Modals */}
      <CongratsModal
        step={currentStep}
        isOpen={congratsModalOpen}
        onClose={() => setCongratsModalOpen(false)}
        onPracticeAgain={() => setCongratsModalOpen(false)}
        onNextChallenge={() => {
          setCongratsModalOpen(false);
          if (currentStep < 5) {
            goToStep(currentStep + 1);
          }
        }}
      />

      <HelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />
    </div>
  );
}
