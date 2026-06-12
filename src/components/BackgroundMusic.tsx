import { useCallback, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';

function getYoutubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function BackgroundMusic() {
  const { content, audioPlaying } = useContent();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytRef = useRef<HTMLIFrameElement | null>(null);

  const url = content.audioUrl || '';
  const ytId = getYoutubeId(url);
  const isYoutube = !!ytId;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const sendYoutubeCommand = useCallback((command: string) => {
    ytRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: command, args: '' }),
      '*'
    );
  }, []);

  // Sync HTML5 audio
  useEffect(() => {
    if (!isYoutube && url) {
      if (!audioRef.current || audioRef.current.src !== url) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(url);
        audioRef.current.loop = true;
      }

      if (audioPlaying) {
        audioRef.current.play().catch(err => {
          console.warn("Background audio play failed (blocked by browser):", err);
        });
      } else {
        audioRef.current.pause();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioPlaying, url, isYoutube]);

  // Sync YouTube audio via postMessage
  useEffect(() => {
    if (isYoutube && ytRef.current) {
      if (audioPlaying) {
        sendYoutubeCommand('playVideo');
        const retry = window.setTimeout(() => sendYoutubeCommand('playVideo'), 700);
        return () => window.clearTimeout(retry);
      } else {
        sendYoutubeCommand('pauseVideo');
      }
    }
  }, [audioPlaying, isYoutube, sendYoutubeCommand, url]);

  if (!url) return null;

  if (isYoutube && ytId) {
    return (
      <iframe
        ref={ytRef}
        src={`https://www.youtube.com/embed/${ytId}?enablejsapi=1&playsinline=1&autoplay=0&loop=1&playlist=${ytId}&controls=0&origin=${encodeURIComponent(origin)}`}
        className="fixed -top-[999px] -left-[999px] w-1 h-1 pointer-events-none opacity-0"
        title="Background Music"
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => {
          if (audioPlaying) {
            setTimeout(() => sendYoutubeCommand('playVideo'), 250);
            setTimeout(() => sendYoutubeCommand('playVideo'), 900);
          }
        }}
      />
    );
  }

  return null;
}
