import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Story } from '../../types_v2';
import StepMusicBlock from './StepMusicBlock';

const DEFAULT_COLORS = [
  '#facc15',
  '#f472b6',
  '#22d3ee',
  '#a3e635',
  '#fb923c'
];

export default function EclatTemplate({ story }: { story: Story }) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = story.steps[currentStep];
  const palette = String(story.config?.eclatPalette || '')
    .split(',')
    .map((color) => color.trim())
    .filter(Boolean);
  const colors = palette.length > 0 ? palette : DEFAULT_COLORS;
  const badgePrefix = story.config?.eclatBadgePrefix || 'Etape';
  const loopMode = story.config?.eclatLoopMode || 'loop';
  const bgColor = step.meta?.accentColor || colors[currentStep % colors.length];

  const nextStep = () => {
    setCurrentStep((current) => {
      if (current >= story.steps.length - 1) {
        return loopMode === 'loop' ? 0 : current;
      }
      return current + 1;
    });
  };

  return (
    <div className="w-full h-full relative overflow-hidden font-display transition-colors duration-700 ease-in-out" style={{ backgroundColor: bgColor }}>
      <motion.div
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -right-40 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          rotate: [360, 270, 180, 90, 0],
          scale: [1, 1.5, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-40 -left-60 w-[500px] h-[500px] bg-black/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="absolute top-8 left-8 z-20">
        <h1 className="text-2xl font-bold text-black tracking-tight flex items-center gap-2">
          {story.title} <Sparkles className="w-5 h-5" />
        </h1>
      </div>

      <div className="w-full h-full flex flex-col md:flex-row items-center justify-center p-8 md:p-16 gap-8 z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id + '-text'}
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex-1 max-w-2xl"
          >
            <div className="inline-block px-4 py-1 rounded-full border-2 border-black font-bold text-sm mb-6 uppercase tracking-widest">
              {step.meta?.badge || `${badgePrefix} ${currentStep + 1} / ${story.steps.length}`}
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-black leading-none mb-8 uppercase tracking-tighter">
              {step.title}
            </h2>
            <p className="text-xl md:text-3xl font-medium text-black/80 leading-snug">
              {step.content}
            </p>
            {step.type === 'music' && <StepMusicBlock step={step} template="eclat" />}
            {step.type === 'words' && step.meta?.quotes && (
              <div className="mt-8 flex flex-col gap-4">
                {step.meta.quotes.map((quote: any, i: number) => (
                  <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="bg-white p-4 rounded-2xl shadow-[4px_4px_0_rgba(0,0,0,1)] border-2 border-black">
                    <p className="text-black font-bold text-lg leading-tight mb-1">"{quote.text}"</p>
                    <p className="text-black/60 font-semibold uppercase text-xs">- {quote.author}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step.type === 'gallery' && step.meta?.images ? (
            <motion.div
              key={step.id + '-gallery'}
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: currentStep % 2 === 0 ? 3 : -3 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full md:w-1/2 grid grid-cols-2 gap-4 z-20"
            >
              {step.meta.images.slice(0, 4).map((img: string, i: number) => (
                <div key={i} className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </motion.div>
          ) : step.mediaType !== 'none' && step.mediaUrl && (
            <motion.div
              key={step.id + '-media'}
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: currentStep % 2 === 0 ? 3 : -3 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full md:w-1/2 aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-white relative z-20"
            >
              {step.mediaType === 'video' ? (
                <video src={step.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              ) : (
                <img src={step.mediaUrl} alt={step.title} className="w-full h-full object-cover" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={nextStep}
        className="absolute bottom-8 right-8 z-30 bg-black text-white rounded-full p-4 md:p-6 shadow-xl hover:scale-110 active:scale-95 transition-transform flex items-center justify-center group"
      >
        <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
