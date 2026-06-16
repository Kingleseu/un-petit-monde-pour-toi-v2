import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useContent } from '../context/ContentContext';

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  isSquare: boolean;
}

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const { content } = useContent();
  const templateId = content.templateId || 'romance';

  useEffect(() => {
    // Colors by theme
    let colors = ['#D4AF37', '#fdeea0', '#ff6b9d', '#ffffff', '#a78bfa']; // romance
    if (templateId === 'retro') {
      colors = ['#ff007f', '#00f0ff', '#8a2be2', '#00ffcc', '#ff80df'];
    } else if (templateId === 'pastel') {
      colors = ['#ff9aa2', '#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7', '#c7ceea'];
    } else if (templateId === 'minimal') {
      colors = ['#ffffff', '#cccccc', '#888888', '#aaaaaa', '#dddddd'];
    }

    const newPieces: ConfettiPiece[] = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2.5 + Math.random() * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: templateId === 'pastel' ? Math.random() * 12 + 6 : Math.random() * 8 + 4,
      isSquare: templateId === 'retro' ? Math.random() > 0.2 : Math.random() > 0.5,
    }));
    setPieces(newPieces);
  }, [templateId]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ 
            opacity: 1, 
            y: -20, 
            x: 0,
            rotate: 0 
          }}
          animate={{ 
            opacity: 0, 
            y: window.innerHeight + 100,
            x: (Math.random() - 0.5) * 200,
            rotate: Math.random() * 720
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
          className="absolute"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: templateId === 'pastel' ? '50%' : piece.isSquare ? '0%' : '50%',
            boxShadow: templateId === 'minimal' ? 'none' : `0 0 10px ${piece.color}80`,
          }}
        />
      ))}
    </div>
  );
}
