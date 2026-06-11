import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface LightboxProps {
  image: { url: string; caption: string } | null;
  onClose: () => void;
}

export function Lightbox({ image, onClose }: LightboxProps) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full max-w-4xl max-h-[90vh] flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image container with Ken Burns effect */}
            <motion.div
              animate={{ scale: [1, 1.08] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
            >
              <img
                src={image.url}
                alt={image.caption}
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>

            {/* Caption */}
            {image.caption && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent"
              >
                <p className="text-center text-white/90 font-serif italic text-lg">
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
