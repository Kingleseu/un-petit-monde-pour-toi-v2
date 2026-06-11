import { motion } from 'motion/react';

interface ChapterNavProps {
  currentStep: number;
}

export function ChapterNav({ currentStep }: ChapterNavProps) {
  const chapters = [
    { step: 0, icon: '🔒', title: 'Verrouillage' },
    { step: 1, icon: '📖', title: 'Introduction' },
    { step: 2, icon: '✨', title: 'La Capsule' },
    { step: 3, icon: '🖼️', title: 'Galerie' },
    { step: 4, icon: '🎵', title: 'Playlist' },
    { step: 5, icon: '💌', title: 'Lettre' },
    { step: 6, icon: '❤️', title: 'Messages' },
    { step: 7, icon: '🎁', title: 'Surprise' },
  ];

  // Hide nav on lock screen
  if (currentStep === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#050508] via-[#050508]/85 to-transparent py-4 sm:py-6 px-3 sm:px-4 pointer-events-none"
    >
      <div className="max-w-6xl mx-auto flex justify-start sm:justify-center gap-2 md:gap-4 pointer-events-auto overflow-x-auto pb-1 sm:flex-wrap">
        {chapters.map((chapter, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative"
            >
              <motion.div
                animate={{
                  boxShadow: isCurrent
                    ? ['0 0 20px rgba(212, 175, 55, 0.5)', '0 0 30px rgba(212, 175, 55, 0.8)']
                    : 'none',
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex shrink-0 items-center justify-center text-base sm:text-lg md:text-xl
                  transition-all duration-300 cursor-pointer
                  ${isCompleted
                    ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[#D4AF37]'
                    : isCurrent
                    ? 'bg-[#D4AF37]/30 border-2 border-[#D4AF37] text-[#D4AF37]'
                    : 'bg-white/5 border border-white/10 text-white/40'
                  }
                `}
              >
                {chapter.icon}
              </motion.div>

              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
              >
                <div className="bg-black/80 text-white/80 text-xs px-3 py-1 rounded-full border border-white/10">
                  {chapter.title}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
