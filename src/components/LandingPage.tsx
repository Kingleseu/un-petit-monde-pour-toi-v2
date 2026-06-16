import { motion } from 'motion/react';
import { Crown, Sparkles, Heart, Globe2, ArrowRight, LayoutTemplate, Layers, Lock, Play } from 'lucide-react';

export default function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-[#070709] text-slate-200 font-sans overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="p-6 md:px-12 flex items-center justify-between relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Globe2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-semibold text-lg text-white tracking-tight">
            Un Petit Monde
          </span>
        </div>
        <button 
          onClick={onStart}
          className="text-sm font-medium hover:text-white text-slate-300 transition-colors"
        >
          Créer un projet
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-32 flex flex-col items-center text-center">
        
        {/* Striking Custom Logo Composite */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-12"
        >
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Outer rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-indigo-500/20 border-dashed"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-purple-500/20"
            />
            
            {/* Core logo */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-indigo-900 to-purple-900 flex items-center justify-center shadow-[0_0_80px_rgba(99,102,241,0.3)] border border-indigo-500/50">
               <Globe2 className="w-12 h-12 text-indigo-200 mb-2" strokeWidth={1} />
               <Heart className="w-6 h-6 text-rose-400 absolute bottom-9 fill-rose-400" />
            </div>

            {/* Orbiting element */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.8)] flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Le studio de création d'expériences uniques</span>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight max-w-4xl"
        >
          Créez un espace digital rien que pour <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400 italic">celles et ceux qui comptent.</span>
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl font-light leading-relaxed"
        >
          Bien plus qu'un simple message. Offrez une véritable capsule temporelle interactive, avec des musiques, des souvenirs cachés et des mots qui résonnent.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button 
            onClick={onStart}
            className="group flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-white text-black font-semibold text-base hover:bg-slate-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Faire un cadeau
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10">
            <Play className="w-4 h-4" />
            Voir un exemple
          </button>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full max-w-6xl text-left"
        >
          {[
            { icon: LayoutTemplate, color: "text-indigo-400", bg: "bg-indigo-400/10", title: "8 Modèles Premium", desc: "De la chronologie cinématographique à la douce romance, choisissez l'ambiance parfaite." },
            { icon: Layers, color: "text-purple-400", bg: "bg-purple-400/10", title: "Expérience Immersive", desc: "Animations fluides, typographie soignée et musique d'ambiance pour marquer les esprits." },
            { icon: Lock, color: "text-rose-400", bg: "bg-rose-400/10", title: "Espace Intime & Sécurisé", desc: "Protégez votre capsule avec un code PIN personnalisé. Un sanctuaire juste pour vous." }
          ].map((feat, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
              <div className={`w-12 h-12 rounded-2xl ${feat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feat.icon className={`w-6 h-6 ${feat.color}`} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feat.title}</h3>
              <p className="text-slate-400 font-light leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
