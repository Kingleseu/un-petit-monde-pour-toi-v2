export type MediaType = 'image' | 'video' | 'none';

export type TransitionType = 'fade' | 'slide' | 'zoom' | 'blur' | 'reveal';

export type ThemeTemplate = 'cinematic' | 'timeline' | 'scrapbook' | 'echo' | 'eclat' | 'murmure' | 'romance' | 'starlight' | 'minimal' | 'classic';

export interface Step {
  id: string;
  title: string;
  content: string;
  mediaType: MediaType;
  mediaUrl?: string;
  transition: TransitionType;
  type?: 'standard' | 'gallery' | 'words' | 'music';
  meta?: Record<string, any>; // Specific configuration per step depending on the template (e.g., author name, audio config)
}

export interface Story {
  id: string;
  title: string;
  recipientName: string;
  themeTemplate: ThemeTemplate;
  steps: Step[];
  config?: Record<string, any>; // Global configuration for the template (e.g., pinCode, ambiance music)
}
