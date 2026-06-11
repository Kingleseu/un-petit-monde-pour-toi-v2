import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Settings } from 'lucide-react';
import { Background } from './components/Background';
import { StepLock } from './components/steps/Step0_Lock';
import { StepIntro } from './components/steps/Step1_Intro';
import { StepCapsule } from './components/steps/Step2_Capsule';
import { StepGallery } from './components/steps/Step3_Gallery';
import { StepPlaylist } from './components/steps/Step4_Playlist';
import { StepLetter } from './components/steps/Step5_Letter';
import { StepMessages } from './components/steps/Step6_Messages';
import { StepSurprise } from './components/steps/Step7_Surprise';
import { ContentProvider } from './context/ContentContext';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  return (
    <ContentProvider>
      <AppContentWrapper />
    </ContentProvider>
  );
}

function AppContentWrapper() {
  const [step, setStep] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep((s) => Math.min(s + 1, 7));
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen relative font-sans text-slate-100 overflow-x-hidden bg-[#050508]">
        <Background />
        <AdminPanel onClose={() => setIsAdmin(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative font-sans text-slate-100 overflow-x-hidden">
      <Background />
      <button 
        onClick={() => setIsAdmin(true)} 
        className="fixed bottom-4 right-4 z-50 p-2 opacity-20 hover:opacity-100 transition-opacity bg-white/10 hover:bg-[#D4AF37] rounded-full border border-white/10 hover:border-[#D4AF37] hover:text-[#050508] shadow-lg text-white" 
        title="Ouvrir la configuration"
      >
        <Settings className="w-5 h-5 flex-shrink-0" />
      </button>

      <main className="relative z-10 w-full min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step-0" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepLock onUnlock={nextStep} />
            </motion.div>
          )}
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
    </div>
  );
}
