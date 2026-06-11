import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function Background() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Only access window on client
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (windowSize.width === 0) return null;

  // Generate some random positions for stars/particles
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * windowSize.width,
    y: Math.random() * windowSize.height,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050508]">
      {/* Starry Background Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      
      {/* Soft gradient orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-[#4A3AFF] blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      {/* Floating particles (stars) */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: [p.y, p.y - 100, p.y],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
          className="absolute rounded-full bg-[#D4AF37]/50"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            boxShadow: `0 0 ${p.size * 2}px rgba(212, 175, 55, 0.3)`,
          }}
        />
      ))}
    </div>
  );
}
