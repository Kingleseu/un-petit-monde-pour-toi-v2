import { motion } from 'motion/react';
import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface Props {
  onUnlock: () => void;
}

export function StepLock({ onUnlock }: Props) {
  const { content } = useContent();
  const [code, setCode] = useState('');
  const [isError, setIsError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleKeyPress = (num: number) => {
    if (code.length < 4 && !isUnlocked) {
      const newCode = code + num;
      setCode(newCode);

      if (newCode.length === 4) {
        if (!content.unlockCode || newCode === content.unlockCode) {
          setTimeout(() => {
            setIsUnlocked(true);
            setTimeout(onUnlock, 1500); // Wait for unlock animation
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
      className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center"
    >
      <div className="mb-8 p-4 rounded-full bg-white/5 border border-white/10 shadow-xl shadow-[#D4AF37]/10">
        {isUnlocked ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Unlock className="w-8 h-8 text-[#D4AF37]" />
          </motion.div>
        ) : (
          <Lock className="w-8 h-8 text-white/40" />
        )}
      </div>

      <h2 className="text-2xl md:text-3xl font-serif text-white mb-2 tracking-wide">Accès Sécurisé</h2>
      <p className="text-white/60 mb-8 text-sm md:text-base max-w-sm">
        À ouvrir seulement quand tu es posé(e), au calme. <br/>
        <span className="italic opacity-70">(Entre un code à 4 chiffres)</span>
      </p>

      {/* Dots */}
      <motion.div
        animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex gap-4 mb-12"
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              code.length > i
                ? isUnlocked ? 'bg-[#D4AF37] border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-white/40 border-white/40'
                : 'border-white/20 bg-transparent'
            }`}
          />
        ))}
      </motion.div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-x-8 gap-y-6 max-w-[280px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleKeyPress(num)}
            className="w-16 h-16 rounded-full text-xl font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center active:scale-95 border border-transparent hover:border-white/5"
          >
            {num}
          </button>
        ))}
        <div className="col-start-2">
          <button
            onClick={() => handleKeyPress(0)}
            className="w-16 h-16 rounded-full text-xl font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center active:scale-95 border border-transparent hover:border-white/5"
          >
            0
          </button>
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={handleDelete}
            className="text-xs tracking-widest font-medium text-white/40 hover:text-white/80 transition-colors active:scale-95 p-4 uppercase"
          >
            EFFACER
          </button>
        </div>
      </div>
    </motion.div>
  );
}
