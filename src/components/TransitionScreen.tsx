import { motion } from 'motion/react';

interface TransitionScreenProps {
  isVisible: boolean;
  message: string;
}

export function TransitionScreen({ isVisible, message }: TransitionScreenProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden px-6"
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
