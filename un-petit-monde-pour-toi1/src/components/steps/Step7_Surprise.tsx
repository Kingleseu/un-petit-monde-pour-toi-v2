import { motion } from 'motion/react';
import { Gift } from 'lucide-react';
import { useState } from 'react';
import { useContent } from '../../context/ContentContext';

export function StepSurprise() {
  const { content } = useContent();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen py-20 px-6 max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="mb-12 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <motion.div 
          animate={!isOpen ? { y: [0, -10, 0] } : { scale: 1.2, rotate: 5, opacity: 0 }}
          transition={{ duration: 2, repeat: !isOpen ? Infinity : 0, ease: 'easeInOut' }}
          className={isOpen ? "pointer-events-none absolute" : ""}
        >
          <Gift className="w-16 h-16 text-[#D4AF37] mx-auto" />
          {!isOpen && (
            <p className="mt-6 text-[#D4AF37]/80 text-xs tracking-[0.2em] uppercase font-bold mb-12">
              Touche le cadeau
            </p>
          )}
        </motion.div>
      </motion.div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-[#050508] border border-white/10 p-10 md:p-14 rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
          {/* Confetti effect placeholder */}
          <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/30 via-white/5 to-transparent blur-xl" />
          
          <div className="relative z-10 border border-[#D4AF37]/20 bg-white/5 p-8 rounded-[1.5rem] backdrop-blur-sm">
            <h2 
              className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight tracking-wide whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: content.surpriseTitle }}
            >
            </h2>
            <p className="text-xl text-white/80 font-light mb-8 italic">
              {content.surpriseSubtitle}
            </p>
            <div className="w-16 h-[1px] bg-white/20 mx-auto mb-8" />
            <p className="text-white/40 text-xs uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
              {content.surpriseText}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
