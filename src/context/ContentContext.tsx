import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContent } from '../types';

const defaultContent: AppContent = {
  recipientName: "Toi",
  introText1: "Ce site existe pour une seule personne : ",
  introText2: "Aujourd'hui, je ne voulais pas juste t'envoyer un message. Je voulais te créer un petit endroit à toi.",
  introText3: "À l'intérieur, il y a des souvenirs, des mots, des sourires, et une surprise.",
  capsuleCards: [
    {
      title: "Ce que j'aime chez toi",
      content: "Ta capacité à rendre n'importe quel moment banal en quelque chose de spécial et chaleureux."
    },
    {
      title: "Un souvenir gravé",
      content: "Ce jour-là où l'on a ri pour absolument rien. Je m'en souviens comme si c'était hier."
    },
    {
      title: "Ta qualité cachée",
      content: "Ton écoute silencieuse. Tu as cette manière unique de rassurer sans même avoir besoin de parler."
    },
    {
      title: "Ce que tu mérites",
      content: "De te voir avec les mêmes yeux que ceux avec lesquels je te regarde. Tu es exceptionnel(le)."
    },
    {
      title: "Une phrase pour toi",
      content: "\"Ne change jamais ta façon de briller, même quand tu doutes de ta propre lumière.\""
    }
  ],
  galleryPhotos: [
    {
      url: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93",
      caption: "Ce jour-là, je crois qu'on ne savait même pas que ça allait devenir un si beau souvenir."
    },
    {
      url: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9d779",
      caption: "Une image simple, mais un moment qui compte tellement pour moi."
    },
    {
      url: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59",
      caption: "Chaque détail de cette journée a sa propre histoire."
    }
  ],
  playlistTitle: "L'Air de la Mer",
  playlistSubtitle: "02:45 / 04:12",
  letterParts: [
    "Je voulais que ce cadeau soit différent.",
    "Pas forcément grand, pas forcément cher. Mais personnel.",
    "Quelque chose qui montre que j'ai pris le temps de penser à toi, à ce que tu représentes, et à la manière dont tu mérites d'être célébré(e).",
    "Il y a des gens qui traversent la vie sans faire de bruit, et il y a toi.",
    "Tu as cette lumière qui fait du bien, cette présence qui rassure.",
    "Cette année, je te souhaite de réaliser à quel point tu es important(e) pour ceux qui t'entourent.",
    "N'oublie jamais que tu mérites ce qu'il y a de plus beau."
  ],
  friendMessages: [
    { text: "Joyeux anniversaire ! Reste cette personne extraordinaire que tu es.", author: "Un ami", word: "Extraordinaire" },
    { text: "Tu mérites tout le bonheur du monde. Profite de ta journée !", author: "Un proche", word: "Unique" },
    { text: "Une année de plus pour briller, grandir et inspirer tout le monde autour de toi.", author: "Quelqu'un qui tient à toi", word: "Inspirante" },
    { text: "Rien ne me fait plus plaisir que de te voir sourire aujourd'hui.", author: "Un(e) confident(e)", word: "Solaire" }
  ],
  surpriseTitle: "Ton vrai cadeau \n t'attend.",
  surpriseSubtitle: "Regarde bien dans l'enveloppe... ou autour de toi.",
  surpriseText: "Ce n'est pas le cadeau le plus cher, mais c'est sûrement l'un des plus sincères que j'ai faits. Ce site restera ici, accessible quand tu voudras te rappeler que tu comptes.",
  unlockCode: "",
  audioUrl: "https://www.youtube.com/watch?v=y7e-GC6oGIZ",
  transitionMessages: [
    "Le chapitre suivant s'ouvre...",
    "Un moment se dessine...",
    "Souffle doux avant la suite...",
    "L'aventure continue...",
    "Prepare ton coeur...",
    "La magie se prepare..."
  ]
};

interface ContentContextType {
  content: AppContent;
  updateContent: (newContent: AppContent) => void;
  resetContent: () => void;
  audioPlaying: boolean;
  setAudioPlaying: (playing: boolean) => void;
  dynamicMessages: { text: string; author: string; word?: string }[];
  addMessage: (text: string, author: string, word: string) => Promise<boolean>;
  refreshMessages: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<AppContent>(defaultContent);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [dynamicMessages, setDynamicMessages] = useState<{ text: string; author: string; word?: string }[]>([]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setDynamicMessages(data);
      }
    } catch (e) {
      console.warn("Failed to fetch dynamic messages, using static fallback:", e);
    }
  };

  const addMessage = async (text: string, author: string, word: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, author, word })
      });
      if (res.ok) {
        const data = await res.json();
        setDynamicMessages(data.messages);
        return true;
      }
    } catch (e) {
      console.error("Failed to add message", e);
    }
    // Fallback: add locally if backend is offline
    setDynamicMessages(prev => [...prev, { text, author, word }]);
    return true;
  };

  useEffect(() => {
    const saved = localStorage.getItem('birthdayRoomContent');
    if (saved) {
      try {
        setContent({ ...defaultContent, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to parse saved content", e);
      }
    }
    fetchMessages();
  }, []);

  const updateContent = (newContent: AppContent) => {
    setContent(newContent);
    localStorage.setItem('birthdayRoomContent', JSON.stringify(newContent));
  };

  const resetContent = () => {
    setContent(defaultContent);
    localStorage.removeItem('birthdayRoomContent');
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent, audioPlaying, setAudioPlaying, dynamicMessages, addMessage, refreshMessages: fetchMessages }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
