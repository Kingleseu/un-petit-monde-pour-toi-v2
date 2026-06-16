import { ExternalLink, ListMusic, Music2, PlayCircle } from 'lucide-react';
import { Step, ThemeTemplate } from '../../types_v2';

type MusicTrack = {
  title?: string;
  artist?: string;
  url?: string;
};

type VariantStyle = {
  panel: string;
  label: string;
  title: string;
  body: string;
  item: string;
  link: string;
};

const variantStyles: Record<ThemeTemplate, VariantStyle> = {
  classic: {
    panel: 'bg-white/10 border-white/15 text-white',
    label: 'text-white/50',
    title: 'text-white',
    body: 'text-white/70',
    item: 'bg-black/20 border-white/10',
    link: 'bg-white text-black hover:bg-white/90'
  },
  cinematic: {
    panel: 'bg-black/45 border-white/15 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]',
    label: 'text-white/45',
    title: 'text-white',
    body: 'text-white/70',
    item: 'bg-white/10 border-white/10',
    link: 'bg-white text-black hover:bg-white/90'
  },
  timeline: {
    panel: 'bg-stone-100 border-stone-300 text-stone-900 shadow-xl',
    label: 'text-stone-400',
    title: 'text-stone-900',
    body: 'text-stone-600',
    item: 'bg-white border-stone-200',
    link: 'bg-stone-900 text-white hover:bg-stone-700'
  },
  scrapbook: {
    panel: 'bg-yellow-50 border-stone-300 text-stone-900 shadow-md',
    label: 'text-stone-500',
    title: 'text-stone-900',
    body: 'text-stone-600',
    item: 'bg-white/70 border-stone-200',
    link: 'bg-stone-900 text-yellow-50 hover:bg-stone-700'
  },
  echo: {
    panel: 'bg-stone-950/70 border-stone-700 text-stone-200',
    label: 'text-stone-600',
    title: 'text-stone-200',
    body: 'text-stone-500',
    item: 'bg-stone-900/80 border-stone-800',
    link: 'bg-stone-200 text-stone-950 hover:bg-stone-300'
  },
  eclat: {
    panel: 'bg-white border-black text-black shadow-[5px_5px_0_rgba(0,0,0,1)]',
    label: 'text-black/50',
    title: 'text-black',
    body: 'text-black/70',
    item: 'bg-white border-black',
    link: 'bg-black text-white hover:bg-black/80'
  },
  murmure: {
    panel: 'bg-white/[0.04] border-white/10 text-white',
    label: 'text-white/25',
    title: 'text-white/80',
    body: 'text-white/45',
    item: 'bg-white/[0.03] border-white/10',
    link: 'bg-white/80 text-black hover:bg-white'
  },
  romance: {
    panel: 'bg-rose-50 border-amber-900/20 text-[#2A2421] shadow-lg',
    label: 'text-amber-900/50',
    title: 'text-[#2A2421]',
    body: 'text-[#3D3531]/75',
    item: 'bg-white/70 border-amber-900/10',
    link: 'bg-[#2A2421] text-rose-50 hover:bg-[#3D3531]'
  },
  starlight: {
    panel: 'bg-blue-950/45 border-blue-400/25 text-blue-50 shadow-[0_0_35px_rgba(59,130,246,0.15)]',
    label: 'text-blue-300/50',
    title: 'text-blue-50',
    body: 'text-blue-100/65',
    item: 'bg-blue-900/20 border-blue-400/20',
    link: 'bg-blue-200 text-blue-950 hover:bg-white'
  },
  minimal: {
    panel: 'bg-white/[0.05] border-white/10 text-white',
    label: 'text-white/30',
    title: 'text-white',
    body: 'text-white/55',
    item: 'bg-white/[0.04] border-white/10',
    link: 'bg-white text-black hover:bg-white/85'
  }
};

const audioPattern = /\.(mp3|wav|ogg|m4a|aac)(\?|#|$)/i;

const isDirectAudioUrl = (url: string) => audioPattern.test(url);

const getYoutubeEmbedUrl = (rawUrl: string) => {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, '');
    const list = url.searchParams.get('list');
    let videoId = '';

    if (host === 'youtu.be') {
      videoId = url.pathname.replace('/', '');
    } else if (host.includes('youtube.com')) {
      if (url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.split('/')[2] || '';
      } else if (url.pathname.startsWith('/shorts/')) {
        videoId = url.pathname.split('/')[2] || '';
      } else {
        videoId = url.searchParams.get('v') || '';
      }
    }

    if (!videoId && list) {
      return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(list)}`;
    }

    if (!videoId) return '';
    return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}${list ? `?list=${encodeURIComponent(list)}` : ''}`;
  } catch {
    return '';
  }
};

const getSpotifyEmbedUrl = (rawUrl: string) => {
  try {
    const url = new URL(rawUrl);
    if (!url.hostname.includes('open.spotify.com')) return '';

    const segments = url.pathname
      .split('/')
      .filter(Boolean)
      .filter((segment) => !segment.startsWith('intl-'));
    const [type, id] = segments;

    if (!type || !id) return '';
    if (!['album', 'artist', 'episode', 'playlist', 'show', 'track'].includes(type)) return '';

    return `https://open.spotify.com/embed/${type}/${id}`;
  } catch {
    return '';
  }
};

const getSoundCloudEmbedUrl = (rawUrl: string) => {
  try {
    const url = new URL(rawUrl);
    if (!url.hostname.includes('soundcloud.com')) return '';
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(rawUrl)}&color=%23ff5500&auto_play=false`;
  } catch {
    return '';
  }
};

const getEmbedUrl = (url: string) => (
  getYoutubeEmbedUrl(url) || getSpotifyEmbedUrl(url) || getSoundCloudEmbedUrl(url)
);

const cleanTracks = (tracks: unknown): MusicTrack[] => (
  Array.isArray(tracks)
    ? tracks
      .map((track) => track as MusicTrack)
      .filter((track) => track.title || track.artist || track.url)
    : []
);

function MusicSource({ url, styles }: { url: string; styles: VariantStyle }) {
  const embedUrl = getEmbedUrl(url);

  if (!url) return null;

  if (isDirectAudioUrl(url)) {
    return (
      <audio controls src={url} className="w-full h-10 mt-4" />
    );
  }

  if (embedUrl) {
    return (
      <iframe
        title="Lecteur musique"
        src={embedUrl}
        className="w-full h-28 mt-4 rounded-lg border-0 bg-black/10"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`mt-4 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${styles.link}`}
    >
      Ouvrir la musique <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

export default function StepMusicBlock({ step, template }: { step: Step; template: ThemeTemplate }) {
  const styles = variantStyles[template] || variantStyles.classic;
  const mode = step.meta?.musicMode === 'single' ? 'single' : 'playlist';
  const playlist = cleanTracks(step.meta?.playlist);
  const playlistUrl = String(step.meta?.playlistUrl || '').trim();
  const singleUrl = String(step.meta?.musicUrl || '').trim();
  const musicTitle = String(step.meta?.musicTitle || step.title || 'Musique').trim();
  const musicArtist = String(step.meta?.musicArtist || '').trim();
  const musicNote = String(step.meta?.musicNote || '').trim();

  if (mode === 'single' && !singleUrl && !musicNote) {
    return null;
  }

  if (mode === 'playlist' && !playlistUrl && playlist.length === 0 && !musicNote) {
    return null;
  }

  return (
    <div
      className={`pointer-events-auto mt-8 w-full max-w-xl rounded-2xl border p-5 backdrop-blur-md ${styles.panel}`}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full border border-current/20 flex items-center justify-center shrink-0">
          {mode === 'single' ? <Music2 className="w-5 h-5" /> : <ListMusic className="w-5 h-5" />}
        </div>
        <div className="min-w-0">
          <p className={`text-[10px] uppercase tracking-[0.25em] font-bold ${styles.label}`}>
            {mode === 'single' ? 'Vraie musique' : 'Playlist'}
          </p>
          <h3 className={`text-lg font-semibold leading-tight ${styles.title}`}>{musicTitle}</h3>
          {musicArtist && <p className={`text-xs mt-1 ${styles.body}`}>{musicArtist}</p>}
        </div>
      </div>

      {musicNote && <p className={`text-sm leading-relaxed mb-4 ${styles.body}`}>{musicNote}</p>}

      {mode === 'single' ? (
        <MusicSource url={singleUrl} styles={styles} />
      ) : (
        <div className="space-y-3">
          <MusicSource url={playlistUrl} styles={styles} />

          {playlist.map((track, index) => {
            const trackUrl = String(track.url || '').trim();
            const trackTitle = track.title || `Piste ${index + 1}`;
            const trackArtist = track.artist || 'Souvenir';

            return (
              <div key={`${trackTitle}-${index}`} className={`rounded-xl border p-3 ${styles.item}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm truncate ${styles.title}`}>{trackTitle}</p>
                    <p className={`text-xs truncate ${styles.body}`}>{trackArtist}</p>
                  </div>
                  {trackUrl && !isDirectAudioUrl(trackUrl) && (
                    <a
                      href={trackUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`shrink-0 inline-flex items-center justify-center rounded-full p-2 transition-colors ${styles.link}`}
                      aria-label={`Ouvrir ${trackTitle}`}
                    >
                      <PlayCircle className="w-4 h-4" />
                    </a>
                  )}
                </div>
                {trackUrl && isDirectAudioUrl(trackUrl) && (
                  <audio controls src={trackUrl} className="w-full h-9 mt-3" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
