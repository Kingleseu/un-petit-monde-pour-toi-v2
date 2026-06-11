import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export function GuestbookForm() {
  const { content, addMessage } = useContent();
  const [newText, setNewText] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newWord, setNewWord] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !newAuthor.trim() || !newWord.trim()) return;

    setIsSubmitting(true);
    const ok = await addMessage(newText.trim(), newAuthor.trim(), newWord.trim());
    setIsSubmitting(false);

    if (ok) {
      setSuccess(true);
      setNewText('');
      setNewAuthor('');
      setNewWord('');
    } else {
      alert("Erreur lors de l'envoi du message.");
    }
  };

  const name = content.recipientName || 'Toi';

  return (
    <div className="w-full max-w-xl px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-[#050508]/80 border border-white/10 p-8 md:p-12 rounded-[2rem] backdrop-blur-md shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-white/5 border border-white/10 mb-4 shadow-xl shadow-[#D4AF37]/5">
            <Heart className="w-6 h-6 text-[#D4AF37] fill-current animate-pulse" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-white tracking-wide">
            Un mot pour {name}
          </h2>
          <p className="text-white/50 text-xs md:text-sm mt-2 max-w-sm mx-auto leading-relaxed">
            Nous préparons une surprise interactive pour {name}. Écrivez un souvenir, un voeu ou un petit mot qui apparaîtra sur son mur d'anniversaire !
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-bold">Votre Prénom / Nom</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Marine, Ton frère, Un ami d'enfance..."
              value={newAuthor}
              onChange={e => setNewAuthor(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#D4AF37] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-bold">Un mot qui décrit {name}</label>
            <input 
              type="text" 
              required
              maxLength={20}
              placeholder="Ex: Lumineuse, Solaire, Unique, Généreux..."
              value={newWord}
              onChange={e => setNewWord(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#D4AF37] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-bold">Votre Message</label>
            <textarea 
              required
              placeholder="Votre message chaleureux..."
              value={newText}
              onChange={e => setNewText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#D4AF37] outline-none transition-colors h-36 resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#D4AF37] text-[#050508] rounded-xl hover:bg-[#D4AF37]/90 text-xs uppercase font-bold tracking-widest transition-all shadow-lg shadow-[#D4AF37]/10 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Envoi en cours..." : "Accrocher au mur"}
          </button>
        </form>

        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#050508] flex flex-col items-center justify-center text-center p-6 z-20"
          >
            <Heart className="w-16 h-16 text-[#D4AF37] fill-current animate-bounce mb-6" />
            <h3 className="text-2xl font-serif text-white mb-3">Message envoyé !</h3>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed mb-6">
              Votre mot doux a bien été envoyé et accroché sur le mur de {name}. Merci pour votre participation !
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="px-6 py-2 border border-white/20 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-white/70 hover:text-[#D4AF37] rounded-full text-xs uppercase tracking-widest transition-colors"
            >
              Écrire un autre message
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
