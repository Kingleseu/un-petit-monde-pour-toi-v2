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

  const allFlipped = flippedIndex !== null; // Just for checking interaction

  return (
    <div className="min-h-screen py-20 px-6 max-w-5xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <Sparkles className="w-6 h-6 text-[#D4AF37] mx-auto mb-4 opacity-75" />
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 tracking-wide">La Capsule "Toi"</h2>
        <p className="text-white/60 font-light text-lg max-w-xl mx-auto">
          Ce que les gens remarquent, c'est ton sourire. Ce que moi je retiens, c'est tout le reste. <br className="hidden md:block"/>
          <span className="italic text-sm opacity-80 mt-2 inline-block">(Clique sur les cartes pour les révéler)</span>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-20 perspective-1000">
        {content.capsuleCards.map((card, idx) => {
          const isFlipped = flippedIndex === idx;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative w-full h-[240px] cursor-pointer group [perspective:1000px] ${idx === 4 ? 'lg:col-start-2' : ''}`}
              onClick={() => setFlippedIndex(isFlipped ? null : idx)}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                className="w-full h-full relative preserve-3d"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:border-[#D4AF37]/40 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] mb-4 opacity-50 relative top-0" />
                  <h3 className="font-serif text-xl text-white tracking-wide">{card.title}</h3>
                </div>
                {/* Back */}
                <div 
                  className="absolute inset-0 backface-hidden bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-6 flex items-center justify-center text-center shadow-lg"
                  style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                >
                  <p className="font-light text-white/90 leading-relaxed text-sm md:text-base italic">
                    {card.content}
                  </p>
                </div>
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
        className="group flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm uppercase tracking-widest"
      >
        <span className="font-medium">Continuer l'exploration</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}
