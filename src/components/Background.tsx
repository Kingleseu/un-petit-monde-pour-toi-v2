import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface BackgroundProps {
  step?: number;
}

export function Background({ step = 0 }: BackgroundProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (windowSize.width === 0) return null;

  // Step-specific color schemes
  const stepConfigs = {
    0: { bg: '#1a0033', orb: '#6a4aff', particles: '#D4AF37', label: 'lock' }, // Deep purple
    1: { bg: '#0f1a2e', orb: '#4a5aff', particles: '#fdb0a0', label: 'intro' }, // Blue night
    2: { bg: '#2d1b1b', orb: '#8b6f47', particles: '#d4af37', label: 'capsule' }, // Warm brown/gold
    3: { bg: '#3d1a2e', orb: '#c85a6e', particles: '#d4a5a0', label: 'gallery' }, // Rose old
    4: { bg: '#1a2d3d', orb: '#6a3aff', particles: '#d4af37', label: 'playlist' }, // Purple deep
    5: { bg: '#2a2015', orb: '#8b7355', particles: '#fdeea0', label: 'letter' }, // Parchment
    6: { bg: '#3d1f2d', orb: '#ff6a8a', particles: '#d4af37', label: 'messages' }, // Rose coral
    7: { bg: '#1a1a1a', orb: '#d4af37', particles: '#fdeea0', label: 'surprise' }, // Dark gold
  };

  const config = stepConfigs[step as keyof typeof stepConfigs] || stepConfigs[0];

  // Generate particles
  const particles = Array.from({ length: 45 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 0.5,
    x: Math.random() * windowSize.width,
    y: Math.random() * windowSize.height,
    duration: Math.random() * 25 + 20,
    delay: Math.random() * 5,
    vx: (Math.random() - 0.5) * 2,
  }));

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden transition-colors duration-1000" style={{ backgroundColor: config.bg }}>
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${config.orb}33 0%, transparent 70%)`,
        }}
      />

      {/* Starfield overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }} 
      />

      {/* Breathing main orb */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.2, 0.12],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 w-[100vw] h-[100vw] max-w-[900px] max-h-[900px] rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ backgroundColor: `${config.orb}40` }}
      />

      {/* Secondary accent orb (step-specific) */}
      {step !== 0 && (
        <motion.div
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full blur-[140px] pointer-events-none"
          style={{ backgroundColor: `${config.particles}30` }}
        />
      )}

      {/* Floating particles (fireflies) */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: [p.y, p.y - 150, p.y],
            x: [p.x, p.x + p.vx * 30, p.x],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            backgroundColor: config.particles,
            boxShadow: `0 0 ${p.size * 3}px ${config.particles}80`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  );
}
