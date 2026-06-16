import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { isVideoUrl, getEmbedUrl } from '../lib/videoUtils';

interface LightboxProps {
  image: { url: string; caption: string } | null;
  onClose: () => void;
}

export function Lightbox({ image, onClose }: LightboxProps) {
  const isVideo = image ? isVideoUrl(image.url) : false;
  const embedUrl = image && isVideo ? getEmbedUrl(image.url) : null;

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full max-w-4xl max-h-[85vh] flex flex-col justify-center items-center"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-0 -top-12 sm:-top-6 right-0 z-10 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 text-white transition-all"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Media Content */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {isVideo ? (
                embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title="Video Player"
                    className="w-full aspect-video rounded-lg max-h-full border-none shadow-2xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={image.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-full rounded-lg object-contain shadow-2xl"
                  />
                )
              ) : (
                <motion.div
                  animate={{ scale: [1, 1.05] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' }}
                  className="relative w-full h-full flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  />
                </motion.div>
              )}
            </div>

            {/* Caption */}
            {image.caption && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full text-center mt-4 p-4 bg-black/40 rounded-xl"
              >
                <p className="text-white/90 font-serif italic text-base sm:text-lg">
                  {image.caption}
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
