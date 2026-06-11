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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden px-6"
      style={{
        background:
          'radial-gradient(circle at 50% 45%, rgba(212,175,55,0.16), transparent 32%), rgba(5, 5, 8, 0.72)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <div className="absolute inset-0 opacity-40">
        {[
          'left-[8%] top-[18%] h-[1px] w-[42%] rotate-[18deg]',
          'right-[10%] top-[24%] h-[1px] w-[35%] -rotate-[22deg]',
          'left-[18%] bottom-[26%] h-[1px] w-[48%] -rotate-[14deg]',
          'right-[16%] bottom-[18%] h-[1px] w-[34%] rotate-[28deg]',
          'left-1/2 top-[12%] h-[42%] w-[1px] rotate-[11deg]',
          'left-[34%] top-[36%] h-[34%] w-[1px] -rotate-[28deg]',
        ].map((className) => (
          <span
            key={className}
            className={`absolute ${className} bg-gradient-to-r from-transparent via-white/70 to-transparent shadow-[0_0_14px_rgba(255,255,255,0.24)]`}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative max-w-2xl text-center rounded-[8px] border border-white/18 bg-white/[0.07] px-8 py-7 shadow-2xl shadow-black/40"
        style={{
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.18), 0 22px 80px rgba(0,0,0,0.42)',
        }}
      >
        <div className="absolute inset-0 rounded-[8px] bg-gradient-to-br from-white/12 via-transparent to-[#D4AF37]/10" />
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.04em' }}
          animate={{ opacity: 1, letterSpacing: '0em' }}
          transition={{ delay: 0.12, duration: 0.35 }}
          className="relative text-[#D4AF37] font-serif text-xl md:text-3xl italic leading-relaxed"
        >
          {message}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
