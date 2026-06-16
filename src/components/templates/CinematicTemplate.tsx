import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Story, TransitionType } from '../../types_v2';
import StepMusicBlock from './StepMusicBlock';

const getBgVariants = (type: TransitionType | undefined) => {
  switch (type) {
    case 'slide':
      return {
        initial: { x: '100%', opacity: 0.5 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-100%', opacity: 0.5 }
      };
    case 'zoom':
      return {
        initial: { scale: 1.2, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.8, opacity: 0 }
      };
    case 'blur':
      return {
        initial: { filter: 'blur(30px)', opacity: 0 },
        animate: { filter: 'blur(0px)', opacity: 1 },
        exit: { filter: 'blur(30px)', opacity: 0 }
      };
    case 'reveal':
      return {
        initial: { clipPath: 'inset(100% 0 0 0)', opacity: 0.8 },
        animate: { clipPath: 'inset(0% 0 0 0)', opacity: 1 },
        exit: { clipPath: 'inset(0 0 100% 0)', opacity: 0.8 }
      };
    case 'fade':
    default:
      return {
        initial: { opacity: 0, scale: 1.05 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0 }
      };
  }
};

const getContentVariants = (type: TransitionType | undefined) => {
  switch (type) {
    case 'slide':
      return {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
      };
    case 'zoom':
      return {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.1 }
      };
    default:
      return {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -40 }
      };
  }
};

export default function CinematicTemplate({ story }: { story: Story }) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep(c => Math.min(c + 1, story.steps.length - 1));
  const prevStep = () => setCurrentStep(c => Math.max(c - 1, 0));

  const step = story.steps[currentStep];
  const autoAdvanceSeconds = Math.max(0, Number(story.config?.autoAdvanceSeconds || 0));
  const progressDuration = autoAdvanceSeconds > 0 ? autoAdvanceSeconds : 5;
  const overlayOpacity = Math.min(90, Math.max(0, Number(story.config?.overlayIntensity || 60))) / 100;
  const eyebrow = String(step.meta?.eyebrow || story.config?.cinematicEyebrow || story.recipientName)
    .replace('{name}', story.recipientName);

  useEffect(() => {
    if (!autoAdvanceSeconds || currentStep >= story.steps.length - 1) return;
    const timeoutId = window.setTimeout(nextStep, autoAdvanceSeconds * 1000);
    return () => window.clearTimeout(timeoutId);
  }, [autoAdvanceSeconds, currentStep, story.steps.length]);

  return (
    <div className="w-full h-full bg-black relative overflow-hidden font-display flex flex-col group">
      {/* Background Media */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={step.id + '-bg'}
          variants={getBgVariants(step.transition)}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          {step.mediaType === 'video' && step.mediaUrl ? (
            <video src={step.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60" />
          ) : step.mediaType === 'image' && step.mediaUrl ? (
            <img src={step.mediaUrl} alt={step.title} className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-black" />
          )}
          <div className="absolute inset-0 bg-black mix-blend-multiply" style={{ opacity: overlayOpacity }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 mix-blend-multiply" />
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute top-8 left-8 right-8 z-20 flex gap-2">
        {story.steps.map((s, i) => (
          <div key={s.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: i < currentStep ? '100%' : i === currentStep ? '100%' : '0%' }}
              transition={{ duration: i === currentStep ? progressDuration : 0.2 }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-40 pointer-events-none flex-1 flex items-end pb-24 px-12 sm:px-24">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step.id + '-content'}
            variants={getContentVariants(step.transition)}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="max-w-4xl"
          >
            <h3 className="text-white/60 font-serif italic text-xl mb-4 tracking-wide">{eyebrow}</h3>
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">{step.title}</h1>
            <p className="text-xl sm:text-2xl text-white/80 font-sans font-light max-w-2xl leading-relaxed drop-shadow-md">{step.content}</p>

            {step.type === 'music' && <StepMusicBlock step={step} template="cinematic" />}
            
            {step.type === 'gallery' && step.meta?.images && (
              <div className="flex gap-4 mt-12 overflow-x-auto pb-6 snap-x">
                {step.meta.images.map((img: string, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="shrink-0 snap-center">
                    <img src={img} className="h-48 md:h-64 object-cover aspect-[4/3] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10" />
                  </motion.div>
                ))}
              </div>
            )}

            {step.type === 'words' && step.meta?.quotes && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {step.meta.quotes.map((q: any, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                    <p className="text-white/90 font-serif italic text-lg mb-4">"{q.text}"</p>
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">- {q.author}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Click zones for navigation */}
      <div className="absolute inset-0 z-30 flex">
        <div className="w-1/3 cursor-w-resize" onClick={prevStep} />
        <div className="w-2/3 cursor-e-resize" onClick={nextStep} />
      </div>
    </div>
  );
}
