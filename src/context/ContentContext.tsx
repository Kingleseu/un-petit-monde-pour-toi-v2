import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContent } from '../types';
import { defaultContent as baseDefaultContent } from '../../lib/defaultContent';

const defaultContent = baseDefaultContent as AppContent;

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

  const applyContent = (newContent: AppContent) => {
    setContent({
      ...defaultContent,
      ...newContent,
      guestbookForm: {
        ...defaultContent.guestbookForm,
        ...newContent.guestbookForm
      }
    });
  };

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/content?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        applyContent(data);
        localStorage.setItem('birthdayRoomContent', JSON.stringify(data));
        return;
      }
    } catch (e) {
      console.warn('Failed to fetch content, using local fallback:', e);
    }

    const saved = localStorage.getItem('birthdayRoomContent');
    if (saved) {
      try {
        applyContent(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved content', e);
      }
    }
  };

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
    fetchContent();
    fetchMessages();
  }, []);

  const updateContent = (newContent: AppContent) => {
    applyContent(newContent);
    localStorage.setItem('birthdayRoomContent', JSON.stringify(newContent));

    fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContent)
    })
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          applyContent(data);
          localStorage.setItem('birthdayRoomContent', JSON.stringify(data));
        }
      })
      .catch(e => {
        console.warn('Failed to save content in database, local fallback kept:', e);
      });
  };

  const resetContent = () => {
    applyContent(defaultContent);
    localStorage.removeItem('birthdayRoomContent');

    fetch('/api/content', { method: 'DELETE' })
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          applyContent(data);
          localStorage.setItem('birthdayRoomContent', JSON.stringify(data));
        }
      })
      .catch(e => {
        console.warn('Failed to reset content in database:', e);
      });
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
