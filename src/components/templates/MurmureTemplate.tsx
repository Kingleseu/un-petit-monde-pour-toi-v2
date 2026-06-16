import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Story } from '../../types_v2';
import StepMusicBlock from './StepMusicBlock';

export default function MurmureTemplate({ story }: { story: Story }) {
  const [currentStep, setCurrentStep] = useState(0);
  const header = String(story.config?.murmureHeader || 'POUR {name}').replace('{name}', story.recipientName);
  const hint = story.config?.murmureHint || 'Touchez pour continuer';

  const nextStep = () => {
    if (currentStep < story.steps.length - 1) {
      setCurrentStep(c => c + 1);
    }
  };

  const step = story.steps[currentStep];

  return (
    <div className="w-full h-full bg-[#050505] relative overflow-hidden font-serif cursor-pointer select-none" onClick={nextStep}>
      
      {/* Absolute minimal header */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 text-center opacity-30">
        <h1 className="text-white/50 text-xs tracking-[0.4em] uppercase font-sans mb-2">{story.title}</h1>
        <p className="text-white/30 text-[10px] tracking-[0.2em] font-sans">{header}</p>
      </div>

      <div className="w-full h-full flex flex-col items-center justify-center p-8 z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="flex flex-col items-center max-w-xl text-center"
          >
            {step.mediaType !== 'none' && step.mediaUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 0.6, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="w-48 h-64 md:w-64 md:h-80 mb-12 overflow-hidden rounded-full shadow-[0_0_50px_rgba(255,255,255,0.05)]"
              >
                {step.mediaType === 'video' ? (
                  <video src={step.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover grayscale opacity-50" />
                ) : (
                  <img src={step.mediaUrl} alt={step.title} className="w-full h-full object-cover grayscale opacity-50" />
                )}
              </motion.div>
            )}

            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ duration: 3, delay: 1 }}
              className="text-white/90 text-2xl md:text-3xl font-light italic mb-8"
            >
              {step.title}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 3, delay: 2 }}
              className="text-white/60 text-sm md:text-base leading-loose max-w-sm"
            >
              {step.content}
            </motion.p>

            {step.meta?.whisper && (
              <p className="mt-6 text-white/25 text-[11px] tracking-[0.25em] uppercase font-sans">
                {step.meta.whisper}
              </p>
            )}

            {step.type === 'music' && <StepMusicBlock step={step} template="murmure" />}

            {step.type === 'gallery' && step.meta?.images && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 2 }}
                className="flex gap-4 max-w-md flex-wrap justify-center mt-12"
              >
                {step.meta.images.map((img: string, i: number) => (
                  <img key={i} src={img} className="w-16 h-16 rounded-full grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-1000 object-cover" />
                ))}
              </motion.div>
            )}

            {step.type === 'words' && step.meta?.quotes && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 2 }}
                className="mt-12 space-y-6 max-w-sm"
              >
                {step.meta.quotes.map((q: any, i: number) => (
                  <div key={i} className="text-center opacity-50">
                    <p className="text-white text-xs italic leading-relaxed mb-2">"{q.text}"</p>
                    <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase">— {q.author}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress indicator very subtle */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-white/20 text-[10px] tracking-[0.25em] uppercase font-sans">
          {hint}
        </span>
        {story.steps.map((_, i) => (
          <div 
            key={i} 
            className={`w-1 h-1 rounded-full transition-all duration-1000 ${i === currentStep ? 'bg-white/50 scale-150' : 'bg-white/10'}`}
          />
        ))}
      </div>
    </div>
  );
}
