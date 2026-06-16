import { motion } from 'motion/react';
import { ArrowRight, Image as ImageIcon, Play, Film } from 'lucide-react';
import { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Lightbox } from '../Lightbox';
import { isVideoUrl, getVideoThumbnail } from '../../lib/videoUtils';

interface Props {
  onNext: () => void;
}

export function StepGallery({ onNext }: Props) {
  const { content } = useContent();
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; caption: string } | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const templateId = content.templateId || 'romance';

  return (
    <div className="min-h-screen py-20 px-6 max-w-5xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.div
          animate={{ rotate: templateId === 'retro' ? [0, -10, 10, 0] : 360 }}
          transition={{ duration: templateId === 'retro' ? 1.5 : 10, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 mx-auto mb-4 text-custom-accent"
        >
          {templateId === 'retro' ? <Film className="w-full h-full" /> : <ImageIcon className="w-full h-full" />}
        </motion.div>
        
        <h2 className="text-3xl md:text-5xl font-bold tracking-wide text-glow text-custom-title">
          {templateId === 'retro' 
            ? "MÉDIATHÈQUE RETRO" 
            : templateId === 'pastel' 
            ? "Le P'tit Album Photo" 
            : "La Galerie Souvenir"}
        </h2>
        
        <p className="text-white/60 font-light text-lg max-w-2xl mx-auto leading-relaxed mt-4 text-custom-body">
          {templateId === 'retro' 
            ? "Flux de données mémorielles restauré. Cliquez pour charger le média." 
            : templateId === 'pastel' 
            ? "Toutes nos jolies photos et vidéos réunies dans ce p'tit coin doux ! ✨" 
            : "Comme un vrai album en ligne, chaque souvenir capture un moment qui compte."}
        </p>
      </motion.div>

      <div className="w-full flex flex-col gap-16 md:gap-24 mb-20">
        {content.galleryPhotos.map((photo, idx) => {
          const isEven = idx % 2 === 0;
          const rotation = isEven ? -1.5 : 2;
          const isVideo = isVideoUrl(photo.url);
          const videoThumb = getVideoThumbnail(photo.url);
          
          // Fallback image for video if no thumbnail matches
          const displayUrl = isVideo 
            ? (videoThumb || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4") 
            : photo.url;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
              className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 relative`}
            >
              {/* Image & Frame Container */}
              <motion.div
                className="w-full md:w-1/2 cursor-pointer perspective"
                whileHover={{ scale: 1.04, rotate: templateId === 'pastel' ? 0 : rotation * 0.5 }}
                transition={{ duration: 0.3 }}
                initial={{ rotate: templateId === 'pastel' ? 0 : rotation }}
                onClick={() => setSelectedPhoto(photo)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* --- ROMANCE THEME (Polaroid) --- */}
                {templateId === 'romance' && (
                  <motion.div
                    className="polaroid bg-white rounded-sm overflow-hidden shadow-2xl"
                    animate={{
                      boxShadow: hoveredIdx === idx 
                        ? '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(212, 175, 55, 0.2)' 
                        : '0 10px 30px rgba(0,0,0,0.3)'
                    }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                      {displayUrl && !failedImages[idx] ? (
                        <img
                          src={displayUrl}
                          alt={photo.caption || 'Souvenir'}
                          loading="lazy"
                          onError={() => setFailedImages(prev => ({ ...prev, [idx]: true }))}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#1b1020] p-6 text-center">
                          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Média non disponible</p>
                        </div>
                      )}
                      {isVideo && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/95 text-black shadow-lg flex items-center justify-center hover:bg-white transition-all">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 /%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23noise)%22 /%3E%3C/svg%3E")', backgroundSize: '200px 200px' }} />
                    </div>
                    <div className="h-16 bg-white flex flex-col justify-center p-3 pb-2">
                      <p className="text-[11px] text-gray-400 font-serif italic text-center">
                        {isVideo ? 'Lecture vidéo disponible' : 'Un instant figé'}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* --- RETRO THEME (CRT TV screen) --- */}
                {templateId === 'retro' && (
                  <motion.div
                    className="crt-overlay retro-border-glow bg-black rounded-lg overflow-hidden relative"
                    animate={{
                      boxShadow: hoveredIdx === idx
                        ? '0 0 25px rgba(255, 0, 127, 0.7), 0 0 15px rgba(0, 240, 255, 0.5)'
                        : '0 0 15px rgba(255, 0, 127, 0.3)'
                    }}
                  >
                    <div className="relative aspect-[16/10] bg-zinc-950">
                      {displayUrl && !failedImages[idx] ? (
                        <img
                          src={displayUrl}
                          alt={photo.caption || 'Souvenir'}
                          loading="lazy"
                          onError={() => setFailedImages(prev => ({ ...prev, [idx]: true }))}
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black p-6 text-center">
                          <p className="text-xs font-mono text-[#ff007f]">[ERROR: MEDIA_LOAD_FAIL]</p>
                        </div>
                      )}
                      {isVideo && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full border-2 border-[#00f0ff] bg-black/80 text-[#00f0ff] flex items-center justify-center hover:bg-[#00f0ff] hover:text-black transition-colors shadow-[0_0_15px_#00f0ff]">
                            <Play className="w-6 h-6 fill-current ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* --- PASTEL THEME (Scrapbook with washi tape) --- */}
                {templateId === 'pastel' && (
                  <div className="relative pt-6">
                    <div className="washi-tape" style={{ backgroundColor: isEven ? 'rgba(255, 214, 165, 0.8)' : 'rgba(181, 234, 215, 0.8)' }} />
                    <motion.div
                      className="pastel-paper bg-white p-3 rounded-2xl"
                      animate={{
                        y: hoveredIdx === idx ? -6 : 0
                      }}
                    >
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-pink-50">
                        {displayUrl && !failedImages[idx] ? (
                          <img
                            src={displayUrl}
                            alt={photo.caption || 'Souvenir'}
                            loading="lazy"
                            onError={() => setFailedImages(prev => ({ ...prev, [idx]: true }))}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-pink-100 p-6 text-center">
                            <p className="text-xs font-bold text-pink-400">Oups ! Pas de photo ☕</p>
                          </div>
                        )}
                        {isVideo && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-[#ffccd5] border border-white text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-center pt-2">
                        <p className="text-xs font-semibold text-pink-400 tracking-wider">🌟 Mon p'tit souvenir 🌟</p>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* --- MINIMAL THEME (Sleek Glass Card) --- */}
                {templateId === 'minimal' && (
                  <motion.div
                    className="minimal-border minimal-card rounded-xl overflow-hidden relative"
                    animate={{
                      borderColor: hoveredIdx === idx ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.12)',
                      background: hoveredIdx === idx ? 'rgba(255,255,255,0.06)' : 'rgba(10,10,10,0.8)'
                    }}
                  >
                    <div className="relative aspect-[16/9] bg-zinc-950">
                      {displayUrl && !failedImages[idx] ? (
                        <img
                          src={displayUrl}
                          alt={photo.caption || 'Souvenir'}
                          loading="lazy"
                          onError={() => setFailedImages(prev => ({ ...prev, [idx]: true }))}
                          className="w-full h-full object-cover opacity-90 transition-opacity hover:opacity-100"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center p-6 text-center">
                          <p className="text-xs tracking-widest text-white/30 uppercase">NO MEDIA AVAILABLE</p>
                        </div>
                      )}
                      {isVideo && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full border border-white/40 bg-black/60 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
              
              {/* Text Caption Container */}
              <div className="w-full md:w-1/2">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className={`border p-6 md:p-8 rounded-2xl ${
                    templateId === 'retro' 
                      ? 'bg-black/80 border-[#ff007f]/30 font-mono text-cyan-400 retro-border-glow' 
                      : templateId === 'pastel' 
                      ? 'bg-white border-[#ffccd5] text-pink-500 shadow-md font-pastel-accent' 
                      : templateId === 'minimal'
                      ? 'bg-[#0f0f0f]/50 border-white/10 text-white font-minimal'
                      : 'bg-gradient-to-r from-white/5 to-[#D4AF37]/5 border-white/10 text-white'
                  }`}
                >
                  <p className={`text-xl md:text-2xl leading-relaxed italic ${templateId === 'pastel' ? 'font-medium' : 'font-light'}`}>
                    "{photo.caption}"
                  </p>
                  <p className={`text-xs mt-4 uppercase tracking-[0.2em] ${
                    templateId === 'retro' 
                      ? 'text-[#ff007f]' 
                      : templateId === 'pastel' 
                      ? 'text-pink-300' 
                      : 'text-white/40'
                  }`}>
                    {isVideo ? "Cliquez pour regarder la vidéo" : "Cliquez pour agrandir"}
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
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onNext}
        className={`group flex items-center gap-3 px-6 py-3 rounded-full transition-all border ${
          templateId === 'retro'
            ? 'bg-black text-[#00f0ff] border-[#00f0ff] hover:bg-[#00f0ff] hover:text-black shadow-[0_0_15px_#00f0ff] font-mono'
            : templateId === 'pastel'
            ? 'bg-[#ffccd5] text-white border-white hover:bg-[#ffb7b2] shadow-md font-pastel-accent'
            : templateId === 'minimal'
            ? 'bg-white text-black border-white hover:bg-neutral-200'
            : 'bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:shadow-[#D4AF37]/20 text-sm uppercase tracking-widest'
        }`}
      >
        <span className="font-medium">Continuer le parcours</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>

      {/* Lightbox Modal */}
      <Lightbox image={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
}
