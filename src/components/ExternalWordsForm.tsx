import { FormEvent, useMemo, useState } from 'react';
import { Heart, Send } from 'lucide-react';
import { ThemeTemplate } from '../types_v2';

type FormStyle = {
  shell: string;
  panel: string;
  eyebrow: string;
  title: string;
  text: string;
  input: string;
  button: string;
  accent: string;
};

const formStyles: Record<ThemeTemplate, FormStyle> = {
  classic: {
    shell: 'bg-[#120d16] text-rose-50',
    panel: 'bg-white/8 border-white/12 shadow-[0_30px_90px_rgba(0,0,0,0.35)]',
    eyebrow: 'text-rose-200/50',
    title: 'text-rose-50',
    text: 'text-rose-100/65',
    input: 'bg-black/25 border-white/12 text-white placeholder:text-white/25 focus:border-rose-300/60',
    button: 'bg-rose-100 text-rose-950 hover:bg-white',
    accent: 'bg-rose-300/20'
  },
  cinematic: {
    shell: 'bg-black text-white',
    panel: 'bg-white/6 border-white/12 shadow-[0_30px_90px_rgba(0,0,0,0.5)]',
    eyebrow: 'text-white/45',
    title: 'text-white',
    text: 'text-white/65',
    input: 'bg-black/40 border-white/12 text-white placeholder:text-white/25 focus:border-white/60',
    button: 'bg-white text-black hover:bg-white/90',
    accent: 'bg-white/10'
  },
  timeline: {
    shell: 'bg-stone-100 text-stone-950',
    panel: 'bg-white/75 border-stone-300 shadow-2xl',
    eyebrow: 'text-stone-400',
    title: 'text-stone-950',
    text: 'text-stone-600',
    input: 'bg-stone-50 border-stone-300 text-stone-950 placeholder:text-stone-400 focus:border-stone-900',
    button: 'bg-stone-950 text-white hover:bg-stone-800',
    accent: 'bg-stone-300/50'
  },
  scrapbook: {
    shell: 'bg-[#f4ece3] text-stone-900',
    panel: 'bg-yellow-50/85 border-stone-300 shadow-2xl rotate-[-1deg]',
    eyebrow: 'text-stone-500',
    title: 'text-stone-900',
    text: 'text-stone-600',
    input: 'bg-white/75 border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-orange-700',
    button: 'bg-stone-900 text-yellow-50 hover:bg-stone-700',
    accent: 'bg-orange-200/60'
  },
  echo: {
    shell: 'bg-[#151515] text-stone-200',
    panel: 'bg-stone-950/70 border-stone-700 shadow-[0_30px_90px_rgba(0,0,0,0.45)]',
    eyebrow: 'text-stone-600',
    title: 'text-stone-200',
    text: 'text-stone-500',
    input: 'bg-black/35 border-stone-700 text-stone-100 placeholder:text-stone-600 focus:border-stone-300',
    button: 'bg-stone-200 text-stone-950 hover:bg-white',
    accent: 'bg-stone-500/10'
  },
  eclat: {
    shell: 'bg-[#facc15] text-black',
    panel: 'bg-white border-black shadow-[8px_8px_0_rgba(0,0,0,1)]',
    eyebrow: 'text-black/45',
    title: 'text-black',
    text: 'text-black/65',
    input: 'bg-white border-black text-black placeholder:text-black/35 focus:border-pink-500',
    button: 'bg-black text-white hover:bg-black/80',
    accent: 'bg-pink-400/30'
  },
  murmure: {
    shell: 'bg-[#050505] text-white',
    panel: 'bg-white/[0.04] border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.6)]',
    eyebrow: 'text-white/25',
    title: 'text-white/85',
    text: 'text-white/45',
    input: 'bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus:border-white/45',
    button: 'bg-white/85 text-black hover:bg-white',
    accent: 'bg-white/[0.04]'
  },
  romance: {
    shell: 'bg-[#18131A] text-rose-50',
    panel: 'bg-[#FAF7F2] border-amber-900/20 shadow-2xl',
    eyebrow: 'text-amber-900/55',
    title: 'text-[#2A2421]',
    text: 'text-[#3D3531]/70',
    input: 'bg-white/75 border-amber-900/20 text-[#2A2421] placeholder:text-amber-900/35 focus:border-rose-400',
    button: 'bg-[#2A2421] text-rose-50 hover:bg-[#3D3531]',
    accent: 'bg-rose-200/55'
  },
  starlight: {
    shell: 'bg-[#050B14] text-blue-50',
    panel: 'bg-blue-950/45 border-blue-400/25 shadow-[0_0_70px_rgba(59,130,246,0.22)]',
    eyebrow: 'text-blue-300/50',
    title: 'text-blue-50',
    text: 'text-blue-100/65',
    input: 'bg-blue-950/40 border-blue-400/20 text-blue-50 placeholder:text-blue-200/25 focus:border-blue-200',
    button: 'bg-blue-200 text-blue-950 hover:bg-white',
    accent: 'bg-blue-400/15'
  },
  minimal: {
    shell: 'bg-[#080808] text-white',
    panel: 'bg-white/[0.05] border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.45)]',
    eyebrow: 'text-white/30',
    title: 'text-white',
    text: 'text-white/55',
    input: 'bg-white/[0.04] border-white/10 text-white placeholder:text-white/25 focus:border-white/60',
    button: 'bg-white text-black hover:bg-white/85',
    accent: 'bg-white/[0.04]'
  }
};

const isTemplate = (value: string): value is ThemeTemplate => (
  ['classic', 'cinematic', 'timeline', 'scrapbook', 'echo', 'eclat', 'murmure', 'romance', 'starlight', 'minimal'].includes(value)
);

export default function ExternalWordsForm() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const requestedTemplate = params.get('template') || 'romance';
  const template = isTemplate(requestedTemplate) ? requestedTemplate : 'romance';
  const styles = formStyles[template];
  const recipientName = params.get('name') || 'cette personne';
  const stepId = params.get('step') || '';
  const storyTitle = params.get('story') || 'Un petit monde';
  const stepTitle = params.get('stepTitle') || 'Les mots des proches';

  const [author, setAuthor] = useState('');
  const [word, setWord] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!author.trim() || !message.trim()) return;

    setStatus('sending');
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: message.trim(),
          author: author.trim(),
          word: word.trim(),
          template,
          stepId,
          recipientName
        })
      });

      if (!response.ok) throw new Error('Unable to send message');

      setStatus('success');
      setAuthor('');
      setWord('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className={`min-h-screen w-full overflow-hidden relative flex items-center justify-center px-5 py-10 font-sans ${styles.shell}`}>
      <div className={`absolute inset-0 pointer-events-none ${template === 'scrapbook' ? 'opacity-[0.07]' : 'opacity-100'}`} style={template === 'scrapbook' ? { backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' } : undefined} />
      {template === 'starlight' && (
        <div className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(147,197,253,0.35) 0 1px, transparent 2px), radial-gradient(circle at 70% 35%, rgba(255,255,255,0.45) 0 1px, transparent 2px), radial-gradient(circle at 40% 80%, rgba(147,197,253,0.25) 0 1px, transparent 2px)' }} />
      )}
      <div className={`absolute w-80 h-80 rounded-full blur-3xl pointer-events-none ${styles.accent}`} />

      <section className={`relative z-10 w-full max-w-xl rounded-[28px] border p-7 md:p-10 backdrop-blur-md ${styles.panel}`}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full border border-current/20 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-[10px] uppercase tracking-[0.25em] font-bold ${styles.eyebrow}`}>{storyTitle}</p>
            <h1 className={`text-2xl md:text-3xl font-semibold leading-tight ${styles.title}`}>{stepTitle}</h1>
          </div>
        </div>

        {status === 'success' ? (
          <div className="py-10 text-center">
            <h2 className={`text-3xl font-semibold mb-4 ${styles.title}`}>Message envoye</h2>
            <p className={`leading-relaxed ${styles.text}`}>
              Merci. Tes mots vont rejoindre le monde prepare pour {recipientName}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className={`leading-relaxed ${styles.text}`}>
              Ajoute un mot pour {recipientName}. Il apparaitra dans l'etape partagee avec les autres messages.
            </p>

            <label className="block">
              <span className={`block text-xs uppercase tracking-[0.2em] font-bold mb-2 ${styles.eyebrow}`}>Ton nom</span>
              <input
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition-colors ${styles.input}`}
                placeholder="Ex: Marie"
                maxLength={80}
              />
            </label>

            <label className="block">
              <span className={`block text-xs uppercase tracking-[0.2em] font-bold mb-2 ${styles.eyebrow}`}>Un mot</span>
              <input
                value={word}
                onChange={(event) => setWord(event.target.value)}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition-colors ${styles.input}`}
                placeholder="Ex: Lumineuse, courageux, unique..."
                maxLength={40}
              />
            </label>

            <label className="block">
              <span className={`block text-xs uppercase tracking-[0.2em] font-bold mb-2 ${styles.eyebrow}`}>Message</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className={`w-full min-h-40 rounded-xl border px-4 py-3 outline-none resize-none transition-colors ${styles.input}`}
                placeholder="Ecris quelques phrases sinceres..."
                maxLength={600}
              />
            </label>

            {status === 'error' && (
              <p className="text-sm text-red-400">Impossible d'envoyer le message pour le moment.</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending' || !author.trim() || !message.trim()}
              className={`w-full rounded-full px-5 py-4 font-bold uppercase tracking-[0.18em] text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-45 disabled:cursor-not-allowed ${styles.button}`}
            >
              {status === 'sending' ? 'Envoi...' : 'Envoyer le message'}
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
