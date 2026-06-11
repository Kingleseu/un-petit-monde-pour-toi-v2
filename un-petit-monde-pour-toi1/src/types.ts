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
  friendMessages: { text: string; author: string }[];
  surpriseTitle: string;
  surpriseSubtitle: string;
  surpriseText: string;
  unlockCode: string;
}
