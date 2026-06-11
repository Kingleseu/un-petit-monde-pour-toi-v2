import { motion } from 'motion/react';
import { ArrowRight, Heart } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface Props {
  onNext: () => void;
}

export function StepMessages({ onNext }: Props) {
  const { content } = useContent();
  return (
    <div className="min-h-screen py-20 px-6 max-w-6xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <Heart className="w-6 h-6 text-[#D4AF37] mx-auto mb-4 opacity-75" />
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 tracking-wide">Quelques mots des autres</h2>
        <p className="text-white/60 font-light text-lg">
          Parce que je ne suis pas le seul à penser ça.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-20">
        {content.friendMessages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.8 }}
            className={`bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col justify-between shadow-xl ${idx % 2 === 0 ? 'mt-0' : 'lg:mt-12'}`}
          >
            <div className="border-l-2 border-[#D4AF37] pl-4">
              <p className="text-white/80 font-serif leading-relaxed text-lg mb-6 break-words italic">
                "{msg.text}"
              </p>
              <div className="w-full flex justify-end">
                <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest">— {msg.author}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="group flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/10 hover:bg-white/20 text-white rounded-full transition-colors mt-8 text-sm uppercase tracking-widest"
      >
        <span className="font-medium">La dernière étape</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}
