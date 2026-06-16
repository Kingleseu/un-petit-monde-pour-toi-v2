import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { Story } from '../../types_v2';
import StepMusicBlock from './StepMusicBlock';

export default function MinimalTemplate({ story }: { story: Story }) {
  const pinCode = String(story.config?.pinCode || '');
  const [isUnlocked, setIsUnlocked] = useState(!pinCode);
  const [pinEntry, setPinEntry] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const accessTitle = story.config?.minimalAccessTitle || 'ACCES RESTREINT';
  const labelPrefix = story.config?.minimalLabelPrefix || '0';

  useEffect(() => {
    if (!pinCode) {
      setIsUnlocked(true);
      return;
    }
    setIsUnlocked(false);
    setPinEntry('');
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

  if (!isUnlocked) {
    const expected = pinCode;
    return (
      <div className="w-full h-full bg-[#080808] flex flex-col items-center justify-center text-white font-sans relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-8">
            <Lock className="w-6 h-6 text-white/80" strokeWidth={1} />
          </div>

          <h1 className="text-2xl font-light mb-6 text-white tracking-widest text-center uppercase">
            {accessTitle}
          </h1>
          <p className="text-white/40 font-light max-w-sm text-center text-sm mb-12">
            Entrez le code d'acces pour continuer.
          </p>

          <motion.div
            animate={errorShake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex gap-4 mb-12"
          >
            {Array.from({ length: expected.length }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index < pinEntry.length
                    ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </motion.div>

          <div className="grid grid-cols-3 gap-x-12 gap-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeypad(num)}
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-light text-white hover:bg-white/10 transition-all"
              >
                {num}
              </button>
            ))}
            <div />
            <button
              onClick={() => handleKeypad(0)}
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-light text-white hover:bg-white/10 transition-all"
            >
              0
            </button>
            <button
              onClick={() => setPinEntry('')}
              className="w-16 h-16 flex items-center justify-center text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors"
            >
              Effacer
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#080808] relative overflow-y-auto snap-y snap-mandatory scroll-smooth font-sans text-white">
      {story.steps.map((step, index) => (
        <section
          key={step.id}
          className="w-full h-full min-h-full snap-center flex flex-col items-center justify-center relative p-8 md:p-24"
        >
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.3em] font-light">
            {labelPrefix}{index + 1}
          </div>

          <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full text-center md:text-left"
            >
              <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-tight">{step.title}</h2>
              <p className="text-white/60 font-light text-lg md:text-xl leading-relaxed whitespace-pre-line">{step.content}</p>
              {step.type === 'words' && step.meta?.quotes && (
                <div className="mt-8 space-y-4">
                  {step.meta.quotes.map((quote: any, quoteIndex: number) => (
                    <div key={quoteIndex} className="border-l border-white/15 pl-4">
                      <p className="text-white/70 text-sm italic">"{quote.text}"</p>
                      <p className="text-white/30 text-[10px] uppercase tracking-[0.25em] mt-2">{quote.author}</p>
                    </div>
                  ))}
                </div>
              )}
              {step.type === 'music' && <StepMusicBlock step={step} template="minimal" />}
              {step.meta?.sideNote && (
                <p className="mt-6 text-white/30 text-xs uppercase tracking-[0.3em]">{step.meta.sideNote}</p>
              )}
            </motion.div>

            {step.type === 'gallery' && step.meta?.images ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex-1 w-full grid grid-cols-2 gap-3"
              >
                {step.meta.images.slice(0, 4).map((image: string, imageIndex: number) => (
                  <div key={imageIndex} className="aspect-[4/5] bg-white/5 p-2 rounded-sm">
                    <img src={image} alt={`${step.title} ${imageIndex + 1}`} className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
                  </div>
                ))}
              </motion.div>
            ) : step.mediaType !== 'none' && step.mediaUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex-1 w-full"
              >
                <div className="aspect-[4/5] bg-white/5 p-4 rounded-sm">
                  {step.mediaType === 'video' ? (
                    <video src={step.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
                  ) : (
                    <img src={step.mediaUrl} alt={step.title} className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {index < story.steps.length - 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
              <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
