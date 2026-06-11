import { motion } from 'motion/react';
import { ArrowRight, MailOpen } from 'lucide-react';
import { useState } from 'react';
import { useContent } from '../../context/ContentContext';

interface Props {
  onNext: () => void;
}

export function StepLetter({ onNext }: Props) {
  const { content } = useContent();
  const [revealedCount, setRevealedCount] = useState(1);

  return (
    <div className="min-h-screen py-20 px-6 max-w-2xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12"
      >
        <MailOpen className="w-8 h-8 text-white/40 mx-auto" />
      </motion.div>

      <div className="w-full space-y-8 mb-16">
        {content.letterParts.slice(0, revealedCount).map((text, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="text-lg md:text-xl font-serif leading-loose text-white/80 text-center italic tracking-wide"
          >
            {text}
          </motion.p>
        ))}
      </div>

      <div className="h-20 flex justify-center items-center">
        {revealedCount < content.letterParts.length ? (
          <motion.button
            onClick={() => setRevealedCount((c) => c + 1)}
            className="text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors uppercase tracking-[0.2em] text-[10px] font-bold pb-1 border-b border-[#D4AF37]/30 hover:border-[#D4AF37]/80"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Continuer la lecture
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="group flex items-center gap-3 px-8 py-3 bg-[#D4AF37] text-[#050508] rounded-full transition-colors font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-[#D4AF37]/20"
          >
            <span className="font-medium">Et ce n'est pas tout</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
