import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Background } from '../components/Background';
import { ChapterNav } from '../components/ChapterNav';
import { ProgressBar } from '../components/ProgressBar';
import { TransitionScreen } from '../components/TransitionScreen';
import { StepIntro } from '../components/steps/Step1_Intro';
import { StepCapsule } from '../components/steps/Step2_Capsule';
import { StepGallery } from '../components/steps/Step3_Gallery';
import { StepPlaylist } from '../components/steps/Step4_Playlist';
import { StepLetter } from '../components/steps/Step5_Letter';
import { StepMessages } from '../components/steps/Step6_Messages';
import { StepSurprise } from '../components/steps/Step7_Surprise';
import { useContent } from '../context/ContentContext';

export function RomanceLayout() {
  const [step, setStep] = useState(1);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
  const { content } = useContent();

  const nextStep = () => {
    if (step < 7) {
      const messages = content.transitionMessages?.filter(Boolean) || [];
      setTransitionMessage(messages[step % messages.length] || "Le chapitre suivant s'ouvre...");
      setShowTransition(true);

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep((s) => Math.min(s + 1, 7));
        setShowTransition(false);
      }, 2400);
    }
  };

  const progress = (step / 7) * 100;

  return (
    <>
      <Background step={step} />
      <ProgressBar progress={progress} />
      <ChapterNav currentStep={step} />
      <TransitionScreen isVisible={showTransition} message={transitionMessage} />

      <main className="relative z-10 w-full min-h-screen flex items-center justify-center pb-28 sm:pb-24">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step-1" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepIntro onNext={nextStep} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step-2" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepCapsule onNext={nextStep} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step-3" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepGallery onNext={nextStep} />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="step-4" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepPlaylist onNext={nextStep} />
            </motion.div>
          )}
          {step === 5 && (
            <motion.div key="step-5" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepLetter onNext={nextStep} />
            </motion.div>
          )}
          {step === 6 && (
            <motion.div key="step-6" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepMessages onNext={nextStep} />
            </motion.div>
          )}
          {step === 7 && (
            <motion.div key="step-7" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepSurprise />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
