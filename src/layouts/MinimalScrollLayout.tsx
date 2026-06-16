import { Background } from '../components/Background';
import { StepIntro } from '../components/steps/Step1_Intro';
import { StepCapsule } from '../components/steps/Step2_Capsule';
import { StepGallery } from '../components/steps/Step3_Gallery';
import { StepPlaylist } from '../components/steps/Step4_Playlist';
import { StepLetter } from '../components/steps/Step5_Letter';
import { StepMessages } from '../components/steps/Step6_Messages';
import { StepSurprise } from '../components/steps/Step7_Surprise';

export function MinimalScrollLayout() {
  const noop = () => {};

  const sections = [
    { id: 'intro', Component: StepIntro },
    { id: 'capsule', Component: StepCapsule },
    { id: 'gallery', Component: StepGallery },
    { id: 'playlist', Component: StepPlaylist },
    { id: 'letter', Component: StepLetter },
    { id: 'messages', Component: StepMessages },
    { id: 'surprise', Component: StepSurprise },
  ];

  return (
    <>
      <Background step={0} />

      <main className="relative z-10 w-full h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth pb-20">
        {sections.map(({ id, Component }, index) => (
          <section
            key={id}
            className="w-full min-h-screen snap-center flex flex-col items-center justify-center relative py-12"
          >
            {/* Minimal section indicator */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.3em] font-light">
              0{index + 1}
            </div>
            
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
              <Component onNext={noop} />
            </div>

            {/* Scroll indicator for all but last section */}
            {index < sections.length - 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
              </div>
            )}
          </section>
        ))}
      </main>
    </>
  );
}
