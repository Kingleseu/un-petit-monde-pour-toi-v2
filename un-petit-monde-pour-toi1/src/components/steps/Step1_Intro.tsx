import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface Props {
  onNext: () => void;
}

export function StepIntro({ onNext }: Props) {
  const { content } = useContent();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center max-w-2xl mx-auto"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-sm uppercase tracking-[0.2em] text-[#D4AF37] mb-8 font-serif italic"
      >
        Le commencement
      </motion.p>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="text-3xl md:text-5xl font-serif text-white leading-relaxed mb-12 tracking-tight"
      >
        {content.introText1} <span className="italic text-[#D4AF37]">{content.recipientName}.</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="space-y-6"
      >
        <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-lg mx-auto whitespace-pre-line">
          {content.introText2}
        </p>
        <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-lg mx-auto mb-12 whitespace-pre-line">
          {content.introText3}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="group relative inline-flex items-center gap-4 px-8 py-4 bg-transparent border border-[#D4AF37]/30 text-[#D4AF37] rounded-full overflow-hidden transition-colors hover:bg-[#D4AF37]/10"
        >
          <span className="relative z-10 font-medium tracking-wide">Ouvrir le coffre</span>
          <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
