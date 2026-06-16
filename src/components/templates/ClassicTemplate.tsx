import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { Background } from '../Background';
import { ChapterNav } from '../ChapterNav';
import { ProgressBar } from '../ProgressBar';
import { TransitionScreen } from '../TransitionScreen';
import { StepLock } from '../steps/Step0_Lock';
import { StepIntro } from '../steps/Step1_Intro';
import { StepCapsule } from '../steps/Step2_Capsule';
import { StepGallery } from '../steps/Step3_Gallery';
import { StepPlaylist } from '../steps/Step4_Playlist';
import { StepLetter } from '../steps/Step5_Letter';
import { StepMessages } from '../steps/Step6_Messages';
import { StepSurprise } from '../steps/Step7_Surprise';
import { ContentContext, useContent } from '../../context/ContentContext';
import { BackgroundMusic } from '../BackgroundMusic';
import { Story } from '../../types_v2';
import { AppContent } from '../../types';
import { defaultContent as baseDefaultContent } from '../../../lib/defaultContent';

const defaultClassicContent = baseDefaultContent as AppContent;

const asArray = <T,>(value: unknown, fallback: T[]): T[] => (
  Array.isArray(value) ? value as T[] : fallback
);

export default function ClassicTemplate({ story }: { story: Story }) {
  const lockCode = String(story.config?.unlockCode ?? story.config?.pinCode ?? '');
  const [isUnlocked, setIsUnlocked] = useState(!lockCode);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    if (!lockCode) {
      setIsUnlocked(true);
    } else {
      setIsUnlocked(false);
    }
  }, [lockCode]);

  const galleryPhotos = asArray<AppContent['galleryPhotos'][number]>(
    story.config?.galleryPhotos,
    asArray<AppContent['galleryPhotos'][number]>(
      story.config?.galleryMedia,
      defaultClassicContent.galleryPhotos
    ).map((photo: any) => (
      typeof photo === 'string'
        ? { url: photo, caption: '' }
        : { url: photo?.url || '', caption: photo?.caption || '' }
    ))
  );

  const letterParts = asArray<string>(
    story.config?.letterParts,
    typeof story.config?.letterContent === 'string' && story.config.letterContent
      ? String(story.config.letterContent).split('\n\n')
      : defaultClassicContent.letterParts
  );

  const mappedContent: AppContent = {
    ...defaultClassicContent,
    templateId: story.config?.classicTheme || defaultClassicContent.templateId || 'romance',
    transitionType: story.config?.classicTransition || defaultClassicContent.transitionType || 'fade',
    unlockCode: lockCode,
    audioUrl: story.config?.audioUrl ?? defaultClassicContent.audioUrl,
    recipientName: story.recipientName || 'Toi',
    
    introText1: story.config?.introText1 ?? defaultClassicContent.introText1,
    introText2: story.config?.introText2 ?? defaultClassicContent.introText2,
    introText3: story.config?.introText3 ?? defaultClassicContent.introText3,
    
    capsuleCards: asArray<AppContent['capsuleCards'][number]>(
      story.config?.capsuleCards,
      defaultClassicContent.capsuleCards
    ),
    
    galleryPhotos,
    
    playlistTitle: story.config?.playlistTitle ?? defaultClassicContent.playlistTitle,
    playlistSubtitle: story.config?.playlistSubtitle ?? defaultClassicContent.playlistSubtitle,
    playlistMode: story.config?.playlistMode ?? defaultClassicContent.playlistMode ?? 'single',
    playlistUrl: story.config?.playlistUrl ?? defaultClassicContent.playlistUrl ?? '',
    playlistNote: story.config?.playlistNote ?? defaultClassicContent.playlistNote ?? '',
    playlistTracks: asArray<AppContent['playlistTracks'][number]>(
      story.config?.playlistTracks,
      defaultClassicContent.playlistTracks || []
    ),
    
    letterParts,
    
    friendMessages: asArray<AppContent['friendMessages'][number]>(
      story.config?.friendMessages,
      defaultClassicContent.friendMessages
    ),
    defaultWords: asArray<string>(story.config?.defaultWords, defaultClassicContent.defaultWords || []),
    guestbookForm: {
      ...defaultClassicContent.guestbookForm!,
      ...(story.config?.guestbookForm || {}),
      title: story.config?.guestbookTitle || story.config?.guestbookForm?.title || defaultClassicContent.guestbookForm!.title,
      description: story.config?.guestbookDesc || story.config?.guestbookForm?.description || defaultClassicContent.guestbookForm!.description
    },
    
    surpriseTitle: story.config?.surpriseTitle ?? defaultClassicContent.surpriseTitle,
    surpriseSubtitle: story.config?.surpriseSubtitle ?? defaultClassicContent.surpriseSubtitle,
    surpriseText: story.config?.surpriseText ?? defaultClassicContent.surpriseText,
    
    transitionMessages: asArray<string>(story.config?.transitionMessages, defaultClassicContent.transitionMessages || [])
  };

  const mockContextValue = {
    content: mappedContent,
    updateContent: () => {},
    resetContent: () => {},
    audioPlaying,
    setAudioPlaying,
    dynamicMessages: [],
    addMessage: async () => true,
    deleteMessage: async () => true,
    refreshMessages: async () => {}
  };

  return (
    <ContentContext.Provider value={mockContextValue}>
      <ClassicContentWrapper isUnlocked={isUnlocked} onUnlock={() => setIsUnlocked(true)} />
    </ContentContext.Provider>
  );
}

function ClassicContentWrapper({ isUnlocked, onUnlock }: { isUnlocked: boolean, onUnlock: () => void }) {
  const [step, setStep] = useState(isUnlocked ? 1 : 0);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
  const { content, audioPlaying, setAudioPlaying } = useContent();

  useEffect(() => {
    if (!isUnlocked) {
      setStep(0);
      return;
    }
    setStep((current) => current === 0 ? 1 : current);
  }, [isUnlocked]);

  const nextStep = () => {
    if (step === 0) {
      onUnlock();
      setStep(1);
      return;
    }
    if (step < 7) {
      const messages = content.transitionMessages?.filter(Boolean) || [];
      setTransitionMessage(messages[step % messages.length] || "Le chapitre suivant s'ouvre...");
      setShowTransition(true);

      setTimeout(() => {
        const container = document.getElementById('preview-container') || window;
        container.scrollTo({ top: 0, behavior: 'smooth' });
        setStep((s: number) => Math.min(s + 1, 7));
        setShowTransition(false);
      }, 2400);
    }
  };

  const progress = (step / 7) * 100;
  const themeClass = `theme-${content.templateId || 'romance'}`;

  return (
    <div id="preview-container" className={`min-h-full relative font-sans text-slate-100 overflow-x-hidden overflow-y-auto ${themeClass} h-full`}>
      <Background step={step} />
      <BackgroundMusic />
      <ProgressBar progress={progress} />
      <ChapterNav currentStep={step} />
      <TransitionScreen isVisible={showTransition} message={transitionMessage} />
      
      {content.audioUrl && step > 0 && (
        <button 
          onClick={() => setAudioPlaying(!audioPlaying)} 
          className="absolute bottom-4 right-16 z-50 p-2 opacity-50 hover:opacity-100 transition-opacity bg-white/10 hover:bg-[#D4AF37] rounded-full border border-white/10 hover:border-[#D4AF37] hover:text-[#050508] shadow-lg text-white" 
          title={audioPlaying ? "Couper le son" : "Activer le son"}
        >
          {audioPlaying ? (
            <Volume2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <VolumeX className="w-5 h-5 flex-shrink-0" />
          )}
        </button>
      )}

      <main className={`relative z-10 w-full min-h-[800px] h-full flex items-center justify-center ${step > 0 ? 'pb-28 sm:pb-24' : ''}`}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step-0" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepLock onUnlock={nextStep} />
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="step-1" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepIntro onNext={nextStep} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step-2" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepCapsule onNext={nextStep} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step-3" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepGallery onNext={nextStep} />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="step-4" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepPlaylist onNext={nextStep} />
            </motion.div>
          )}
          {step === 5 && (
            <motion.div key="step-5" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepLetter onNext={nextStep} />
            </motion.div>
          )}
          {step === 6 && (
            <motion.div key="step-6" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepMessages onNext={nextStep} />
            </motion.div>
          )}
          {step === 7 && (
            <motion.div key="step-7" className="w-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
              <StepSurprise />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
