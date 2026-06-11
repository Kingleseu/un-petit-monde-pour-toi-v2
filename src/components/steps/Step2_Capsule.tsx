import { motion } from 'motion/react';
import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface Props {
  onNext: () => void;
}

export function StepCapsule({ onNext }: Props) {
  const { content } = useContent();
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const cardColors = [
    { glow: '#ff6b9d', icon: '✨', accent: 'from-pink-500/20 to-pink-500/5' },
    { glow: '#ffa500', icon: '📷', accent: 'from-orange-500/20 to-orange-500/5' },
    { glow: '#a78bfa', icon: '💎', accent: 'from-purple-500/20 to-purple-500/5' },
    { glow: '#38b6ff', icon: '🌟', accent: 'from-blue-500/20 to-blue-500/5' },
    { glow: '#d4af37', icon: '❤️', accent: 'from-yellow-500/20 to-yellow-500/5' },
  ];

  return (
    <div className="min-h-screen py-20 px-6 max-w-5xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 text-[#D4AF37] mx-auto mb-4"
        >
          <Sparkles className="w-full h-full" />
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 tracking-wide text-glow">La Capsule "Toi"</h2>
        <p className="text-white/60 font-light text-lg max-w-xl mx-auto leading-relaxed">
          Ce que les gens remarquent, c'est ton sourire. <br className="hidden md:block"/>
          Ce que moi je retiens, c'est tout le reste.
        </p>
        <p className="text-sm text-white/40 italic mt-4">(Clique sur les cartes pour les révéler)</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-20">
        {content.capsuleCards.map((card, idx) => {
          const isFlipped = flippedIndex === idx;
          const cardColor = cardColors[idx % cardColors.length];

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.12, type: 'spring', stiffness: 200 }}
              className={`relative w-full h-[280px] cursor-pointer [perspective:1000px] group`}
              onClick={() => setFlippedIndex(isFlipped ? null : idx)}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                className="w-full h-full relative preserve-3d"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <motion.div 
                  className="absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col items-center justify-center text-center border-2 transition-all"
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, ${cardColor.glow}15 100%)`,
                    borderColor: `${cardColor.glow}40`,
                    boxShadow: `0 0 20px ${cardColor.glow}20, inset 0 0 20px ${cardColor.glow}10`,
                  }}
                  whileHover={{
                    boxShadow: `0 0 40px ${cardColor.glow}40, inset 0 0 30px ${cardColor.glow}20`,
                  }}
                >
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl mb-4"
                  >
                    {cardColor.icon}
                  </motion.div>
                  <h3 className="font-serif text-xl text-white tracking-wide">{card.title}</h3>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xs text-white/40 uppercase tracking-[0.2em] mt-4 font-serif italic"
                  >
                    Cliquez pour révéler
                  </motion.div>
                </motion.div>

                {/* Back */}
                <motion.div 
                  className="absolute inset-0 backface-hidden rounded-2xl p-8 flex items-center justify-center text-center border-2"
                  style={{
                    background: `linear-gradient(135deg, ${cardColor.glow}25 0%, ${cardColor.glow}10 100%)`,
                    borderColor: `${cardColor.glow}50`,
                    boxShadow: `0 0 30px ${cardColor.glow}40, inset 0 0 20px ${cardColor.glow}20`,
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <p className="font-light text-white/95 leading-relaxed text-base italic">
                    {card.content}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] rounded-full transition-all hover:shadow-lg hover:shadow-[#D4AF37]/20 text-sm uppercase tracking-widest"
      >
        <span className="font-medium">Continuer l'exploration</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}
