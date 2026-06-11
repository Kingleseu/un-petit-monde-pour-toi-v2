import { motion } from 'motion/react';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { useContent } from '../../context/ContentContext';

interface Props {
  onNext: () => void;
}

export function StepGallery({ onNext }: Props) {
  const { content } = useContent();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen py-20 px-6 max-w-5xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <ImageIcon className="w-6 h-6 text-[#D4AF37] mx-auto mb-4 opacity-75" />
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 tracking-wide">La Galerie</h2>
        <p className="text-white/60 font-light text-lg">
          Un mini album figé dans le temps.
        </p>
      </motion.div>

      <div className="w-full flex flex-col gap-12 md:gap-24 mb-20">
        {content.galleryPhotos.map((photo, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}
            >
              <div 
                className="w-full md:w-1/2 cursor-pointer"
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <div className="relative aspect-[4/3] rounded-lg bg-white/5 border border-white/10 p-2 pb-10 shadow-xl shadow-black/50 rotate-[-2deg] hover:rotate-0 transition-all duration-500 hover:scale-[1.02]">
                  {/* Polaroid look */}
                  <img 
                    src={`${photo.url}?auto=format&fit=crop&w=800&q=80`} 
                    alt="Souvenir" 
                    className={`w-full h-full object-cover rounded-sm filter transition-all duration-700 ${activeIdx !== null && activeIdx !== idx ? 'grayscale blur-[2px] opacity-40' : 'grayscale-0'}`}
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 text-center md:text-left">
                <motion.p 
                  className="font-serif text-xl md:text-2xl text-white/80 leading-relaxed italic"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  "{photo.caption}"
                </motion.p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="group flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/10 hover:bg-white/20 text-white rounded-full transition-colors mt-8 text-sm uppercase tracking-widest"
      >
        <span className="font-medium">Continuer le parcours</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}
