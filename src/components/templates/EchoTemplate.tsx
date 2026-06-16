import { useRef, useState, type PointerEvent } from 'react';
import { motion } from 'motion/react';
import { MousePointer2 } from 'lucide-react';
import { Story } from '../../types_v2';
import StepMusicBlock from './StepMusicBlock';

export default function EchoTemplate({ story }: { story: Story }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [hasMoved, setHasMoved] = useState(false);
  const radius = Math.max(120, Number(story.config?.echoRadius || 250));
  const glowRadius = radius + 50;
  const instruction = story.config?.echoInstruction || "Explorez l'obscurite";
  const introLabel = story.config?.echoIntroLabel || 'Un echo du passe';

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!hasMoved) setHasMoved(true);
    setMousePos({
      x: event.clientX,
      y: event.clientY
    });
  };

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto bg-[#1A1A1A] text-stone-300 font-serif scroll-smooth relative cursor-crosshair"
      onPointerMove={handlePointerMove}
    >
      <div
        className="fixed inset-0 pointer-events-none z-50 mix-blend-screen transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle ${glowRadius}px at ${mousePos.x}px ${mousePos.y}px, rgba(200,195,185,0.4), transparent 80%)`,
          opacity: hasMoved ? 1 : 0
        }}
      />

      {!hasMoved && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-40 pointer-events-none text-stone-500 animate-pulse">
          <MousePointer2 className="w-12 h-12 mb-4" />
          <p className="tracking-widest uppercase text-sm">{instruction}</p>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none opacity-[0.25] mix-blend-overlay z-40 flex" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <div
        className="min-h-full w-full"
        style={{
          maskImage: `radial-gradient(circle ${radius}px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle ${radius}px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`
        }}
      >
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative z-10">
          <p className="text-stone-400 tracking-[0.4em] uppercase text-xs mb-6 font-sans font-bold">
            {introLabel} pour {story.recipientName}
          </p>
          <h1 className="text-5xl sm:text-7xl text-stone-200 font-light italic">
            {story.title}
          </h1>
        </div>

        <div className="max-w-xl mx-auto pb-64 px-6 relative z-10 space-y-96">
          {story.steps.map((step) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-20%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="flex flex-col items-center text-center group"
            >
              {step.mediaType !== 'none' && step.mediaUrl && (
                <div className="w-full aspect-square md:aspect-video mb-12 overflow-hidden rounded-sm relative opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[2000ms]">
                  {step.mediaType === 'video' ? (
                    <video src={step.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover sepia-[.2] contrast-125" />
                  ) : (
                    <img src={step.mediaUrl} alt={step.title} className="w-full h-full object-cover sepia-[.2] contrast-125" />
                  )}
                </div>
              )}

              <h2 className="text-xl sm:text-3xl font-serif tracking-wide text-stone-200 mb-8 capitalize-first">{step.title}</h2>
              <p className="text-lg sm:text-xl leading-relaxed text-stone-400 font-light max-w-md">"{step.content}"</p>
              {step.meta?.echoCaption && (
                <p className="mt-4 text-stone-600 text-xs tracking-[0.2em] uppercase font-sans">
                  {step.meta.echoCaption}
                </p>
              )}

              {step.type === 'music' && <StepMusicBlock step={step} template="echo" />}

              {step.type === 'gallery' && step.meta?.images && (
                <div className="flex gap-4 mt-12 overflow-x-auto w-[600px] max-w-full pb-8">
                  {step.meta.images.map((img: string, i: number) => (
                    <img key={i} src={img} className="h-40 object-cover aspect-square sepia-[.3] contrast-125 opacity-70 hover:opacity-100 transition-opacity rounded-sm" />
                  ))}
                </div>
              )}

              {step.type === 'words' && step.meta?.quotes && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 w-[600px] max-w-full">
                  {step.meta.quotes.map((quote: any, i: number) => (
                    <div key={i} className="text-left border-l border-stone-700 pl-4">
                      <p className="text-stone-500 italic mb-2">"{quote.text}"</p>
                      <p className="text-stone-600 text-xs uppercase tracking-widest">{quote.author}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
