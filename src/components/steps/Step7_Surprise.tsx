import { motion } from 'motion/react';
import { Gift, Bookmark, Terminal, ShieldAlert, Sparkles, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { Confetti } from '../Confetti';

export function StepSurprise() {
  const { content } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [daysAgo, setDaysAgo] = useState(0);

  const templateId = content.templateId || 'romance';

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
    }
  }, [isOpen]);

  // Calculate days since birthday
  useEffect(() => {
    const today = new Date();
    const lastBirthday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const days = Math.floor((today.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24));
    setDaysAgo(days);
  }, []);

  return (
    <div className={`min-h-screen py-20 px-6 max-w-2xl mx-auto flex flex-col items-center justify-center text-center relative ${
      templateId === 'retro' 
        ? 'font-mono' 
        : templateId === 'pastel' 
        ? 'font-pastel-accent' 
        : templateId === 'minimal'
        ? 'font-minimal'
        : 'font-serif'
    }`}>
      {showConfetti && <Confetti />}

      {/* Envelope/Gift Animation before open */}
      {!isOpen ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateX: -30 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="mb-12 cursor-pointer perspective"
          onClick={() => setIsOpen(true)}
        >
          {/* --- GIFT BOX DESIGNS BY THEME --- */}
          
          {/* 1. ROMANCE (Envelope) */}
          {templateId === 'romance' && (
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-32 h-20 mb-8 mx-auto"
            >
              <div className="absolute inset-0 bg-white rounded-sm shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-100" />
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/80 border-b border-gray-200" />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white border-t border-gray-200" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8902e] shadow-lg flex items-center justify-center">
                <Gift className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          )}

          {/* 2. RETRO (Cyber Chest) */}
          {templateId === 'retro' && (
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-40 h-28 bg-black border-2 border-[#ff007f] rounded-none flex flex-col justify-between p-3 mb-8 shadow-[0_0_15px_#ff007f]"
            >
              <div className="w-full flex justify-between items-center px-2 border-b border-[#00f0ff]/30 pb-1">
                <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span className="text-[8px] text-[#ff007f] tracking-widest">[ SAFE_V.03 ]</span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border border-dashed border-[#00f0ff] rounded-full flex items-center justify-center animate-pulse">
                  <ShieldAlert className="w-4 h-4 text-[#00f0ff]" />
                </div>
              </div>
              <div className="text-[7px] text-zinc-500 tracking-[0.2em] uppercase">CLIQUEZ POUR DÉCRYPTER</div>
            </motion.div>
          )}

          {/* 3. PASTEL (Cute Pink Box) */}
          {templateId === 'pastel' && (
            <motion.div
              animate={{ y: [0, -6, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-28 h-28 bg-[#ffccd5] rounded-3xl flex items-center justify-center border-4 border-white shadow-lg shadow-pink-100/50 mb-8 mx-auto"
            >
              <div className="absolute -top-3 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm" />
              <div className="absolute w-2 h-full bg-white opacity-90" />
              <div className="absolute h-2 w-full bg-white opacity-90" />
              <span className="text-4xl relative z-10">🎁</span>
            </motion.div>
          )}

          {/* 4. MINIMAL (Black box) */}
          {templateId === 'minimal' && (
            <motion.div
              animate={{ scale: [0.98, 1, 0.98] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative w-28 h-28 bg-neutral-900 border border-white/20 flex items-center justify-center mb-8 mx-auto"
            >
              <div className="absolute inset-1 border border-white/5" />
              <Gift className="w-8 h-8 text-white/50" />
            </motion.div>
          )}

          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`text-xs tracking-[0.2em] uppercase font-semibold ${
              templateId === 'retro' 
                ? 'text-[#00f0ff] font-mono' 
                : templateId === 'pastel'
                ? 'text-pink-400 font-pastel-accent'
                : 'text-custom-accent'
            }`}
          >
            {templateId === 'retro' ? "[ CHARGER LE CADEAU ]" : "Cliquez pour ouvrir"}
          </motion.p>
        </motion.div>
      ) : null}

      {/* Content revealed */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="w-full space-y-10"
        >
          {/* Card container based on theme */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            {/* Background Glow */}
            <div className={`absolute inset-0 -z-10 blur-3xl opacity-20 ${
              templateId === 'retro' ? 'bg-[#ff007f]' : templateId === 'pastel' ? 'bg-pink-300' : 'bg-custom-accent'
            }`} />
            
            <div className={`border p-6 md:p-12 backdrop-blur-sm ${
              templateId === 'retro'
                ? 'bg-black border-[#ff007f] font-mono text-cyan-400 retro-border-glow rounded-none'
                : templateId === 'pastel'
                ? 'bg-white border-3 border-[#ffccd5] text-pink-500 shadow-lg shadow-pink-100/30 rounded-[28px]'
                : templateId === 'minimal'
                ? 'minimal-card minimal-border text-white rounded-xl'
                : 'bg-gradient-to-b from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30 rounded-2xl'
            }`}>
              
              {/* Surprise Title */}
              <motion.h2 
                className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-wide break-words font-custom-title ${
                  templateId === 'pastel' ? 'text-pink-500 font-pastel-accent' : templateId === 'retro' ? 'text-[#00f0ff]' : 'text-custom-accent'
                }`}
                dangerouslySetInnerHTML={{ __html: content.surpriseTitle }}
                animate={templateId === 'retro' ? {} : { scale: [1, 1.02, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              
              {/* Surprise Subtitle */}
              <p className={`text-xl md:text-2xl mb-4 font-custom-body ${
                templateId === 'pastel' ? 'text-pink-300 font-semibold' : 'text-white/80'
              }`}>
                {content.surpriseSubtitle}
              </p>
              
              {/* Visual Divider */}
              <motion.div
                className={`w-16 h-0.5 mx-auto my-6 ${
                  templateId === 'retro' 
                    ? 'bg-[#ff007f]' 
                    : templateId === 'pastel' 
                    ? 'bg-[#ffccd5]' 
                    : 'bg-custom-accent'
                }`}
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Surprise Text */}
              <p className={`text-base font-light max-w-2xl mx-auto leading-relaxed font-custom-body ${
                templateId === 'pastel' ? 'text-pink-400 font-medium' : 'text-white/70'
              }`}>
                {content.surpriseText}
              </p>
            </div>
          </motion.div>

          {/* Bookmark section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="pt-8 space-y-6"
          >
            <div className="flex items-center justify-center gap-4 text-white/20">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-white/10" />
              {templateId === 'pastel' ? (
                <Sparkles className="w-5 h-5 text-pink-400" />
              ) : (
                <Bookmark className="w-5 h-5 text-custom-accent" />
              )}
              <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-white/10" />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className={`p-6 text-center rounded-2xl ${
                templateId === 'retro'
                  ? 'bg-black border border-[#00f0ff]/30 font-mono text-cyan-400'
                  : templateId === 'pastel'
                  ? 'bg-pink-50/40 border border-[#ffccd5] text-pink-400'
                  : templateId === 'minimal'
                  ? 'bg-white/5 border border-white/10 text-white/60'
                  : 'glass-gradient text-white/60'
              }`}
            >
              <p className="text-sm mb-2 font-custom-title font-bold">
                <span className="text-custom-accent">
                  {templateId === 'retro' ? "[ INFO CONSEILLÉE ]" : "Astuce spéciale :"}
                </span>
              </p>
              <p className="italic text-sm font-custom-body">
                {templateId === 'pastel'
                  ? "Mets cette p'tite page dans tes favoris ! Tu pourras revenir ici dès que tu auras besoin d'un p'tit sourire. 🌸"
                  : "Marquez cette page dans vos favoris. Tu pourras revenir ici quand tu voudras te rappeler que tu comptes vraiment."}
              </p>
            </motion.div>
          </motion.div>

          {/* Birthday counter */}
          {daysAgo > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-white/50 text-xs uppercase tracking-[0.2em] font-custom-body"
            >
              Il y a {daysAgo} jour{daysAgo > 1 ? 's' : ''}, on célébrait ta journée spéciale
            </motion.p>
          )}
        </motion.div>
      )}
    </div>
  );
}
