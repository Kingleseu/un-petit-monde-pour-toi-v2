import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Story } from '../../types_v2';
import StepMusicBlock from './StepMusicBlock';

export default function StarlightTemplate({ story }: { story: Story }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState<Record<string, boolean>>({});

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const starCount = Math.max(10, Number(story.config?.starCount || 60));
  const holdSpeed = Math.max(1, Number(story.config?.holdSpeed || 2));
  const holdHint = story.config?.starlightHint || "Maintenez pour connecter l'etoile";
  const stars = useMemo(() => Array.from({ length: starCount }).map((_, index) => ({
    id: index,
    width: Math.random() * 2 + 'px',
    height: Math.random() * 2 + 'px',
    top: Math.random() * 100 + '%',
    left: Math.random() * 100 + '%',
    opacity: Math.random() * 0.8 + 0.2,
    animation: `twinkle ${Math.random() * 4 + 2}s infinite alternate`
  })), [starCount]);

  const nextStep = () => {
    setCurrentStep((current) => Math.min(current + 1, story.steps.length - 1));
    setHoldProgress(0);
  };

  const prevStep = () => {
    setCurrentStep((current) => Math.max(current - 1, 0));
    setHoldProgress(0);
  };

  const step = story.steps[currentStep];
  const isRevealed = revealedSteps[step.id];

  const handlePointerDown = () => {
    if (isRevealed) return;

    intervalRef.current = setInterval(() => {
      setHoldProgress((previous) => {
        if (previous >= 100) {
          clearInterval(intervalRef.current!);
          setRevealedSteps((revealed) => ({ ...revealed, [step.id]: true }));
          return 100;
        }
        return previous + holdSpeed;
      });
    }, 20);
  };

  const handlePointerUp = () => {
    if (isRevealed) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="w-full h-full bg-[#050B14] relative overflow-hidden font-sans text-blue-50 selection:bg-blue-900/50">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        {stars.map((star) => (
          <div
            key={`star-${star.id}`}
            className="absolute rounded-full bg-white"
            style={{
              width: star.width,
              height: star.height,
              top: star.top,
              left: star.left,
              opacity: star.opacity,
              animation: star.animation
            }}
          />
        ))}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2) drop-shadow(0 0 4px rgba(255,255,255,0.8)); }
        }
      ` }} />

      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#050B14]/50 to-[#050B14] z-10 pointer-events-none" />

      <div
        className="relative z-20 w-full h-full flex flex-col justify-center items-center px-8"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key={`hold-${step.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center justify-center cursor-pointer select-none"
            >
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="2" />
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-blue-400 transition-all duration-75 ease-linear"
                    strokeDasharray="377"
                    strokeDashoffset={377 - (377 * holdProgress) / 100}
                  />
                </svg>
                <div className={`w-8 h-8 rounded-full bg-blue-300 shadow-[0_0_50px_#60a5fa] ${holdProgress > 0 ? 'scale-150 animate-pulse' : 'animate-bounce'}`} />
              </div>
              <p className="mt-8 text-blue-300/60 uppercase tracking-[0.3em] text-xs font-bold font-sans">
                {holdProgress > 0 ? 'Connexion...' : holdHint}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`revealed-${step.id}`}
              initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.8 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="max-w-4xl mx-auto w-full flex flex-col items-center text-center gap-8"
            >
              <div className="flex items-center gap-4 text-blue-300/50 uppercase tracking-[0.5em] text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa] animate-pulse" />
                CONSTELLATION {currentStep + 1}
              </div>

              <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-tight">
                {step.title}
              </h1>

              <p className="text-lg md:text-2xl text-blue-100/70 font-light leading-relaxed max-w-2xl px-4 z-20 relative">
                "{step.content}"
              </p>

              {step.meta?.words && typeof step.meta.words === 'string' && (
                <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                  {step.meta.words.split(',').map((word: string) => word.trim()).filter(Boolean).map((word: string, index: number, words: string[]) => {
                    const angle = (index / words.length) * Math.PI * 2;
                    const radius = 250 + ((index * 37) % 100);
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 0, y: 0 }}
                        animate={{ opacity: 0.6, x, y }}
                        transition={{ duration: 2, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
                        className="absolute text-blue-200/80 font-serif text-lg tracking-wider"
                      >
                        {word}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {step.type === 'gallery' && step.meta?.images ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
                  className="mt-8 flex gap-4 max-w-2xl overflow-x-auto pb-4 z-20 relative"
                >
                  {step.meta.images.map((img: string, index: number) => (
                    <img key={index} src={img} className="h-40 md:h-56 aspect-[3/4] object-cover rounded-lg shadow-[0_0_30px_rgba(59,130,246,0.2)] border border-blue-500/40 opacity-80 hover:opacity-100 transition-opacity shrink-0" />
                  ))}
                </motion.div>
              ) : step.type === 'words' && step.meta?.quotes ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
                  className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl z-20 relative"
                >
                  {step.meta.quotes.map((quote: any, index: number) => (
                    <div key={index} className="bg-blue-900/10 backdrop-blur-sm border border-blue-500/20 p-6 rounded-2xl">
                      <p className="text-blue-100 italic mb-4">"{quote.text}"</p>
                      <p className="text-blue-300/60 uppercase tracking-widest text-[10px] font-bold">~ {quote.author}</p>
                    </div>
                  ))}
                </motion.div>
              ) : step.type === 'music' ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
                  className="z-40 relative w-full flex justify-center"
                >
                  <StepMusicBlock step={step} template="starlight" />
                </motion.div>
              ) : step.mediaType !== 'none' && step.mediaUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
                  className="mt-8 w-64 md:w-96 aspect-video rounded-xl overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.15)] border border-blue-500/30 bg-blue-900/20 z-20 relative"
                >
                  {step.mediaType === 'video' ? (
                    <video src={step.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover mix-blend-screen opacity-90" />
                  ) : (
                    <img src={step.mediaUrl} alt={step.title} className="w-full h-full object-cover opacity-90" />
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isRevealed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 pointer-events-none">
            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-1/4 cursor-w-resize pointer-events-auto" onClick={prevStep}>
              {currentStep > 0 && <div className="absolute left-8 top-1/2 -translate-y-1/2 text-blue-500/50 text-xs tracking-widest uppercase -rotate-90 origin-left hover:text-blue-300 transition-colors">Retour</div>}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-1/4 cursor-e-resize pointer-events-auto" onClick={nextStep}>
              {currentStep < story.steps.length - 1 && <div className="absolute right-8 top-1/2 -translate-y-1/2 text-blue-500/50 text-xs tracking-widest uppercase rotate-90 origin-right hover:text-blue-300 transition-colors">Voyager plus loin</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
