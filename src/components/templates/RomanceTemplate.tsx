import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Story, TransitionType } from '../../types_v2';
import { Heart, Lock, Unlock, ArrowRight, ArrowLeft } from 'lucide-react';
import StepMusicBlock from './StepMusicBlock';

const getVariants = (type: TransitionType | undefined) => {
  switch (type) {
    case 'slide':
      return {
        initial: { opacity: 0, x: 50, filter: 'blur(5px)' },
        animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, x: -50, filter: 'blur(5px)' }
      };
    case 'zoom':
      return {
        initial: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, scale: 1.1, filter: 'blur(10px)' }
      };
    case 'blur':
      return {
        initial: { opacity: 0, filter: 'blur(20px)' },
        animate: { opacity: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, filter: 'blur(20px)' }
      };
    default:
      return {
        initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -30, filter: 'blur(10px)' }
      };
  }
};

export default function RomanceTemplate({ story }: { story: Story }) {
  const pinCode = String(story.config?.pinCode || '');
  const [isUnlocked, setIsUnlocked] = useState(!pinCode);
  const [pinEntry, setPinEntry] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(0);
  const chapterLabel = story.config?.romanceEyebrow || 'Chapitre';
  const paperTone = story.config?.romancePaperTone || 'ivoire';
  const paperClass = paperTone === 'rose'
    ? 'bg-[#FFF1F3]'
    : paperTone === 'ambre'
      ? 'bg-[#FFF6DF]'
      : 'bg-[#FAF7F2]';

  // Reset unlock state if pinCode changes in editor
  useEffect(() => {
    if (pinCode && pinCode !== pinEntry && isUnlocked) {
      setIsUnlocked(false);
      setPinEntry('');
    } else if (!pinCode) {
      setIsUnlocked(true);
    }
  }, [pinCode]);

  const handleKeypad = (num: number) => {
    if (errorShake || isUnlocked) return;
    const expected = pinCode;
    const newPin = pinEntry + num;
    setPinEntry(newPin);

    if (newPin === expected) {
      setTimeout(() => setIsUnlocked(true), 400);
    } else if (newPin.length >= expected.length) {
      setErrorShake(true);
      setTimeout(() => {
        setPinEntry('');
        setErrorShake(false);
      }, 500);
    }
  };

  const nextStep = () => setCurrentStep(c => Math.min(c + 1, story.steps.length - 1));
  const prevStep = () => setCurrentStep(c => Math.max(c - 1, 0));

  if (!isUnlocked) {
    const expected = pinCode;
    return (
      <div className="w-full h-full bg-[#0B0914] flex flex-col items-center justify-center text-rose-100 font-serif relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-900/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full border border-rose-500/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
            <Lock className="w-6 h-6 text-rose-300" strokeWidth={1.5} />
          </div>
          
          <h3 className="text-rose-300/60 uppercase tracking-[0.3em] text-xs font-bold font-sans mb-3">
            Bienvenue {story.recipientName}
          </h3>
          <h1 className="text-3xl md:text-4xl font-light mb-6 text-rose-100 tracking-wide text-center">
            Accès sécurisé
          </h1>
          <p className="text-rose-200/60 font-sans font-light max-w-sm text-center text-sm mb-12 leading-relaxed">
            Ce petit monde a été préparé pour toi. Pose-toi au calme, puis entre le code pour commencer.
          </p>

          <motion.div 
            animate={errorShake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex gap-4 mb-12"
          >
            {Array.from({ length: expected.length }).map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                  i < pinEntry.length 
                    ? 'bg-rose-400 border-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.6)]' 
                    : 'border-rose-500/30'
                }`}
              />
            ))}
          </motion.div>

          <div className="grid grid-cols-3 gap-x-12 gap-y-6 font-sans">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button 
                key={num}
                onClick={() => handleKeypad(num)}
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-light text-rose-100 hover:bg-rose-500/10 hover:text-rose-300 transition-all active:scale-95"
              >
                {num}
              </button>
            ))}
            <div />
            <button 
              onClick={() => handleKeypad(0)}
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-light text-rose-100 hover:bg-rose-500/10 hover:text-rose-300 transition-all active:scale-95"
            >
              0
            </button>
            <button 
              onClick={() => setPinEntry('')}
              className="w-16 h-16 flex items-center justify-center text-xs uppercase tracking-widest text-rose-400 hover:text-rose-300 transition-colors"
            >
              Effacer
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const step = story.steps[currentStep];

  return (
    <div className="w-full h-full bg-[#18131A] relative overflow-hidden font-serif selection:bg-rose-900/50">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-900/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center p-6 md:p-12 lg:p-24">
        <div className="max-w-6xl w-full h-full flex flex-col md:flex-row gap-12 lg:gap-24 items-center">
          
          {/* Letter / Text Content */}
          <div className="flex-1 w-full order-2 md:order-1 flex flex-col">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 md:mb-16"
            >
              <Heart className="w-5 h-5 text-amber-600/50 mb-6 mx-auto md:mx-0" />
              <h3 className="text-amber-500/80 font-sans uppercase tracking-[0.2em] text-xs font-semibold text-center md:text-left">
                {chapterLabel} {currentStep + 1} sur {story.steps.length}
              </h3>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step.id + '-text'}
                variants={getVariants(step.transition)}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1"
              >
                <div className={`${paperClass} p-8 md:p-12 lg:p-16 rounded-[2rem] shadow-2xl relative`}>
                  {/* Paper texture overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-[2rem]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }}></div>
                  
                  <div className="h-px w-24 bg-amber-900/20 mb-8 mx-auto md:mx-0" />
                  
                  <h1 className="text-3xl md:text-5xl text-[#2A2421] font-light mb-8 leading-tight">
                    {step.title}
                  </h1>
                  
                  <p className="text-lg md:text-xl text-[#3D3531] leading-loose font-light whitespace-pre-wrap">
                    {step.content}
                  </p>

                  {step.type === 'music' && <StepMusicBlock step={step} template="romance" />}

                  {step.type === 'words' && step.meta?.quotes && (
                    <div className="mt-8 space-y-6">
                      {step.meta.quotes.map((q: any, i: number) => (
                        <div key={i}>
                          <p className="text-[#3D3531] italic">"{q.text}"</p>
                          <p className="text-amber-900/60 text-sm mt-1">- {q.author}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="h-px w-24 bg-amber-900/20 mt-12 mb-8 mx-auto md:mx-0" />

                  {step.meta?.signature && (
                    <p className="text-xl text-amber-900/80 font-serif italic pb-4">
                      {step.meta.signature}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Media Presentation */}
          <div className="flex-1 w-full order-1 md:order-2">
            <AnimatePresence mode="wait">
              {step.type === 'gallery' && step.meta?.images ? (
                <motion.div
                  key={step.id + '-gallery'}
                  variants={getVariants(step.transition)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="relative mx-auto max-w-md w-full grid grid-cols-2 gap-4"
                >
                  {step.meta.images.map((img: string, i: number) => (
                    <div key={i} className={`bg-white p-2 md:p-3 rounded-sm shadow-xl ${i % 2 === 0 ? 'rotate-2' : '-rotate-2'} hover:rotate-0 transition-transform duration-700`}>
                      <img src={img} className="w-full aspect-[4/5] object-cover bg-stone-100" />
                    </div>
                  ))}
                </motion.div>
              ) : step.mediaType !== 'none' && step.mediaUrl && (
                <motion.div
                  key={step.id + '-media'}
                  variants={getVariants(step.transition)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="relative mx-auto max-w-md w-full"
                >
                  <div className="aspect-[4/5] bg-white p-3 md:p-4 rounded-sm shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                    <div className="w-full h-full relative overflow-hidden bg-stone-100">
                      {step.mediaType === 'video' ? (
                        <video src={step.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      ) : (
                        <img src={step.mediaUrl} alt={step.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </div>
                  {/* Decorative tape */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/20 backdrop-blur-sm shadow-sm rotate-3 mix-blend-overlay" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Navigation Layer */}
      <div className="absolute bottom-8 left-0 right-0 z-50 px-8 flex justify-between items-center max-w-6xl mx-auto pointer-events-none">
        <button 
          onClick={prevStep}
          disabled={currentStep === 0}
          className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-0 transition-all backdrop-blur-md"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={1} />
        </button>
        
        <div className="flex gap-2 pointer-events-auto">
          {story.steps.map((_, i) => (
            <div 
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>

        <button 
          onClick={nextStep}
          disabled={currentStep === story.steps.length - 1}
          className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-0 transition-all backdrop-blur-md"
        >
          <ArrowRight className="w-5 h-5" strokeWidth={1} />
        </button>
      </div>
    </div>
  );
}

