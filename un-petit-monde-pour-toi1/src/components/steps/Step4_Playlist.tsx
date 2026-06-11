import { motion } from 'motion/react';
import { ArrowRight, Music, Play, Pause } from 'lucide-react';
import { useState } from 'react';
import { useContent } from '../../context/ContentContext';

interface Props {
  onNext: () => void;
}

export function StepPlaylist({ onNext }: Props) {
  const { content } = useContent();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen py-20 px-6 max-w-3xl mx-auto flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <Music className="w-6 h-6 text-[#D4AF37] mx-auto mb-4 opacity-75" />
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 tracking-wide">La Playlist Cachée</h2>
        <p className="text-white/60 font-light text-lg mb-2 text-balance leading-relaxed">
          Avant de continuer, lance cette chanson.
        </p>
        <p className="text-white/40 font-light text-base mb-12 text-balance leading-relaxed italic">
          Elle n'est pas là par hasard. Elle donne l'ambiance exacte que je voulais pour ce qui suit.
        </p>

        {/* Mock Audio Player or embedded iframe */}
        <div className="w-full max-w-sm mx-auto bg-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          {/* subtle vinyl groove effect background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,transparent_20%,#fff_21%,#fff_22%,transparent_23%,transparent_30%,#fff_31%,#fff_32%,transparent_33%)] bg-[length:20px_20px]" />
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 rounded-full border-4 border-[#D4AF37]/20 bg-[#050508] flex items-center justify-center mb-6 shadow-xl shadow-black"
            >
              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/20" />
            </motion.div>
            
            <h3 className="text-white font-serif italic text-lg mb-1 tracking-wide">{content.playlistTitle}</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-6">{content.playlistSubtitle}</p>

            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-[#D4AF37] text-[#050508] flex items-center justify-center hover:bg-[#D4AF37]/90 hover:scale-105 transition-all shadow-lg shadow-[#D4AF37]/20"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>
            </div>
            
            {/* Note to the user: you could replace this entire block with a Spotify iframe */}
            {/* <iframe src="https://open.spotify.com/embed/track/YOUR_TRACK_ID" width="100%" height="80" frameBorder="0" allow="encrypted-media"></iframe> */}
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="group flex items-center gap-3 px-6 py-3 mt-8 bg-transparent border border-[#D4AF37]/30 text-[#D4AF37] rounded-full transition-colors hover:bg-[#D4AF37]/10 uppercase text-xs font-bold tracking-widest"
      >
        <span className="font-medium">Ouvrir la lettre</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}
