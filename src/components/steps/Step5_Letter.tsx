import { motion } from 'motion/react';
import { ArrowRight, MailOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';

interface Props {
  onNext: () => void;
}

function TypewriterText({ text, delay }: { text: string; delay: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (displayedText.length === text.length) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, 30);

    return () => clearTimeout(timer);
  }, [displayedText, text]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="text-lg md:text-xl font-serif leading-relaxed text-[#3d2817] italic tracking-wide"
    >
      {displayedText}
      {!isComplete && <span className="typewriter-cursor" />}
    </motion.p>
  );
}

export function StepLetter({ onNext }: Props) {
  const { content } = useContent();
  const [revealedCount, setRevealedCount] = useState(1);

  return (
    <div className="min-h-screen py-20 px-6 max-w-2xl mx-auto flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="mb-12"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <MailOpen className="w-8 h-8 text-[#D4AF37]" />
        </motion.div>
      </motion.div>

      {/* Parchment Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-full parchment-bg rounded-sm shadow-2xl overflow-hidden relative"
      >
        {/* Paper texture overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 /%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23noise)%22 fill=%22%23000%22 /%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
          }}
        />

        {/* Letter content */}
        <div className="relative p-12 md:p-16 space-y-8 mb-16">
          {/* Signature line decoration */}
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{ scaleX: [0, 1] }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#8b6f47] to-transparent"
            />
          </div>

          {content.letterParts.slice(0, revealedCount).map((text, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.3, duration: 0.5 }}
              className="space-y-4"
            >
              <TypewriterText text={text} delay={idx * 0.3 + 0.5} />
            </motion.div>
          ))}

          {/* Signature area */}
          {revealedCount === content.letterParts.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-12 space-y-4 text-center"
            >
              <motion.div
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 1 }}
                className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#8b6f47] to-transparent mx-auto"
              />
              <p className="font-script text-2xl text-[#8b6f47] tracking-wider">Avec tout mon amour</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="h-20 flex justify-center items-center mt-12">
        {revealedCount < content.letterParts.length ? (
          <motion.button
            onClick={() => setRevealedCount((c) => c + 1)}
            className="text-[#D4AF37] hover:text-[#fdeea0] transition-colors uppercase tracking-[0.2em] text-xs font-bold pb-2 border-b-2 border-[#D4AF37] hover:border-[#fdeea0]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Continuer la lecture...
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#D4AF37]/30 to-[#D4AF37]/10 border-2 border-[#D4AF37] text-[#D4AF37] rounded-full transition-all hover:shadow-lg hover:shadow-[#D4AF37]/20 font-serif uppercase text-sm tracking-widest"
          >
            <span className="font-medium">Et ce n'est pas tout</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
