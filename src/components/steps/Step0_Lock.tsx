import { motion } from 'motion/react';
import { useState } from 'react';
import { Lock, Unlock, KeyRound, Sparkles } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface Props {
  onUnlock: () => void;
}

export function StepLock({ onUnlock }: Props) {
  const { content, setAudioPlaying } = useContent();
  const [code, setCode] = useState('');
  const [isError, setIsError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const templateId = content.templateId || 'romance';

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
      className={`flex min-h-screen flex-col items-center justify-center px-5 py-10 text-center ${
        templateId === 'retro' 
          ? 'font-mono' 
          : templateId === 'pastel' 
          ? 'font-pastel-accent' 
          : templateId === 'minimal'
          ? 'font-minimal'
          : 'font-serif'
      }`}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className={`mb-6 rounded-full border p-4 shadow-xl ${
          templateId === 'retro'
            ? 'border-[#ff007f] bg-black text-[#ff007f] retro-border-glow'
            : templateId === 'pastel'
            ? 'border-[#ffccd5] bg-[#fff5f5] text-pink-400 rounded-2xl shadow-pink-200/50'
            : templateId === 'minimal'
            ? 'border-white/10 bg-neutral-900/60 text-white'
            : 'border-white/10 bg-white/5 shadow-[#D4AF37]/10 animate-gold-glow'
        }`}
      >
        {isUnlocked ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            {templateId === 'retro' ? (
              <KeyRound className="h-8 w-8 text-[#00f0ff]" />
            ) : templateId === 'pastel' ? (
              <Sparkles className="h-8 w-8 text-pink-400" />
            ) : (
              <Unlock className="h-8 w-8 text-custom-accent" />
            )}
          </motion.div>
        ) : (
          <Lock className={`h-8 w-8 ${templateId === 'pastel' ? 'text-pink-300' : 'text-white/40'}`} />
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.7 }}
        className="mb-3 text-xs uppercase tracking-[0.22em] text-custom-accent font-custom-title italic font-semibold"
      >
        Bienvenue {content.recipientName || 'à toi'}
      </motion.p>

      <h2 className="mb-2 text-2xl md:text-3xl text-white tracking-wide font-custom-title font-bold">
        {templateId === 'retro' 
          ? "ACCÈS SYSTÈME SÉCURISÉ" 
          : templateId === 'pastel' 
          ? "Un p'tit secret à déverrouiller" 
          : "Accès sécurisé"}
      </h2>
      
      <p className="mb-7 max-w-sm text-sm md:text-base text-white/60 leading-relaxed font-custom-body">
        {templateId === 'retro'
          ? "Ce terminal contient une transmission privée. Saisissez la clé d'accès."
          : templateId === 'pastel'
          ? "Coucou ! Entre le p'tit code pour ouvrir ton cadeau surprise ! 🎁"
          : "Ce petit monde a été préparé pour toi. Pose-toi au calme, puis entre le code pour commencer."}
        <br />
        <span className="italic opacity-70 text-xs">
          {content.unlockCode ? "(Entre le code à 4 chiffres)" : "(Tout code à 4 chiffres fonctionnera)"}
        </span>
      </p>

      {/* Code Dots */}
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
                  ? 'bg-custom-accent border-custom-accent shadow-[0_0_12px_var(--color-accent)]'
                  : templateId === 'retro'
                  ? 'bg-[#ff007f] border-[#ff007f] shadow-[0_0_8px_#ff007f]'
                  : templateId === 'pastel'
                  ? 'bg-pink-400 border-pink-400'
                  : 'bg-white/40 border-white/40'
                : templateId === 'retro'
                ? 'border-[#00f0ff]/30 bg-transparent'
                : templateId === 'pastel'
                ? 'border-[#ffccd5] bg-transparent'
                : 'border-white/20 bg-transparent'
            }`}
          />
        ))}
      </motion.div>

      {/* Clavier */}
      <div className="grid max-w-[260px] sm:max-w-[280px] grid-cols-3 gap-x-5 gap-y-4 sm:gap-x-8 sm:gap-y-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.06)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleKeyPress(num)}
            className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-transparent text-lg sm:text-xl font-medium transition-all ${
              templateId === 'retro'
                ? 'text-[#00f0ff] hover:border-[#00f0ff]/40 hover:text-white shadow-[inset_0_0_5px_rgba(0,240,255,0.1)]'
                : templateId === 'pastel'
                ? 'text-pink-500 bg-white border-[#ffccd5] hover:bg-[#fff5f5] shadow-sm'
                : 'text-white/80 hover:border-white/5'
            }`}
          >
            {num}
          </motion.button>
        ))}

        <div className="col-start-2">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.06)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleKeyPress(0)}
            className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-transparent text-lg sm:text-xl font-medium transition-all ${
              templateId === 'retro'
                ? 'text-[#00f0ff] hover:border-[#00f0ff]/40 hover:text-white shadow-[inset_0_0_5px_rgba(0,240,255,0.1)]'
                : templateId === 'pastel'
                ? 'text-pink-500 bg-white border-[#ffccd5] hover:bg-[#fff5f5] shadow-sm'
                : 'text-white/80 hover:border-white/5'
            }`}
          >
            0
          </motion.button>
        </div>

        <div className="flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className={`p-2 text-xs uppercase tracking-widest transition-colors ${
              templateId === 'retro'
                ? 'text-[#ff007f] hover:text-white'
                : templateId === 'pastel'
                ? 'text-pink-400 hover:text-pink-600'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            Effacer
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
