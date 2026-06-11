import { motion } from 'motion/react';
import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface Props {
  onUnlock: () => void;
}

export function StepLock({ onUnlock }: Props) {
  const { content, setAudioPlaying } = useContent();
  const [code, setCode] = useState('');
  const [isError, setIsError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const startMusic = () => {
    setAudioPlaying(true);
  };

  const handleKeyPress = (num: number) => {
    startMusic();

    if (code.length < 4 && !isUnlocked) {
      const newCode = code + num;
      setCode(newCode);

      if (newCode.length === 4) {
        if (!content.unlockCode || newCode === content.unlockCode) {
          setTimeout(() => {
            setIsUnlocked(true);
            setTimeout(onUnlock, 1500);
          }, 600);
        } else {
          setIsError(true);
          setTimeout(() => {
            setCode('');
            setIsError(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    startMusic();

    if (code.length > 0 && !isUnlocked) {
      setCode(code.slice(0, -1));
      setIsError(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex min-h-screen flex-col items-center justify-center px-5 py-10 text-center"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="mb-6 rounded-full border border-white/10 bg-white/5 p-4 shadow-xl shadow-[#D4AF37]/10 animate-gold-glow"
      >
        {isUnlocked ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Unlock className="h-8 w-8 text-[#D4AF37]" />
          </motion.div>
        ) : (
          <Lock className="h-8 w-8 text-white/40" />
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.7 }}
        className="mb-3 text-xs uppercase tracking-[0.22em] text-[#D4AF37] font-serif italic"
      >
        Bienvenue {content.recipientName || 'a toi'}
      </motion.p>

      <h2 className="mb-2 text-2xl md:text-3xl font-serif text-white tracking-wide">
        Acces securise
      </h2>
      <p className="mb-7 max-w-sm text-sm md:text-base text-white/60 leading-relaxed">
        Ce petit monde a ete prepare pour toi. Pose-toi au calme, puis entre le code pour commencer.
        <br />
        <span className="italic opacity-70">(Entre un code a 4 chiffres)</span>
      </p>

      <motion.div
        animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="mb-8 sm:mb-12 flex gap-3 sm:gap-4"
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`h-4 w-4 rounded-full border-2 transition-all duration-300 ${
              code.length > i
                ? isUnlocked
                  ? 'bg-[#D4AF37] border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]'
                  : 'bg-white/40 border-white/40'
                : 'border-white/20 bg-transparent'
            }`}
          />
        ))}
      </motion.div>

      <div className="grid max-w-[260px] sm:max-w-[280px] grid-cols-3 gap-x-5 gap-y-4 sm:gap-x-8 sm:gap-y-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleKeyPress(num)}
            className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-transparent text-lg sm:text-xl font-medium text-white/80 transition-colors hover:border-white/5"
          >
            {num}
          </motion.button>
        ))}

        <div className="col-start-2">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleKeyPress(0)}
            className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-transparent text-lg sm:text-xl font-medium text-white/80 transition-colors hover:border-white/5"
          >
            0
          </motion.button>
        </div>

        <div className="flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="p-4 text-xs uppercase tracking-widest text-white/40 transition-colors hover:text-white/80"
          >
            Effacer
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
