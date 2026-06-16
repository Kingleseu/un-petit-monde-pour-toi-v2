import { motion } from 'motion/react';
import { useContent } from '../context/ContentContext';

interface TransitionScreenProps {
  isVisible: boolean;
  message: string;
}

export function TransitionScreen({ isVisible, message }: TransitionScreenProps) {
  const { content } = useContent();
  const transitionType = content.transitionType || 'fade';
  const templateId = content.templateId || 'romance';

  if (!isVisible) return null;

  // Render transitions depending on transitionType
  switch (transitionType) {
    case 'glitch':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0816] crt-overlay font-mono text-cyan-400 p-6"
        >
          {/* Glitching matrix background */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #ff007f, #ff007f 1px, transparent 1px, transparent 2px)',
            backgroundSize: '100% 4px'
          }} />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="border-2 border-[#ff007f] bg-black/90 p-8 rounded-none max-w-xl text-center shadow-[0_0_20px_rgba(255,0,127,0.5)]"
          >
            <div className="text-[#ff007f] text-xs uppercase tracking-[0.3em] mb-4">
              [ TRANSMISSION EN COURS ]
            </div>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-widest text-[#00f0ff] animate-glitch">
              {message}
            </p>
            <div className="mt-6 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 bg-[#00f0ff]"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      );

    case 'bubble':
      // Generate some bubble elements for background
      const bubbles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 40 + 20,
        delay: Math.random() * 0.4,
        duration: Math.random() * 1.5 + 0.8,
      }));

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#ffeef2] overflow-hidden p-6 font-pastel-accent text-pink-500"
        >
          {/* Floating colorful bubbles curtain */}
          {bubbles.map((b) => (
            <motion.div
              key={b.id}
              initial={{ y: '100vh', scale: 0.8 }}
              animate={{ y: '-10vh', scale: [0.8, 1.2, 0.9] }}
              transition={{ duration: b.duration, repeat: Infinity, delay: b.delay, ease: 'easeOut' }}
              className="absolute rounded-full border border-[#ffccd5]"
              style={{
                left: b.left,
                width: b.size,
                height: b.size,
                backgroundColor: 'rgba(255, 183, 178, 0.2)',
              }}
            />
          ))}
          
          <motion.div
            initial={{ scale: 0.7, rotate: -2, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 1.2, rotate: 2, opacity: 0 }}
            className="pastel-paper bg-white p-8 max-w-md text-center rounded-2xl relative z-10"
          >
            <div className="text-4xl mb-4">🎀</div>
            <p className="text-xl md:text-2xl font-bold text-pink-400">
              {message}
            </p>
          </motion.div>
        </motion.div>
      );

    case 'slide':
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden font-minimal text-white">
          {/* Top Panel */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-x-0 top-0 h-1/2 bg-[#0d0d0d] border-b border-white/10"
          />
          {/* Bottom Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0d0d0d]"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="relative z-10 text-center max-w-xl p-8"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/40 mb-3">CHAPITRE SUIVANT</p>
            <p className="text-xl md:text-3xl font-light tracking-wide text-white">
              {message}
            </p>
            <div className="mt-6 w-12 h-px bg-white/20 mx-auto" />
          </motion.div>
        </div>
      );

    case 'fade':
    default:
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-6"
          style={{
            background:
              'radial-gradient(circle at 50% 42%, rgba(212,175,55,0.22), transparent 30%), linear-gradient(180deg, rgba(5,5,8,0.86), rgba(5,5,8,0.74))',
            backdropFilter: 'blur(12px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1.08 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="absolute h-56 w-56 rounded-full bg-[#D4AF37]/12 blur-3xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative max-w-2xl text-center rounded-[8px] border border-[#D4AF37]/25 bg-[#050508]/45 px-7 py-6 md:px-10 md:py-8 shadow-2xl shadow-black/35"
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent" />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="relative text-[#D4AF37] font-serif text-xl md:text-3xl italic leading-relaxed"
            >
              {message}
            </motion.p>
          </motion.div>
        </motion.div>
      );
  }
}
