import { motion } from 'motion/react';
import { useState } from 'react';
import { ArrowRight, Sparkles, Binary, Heart, Compass } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface Props {
  onNext: () => void;
}

export function StepCapsule({ onNext }: Props) {
  const { content } = useContent();
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const templateId = content.templateId || 'romance';

  const cardColors = [
    { glow: '#ff6b9d', icon: '✨', accent: 'from-pink-500/20 to-pink-500/5' },
    { glow: '#ffa500', icon: '📷', accent: 'from-orange-500/20 to-orange-500/5' },
    { glow: '#a78bfa', icon: '💎', accent: 'from-purple-500/20 to-purple-500/5' },
    { glow: '#38b6ff', icon: '🌟', accent: 'from-blue-500/20 to-blue-500/5' },
    { glow: '#d4af37', icon: '❤️', accent: 'from-yellow-500/20 to-yellow-500/5' },
  ];

  return (
    <div className={`min-h-screen py-20 px-6 max-w-5xl mx-auto flex flex-col items-center ${
      templateId === 'retro' 
        ? 'font-mono' 
        : templateId === 'pastel' 
        ? 'font-pastel-accent' 
        : templateId === 'minimal'
        ? 'font-minimal'
        : 'font-serif'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 mx-auto mb-4 text-custom-accent"
        >
          {templateId === 'retro' ? (
            <Binary className="w-full h-full" />
          ) : templateId === 'pastel' ? (
            <Heart className="w-full h-full text-pink-400" />
          ) : (
            <Compass className="w-full h-full" />
          )}
        </motion.div>
        
        <h2 className="text-3xl md:text-5xl font-bold tracking-wide text-glow text-custom-title">
          {templateId === 'retro' 
            ? "MODULE DE DONNÉES" 
            : templateId === 'pastel' 
            ? "Ce que j'adore chez toi" 
            : 'La Capsule "Toi"'}
        </h2>
        
        <p className="text-white/60 font-light text-lg max-w-xl mx-auto leading-relaxed mt-4 text-custom-body">
          {templateId === 'retro'
            ? "Analyse structurelle de ta personnalité. Cliquez pour décrypter."
            : templateId === 'pastel'
            ? "Voici quelques p'tites choses qui te rendent si incroyable ! 🥰"
            : "Ce que les gens remarquent, c'est ton sourire. Ce que moi je retiens, c'est tout le reste."}
        </p>
        <p className={`text-sm italic mt-4 ${templateId === 'pastel' ? 'text-pink-400' : 'text-white/40'}`}>
          (Cliquez sur les cartes pour les retourner)
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-20">
        {content.capsuleCards.map((card, idx) => {
          const isFlipped = flippedIndex === idx;
          const cardColor = cardColors[idx % cardColors.length];

          // Set specific borders & cards bg depending on templateId
          const frontBackStyles = () => {
            switch (templateId) {
              case 'retro':
                return {
                  front: {
                    background: 'rgba(5, 2, 15, 0.9)',
                    borderColor: isFlipped ? '#00f0ff' : '#ff007f',
                    boxShadow: '0 0 10px rgba(255, 0, 127, 0.3)',
                    color: '#ff007f'
                  },
                  back: {
                    background: 'rgba(12, 8, 22, 0.95)',
                    borderColor: '#00f0ff',
                    boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
                    transform: 'rotateY(180deg)',
                    color: '#00f0ff'
                  }
                };
              case 'pastel':
                return {
                  front: {
                    background: '#ffffff',
                    borderColor: '#ffccd5',
                    boxShadow: '4px 4px 0px #ffccd5',
                    color: '#ffb7b2',
                    borderRadius: '24px'
                  },
                  back: {
                    background: '#fff5f5',
                    borderColor: '#ffccd5',
                    boxShadow: '4px 4px 0px #ffccd5',
                    transform: 'rotateY(180deg)',
                    color: '#ff6b9d',
                    borderRadius: '24px'
                  }
                };
              case 'minimal':
                return {
                  front: {
                    background: 'rgba(10, 10, 10, 0.8)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    boxShadow: 'none',
                    color: '#ffffff'
                  },
                  back: {
                    background: '#121212',
                    borderColor: 'rgba(255,255,255,0.2)',
                    boxShadow: 'none',
                    transform: 'rotateY(180deg)',
                    color: '#ffffff'
                  }
                };
              case 'romance':
              default:
                return {
                  front: {
                    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, ${cardColor.glow}15 100%)`,
                    borderColor: `${cardColor.glow}40`,
                    boxShadow: `0 0 20px ${cardColor.glow}20, inset 0 0 20px ${cardColor.glow}10`,
                    color: cardColor.glow
                  },
                  back: {
                    background: `linear-gradient(135deg, ${cardColor.glow}25 0%, ${cardColor.glow}10 100%)`,
                    borderColor: `${cardColor.glow}50`,
                    boxShadow: `0 0 30px ${cardColor.glow}40, inset 0 0 20px ${cardColor.glow}20`,
                    transform: 'rotateY(180deg)',
                    color: '#ffffff'
                  }
                };
            }
          };

          const activeStyles = frontBackStyles();

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200 }}
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
                <div 
                  className={`absolute inset-0 backface-hidden p-6 flex flex-col items-center justify-center text-center border-2 transition-all ${
                    templateId === 'pastel' ? 'rounded-[24px]' : 'rounded-2xl'
                  }`}
                  style={activeStyles.front}
                >
                  <motion.div 
                    animate={templateId === 'retro' ? {} : { scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl mb-4"
                  >
                    {cardColor.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold tracking-wide font-custom-title">{card.title}</h3>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`text-xs uppercase tracking-[0.2em] mt-4 font-semibold ${
                      templateId === 'retro' ? 'text-[#00f0ff]' : 'text-custom-accent'
                    }`}
                  >
                    {templateId === 'retro' ? "[ LIRE LES DONNÉES ]" : "Cliquez pour révéler"}
                  </motion.div>
                </div>

                {/* Back */}
                <div 
                  className={`absolute inset-0 backface-hidden p-8 flex items-center justify-center text-center border-2 ${
                    templateId === 'pastel' ? 'rounded-[24px]' : 'rounded-2xl'
                  }`}
                  style={activeStyles.back}
                >
                  <p className={`leading-relaxed text-base font-custom-body ${
                    templateId === 'pastel' ? 'font-medium' : 'font-light italic'
                  }`}>
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
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onNext}
        className={`group flex items-center gap-3 px-6 py-3 rounded-full transition-all border ${
          templateId === 'retro'
            ? 'bg-black text-[#00f0ff] border-[#00f0ff] hover:bg-[#00f0ff] hover:text-black shadow-[0_0_15px_#00f0ff] font-mono'
            : templateId === 'pastel'
            ? 'bg-[#ffccd5] text-white border-white hover:bg-[#ffb7b2] shadow-md font-semibold'
            : templateId === 'minimal'
            ? 'bg-white text-black border-white hover:bg-neutral-200'
            : 'bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:shadow-[#D4AF37]/20 text-sm uppercase tracking-widest'
        }`}
      >
        <span className="font-medium">Continuer l'exploration</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}
