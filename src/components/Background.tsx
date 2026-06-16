import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useContent } from '../context/ContentContext';

interface BackgroundProps {
  step?: number;
}

export function Background({ step = 0 }: BackgroundProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const { content } = useContent();
  const templateId = content.templateId || 'romance';

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (windowSize.width === 0) return null;

  // Step-specific configs per template
  const themeConfigs = {
    romance: {
      0: { bg: '#1a0033', orb: '#6a4aff', particles: '#D4AF37' },
      1: { bg: '#0f1a2e', orb: '#4a5aff', particles: '#fdb0a0' },
      2: { bg: '#2d1b1b', orb: '#8b6f47', particles: '#d4af37' },
      3: { bg: '#3d1a2e', orb: '#c85a6e', particles: '#d4a5a0' },
      4: { bg: '#1a2d3d', orb: '#6a3aff', particles: '#d4af37' },
      5: { bg: '#2a2015', orb: '#8b7355', particles: '#fdeea0' },
      6: { bg: '#3d1f2d', orb: '#ff6a8a', particles: '#d4af37' },
      7: { bg: '#1a1a1a', orb: '#d4af37', particles: '#fdeea0' },
    },
    retro: {
      0: { bg: '#0c0816', orb: '#ff007f', particles: '#00f0ff' },
      1: { bg: '#050510', orb: '#00f0ff', particles: '#ff007f' },
      2: { bg: '#0d021a', orb: '#8a2be2', particles: '#00f0ff' },
      3: { bg: '#1b0022', orb: '#ff007f', particles: '#ff80df' },
      4: { bg: '#050920', orb: '#00f0ff', particles: '#8a2be2' },
      5: { bg: '#120224', orb: '#8a2be2', particles: '#ff007f' },
      6: { bg: '#1d0430', orb: '#ff007f', particles: '#00f0ff' },
      7: { bg: '#080018', orb: '#ff007f', particles: '#00f0ff' },
    },
    pastel: {
      0: { bg: '#fff5f5', orb: '#ffc6ff', particles: '#ffccd5' },
      1: { bg: '#f0f8ff', orb: '#bdf0ff', particles: '#ffccd5' },
      2: { bg: '#faf0e6', orb: '#ffd166', particles: '#b5ead7' },
      3: { bg: '#fff0f5', orb: '#ffc6ff', particles: '#ffccd5' },
      4: { bg: '#f4f9f4', orb: '#b5ead7', particles: '#e8aeff' },
      5: { bg: '#fffaf0', orb: '#ffe5d9', particles: '#ffd166' },
      6: { bg: '#fff0f5', orb: '#ffb7b2', particles: '#e8aeff' },
      7: { bg: '#fff5f5', orb: '#ffccd5', particles: '#ffd166' },
    },
    minimal: {
      0: { bg: '#080808', orb: '#333333', particles: '#ffffff' },
      1: { bg: '#0b0b0b', orb: '#222222', particles: '#888888' },
      2: { bg: '#060606', orb: '#333333', particles: '#aaaaaa' },
      3: { bg: '#0d0d0d', orb: '#2c2c2c', particles: '#ffffff' },
      4: { bg: '#090909', orb: '#333333', particles: '#888888' },
      5: { bg: '#050505', orb: '#1a1a1a', particles: '#ffffff' },
      6: { bg: '#0c0c0c', orb: '#262626', particles: '#aaaaaa' },
      7: { bg: '#080808', orb: '#444444', particles: '#ffffff' },
    }
  };

  const currentThemeConfigs = themeConfigs[templateId as keyof typeof themeConfigs] || themeConfigs.romance;
  const config = currentThemeConfigs[step as keyof typeof currentThemeConfigs] || currentThemeConfigs[0];

  // Generate particles
  const particlesCount = templateId === 'minimal' ? 25 : templateId === 'pastel' ? 30 : 45;
  const particles = Array.from({ length: particlesCount }).map((_, i) => ({
    id: i,
    size: templateId === 'pastel' ? Math.random() * 8 + 4 : Math.random() * 3 + 0.5,
    x: Math.random() * windowSize.width,
    y: Math.random() * windowSize.height,
    duration: Math.random() * 20 + (templateId === 'pastel' ? 12 : 20),
    delay: Math.random() * 5,
    vx: (Math.random() - 0.5) * (templateId === 'retro' ? 4 : 2),
  }));

  return (
    <div className={`fixed inset-0 z-[-1] overflow-hidden transition-colors duration-1000 ${templateId === 'retro' ? 'crt-overlay' : ''}`} style={{ backgroundColor: config.bg }}>
      
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${config.orb}33 0%, transparent 70%)`,
        }}
      />

      {/* Starfield overlay (only for romance & retro) */}
      {(templateId === 'romance' || templateId === 'retro') && (
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: templateId === 'retro' ? '60px 60px' : '50px 50px' }} 
        />
      )}

      {/* Retro Synthwave Grid (only for retro) */}
      {templateId === 'retro' && (
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundPosition: 'center bottom',
            backgroundImage: `
              linear-gradient(to right, ${config.particles} 1px, transparent 1px),
              linear-gradient(to bottom, ${config.particles} 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: '50% 100%',
            bottom: '-30%',
          }}
        />
      )}

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

      {/* Floating particles */}
      {particles.map((p) => {
        // Different animations per template
        let particleStyle = {};
        
        if (templateId === 'pastel') {
          // Pastel bubbles rising
          return (
            <motion.div
              key={p.id}
              animate={{
                y: [windowSize.height + 20, -20],
                x: [p.x, p.x + p.vx * 25, p.x],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: 'easeInOut',
              }}
              className="absolute rounded-full border border-white/20"
              style={{
                width: p.size,
                height: p.size,
                left: p.x,
                backgroundColor: config.particles,
                boxShadow: `0 0 10px ${config.particles}60`,
              }}
            />
          );
        } else if (templateId === 'retro') {
          // Retro pixel stars falling or glitching
          return (
            <motion.div
              key={p.id}
              animate={{
                y: [-20, windowSize.height + 20],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: p.duration * 0.5,
                repeat: Infinity,
                delay: p.delay,
                ease: 'linear',
              }}
              className="absolute bg-square"
              style={{
                width: p.size * 1.5,
                height: p.size * 1.5,
                left: p.x,
                backgroundColor: config.particles,
                boxShadow: `0 0 8px ${config.particles}`,
                clipPath: 'inset(0% 0% 0% 0%)', // square-ish look
              }}
            />
          );
        } else {
          // Classic romance or minimal (slow floats)
          return (
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
                boxShadow: `0 0 ${p.size * (templateId === 'minimal' ? 2 : 4)}px ${config.particles}aa`,
                filter: 'blur(0.5px)',
              }}
            />
          );
        }
      })}
    </div>
  );
}
