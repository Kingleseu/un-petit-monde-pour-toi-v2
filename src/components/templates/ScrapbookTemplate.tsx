import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Story } from '../../types_v2';
import StepMusicBlock from './StepMusicBlock';

export default function ScrapbookTemplate({ story }: { story: Story }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());
  const containerRef = useRef(null);
  const hint = story.config?.scrapbookHint || 'Appuyez pour reveler';
  const stamp = story.config?.scrapbookStamp || 'SOUVENIRS';
  const cardBack = story.config?.scrapbookCardBack || 'Secret';

  const handleCardClick = (id: string, currentlyActive: boolean) => {
    if (!flippedIds.has(id)) {
      setFlippedIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      setActiveId(id);
      return;
    }

    setActiveId(currentlyActive ? null : id);
  };

  return (
    <div ref={containerRef} className="h-full w-full bg-[#f4ece3] relative overflow-hidden font-hand select-none cursor-crosshair">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }} />
      <div className="absolute text-9xl font-bold text-orange-900/5 rotate-[-10deg] top-20 -left-10 pointer-events-none scale-150">{stamp}</div>

      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-0 pointer-events-none w-full text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-stone-800 drop-shadow-sm rotate-2">
          {story.title}
        </h1>
        <p className="text-3xl text-stone-500 mt-2 -rotate-1">
          {hint} a {story.recipientName}...
        </p>
      </div>

      <div className="relative w-full h-full flex flex-wrap items-center justify-center pt-32 p-12 gap-8">
        {story.steps.map((step, idx) => {
          const isActive = activeId === step.id;
          const isFlipped = flippedIds.has(step.id);
          const rotation = (idx % 2 === 0 ? 1 : -1) * (8 + (idx * 7) % 10);
          const xOffset = ((idx * 37) % 100) - 50;
          const yOffset = ((idx * 23) % 50) - 25;

          return (
            <motion.div
              drag={isFlipped && !isActive}
              dragConstraints={containerRef}
              key={step.id}
              onClick={() => handleCardClick(step.id, isActive)}
              initial={{ scale: 0, rotate: rotation + 40, x: xOffset * 3, y: yOffset * 3, rotateY: 180 }}
              animate={{
                scale: isActive ? 1.4 : 1,
                rotate: isActive ? 0 : rotation,
                x: isActive ? 0 : xOffset,
                y: isActive ? 0 : yOffset,
                rotateY: isFlipped ? 0 : 180,
                zIndex: isActive ? 50 : (isFlipped ? idx + 20 : idx + 10)
              }}
              whileHover={{ scale: isActive ? 1.4 : 1.05, zIndex: 40 }}
              transition={{ type: 'spring', stiffness: 200, damping: isFlipped ? 20 : 15 }}
              className="relative cursor-grab active:cursor-grabbing preserve-3d"
              style={{ width: '280px', transformStyle: 'preserve-3d' }}
            >
              <div
                className="absolute inset-0 bg-[#e0d8c8] shadow-2xl border border-stone-300 backface-hidden flex items-center justify-center"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="w-16 h-16 opacity-20 rotate-45 border-4 border-stone-400 border-dashed rounded-full" />
                <div className="absolute top-4 w-32 h-8 bg-white/40 -rotate-[5deg] backdrop-blur-sm border border-stone-200" />
                <span className="absolute bottom-8 text-stone-400 uppercase tracking-[0.3em] text-[10px] font-sans">
                  {cardBack}
                </span>
              </div>

              <div
                className="bg-white p-4 pb-12 shadow-2xl border border-stone-200 backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="aspect-[4/5] bg-stone-100 overflow-hidden relative mb-4 pointer-events-none">
                  {step.mediaType === 'video' && step.mediaUrl ? (
                    <video src={step.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  ) : step.mediaType === 'image' && step.mediaUrl ? (
                    <img src={step.mediaUrl} alt={step.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-200 text-stone-400 p-6 text-center">
                      <span className="text-2xl">{step.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-yellow-500/10 mix-blend-multiply" />
                </div>

                {step.type === 'gallery' && step.meta?.images && (
                  <div className="absolute top-4 left-4 right-4 grid grid-cols-2 gap-2">
                    {step.meta.images.slice(0, 4).map((img: string, i: number) => (
                      <img key={i} src={img} className="w-full aspect-square object-cover rounded-sm shadow-sm opacity-90 rotate-[-2deg]" style={{ transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }} />
                    ))}
                  </div>
                )}

                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 rotate-[3deg] backdrop-blur-md shadow-sm border border-white/50" />

                <div className="text-center px-4 pointer-events-none">
                  <h3 className="font-bold text-stone-800 text-3xl mb-2 leading-none">{step.title}</h3>
                  {step.meta?.sticker && (
                    <p className="inline-block bg-yellow-100 px-2 py-1 rounded-sm text-xs uppercase tracking-widest text-stone-500 mb-2">
                      {step.meta.sticker}
                    </p>
                  )}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <p className="text-stone-700 text-xl leading-tight border-t border-dashed border-stone-300 pt-4 mt-2">
                          {step.content}
                        </p>

                        {step.type === 'music' && <StepMusicBlock step={step} template="scrapbook" />}

                        {step.type === 'words' && step.meta?.quotes && (
                          <div className="mt-4 space-y-3">
                            {step.meta.quotes.map((quote: any, i: number) => (
                              <div key={i} className="bg-yellow-100/50 p-2 rounded text-left">
                                <p className="text-sm italic text-stone-600">"{quote.text}"</p>
                                <p className="text-xs font-bold text-stone-500 mt-1">- {quote.author}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
