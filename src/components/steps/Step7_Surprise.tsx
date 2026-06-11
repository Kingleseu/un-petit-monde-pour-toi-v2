import { motion } from 'motion/react';
import { Gift, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { Confetti } from '../Confetti';

export function StepSurprise() {
  const { content } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [daysAgo, setDaysAgo] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
    }
  }, [isOpen]);

  // Calculate days since birthday
  useEffect(() => {
    const today = new Date();
    const lastBirthday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const days = Math.floor((today.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24));
    setDaysAgo(days);
  }, []);

  return (
    <div className="min-h-screen py-20 px-6 max-w-2xl mx-auto flex flex-col items-center justify-center text-center relative">
      {showConfetti && <Confetti />}

      {/* Envelope/Gift Animation */}
      {!isOpen ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateX: -30 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="mb-12 cursor-pointer perspective"
          onClick={() => setIsOpen(true)}
        >
          {/* Envelope */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-32 h-20 mb-8"
          >
            {/* Envelope body */}
            <div className="absolute inset-0 bg-white rounded-sm shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-100" />
              
              {/* Envelope flap */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1/2 bg-white/80 border-b border-gray-200 origin-top"
                animate={{ rotateX: isOpen ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Letter peeking out */}
                {isOpen && (
                  <motion.div
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -60, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-24 bg-yellow-50 rounded-sm shadow-xl"
                  />
                )}
              </motion.div>
              
              {/* Envelope body */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white border-t border-gray-200">
                <motion.div
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gray-300"
                  animate={{ scaleX: isOpen ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Seal */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8902e] shadow-lg flex items-center justify-center"
              animate={{ scale: isOpen ? 0.1 : 1, opacity: isOpen ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Gift className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>

          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[#D4AF37] text-xs tracking-[0.2em] uppercase font-serif italic"
          >
            Cliquez pour ouvrir
          </motion.p>
        </motion.div>
      ) : null}

      {/* Content revealed */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="w-full space-y-10"
        >
          {/* Title section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#D4AF37]/20 via-transparent to-[#D4AF37]/10 blur-2xl" />
            
            <div className="bg-gradient-to-b from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-2xl p-6 md:p-12 backdrop-blur-sm">
              <motion.h2 
                className="text-3xl sm:text-4xl md:text-6xl font-serif text-[#D4AF37] mb-6 leading-tight tracking-wide break-words"
                dangerouslySetInnerHTML={{ __html: content.surpriseTitle }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <p className="text-xl md:text-2xl text-white/80 font-serif italic mb-4">
                {content.surpriseSubtitle}
              </p>
              
              <motion.div
                className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-6"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <p className="text-white/70 text-base font-light max-w-2xl mx-auto leading-relaxed">
                {content.surpriseText}
              </p>
            </div>
          </motion.div>

          {/* Bookmark section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="pt-8 space-y-6"
          >
            <div className="flex items-center justify-center gap-4 text-white/60">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-white/20" />
              <Bookmark className="w-5 h-5 text-[#D4AF37]" />
              <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-white/20" />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="glass-gradient rounded-2xl p-6 text-center"
            >
              <p className="text-sm text-white/70 mb-2 font-serif">
                <span className="text-[#D4AF37] font-semibold">Astuce spéciale:</span>
              </p>
              <p className="text-white/60 italic text-sm">
                Marquez cette page dans vos favoris. Tu pourras revenir ici quand tu voudras te rappeler que tu comptes vraiment.
              </p>
            </motion.div>
          </motion.div>

          {/* Birthday counter */}
          {daysAgo > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-white/50 text-xs uppercase tracking-[0.2em] font-serif"
            >
              Il y a {daysAgo} jour{daysAgo > 1 ? 's' : ''}, on célébrait ta journée spéciale
            </motion.p>
          )}
        </motion.div>
      )}
    </div>
  );
}
