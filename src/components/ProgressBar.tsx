import { motion } from 'motion/react';

interface ProgressBarProps {
  progress: number; // 0-100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-lg shadow-[#D4AF37]/50"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: progress / 100 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{ originX: 0 }}
    />
  );
}
