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

export function RetroTimelineLayout() {
  const { content } = useContent();
  const noop = () => {};

  const sections = [
    { id: 'SYS.INIT', label: 'INITIALIZATION', Component: StepIntro },
    { id: 'MEM.DUMP', label: 'MEMORY CAPSULE', Component: StepCapsule },
    { id: 'IMG.DAT', label: 'VISUAL ARCHIVE', Component: StepGallery },
    { id: 'AUD.LOG', label: 'AUDIO FREQUENCIES', Component: StepPlaylist },
    { id: 'TXT.MSG', label: 'ENCRYPTED TRANSMISSION', Component: StepLetter },
    { id: 'COM.NET', label: 'COMMUNICATIONS', Component: StepMessages },
    { id: 'SYS.OVR', label: 'SYSTEM OVERRIDE', Component: StepSurprise },
  ];

  return (
    <>
      <Background step={0} />

      <main className="relative z-10 w-full min-h-screen py-24 overflow-x-hidden font-mono text-[#00f0ff]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          
          {/* Vertical Timeline Line */}
          <div className="absolute left-[39px] sm:left-1/2 top-0 bottom-0 w-[2px] bg-[#00f0ff]/30 shadow-[0_0_10px_#00f0ff]" />

          {sections.map(({ id, label, Component }, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`relative flex flex-col sm:flex-row items-center gap-8 mb-32 ${isEven ? 'sm:flex-row-reverse' : ''}`}
              >
                {/* Timeline Node */}
                <div className="absolute left-[28px] sm:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-black border-[3px] border-[#ff007f] shadow-[0_0_15px_#ff007f] z-20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#00f0ff] rounded-full animate-pulse" />
                </div>

                {/* Content Container */}
                <div className="w-full sm:w-1/2 pl-24 sm:pl-0">
                  <div className={`border border-[#00f0ff]/40 bg-black/60 p-6 shadow-[0_0_20px_rgba(0,240,255,0.1)] backdrop-blur-md relative overflow-hidden group ${isEven ? 'sm:mr-12' : 'sm:ml-12'}`}>
                    
                    {/* Retro UI Accents */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f0ff] to-[#ff007f] opacity-50" />
                    <div className="text-xs text-[#ff007f] mb-4 tracking-widest font-bold border-b border-[#00f0ff]/20 pb-2">
                      [{id}] // {label}
                    </div>

                    <div className="relative z-10">
                      <Component onNext={noop} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </>
  );
}
