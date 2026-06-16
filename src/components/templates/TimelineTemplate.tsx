import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Story } from '../../types_v2';
import StepMusicBlock from './StepMusicBlock';

export default function TimelineTemplate({ story }: { story: Story }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const openingTitle = story.config?.timelineOpening || story.title;
  const datePrefix = story.config?.timelineDatePrefix || 'Souvenir';
  const mediaStyle = story.config?.timelineMediaStyle || 'polaroid';

  return (
    <div ref={containerRef} className="h-full overflow-y-auto bg-stone-50 py-24 px-8 font-serif text-stone-900 relative scroll-smooth">
      <div className="max-w-3xl mx-auto relative">
        <div className="text-center mb-32 relative z-10 bg-stone-50/80 p-8 backdrop-blur-sm rounded-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 mb-6 font-display">
            {openingTitle}
          </h1>
          <p className="text-xl text-stone-500 italic">
            Pour {story.recipientName}
          </p>
        </div>

        <div className="relative pb-32">
          {/* Subtle line background */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-stone-200 -translate-x-1/2" />
          
          {/* Animated fill line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-stone-900 -translate-x-1/2 origin-top">
            <motion.div 
              className="absolute top-0 w-full bg-stone-900 origin-top"
              style={{ height: '100%', scaleY: pathLength }}
            />
          </div>

          <div className="flex flex-col gap-32">
            {story.steps.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex flex-col md:flex-row items-center gap-12 md:gap-24 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-3 h-3 rounded-full bg-stone-900 -translate-x-[5px] z-10 ring-4 ring-stone-50" />
                  
                  {/* Content Panel */}
                  <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                    <span className="text-stone-400 font-sans text-sm tracking-widest uppercase mb-4 block">
                      {step.meta?.dateLabel || `${datePrefix} ${index + 1}`}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-6 font-display capitalize-first">{step.title}</h2>
                    <p className="text-stone-600 leading-relaxed text-lg font-sans font-light">{step.content}</p>
                    {step.type === 'music' && (
                      <div className={isEven ? 'md:ml-0' : 'md:ml-auto'}>
                        <StepMusicBlock step={step} template="timeline" />
                      </div>
                    )}
                    {step.type === 'words' && step.meta?.quotes && (
                      <div className="mt-8 space-y-4">
                        {step.meta.quotes.map((quote: any, quoteIndex: number) => (
                          <div key={quoteIndex} className={`border-stone-300 ${isEven ? 'md:border-l md:pl-4' : 'md:border-r md:pr-4'} border-l pl-4 md:pl-0`}>
                            <p className="text-stone-700 font-serif italic">"{quote.text}"</p>
                            <p className="text-stone-400 text-xs uppercase tracking-widest mt-2">{quote.author}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Media Panel */}
                  <div className="w-full md:w-1/2 pl-20 md:pl-0">
                    {step.type === 'gallery' && step.meta?.images ? (
                      <div className={`grid grid-cols-2 gap-3 ${mediaStyle === 'polaroid' ? 'rotate-2 hover:rotate-0' : ''} transition-transform duration-700`}>
                        {step.meta.images.slice(0, 4).map((image: string, imageIndex: number) => (
                          <div key={imageIndex} className="bg-white p-2 shadow-xl aspect-[4/5]">
                            <img src={image} alt={`${step.title} ${imageIndex + 1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                          </div>
                        ))}
                      </div>
                    ) : step.mediaType !== 'none' && step.mediaUrl && (
                      <div className={`overflow-hidden shadow-2xl aspect-[4/5] bg-stone-200 relative transition-transform duration-700 ease-out ${mediaStyle === 'polaroid' ? 'rotate-2 hover:rotate-0' : ''}`}>
                        {step.mediaType === 'video' ? (
                          <video src={step.mediaUrl} autoPlay loop muted playsInline className={`w-full h-full object-cover transition-all duration-700 ${mediaStyle === 'polaroid' ? 'grayscale hover:grayscale-0' : ''}`} />
                        ) : (
                          <img src={step.mediaUrl} alt={step.title} className={`w-full h-full object-cover transition-all duration-700 ${mediaStyle === 'polaroid' ? 'grayscale hover:grayscale-0' : ''}`} />
                        )}
                        <div className="absolute inset-0 mix-blend-overlay bg-stone-500/20 pointer-events-none" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
