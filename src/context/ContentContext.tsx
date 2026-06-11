import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContent } from '../types';

const defaultContent: AppContent = {
  recipientName: 'Toi',
  introText1: 'Ce site existe pour une seule personne : ',
  introText2: "Aujourd'hui, je ne voulais pas juste t'envoyer un message. Je voulais te creer un petit endroit a toi.",
  introText3: "A l'interieur, il y a des souvenirs, des mots, des sourires, et une surprise.",
  capsuleCards: [
    {
      title: "Ce que j'aime chez toi",
      content: "Ta capacite a rendre n'importe quel moment banal en quelque chose de special et chaleureux."
    },
    {
      title: 'Un souvenir grave',
      content: "Ce jour-la ou l'on a ri pour absolument rien. Je m'en souviens comme si c'etait hier."
    },
    {
      title: 'Ta qualite cachee',
      content: "Ton ecoute silencieuse. Tu as cette maniere unique de rassurer sans meme avoir besoin de parler."
    },
    {
      title: 'Ce que tu merites',
      content: 'De te voir avec les memes yeux que ceux avec lesquels je te regarde. Tu es exceptionnel(le).'
    },
    {
      title: 'Une phrase pour toi',
      content: '"Ne change jamais ta facon de briller, meme quand tu doutes de ta propre lumiere."'
    }
  ],
  galleryPhotos: [
    {
      url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93',
      caption: "Ce jour-la, je crois qu'on ne savait meme pas que ca allait devenir un si beau souvenir."
    },
    {
      url: 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9d779',
      caption: 'Une image simple, mais un moment qui compte tellement pour moi.'
    },
    {
      url: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59',
      caption: 'Chaque detail de cette journee a sa propre histoire.'
    }
  ],
  playlistTitle: "L'Air de la Mer",
  playlistSubtitle: '02:45 / 04:12',
  letterParts: [
    'Je voulais que ce cadeau soit different.',
    'Pas forcement grand, pas forcement cher. Mais personnel.',
    "Quelque chose qui montre que j'ai pris le temps de penser a toi, a ce que tu representes, et a la maniere dont tu merites d'etre celebre(e).",
    'Il y a des gens qui traversent la vie sans faire de bruit, et il y a toi.',
    'Tu as cette lumiere qui fait du bien, cette presence qui rassure.',
    "Cette annee, je te souhaite de realiser a quel point tu es important(e) pour ceux qui t'entourent.",
    "N'oublie jamais que tu merites ce qu'il y a de plus beau."
  ],
  friendMessages: [
    { text: 'Joyeux anniversaire ! Reste cette personne extraordinaire que tu es.', author: 'Un ami', word: 'Extraordinaire' },
    { text: 'Tu merites tout le bonheur du monde. Profite de ta journee !', author: 'Un proche', word: 'Unique' },
    { text: 'Une annee de plus pour briller, grandir et inspirer tout le monde autour de toi.', author: "Quelqu'un qui tient a toi", word: 'Inspirante' },
    { text: 'Rien ne me fait plus plaisir que de te voir sourire aujourd hui.', author: 'Un(e) confident(e)', word: 'Solaire' }
  ],
  defaultWords: [
    'Solaire',
    'Unique',
    'Bienveillante',
    'Lumineuse',
    'Sincere',
    'Drole',
    'Genereuse',
    'Brillante',
    'Attentionnee',
    'Douce',
    'Inestimable',
    'Magique',
    'Inspirante',
    'Rayonnante',
    'Precieuse',
    'Complice',
    'Formidable',
    'Extraordinaire',
    'Chaleureuse',
    'Fidele',
    'Souriante',
    'Optimiste',
    'Sensible',
    'Creative',
    'Adorable'
  ],
  surpriseTitle: 'Ton vrai cadeau \n t attend.',
  surpriseSubtitle: "Regarde bien dans l'enveloppe... ou autour de toi.",
  surpriseText: "Ce n'est pas le cadeau le plus cher, mais c'est surement l'un des plus sinceres que j'ai faits. Ce site restera ici, accessible quand tu voudras te rappeler que tu comptes.",
  unlockCode: '',
  audioUrl: 'https://www.youtube.com/watch?v=y7e-GC6oGIZ',
  transitionMessages: [
    "Le chapitre suivant s'ouvre...",
    'Un moment se dessine...',
    'Souffle doux avant la suite...',
    "L'aventure continue...",
    'Prepare ton coeur...',
    'La magie se prepare...'
  ],
  guestbookForm: {
    title: 'Un mot pour {name}',
    description: "Nous preparons une surprise interactive pour {name}. Ecrivez un souvenir, un voeu ou un petit mot qui apparaitra sur son mur d'anniversaire !",
    authorLabel: 'Votre Prenom / Nom',
    authorPlaceholder: "Ex: Marine, Ton frere, Un ami d'enfance...",
    wordLabel: 'Un mot qui decrit {name}',
    wordPlaceholder: 'Ex: Lumineuse, Solaire, Unique, Genereux...',
    messageLabel: 'Votre Message',
    messagePlaceholder: 'Votre message chaleureux...',
    submitText: 'Accrocher au mur',
    submittingText: 'Envoi en cours...',
    successTitle: 'Message envoye !',
    successMessage: 'Votre mot doux a bien ete envoye et accroche sur le mur de {name}. Merci pour votre participation !',
    writeAnotherText: 'Ecrire un autre message'
  }
};

interface ContentContextType {
  content: AppContent;
  updateContent: (newContent: AppContent) => void;
  resetContent: () => void;
  audioPlaying: boolean;
  setAudioPlaying: (playing: boolean) => void;
  dynamicMessages: { text: string; author: string; word?: string }[];
  addMessage: (text: string, author: string, word: string) => Promise<boolean>;
  deleteMessage: (index: number) => Promise<boolean>;
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
      console.warn('Failed to fetch dynamic messages, using static fallback:', e);
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
      console.error('Failed to add message', e);
    }

    setDynamicMessages(prev => [...prev, { text, author, word }]);
    return true;
  };

  const deleteMessage = async (index: number): Promise<boolean> => {
    try {
      const res = await fetch(`/api/messages?index=${index}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        setDynamicMessages(data.messages);
        return true;
      }
    } catch (e) {
      console.error('Failed to delete message', e);
    }

    setDynamicMessages(prev => prev.filter((_, i) => i !== index));
    return true;
  };

  useEffect(() => {
    const saved = localStorage.getItem('birthdayRoomContent');
    if (saved) {
      try {
        const savedContent = JSON.parse(saved);
        setContent({
          ...defaultContent,
          ...savedContent,
          guestbookForm: {
            ...defaultContent.guestbookForm,
            ...savedContent.guestbookForm
          }
        });
      } catch (e) {
        console.error('Failed to parse saved content', e);
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
    <ContentContext.Provider value={{ content, updateContent, resetContent, audioPlaying, setAudioPlaying, dynamicMessages, addMessage, deleteMessage, refreshMessages: fetchMessages }}>
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
