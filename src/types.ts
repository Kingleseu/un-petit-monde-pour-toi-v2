export interface AppContent {
  recipientName: string;
  introText1: string;
  introText2: string;
  introText3: string;
  capsuleCards: { title: string; content: string }[];
  galleryPhotos: { url: string; caption: string }[];
  playlistTitle: string;
  playlistSubtitle: string;
  letterParts: string[];
  friendMessages: { text: string; author: string; word?: string }[];
  defaultWords?: string[];
  surpriseTitle: string;
  surpriseSubtitle: string;
  surpriseText: string;
  unlockCode: string;
  audioUrl?: string;
  transitionMessages?: string[];
  guestbookForm?: {
    title: string;
    description: string;
    authorLabel: string;
    authorPlaceholder: string;
    wordLabel: string;
    wordPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitText: string;
    submittingText: string;
    successTitle: string;
    successMessage: string;
    writeAnotherText: string;
  };
}
