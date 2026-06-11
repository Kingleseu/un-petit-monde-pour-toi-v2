import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Heart, Link } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useState, useEffect } from 'react';

interface Props {
  onNext: () => void;
}

function WordHeart({
  messages,
  defaultWords,
}: {
  messages: { text: string; author: string; word?: string }[];
  defaultWords: string[];
}) {
  const [hovered, setHovered] = useState<{ text: string; author: string } | null>(null);

  const wordsList = messages
    .filter(msg => msg.word && msg.word.trim().length > 0)
    .map(msg => ({ text: msg.word!.trim(), author: msg.author }));

  const fallbackWords = defaultWords
    .filter(word => word.trim().length > 0)
    .map(word => ({
      text: word.trim(),
      author: 'Mot par defaut',
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
    { count: 1, scale: 0.0, offset: 0, sizeClass: 'text-xl md:text-2xl font-bold text-[#D4AF37]' },
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

  return (
    <div className="w-full flex flex-col items-center mt-16 py-10 border-t border-white/5">
      <div className="text-center mb-8">
        <Heart className="w-5 h-5 text-[#D4AF37] mx-auto mb-2 opacity-60" />
        <h3 className="text-xl md:text-2xl font-serif text-white mb-2">Le Coeur des Mots</h3>
        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
          Ce que tes proches disent de toi
        </p>
      </div>

      <div className="relative w-full max-w-[min(420px,calc(100vw-3rem))] aspect-square bg-white/[0.01] border border-white/5 rounded-full flex items-center justify-center shadow-inner overflow-hidden mb-6">
        <div className="absolute w-56 h-56 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

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
              className={`cursor-pointer transition-all duration-300 select-none px-2 py-0.5 rounded hover:bg-white/5 break-keep whitespace-nowrap block ${word.sizeClass}`}
              animate={{ y: [0, -5, 0] }}
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
              className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 sm:px-6 py-2 rounded-full"
            >
              <p className="text-xs text-white/80">
                <span className="text-[#D4AF37] font-semibold">"{hovered.text}"</span> - {hovered.author}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-xs text-white/60 italic tracking-wide"
            >
              Survolez ou touchez un mot pour voir son origine...
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function StepMessages({ onNext }: Props) {
  const { content, dynamicMessages, refreshMessages } = useContent();

  useEffect(() => {
    refreshMessages();
    const interval = setInterval(() => {
      refreshMessages();
    }, 4000);
    return () => clearInterval(interval);
  }, [refreshMessages]);

  const allMessages = [...content.friendMessages, ...dynamicMessages];

  return (
    <div className="min-h-screen py-20 px-6 max-w-6xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <Heart className="w-6 h-6 text-[#D4AF37] mx-auto mb-4 opacity-75" />
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 tracking-wide">Quelques mots des autres</h2>
        <p className="text-white/60 font-light text-base md:text-lg">
          Parce que je ne suis pas le seul a penser ca.
        </p>
      </motion.div>

      {allMessages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/30 py-16"
        >
          <Link className="w-8 h-8 mx-auto mb-4 opacity-50" />
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

            return (
              <motion.div
                key={`${msg.author}-${idx}`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.6, type: 'spring' }}
                whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${color.border}40` }}
                className="relative overflow-hidden rounded-2xl group"
                style={{
                  background: `linear-gradient(135deg, ${color.bg})`,
                  border: `2px solid ${color.border}40`,
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                  animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    background: `linear-gradient(45deg, ${color.border}80 0%, ${color.border}20 50%, ${color.border}80 100%)`,
                    backgroundSize: '200% 200%',
                  }}
                />

                <motion.div
                  className="relative z-10 p-6 h-full flex flex-col justify-between"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: idx * 0.08 + 0.2 }}
                >
                  <motion.div
                    className="text-4xl opacity-20"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ color: color.border }}
                  >
                    "
                  </motion.div>

                  <p className="text-white/90 font-serif leading-relaxed text-base italic mb-4 break-words flex-1">
                    {msg.text}
                  </p>

                  <motion.div
                    className="flex items-center justify-between pt-4 border-t"
                    style={{ borderColor: `${color.border}40` }}
                  >
                    <div className="flex-1">
                      <p className="text-xs uppercase font-bold tracking-widest" style={{ color: color.border }}>
                        - {msg.author}
                      </p>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-lg text-[#D4AF37]"
                    >
                      ♥
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      )}

      <WordHeart messages={allMessages} defaultWords={content.defaultWords || []} />

      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="group flex items-center gap-3 px-5 sm:px-6 py-3 bg-white/10 border border-white/10 hover:bg-white/20 text-white rounded-full transition-colors mt-12 text-xs sm:text-sm uppercase tracking-widest"
      >
        <span className="font-medium">La derniere etape</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}
