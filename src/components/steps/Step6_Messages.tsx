import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Heart, Link, Terminal, Sticker, Shield } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useState, useEffect } from 'react';

interface Props {
  onNext: () => void;
}

function WordHeart({
  messages,
  defaultWords,
  templateId,
}: {
  messages: { text: string; author: string; word?: string }[];
  defaultWords: string[];
  templateId: string;
}) {
  const [hovered, setHovered] = useState<{ text: string; author: string } | null>(null);

  const wordsList = messages
    .filter(msg => msg.word && msg.word.trim().length > 0)
    .map(msg => ({ text: msg.word!.trim(), author: msg.author }));

  const fallbackWords = defaultWords
    .filter(word => word.trim().length > 0)
    .map(word => ({
      text: word.trim(),
      author: 'Mot par défaut',
    }));

  const maxWords = 28;
  let displayWords = [...wordsList];
  if (displayWords.length < maxWords) {
    const needed = maxWords - displayWords.length;
    for (let i = 0; i < needed && fallbackWords.length > 0; i++) {
      displayWords.push(fallbackWords[i % fallbackWords.length]);
    }
  } else if (displayWords.length > maxWords) {
    displayWords = displayWords.slice(0, maxWords);
  }

  const layers = [
    { count: 14, scale: 1.0, offset: 0, sizeClass: 'text-xs md:text-sm text-white/50 hover:text-white' },
    { count: 9, scale: 0.65, offset: Math.PI / 6, sizeClass: 'text-sm md:text-base text-white/70 hover:text-white' },
    { count: 4, scale: 0.38, offset: Math.PI / 4, sizeClass: 'text-base md:text-lg font-semibold text-white/90 hover:text-white' },
    { count: 1, scale: 0.0, offset: 0, sizeClass: 'text-xl md:text-2xl font-bold text-custom-accent' },
  ];

  let wordIndex = 0;
  const positionedWords = [];

  for (const layer of layers) {
    for (let i = 0; i < layer.count; i++) {
      if (wordIndex >= displayWords.length) break;
      const word = displayWords[wordIndex];

      let left = '50%';
      let top = '50%';
      if (layer.scale > 0) {
        const t = (i / layer.count) * 2 * Math.PI + layer.offset;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        left = `${50 + x * 2.2 * layer.scale}%`;
        top = `${50 + y * 2.2 * layer.scale - 5}%`;
      }

      positionedWords.push({
        ...word,
        left,
        top,
        sizeClass: layer.sizeClass,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
      });

      wordIndex++;
    }
  }

  // Get specific hovered box styles
  const getHoverBoxStyle = () => {
    switch (templateId) {
      case 'retro':
        return 'bg-black border border-[#00f0ff] px-4 sm:px-6 py-2 rounded-none text-xs font-mono text-[#00f0ff] shadow-[0_0_10px_#00f0ff]';
      case 'pastel':
        return 'bg-white border-2 border-[#ffccd5] px-4 sm:px-6 py-2 rounded-xl text-xs font-pastel text-pink-500 shadow-md shadow-pink-100/30';
      case 'minimal':
        return 'bg-[#121212] border border-white/20 px-4 sm:px-6 py-2 rounded-none text-xs font-minimal text-white';
      case 'romance':
      default:
        return 'bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 sm:px-6 py-2 rounded-full text-xs font-serif text-[#D4AF37]';
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-16 py-10 border-t border-white/5">
      <div className="text-center mb-8">
        <Heart className="w-5 h-5 text-custom-accent mx-auto mb-2 opacity-60" />
        <h3 className="text-xl md:text-2xl font-bold font-custom-title">
          {templateId === 'retro' ? "MÉTA-NUAGE" : templateId === 'pastel' ? "Le P'tit Cœur Magique" : "Le Cœur des Mots"}
        </h3>
        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold mt-1 font-custom-body">
          {templateId === 'retro' ? "PARAMÈTRES DE CARACTÈRE ENREGISTRÉS" : "Ce que tes proches disent de toi"}
        </p>
      </div>

      <div className={`relative w-full max-w-[min(420px,calc(100vw-3rem))] aspect-square flex items-center justify-center overflow-hidden mb-6 border rounded-full ${
        templateId === 'retro'
          ? 'bg-black/60 border-[#ff007f]/30 shadow-[0_0_15px_rgba(255,0,127,0.15)]'
          : templateId === 'pastel'
          ? 'bg-pink-50/20 border-[#ffccd5] rounded-[32px]'
          : templateId === 'minimal'
          ? 'bg-[#0a0a0a] border-white/10'
          : 'bg-white/[0.01] border-white/5 shadow-inner'
      }`}>
        <div className={`absolute w-56 h-56 rounded-full blur-3xl pointer-events-none ${
          templateId === 'retro' ? 'bg-[#ff007f]/5' : templateId === 'pastel' ? 'bg-pink-300/5' : 'bg-custom-accent/5'
        }`} />

        {positionedWords.map((word, idx) => (
          <motion.div
            key={`${word.text}-${idx}`}
            style={{
              position: 'absolute',
              left: word.left,
              top: word.top,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.02, duration: 0.6 }}
          >
            <motion.span
              className={`cursor-pointer transition-all duration-300 select-none px-2 py-0.5 rounded hover:bg-white/5 break-keep whitespace-nowrap block ${
                templateId === 'retro'
                  ? 'font-mono text-cyan-400 hover:text-[#00f0ff]'
                  : templateId === 'pastel'
                  ? 'font-pastel text-pink-400 hover:text-pink-600 font-semibold'
                  : templateId === 'minimal'
                  ? 'font-minimal text-white/50 hover:text-white font-light'
                  : `font-serif text-white/70 hover:text-white ${word.sizeClass}`
              }`}
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: word.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: word.delay,
              }}
              whileHover={{ scale: 1.15, zIndex: 10 }}
              onMouseEnter={() => setHovered({ text: word.text, author: word.author })}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered({ text: word.text, author: word.author })}
            >
              {word.text}
            </motion.span>
          </motion.div>
        ))}
      </div>

      <div className="h-16 flex items-center justify-center px-4 text-center">
        <AnimatePresence mode="wait">
          {hovered ? (
            <motion.div
              key={hovered.text}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={getHoverBoxStyle()}
            >
              <p className={templateId === 'pastel' ? 'font-semibold' : ''}>
                <span>"{hovered.text}"</span> - {hovered.author}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-xs text-white/60 italic tracking-wide font-custom-body"
            >
              {templateId === 'retro'
                ? "Sélectionnez un mot de donnée pour voir la source..."
                : templateId === 'pastel'
                ? "Touche un mot pour savoir qui l'a écrit ! 💕"
                : "Survolez ou touchez un mot pour voir son origine..."}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function StepMessages({ onNext }: Props) {
  const { content, dynamicMessages, refreshMessages } = useContent();
  const templateId = content.templateId || 'romance';

  useEffect(() => {
    refreshMessages();
    const interval = setInterval(() => {
      refreshMessages();
    }, 4000);
    return () => clearInterval(interval);
  }, [refreshMessages]);

  const allMessages = [...content.friendMessages, ...dynamicMessages];

  // Frame classes by theme
  const getCardStyle = (idx: number, borderCol: string) => {
    switch (templateId) {
      case 'retro':
        return {
          className: 'bg-black border border-[#ff007f]/40 font-mono text-cyan-400 retro-border-glow rounded-none',
          borderStyle: { border: `1px solid ${borderCol}` },
          tagColor: 'text-[#ff007f]'
        };
      case 'pastel':
        return {
          className: 'bg-white border-2 border-[#ffccd5] font-pastel text-pink-500 shadow-md shadow-pink-100/20 rounded-[20px]',
          borderStyle: { borderColor: '#ffccd5' },
          tagColor: 'text-pink-400 font-semibold font-pastel-accent'
        };
      case 'minimal':
        return {
          className: 'minimal-card minimal-border font-minimal text-white/90 rounded-xl',
          borderStyle: { borderColor: 'rgba(255,255,255,0.1)' },
          tagColor: 'text-white/60 font-semibold'
        };
      case 'romance':
      default:
        return {
          className: 'glass-gradient border border-white/10 text-white font-serif',
          borderStyle: { borderColor: `${borderCol}40` },
          tagColor: borderCol
        };
    }
  };

  return (
    <div className={`min-h-screen py-20 px-6 max-w-6xl mx-auto flex flex-col items-center ${
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
        <Heart className="w-6 h-6 text-custom-accent mx-auto mb-4 opacity-75 animate-pulse" />
        <h2 className="text-3xl md:text-5xl font-bold tracking-wide text-custom-title text-glow">
          {templateId === 'retro' 
            ? "MESSAGES DU GROUPE" 
            : templateId === 'pastel' 
            ? "Les p'tits mots des copains" 
            : "Quelques mots des autres"}
        </h2>
        <p className="text-white/60 font-light text-base md:text-lg mt-4 text-custom-body">
          {templateId === 'retro'
            ? "Enregistrements vocaux décryptés de l'équipage."
            : templateId === 'pastel'
            ? "Parce que tout le monde est d'accord pour dire que tu es géniale ! 🥰"
            : "Parce que je ne suis pas le seul à penser ça."}
        </p>
      </motion.div>

      {allMessages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/30 py-16"
        >
          {templateId === 'retro' ? (
            <Terminal className="w-8 h-8 mx-auto mb-4 opacity-50 text-cyan-400" />
          ) : templateId === 'pastel' ? (
            <Sticker className="w-8 h-8 mx-auto mb-4 opacity-50 text-pink-300" />
          ) : (
            <Link className="w-8 h-8 mx-auto mb-4 opacity-50" />
          )}
          <p className="text-sm italic">Les messages de tes proches apparaitront ici...</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-16">
          {allMessages.map((msg, idx) => {
            const colors = [
              { border: '#ff6b9d', bg: 'from-pink-500/10 to-pink-500/5' },
              { border: '#ffa500', bg: 'from-orange-500/10 to-orange-500/5' },
              { border: '#a78bfa', bg: 'from-purple-500/10 to-purple-500/5' },
              { border: '#38b6ff', bg: 'from-blue-500/10 to-blue-500/5' },
              { border: '#d4af37', bg: 'from-yellow-500/10 to-yellow-500/5' },
            ];
            const color = colors[idx % colors.length];
            const cardDesign = getCardStyle(idx, color.border);

            return (
              <motion.div
                key={`${msg.author}-${idx}`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.6, type: 'spring' }}
                whileHover={templateId === 'pastel' ? { y: -5 } : { scale: 1.03 }}
                className={`relative overflow-hidden group h-full flex flex-col justify-between ${cardDesign.className}`}
                style={templateId === 'romance' ? {
                  background: `linear-gradient(135deg, ${color.bg})`,
                  borderColor: `${color.border}40`,
                  borderWidth: '1px'
                } : undefined}
              >
                {/* Neon Shimmer Effect (only for romance) */}
                {templateId === 'romance' && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
                    animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{
                      background: `linear-gradient(45deg, ${color.border}80 0%, ${color.border}20 50%, ${color.border}80 100%)`,
                      backgroundSize: '200% 200%',
                    }}
                  />
                )}

                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div className="text-4xl opacity-20 font-serif leading-none" style={{ color: color.border }}>
                    "
                  </div>

                  <p className={`leading-relaxed text-base mb-4 break-words flex-1 ${
                    templateId === 'pastel' ? 'font-medium' : 'font-light italic'
                  }`}>
                    {msg.text}
                  </p>

                  <div
                    className="flex items-center justify-between pt-4 border-t"
                    style={cardDesign.borderStyle}
                  >
                    <div className="flex-1">
                      <p className={`text-xs uppercase tracking-widest ${cardDesign.tagColor}`}>
                        - {msg.author}
                      </p>
                    </div>
                    
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-lg text-[#ff6b9d] ml-2"
                    >
                      ♥
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Heart word cloud */}
      <WordHeart messages={allMessages} defaultWords={content.defaultWords || []} templateId={templateId} />

      {/* Next button */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
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
        <span className="font-medium">La dernière étape</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}
