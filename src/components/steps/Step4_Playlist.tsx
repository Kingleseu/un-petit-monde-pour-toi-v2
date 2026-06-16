import { motion } from 'motion/react';
import { ArrowRight, Music, Play, Pause, Disc } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { Step } from '../../types_v2';
import StepMusicBlock from '../templates/StepMusicBlock';

interface Props {
  onNext: () => void;
}

export function StepPlaylist({ onNext }: Props) {
  const { content, audioPlaying, setAudioPlaying } = useContent();
  const templateId = content.templateId || 'romance';
  const playlistMode = content.playlistMode === 'playlist' ? 'playlist' : 'single';
  const playlistTracks = Array.isArray(content.playlistTracks) ? content.playlistTracks : [];
  const playlistStep: Step = {
    id: 'classic-playlist',
    title: content.playlistTitle || 'Playlist',
    content: '',
    mediaType: 'none',
    transition: 'fade',
    type: 'music',
    meta: {
      musicMode: playlistMode,
      musicTitle: content.playlistTitle,
      musicArtist: content.playlistSubtitle,
      musicUrl: content.audioUrl || '',
      musicNote: content.playlistNote || '',
      playlistUrl: content.playlistUrl || '',
      playlist: playlistTracks
    }
  };

  // Visualizer bars
  const bars = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    delay: i * 0.05,
  }));

  return (
    <div className={`min-h-screen py-20 px-6 max-w-3xl mx-auto flex flex-col items-center justify-center ${
      templateId === 'retro' 
        ? 'font-mono' 
        : templateId === 'pastel' 
        ? 'font-pastel-accent' 
        : templateId === 'minimal'
        ? 'font-minimal'
        : 'font-serif'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 w-full"
      >
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 mx-auto mb-6 text-custom-accent"
        >
          <Music className="w-full h-full" />
        </motion.div>

        <h2 className="text-3xl md:text-5xl font-bold tracking-wide text-glow text-custom-title">
          {templateId === 'retro' 
            ? "LECTEUR AUDIO" 
            : templateId === 'pastel' 
            ? "Notre p'tite musique" 
            : "La Playlist Cachée"}
        </h2>
        
        <p className="text-white/60 font-light text-lg mb-3 max-w-xl mx-auto leading-relaxed mt-4 text-custom-body">
          {templateId === 'retro'
            ? "Initialisation de la bande son. Activez la lecture."
            : templateId === 'pastel'
            ? "Clique sur play pour mettre une jolie p'tite chanson ! 🎵"
            : "Avant de continuer, lance cette chanson."}
        </p>
        
        <p className="text-white/40 font-light text-sm max-w-md mx-auto leading-relaxed text-custom-body">
          {templateId === 'retro'
            ? "Bande sonore recommandée pour optimiser la décryption."
            : templateId === 'pastel'
            ? "Elle donne une p'tite ambiance toute douce pour la suite... ✨"
            : "Elle n'est pas là par hasard. Elle donne l'ambiance exacte que je voulais pour ce qui suit."}
        </p>
      </motion.div>

      {/* Music Player Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="w-full max-w-sm mb-12"
      >
        <div className={`rounded-3xl p-8 shadow-2xl relative overflow-hidden ${
          templateId === 'retro' 
            ? 'bg-black border border-[#ff007f] retro-border-glow' 
            : templateId === 'pastel' 
            ? 'bg-white border-2 border-[#ffccd5] shadow-pink-100/50' 
            : templateId === 'minimal'
            ? 'minimal-card minimal-border'
            : 'glass-gradient border border-white/10'
        }`}>
          {/* Background glow (only for Romance) */}
          {templateId === 'romance' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />
          )}

          <div className="relative z-10 flex flex-col items-center">
            
            {/* --- PLAYER COMPONENT BY THEME --- */}
            
            {/* 1. ROMANCE (Vinyl disc) */}
            {templateId === 'romance' && (
              <motion.div
                animate={{ rotate: audioPlaying ? 360 : 0 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="w-40 h-40 rounded-full mb-8 relative"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-black to-gray-900 shadow-2xl border-4 border-black/50" />
                <div className="absolute inset-2 rounded-full border-4 border-gray-800/30 border-dashed opacity-50" />
                <div className="absolute inset-6 rounded-full border-2 border-gray-700/20 opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#b8902e] flex items-center justify-center shadow-lg">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                </div>
                {audioPlaying && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#D4AF37] rounded-full shadow-lg shadow-[#D4AF37]"
                  />
                )}
              </motion.div>
            )}

            {/* 2. RETRO (Cassette Tape) */}
            {templateId === 'retro' && (
              <div className="w-52 h-32 bg-zinc-950 border-2 border-[#ff007f] rounded-lg relative flex flex-col justify-between p-2 mb-8 shadow-[inset_0_0_10px_rgba(255,0,127,0.3)]">
                <div className="w-full h-6 bg-zinc-900 border border-zinc-800 rounded flex justify-between items-center px-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                  <span className="text-[9px] text-[#ff007f] font-mono tracking-widest">TAPE A</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                </div>
                <div className="w-32 h-12 bg-black border border-zinc-800 mx-auto rounded flex items-center justify-around relative overflow-hidden">
                  <motion.div 
                    animate={{ rotate: audioPlaying ? 360 : 0 }} 
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="w-7 h-7 rounded-full border-2 border-dashed border-[#00f0ff] flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff007f]" />
                  </motion.div>
                  <motion.div 
                    animate={{ rotate: audioPlaying ? 360 : 0 }} 
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="w-7 h-7 rounded-full border-2 border-dashed border-[#00f0ff] flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff007f]" />
                  </motion.div>
                </div>
                <div className="w-full text-center text-[7px] text-zinc-500 font-mono tracking-widest">
                  AUTO REVERSE - HI-FI STEREO
                </div>
              </div>
            )}

            {/* 3. PASTEL (Cute CD) */}
            {templateId === 'pastel' && (
              <motion.div
                animate={{ rotate: audioPlaying ? 360 : 0 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-200 via-purple-100 to-yellow-100 border-4 border-pink-300 relative flex items-center justify-center shadow-lg mb-8"
              >
                <div className="absolute inset-4 rounded-full border border-white/60 opacity-60" />
                <div className="absolute inset-8 rounded-full border-2 border-white/40 opacity-40" />
                <div className="w-12 h-12 rounded-full bg-white border-4 border-pink-300 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-pink-200" />
                </div>
                {!audioPlaying && (
                  <span className="absolute text-xl top-5 right-5">💤</span>
                )}
                {audioPlaying && (
                  <span className="absolute text-xl top-5 right-5 animate-bounce">🎶</span>
                )}
              </motion.div>
            )}

            {/* 4. MINIMAL (Clean Waveform disc) */}
            {templateId === 'minimal' && (
              <motion.div
                animate={audioPlaying ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-36 h-36 rounded-full border border-white/10 flex items-center justify-center mb-8 relative bg-zinc-950/40"
              >
                <Disc className={`w-12 h-12 text-white/30 ${audioPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                {audioPlaying && (
                  <div className="absolute inset-2 rounded-full border border-white/5 border-dashed" />
                )}
              </motion.div>
            )}

            {/* Song Info */}
            <h3 className={`font-bold text-lg mb-1 tracking-wide text-center font-custom-title ${
              templateId === 'pastel' ? 'text-pink-500' : 'text-white'
            }`}>
              {content.playlistTitle}
            </h3>
            
            <p className={`text-[10px] uppercase tracking-[0.2em] mb-8 font-custom-body ${
              templateId === 'pastel' ? 'text-pink-300 font-semibold' : 'text-white/50'
            }`}>
              {content.playlistSubtitle}
            </p>

            {/* Visualizer Bars */}
            <div className="w-full flex items-end justify-center gap-1 h-12 mb-8 px-2">
              {bars.map((bar) => (
                <motion.div
                  key={bar.id}
                  animate={{
                    height: audioPlaying
                      ? [8, Math.random() * 40 + 10, 8]
                      : 8,
                    opacity: audioPlaying ? [0.6, 1, 0.6] : 0.2,
                  }}
                  transition={{
                    duration: audioPlaying ? 0.4 + Math.random() * 0.4 : 2,
                    repeat: Infinity,
                    delay: bar.delay,
                  }}
                  className={`flex-1 rounded-full ${
                    templateId === 'retro'
                      ? 'bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]'
                      : templateId === 'pastel'
                      ? 'bg-[#ffccd5]'
                      : templateId === 'minimal'
                      ? 'bg-white/40'
                      : 'bg-gradient-to-t from-[#D4AF37] to-[#fdeea0] shadow-lg shadow-[#D4AF37]/30'
                  }`}
                />
              ))}
            </div>

            {/* Play Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAudioPlaying(!audioPlaying)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                templateId === 'retro'
                  ? 'bg-black border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black shadow-[0_0_15px_#00f0ff]'
                  : templateId === 'pastel'
                  ? 'bg-[#ffccd5] border border-white text-white hover:bg-[#ffb7b2]'
                  : templateId === 'minimal'
                  ? 'bg-white text-black hover:bg-neutral-200'
                  : 'bg-gradient-to-br from-[#D4AF37] to-[#b8902e] text-[#050508] hover:shadow-xl hover:shadow-[#D4AF37]/30'
              }`}
            >
              {audioPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </motion.button>

            {/* Status text */}
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`text-xs mt-4 italic font-custom-body ${
                templateId === 'pastel' ? 'text-pink-300' : 'text-white/40'
              }`}
            >
              {audioPlaying ? 'Lecture en cours...' : 'Cliquez pour écouter'}
            </motion.p>

            <StepMusicBlock step={playlistStep} template="classic" />
          </div>
        </div>
      </motion.div>

      {/* Poetic divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className={`w-20 h-0.5 mb-8 ${
          templateId === 'retro'
            ? 'bg-gradient-to-r from-transparent via-[#ff007f] to-transparent'
            : templateId === 'pastel'
            ? 'bg-gradient-to-r from-transparent via-[#ffccd5] to-transparent'
            : templateId === 'minimal'
            ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
            : 'bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent'
        }`}
      />

      {/* Next button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onNext}
        className={`group flex items-center gap-3 px-8 py-3 rounded-full transition-all border ${
          templateId === 'retro'
            ? 'bg-black text-[#00f0ff] border-[#00f0ff] hover:bg-[#00f0ff] hover:text-black shadow-[0_0_15px_#00f0ff] font-mono'
            : templateId === 'pastel'
            ? 'bg-[#ffccd5] text-white border-white hover:bg-[#ffb7b2] shadow-md font-semibold'
            : templateId === 'minimal'
            ? 'bg-white text-black border-white hover:bg-neutral-200'
            : 'bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:shadow-[#D4AF37]/20 text-sm uppercase tracking-widest'
        }`}
      >
        <span className="font-medium">Ouvrir la lettre</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}
