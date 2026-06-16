import { motion } from 'motion/react';
import { Background } from '../components/Background';
import { StepIntro } from '../components/steps/Step1_Intro';
import { StepCapsule } from '../components/steps/Step2_Capsule';
import { StepGallery } from '../components/steps/Step3_Gallery';
import { StepPlaylist } from '../components/steps/Step4_Playlist';
import { StepLetter } from '../components/steps/Step5_Letter';
import { StepMessages } from '../components/steps/Step6_Messages';
import { StepSurprise } from '../components/steps/Step7_Surprise';
import { useContent } from '../context/ContentContext';

export function PastelScrapbookLayout() {
  const { content } = useContent();

  const noop = () => {};

  // For a scrapbook, we give each section a slight rotation and a "polaroid" or "note" card look.
  const sections = [
    { id: 'intro', Component: StepIntro, rotation: -2, x: -10 },
    { id: 'capsule', Component: StepCapsule, rotation: 3, x: 15 },
    { id: 'gallery', Component: StepGallery, rotation: -1, x: 5 },
    { id: 'playlist', Component: StepPlaylist, rotation: 2, x: -5 },
    { id: 'letter', Component: StepLetter, rotation: -3, x: 10 },
    { id: 'messages', Component: StepMessages, rotation: 1, x: -15 },
    { id: 'surprise', Component: StepSurprise, rotation: 0, x: 0 },
  ];

  return (
    <>
      <Background step={0} />

      <main className="relative z-10 w-full min-h-screen py-24 overflow-x-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col gap-24 sm:gap-32">
          {sections.map(({ id, Component, rotation, x }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 50, rotate: rotation - 5, x: x - 20 }}
              whileInView={{ opacity: 1, y: 0, rotate: rotation, x: x }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="relative"
            >
              {/* Scrapbook Tape / Pin effects could go here */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-md rotate-2 z-20 shadow-sm" />
              
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 sm:p-12 shadow-xl border border-white/50 relative overflow-hidden">
                <Component onNext={noop} />
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </>
  );
}
