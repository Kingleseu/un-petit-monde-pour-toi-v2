import { motion } from 'motion/react';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Lightbox } from '../Lightbox';

interface Props {
  onNext: () => void;
}

export function StepGallery({ onNext }: Props) {
  const { content } = useContent();
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; caption: string } | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  return (
    <div className="min-h-screen py-20 px-6 max-w-5xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="w-6 h-6 text-[#D4AF37] mx-auto mb-4"
        >
          <ImageIcon className="w-full h-full" />
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 tracking-wide text-glow">La Galerie Souvenir</h2>
        <p className="text-white/60 font-light text-lg max-w-2xl mx-auto leading-relaxed">
          Comme un vrai album en ligne, chaque photo capture un moment qui compte.
        </p>
      </motion.div>

      <div className="w-full flex flex-col gap-16 md:gap-32 mb-20">
        {content.galleryPhotos.map((photo, idx) => {
          const isEven = idx % 2 === 0;
          const rotation = isEven ? -1.5 : 2;
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
              className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 relative`}
            >
              {/* Polaroid Card */}
              <motion.div
                className="w-full md:w-1/2 cursor-pointer perspective"
                whileHover={{ scale: 1.05, rotate: 0 }}
                transition={{ duration: 0.3 }}
                initial={{ rotate: rotation }}
                onClick={() => setSelectedPhoto(photo)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <motion.div
                  className="polaroid bg-white rounded-sm overflow-hidden shadow-2xl"
                  animate={{
                    boxShadow: hoveredIdx === idx 
                      ? '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(212, 175, 55, 0.2)' 
                      : '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Image container with grain effect */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-white">
                    {photo.url && !failedImages[idx] ? (
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Souvenir'}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() => setFailedImages(prev => ({ ...prev, [idx]: true }))}
                        className="w-full h-full object-cover transition-transform duration-500"
                        style={{
                          transform: hoveredIdx === idx ? 'scale(1.08)' : 'scale(1)',
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#1b1020] p-6 text-center">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                          Image indisponible
                        </p>
                      </div>
                    )}
                    {/* Film grain overlay */}
                    <div 
                      className="absolute inset-0 opacity-5 pointer-events-none"
                      style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 /%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23noise)%22 /%3E%3C/svg%3E")',
                        backgroundSize: '200px 200px',
                      }}
                    />
                  </div>
                  
                  {/* Polaroid white bottom */}
                  <div className="h-20 bg-white flex flex-col justify-between p-3 pb-2">
                    <div />
                    <p className="text-[10px] text-gray-400 font-serif italic text-center leading-tight">
                      Un instant figé
                    </p>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Caption */}
              <div className="w-full md:w-1/2">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="bg-gradient-to-r from-white/5 to-[#D4AF37]/5 border border-white/10 rounded-2xl p-8"
                >
                  <p className="font-serif text-xl md:text-2xl text-white leading-relaxed italic">
                    "{photo.caption}"
                  </p>
                  <p className="text-xs text-white/40 mt-4 uppercase tracking-[0.2em]">
                    Cliquez pour agrandir
                  </p>
                </motion.div>
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
        className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] rounded-full transition-all hover:shadow-lg hover:shadow-[#D4AF37]/20 text-sm uppercase tracking-widest"
      >
        <span className="font-medium">Continuer le parcours</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>

      {/* Lightbox */}
      <Lightbox image={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
}
