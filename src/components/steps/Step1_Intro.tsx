import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface Props {
  onNext: () => void;
}

export function StepIntro({ onNext }: Props) {
  const { content } = useContent();
  const templateId = content.templateId || 'romance';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1 }}
      className={`flex flex-col items-center justify-center min-h-[80vh] px-6 text-center max-w-2xl mx-auto ${
        templateId === 'retro' 
          ? 'font-mono' 
          : templateId === 'pastel' 
          ? 'font-pastel-accent' 
          : templateId === 'minimal'
          ? 'font-minimal'
          : 'font-serif'
      }`}
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-sm uppercase tracking-[0.2em] text-custom-accent mb-8 font-custom-title italic font-semibold"
      >
        {templateId === 'retro' ? "INITIALISATION DE LA TRANSMISSION" : "Le commencement"}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1.5 }}
        className="text-3xl md:text-5xl text-white leading-relaxed mb-12 tracking-tight font-custom-title font-bold"
      >
        {content.introText1} <span className="italic text-custom-accent">{content.recipientName}.</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="space-y-6"
      >
        <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-lg mx-auto whitespace-pre-line font-custom-body">
          {content.introText2}
        </p>
        <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-lg mx-auto mb-12 whitespace-pre-line font-custom-body">
          {content.introText3}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className={`group relative inline-flex items-center gap-4 px-8 py-4 transition-all border rounded-full ${
            templateId === 'retro'
              ? 'bg-black text-[#00f0ff] border-[#00f0ff] hover:bg-[#00f0ff] hover:text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : templateId === 'pastel'
              ? 'bg-[#ffccd5] text-white border-white hover:bg-[#ffb7b2] shadow-sm font-semibold'
              : templateId === 'minimal'
              ? 'bg-white text-black border-white hover:bg-neutral-200 font-semibold'
              : 'bg-transparent border-custom-accent/30 text-custom-accent hover:bg-custom-accent/10'
          }`}
        >
          <span className="relative z-10 font-medium tracking-wide">
            {templateId === 'retro' 
              ? "LIRE LA SUITE" 
              : templateId === 'pastel' 
              ? "C'est parti ! 🚀" 
              : "Ouvrir le coffre"}
          </span>
          <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
