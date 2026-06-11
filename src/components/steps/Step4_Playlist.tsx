import { motion } from 'motion/react';
import { ArrowRight, Music, Play, Pause } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface Props {
  onNext: () => void;
}

export function StepPlaylist({ onNext }: Props) {
  const { content, audioPlaying, setAudioPlaying } = useContent();

  // Visualizer bars
  const bars = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    delay: i * 0.05,
  }));

  return (
    <div className="min-h-screen py-20 px-6 max-w-3xl mx-auto flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 w-full"
      >
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 text-[#D4AF37] mx-auto mb-6"
        >
          <Music className="w-full h-full" />
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 tracking-wide text-glow">
          La Playlist Cachée
        </h2>
        <p className="text-white/60 font-light text-lg mb-3 max-w-2xl mx-auto leading-relaxed">
          Avant de continuer, lance cette chanson.
        </p>
        <p className="text-white/40 font-serif italic text-base max-w-xl mx-auto leading-relaxed">
          Elle n'est pas là par hasard. Elle donne l'ambiance exacte que je voulais pour ce qui suit.
        </p>
      </motion.div>

      {/* Vinyl Player Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-full max-w-sm mb-16"
      >
        <div className="glass-gradient rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Vinyl Disc */}
            <motion.div
              animate={{ rotate: audioPlaying ? 360 : 0 }}
              transition={{
                duration: audioPlaying ? 4 : 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-40 h-40 rounded-full mb-8 relative"
            >
              {/* Outer vinyl edge */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-black to-gray-900 shadow-2xl border-4 border-black/50" />

              {/* Vinyl grooves */}
              <div className="absolute inset-2 rounded-full border-4 border-gray-800/30 border-dashed opacity-50" />
              <div className="absolute inset-6 rounded-full border-2 border-gray-700/20 opacity-50" />

              {/* Center label */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#b8902e] flex items-center justify-center shadow-lg">
                  <Music className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              {/* Playing indicator */}
              {audioPlaying && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#D4AF37] rounded-full shadow-lg shadow-[#D4AF37]"
                />
              )}
            </motion.div>

            {/* Song Info */}
            <h3 className="text-white font-serif text-lg mb-1 tracking-wide text-center">
              {content.playlistTitle}
            </h3>
            <p className="text-[11px] text-white/50 uppercase tracking-[0.2em] mb-8 font-serif">
              {content.playlistSubtitle}
            </p>

            {/* Visualizer Bars */}
            <div className="w-full flex items-end justify-center gap-1 h-16 mb-8 px-2">
              {bars.map((bar) => (
                <motion.div
                  key={bar.id}
                  animate={{
                    height: audioPlaying
                      ? [12, Math.random() * 50 + 20, 12]
                      : 12,
                    opacity: audioPlaying ? [0.5, 1, 0.5] : 0.3,
                  }}
                  transition={{
                    duration: audioPlaying ? 0.5 + Math.random() * 0.5 : 2,
                    repeat: Infinity,
                    delay: bar.delay,
                  }}
                  className="flex-1 bg-gradient-to-t from-[#D4AF37] to-[#fdeea0] rounded-full shadow-lg shadow-[#D4AF37]/50"
                />
              ))}
            </div>

            {/* Play Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAudioPlaying(!audioPlaying)}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8902e] text-[#050508] flex items-center justify-center hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all shadow-lg"
            >
              {audioPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-0.5" />
              )}
            </motion.button>

            {/* Status text */}
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xs text-white/40 mt-4 font-serif italic"
            >
              {audioPlaying ? 'En cours...' : 'Cliquez pour écouter'}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Poetic divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-8"
      />

      {/* Next button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] rounded-full transition-all hover:shadow-lg hover:shadow-[#D4AF37]/20 uppercase text-xs font-bold tracking-widest"
      >
        <span className="font-medium">Ouvrir la lettre</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}
