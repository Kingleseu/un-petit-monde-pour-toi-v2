import { motion } from 'motion/react';
import { ArrowRight, MailOpen, Terminal, Heart, CircleDot } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';

interface Props {
  onNext: () => void;
}

function TypewriterText({ text, delay, className }: { text: string; delay: number; className?: string }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (displayedText.length === text.length) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, 25);

    return () => clearTimeout(timer);
  }, [displayedText, text]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className={`text-lg md:text-xl leading-relaxed tracking-wide ${className}`}
    >
      {displayedText}
      {!isComplete && <span className="typewriter-cursor bg-custom-accent" />}
    </motion.p>
  );
}

export function StepLetter({ onNext }: Props) {
  const { content } = useContent();
  const [revealedCount, setRevealedCount] = useState(1);

  const templateId = content.templateId || 'romance';

  // Paper styling classes by theme
  const getContainerStyles = () => {
    switch (templateId) {
      case 'retro':
        return 'bg-black border border-[#ff007f] p-8 md:p-12 retro-border-glow';
      case 'pastel':
        return 'bg-white border-3 border-[#ffccd5] p-8 md:p-12 shadow-md rounded-[24px]';
      case 'minimal':
        return 'minimal-card minimal-border p-8 md:p-12 rounded-xl';
      case 'romance':
      default:
        return 'parchment-bg rounded-sm shadow-2xl p-8 md:p-12';
    }
  };

  const getTextColor = () => {
    switch (templateId) {
      case 'retro':
        return 'text-[#00f0ff] font-mono';
      case 'pastel':
        return 'text-pink-500 font-pastel';
      case 'minimal':
        return 'text-white/90 font-minimal font-light';
      case 'romance':
      default:
        return 'text-[#3d2817] font-serif italic';
    }
  };

  const getSignatureColor = () => {
    switch (templateId) {
      case 'retro':
        return 'text-[#ff007f] font-mono';
      case 'pastel':
        return 'text-pink-400 font-pastel-accent';
      case 'minimal':
        return 'text-white font-minimal font-semibold';
      case 'romance':
      default:
        return 'text-[#8b6f47] font-script';
    }
  };

  return (
    <div className={`min-h-screen py-20 px-6 max-w-2xl mx-auto flex flex-col items-center justify-center ${
      templateId === 'retro' 
        ? 'font-mono' 
        : templateId === 'pastel' 
        ? 'font-pastel-accent' 
        : templateId === 'minimal'
        ? 'font-minimal'
        : 'font-serif'
    }`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="mb-8"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-custom-accent"
        >
          {templateId === 'retro' ? (
            <Terminal className="w-8 h-8" />
          ) : templateId === 'pastel' ? (
            <Heart className="w-8 h-8 text-pink-400" />
          ) : templateId === 'minimal' ? (
            <CircleDot className="w-8 h-8" />
          ) : (
            <MailOpen className="w-8 h-8" />
          )}
        </motion.div>
      </motion.div>

      {/* Paper Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className={`w-full overflow-hidden relative ${getContainerStyles()}`}
      >
        {/* Paper texture overlay (only for romance) */}
        {templateId === 'romance' && (
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 /%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23noise)%22 fill=%22%23000%22 /%3E%3C/svg%3E")',
              backgroundSize: '200px 200px',
            }}
          />
        )}

        {/* Letter content */}
        <div className="relative space-y-6">
          {/* Signature line decoration */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ scaleX: [0, 1] }}
              transition={{ duration: 1.5, delay: 0.4 }}
              className={`w-32 h-0.5 ${
                templateId === 'retro' 
                  ? 'bg-[#ff007f]' 
                  : templateId === 'pastel' 
                  ? 'bg-[#ffccd5]' 
                  : templateId === 'minimal'
                  ? 'bg-white/20'
                  : 'bg-[#8b6f47]'
              }`}
            />
          </div>

          {content.letterParts.slice(0, revealedCount).map((text, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              className="space-y-4"
            >
              <TypewriterText text={text} delay={idx * 0.2 + 0.4} className={getTextColor()} />
            </motion.div>
          ))}

          {/* Signature area */}
          {revealedCount === content.letterParts.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-10 space-y-4 text-center"
            >
              <motion.div
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 1 }}
                className={`w-28 h-0.5 mx-auto ${
                  templateId === 'retro' 
                    ? 'bg-[#ff007f]' 
                    : templateId === 'pastel' 
                    ? 'bg-[#ffccd5]' 
                    : templateId === 'minimal'
                    ? 'bg-white/20'
                    : 'bg-[#8b6f47]'
                }`}
              />
              <p className={`text-2xl tracking-wider ${getSignatureColor()}`}>
                {templateId === 'retro' 
                  ? "// TRANSMISSION TERMINÉE //" 
                  : templateId === 'pastel' 
                  ? "Avec plein de p'tits cœurs ✨" 
                  : templateId === 'minimal'
                  ? "Sincèrement"
                  : "Avec tout mon amour"}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="h-20 flex justify-center items-center mt-8">
        {revealedCount < content.letterParts.length ? (
          <motion.button
            onClick={() => setRevealedCount((c) => c + 1)}
            className={`transition-colors uppercase tracking-[0.2em] text-xs font-bold pb-2 border-b-2 hover:text-white ${
              templateId === 'retro'
                ? 'text-[#00f0ff] border-[#00f0ff] hover:border-white'
                : templateId === 'pastel'
                ? 'text-pink-400 border-[#ffccd5] hover:text-pink-600'
                : templateId === 'minimal'
                ? 'text-white/50 border-white/10 hover:border-white'
                : 'text-custom-accent border-custom-accent/30 hover:border-custom-accent'
            }`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            {templateId === 'retro' ? "DÉCRYPTER LA LIGNE SUIVANTE..." : "Continuer la lecture..."}
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onNext}
            className={`group flex items-center gap-3 px-8 py-3 rounded-full transition-all border ${
              templateId === 'retro'
                ? 'bg-black text-[#00f0ff] border-[#00f0ff] hover:bg-[#00f0ff] hover:text-black shadow-[0_0_15px_#00f0ff] font-mono'
                : templateId === 'pastel'
                ? 'bg-[#ffccd5] text-white border-white hover:bg-[#ffb7b2] shadow-md font-semibold'
                : templateId === 'minimal'
                ? 'bg-white text-black border-white hover:bg-neutral-200'
                : 'bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:shadow-[#D4AF37]/20 text-sm uppercase tracking-widest'
            }`}
          >
            <span className="font-medium">Et ce n'est pas tout</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
