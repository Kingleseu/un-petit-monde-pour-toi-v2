import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Story, ThemeTemplate, Step } from '../types_v2';
import { AppContent } from '../types';
import { defaultContent as baseDefaultContent } from '../../lib/defaultContent';
import CinematicTemplate from './templates/CinematicTemplate';
import TimelineTemplate from './templates/TimelineTemplate';
import ScrapbookTemplate from './templates/ScrapbookTemplate';
import EchoTemplate from './templates/EchoTemplate';
import EclatTemplate from './templates/EclatTemplate';
import MurmureTemplate from './templates/MurmureTemplate';
import RomanceTemplate from './templates/RomanceTemplate';
import StarlightTemplate from './templates/StarlightTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import {
  Clock,
  CloudMoon,
  Check,
  Copy,
  Crown,
  ExternalLink,
  Film,
  Flower2,
  Gem,
  GripVertical,
  Heart,
  LayoutTemplate,
  Plus,
  Save,
  Sparkles,
  Square,
  Sun,
  Trash2,
  UploadCloud,
  Wind,
  type LucideIcon
} from 'lucide-react';

type FieldType = 'text' | 'textarea' | 'select';

type FieldOption = {
  value: string;
  label: string;
};

type FieldConfig = {
  key: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  helper?: string;
  options?: FieldOption[];
};

type MusicTrack = {
  title: string;
  artist?: string;
  url?: string;
};

type ExternalMessage = {
  text: string;
  author: string;
  word?: string;
  template?: string;
  stepId?: string;
};

type StudioDraft = {
  story: Story;
  templateConfigs: Partial<Record<ThemeTemplate, Record<string, any>>>;
  templateSteps: Partial<Record<ThemeTemplate, Step[]>>;
  savedAt: string;
};

type TemplateProfile = {
  id: ThemeTemplate;
  label: string;
  desc: string;
  icon: LucideIcon;
  premium?: boolean;
  settings: FieldConfig[];
  stepFields: FieldConfig[];
};

const defaultClassicContent = baseDefaultContent as AppContent;
const studioDraftStorageKey = 'unPetitMondeStudioDraft';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const readStudioDraft = (): StudioDraft | null => {
  if (typeof window === 'undefined') return null;

  try {
    const rawDraft = window.localStorage.getItem(studioDraftStorageKey);
    if (!rawDraft) return null;

    const draft = JSON.parse(rawDraft) as StudioDraft;
    if (!draft?.story?.themeTemplate || !Array.isArray(draft.story.steps)) return null;
    return draft;
  } catch {
    return null;
  }
};

const formatSavedTime = (value: string) => {
  if (!value) return '';

  try {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  } catch {
    return '';
  }
};

const splitLines = (value: string) => value
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

const transitionOptions: FieldOption[] = [
  { value: 'fade', label: 'Fondu' },
  { value: 'slide', label: 'Glissement' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'blur', label: 'Flou' },
  { value: 'reveal', label: 'Revelation' }
];

const mediaOptions: FieldOption[] = [
  { value: 'none', label: 'Sans media' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' }
];

const stepTypeOptions: FieldOption[] = [
  { value: 'standard', label: 'Moment simple' },
  { value: 'gallery', label: 'Galerie d images' },
  { value: 'words', label: 'Messages / citations' },
  { value: 'music', label: 'Musique / playlist' }
];

const classicThemeOptions: FieldOption[] = [
  { value: 'romance', label: 'Romance classique' },
  { value: 'retro', label: 'Neon retro' },
  { value: 'pastel', label: 'Mignon pastel' },
  { value: 'minimal', label: 'Cinematique sombre' }
];

const classicTransitionOptions: FieldOption[] = [
  { value: 'fade', label: 'Fondu de lumiere' },
  { value: 'glitch', label: 'Glitch CRT' },
  { value: 'bubble', label: 'Rideau de bulles' },
  { value: 'slide', label: 'Rideau coulissant' }
];

const templateDefaults: Record<ThemeTemplate, Record<string, string>> = {
  classic: {},
  cinematic: {
    autoAdvanceSeconds: '0',
    cinematicEyebrow: 'Pour {name}',
    overlayIntensity: '60'
  },
  timeline: {
    timelineOpening: 'Un chemin de souvenirs',
    timelineDatePrefix: 'Souvenir',
    timelineMediaStyle: 'polaroid'
  },
  scrapbook: {
    scrapbookHint: 'Appuyez pour reveler',
    scrapbookStamp: 'SOUVENIRS',
    scrapbookCardBack: 'Secret'
  },
  echo: {
    echoInstruction: "Explorez l'obscurite",
    echoIntroLabel: 'Un echo du passe',
    echoRadius: '250'
  },
  eclat: {
    eclatPalette: '#facc15,#f472b6,#22d3ee,#a3e635,#fb923c',
    eclatBadgePrefix: 'Etape',
    eclatLoopMode: 'loop'
  },
  murmure: {
    murmureHint: 'Touchez pour continuer',
    murmureHeader: 'Pour {name}',
    musicUrl: ''
  },
  romance: {
    pinCode: '0000',
    romanceEyebrow: 'Chapitre',
    romancePaperTone: 'ivoire'
  },
  starlight: {
    starlightHint: "Maintenez pour connecter l'etoile",
    starCount: '60',
    holdSpeed: '2'
  },
  minimal: {
    pinCode: '',
    minimalLabelPrefix: '0',
    minimalAccessTitle: 'ACCES RESTREINT'
  }
};

const templateProfiles: TemplateProfile[] = [
  {
    id: 'classic',
    label: "L'Original (V1)",
    desc: 'Le modele original complet avec les 8 etapes restaurees',
    icon: Gem,
    settings: [
      { key: 'classicTheme', label: 'Style visuel V1', type: 'select', options: classicThemeOptions },
      { key: 'classicTransition', label: 'Transition V1', type: 'select', options: classicTransitionOptions },
      { key: 'unlockCode', label: "Code d'acces", placeholder: 'Ex: 1234. Vide = pas de code' },
      { key: 'audioUrl', label: 'Musique globale', placeholder: 'URL YouTube ou MP3' }
    ],
    stepFields: []
  },
  {
    id: 'cinematic',
    label: 'Cinematographique',
    desc: 'Sequence cinema avec media plein ecran',
    icon: Film,
    premium: true,
    settings: [
      { key: 'autoAdvanceSeconds', label: 'Auto-avance par scene', placeholder: '0 = manuel, ex: 5', helper: 'Utilise par la preview cinematic pour avancer automatiquement.' },
      { key: 'cinematicEyebrow', label: 'Texte au-dessus des titres', placeholder: 'Pour {name}' },
      { key: 'overlayIntensity', label: 'Intensite du voile sombre', placeholder: '0 a 90' }
    ],
    stepFields: [
      { key: 'eyebrow', label: 'Eyebrow de la scene', placeholder: 'Ex: Chapitre secret' },
      { key: 'duration', label: 'Duree speciale', placeholder: 'Ex: 7 secondes' }
    ]
  },
  {
    id: 'timeline',
    label: 'Ligne du temps',
    desc: 'Voyage vertical au defilement',
    icon: Clock,
    settings: [
      { key: 'timelineOpening', label: "Titre d'ouverture", placeholder: 'Un chemin de souvenirs' },
      { key: 'timelineDatePrefix', label: 'Prefixe des dates', placeholder: 'Souvenir' },
      { key: 'timelineMediaStyle', label: 'Style media', type: 'select', options: [{ value: 'polaroid', label: 'Polaroid' }, { value: 'clean', label: 'Cadre simple' }] }
    ],
    stepFields: [
      { key: 'dateLabel', label: 'Date / repere', placeholder: 'Ex: Juin 2026' }
    ]
  },
  {
    id: 'scrapbook',
    label: 'Carnet Souvenirs',
    desc: 'Polaroids a retourner et deplacer',
    icon: LayoutTemplate,
    premium: true,
    settings: [
      { key: 'scrapbookHint', label: 'Instruction principale', placeholder: 'Appuyez pour reveler' },
      { key: 'scrapbookStamp', label: 'Grand tampon de fond', placeholder: 'SOUVENIRS' },
      { key: 'scrapbookCardBack', label: 'Texte dos de carte', placeholder: 'Secret' }
    ],
    stepFields: [
      { key: 'sticker', label: 'Sticker / etiquette', placeholder: 'Ex: ete, rire, surprise' }
    ]
  },
  {
    id: 'echo',
    label: 'Echo Nostalgique',
    desc: 'Souvenirs reveles par le pointeur',
    icon: Wind,
    settings: [
      { key: 'echoInstruction', label: 'Instruction avant interaction', placeholder: "Explorez l'obscurite" },
      { key: 'echoIntroLabel', label: "Label d'introduction", placeholder: 'Un echo du passe' },
      { key: 'echoRadius', label: 'Rayon de lumiere', placeholder: 'Ex: 250' }
    ],
    stepFields: [
      { key: 'echoCaption', label: 'Legende nostalgique', placeholder: 'Ex: Ce moment etait discret' }
    ]
  },
  {
    id: 'eclat',
    label: 'Eclat de Joie',
    desc: 'Couleurs vives et navigation rapide',
    icon: Sun,
    settings: [
      { key: 'eclatPalette', label: 'Palette de couleurs', placeholder: '#facc15,#f472b6,#22d3ee' },
      { key: 'eclatBadgePrefix', label: 'Prefixe du badge', placeholder: 'Etape' },
      { key: 'eclatLoopMode', label: 'Navigation finale', type: 'select', options: [{ value: 'loop', label: 'Boucler' }, { value: 'stop', label: 'Bloquer a la derniere etape' }] }
    ],
    stepFields: [
      { key: 'badge', label: 'Badge de cette etape', placeholder: 'Ex: Moment solaire' },
      { key: 'accentColor', label: 'Couleur forcee', placeholder: 'Ex: #f472b6' }
    ]
  },
  {
    id: 'murmure',
    label: 'Murmure Intime',
    desc: 'Chuchotements tactiles et ambiance minimale',
    icon: Heart,
    premium: true,
    settings: [
      { key: 'murmureHint', label: 'Indice de navigation', placeholder: 'Touchez pour continuer' },
      { key: 'murmureHeader', label: 'Texte discret du haut', placeholder: 'Pour {name}' },
      { key: 'musicUrl', label: 'Musique de fond', placeholder: 'https://...' }
    ],
    stepFields: [
      { key: 'whisper', label: 'Murmure secondaire', placeholder: 'Ex: doucement...' }
    ]
  },
  {
    id: 'romance',
    label: 'Douce Romance',
    desc: 'Lettre cachetee, papier et navigation chapitre',
    icon: Flower2,
    settings: [
      { key: 'pinCode', label: 'Code secret', placeholder: 'Ex: 1234. Vide = pas de code' },
      { key: 'romanceEyebrow', label: 'Label chapitre', placeholder: 'Chapitre' },
      { key: 'romancePaperTone', label: 'Ton du papier', type: 'select', options: [{ value: 'ivoire', label: 'Ivoire' }, { value: 'rose', label: 'Rose doux' }, { value: 'ambre', label: 'Ambre' }] }
    ],
    stepFields: [
      { key: 'signature', label: 'Signature / date', placeholder: 'Avec tout mon amour' }
    ]
  },
  {
    id: 'starlight',
    label: 'Constellations',
    desc: "Maintenir pour raviver l'etoile",
    icon: CloudMoon,
    premium: true,
    settings: [
      { key: 'starlightHint', label: 'Instruction de maintien', placeholder: "Maintenez pour connecter l'etoile" },
      { key: 'starCount', label: "Nombre d'etoiles", placeholder: '60' },
      { key: 'holdSpeed', label: 'Vitesse de revelation', placeholder: '2' }
    ],
    stepFields: [
      { key: 'words', label: 'Mots de constellation', placeholder: 'Joie,Avenir,Rire' }
    ]
  },
  {
    id: 'minimal',
    label: 'Minimaliste',
    desc: 'Noir mat, typographie simple et defilement',
    icon: Square,
    settings: [
      { key: 'pinCode', label: 'Code secret', placeholder: 'Vide = pas de code' },
      { key: 'minimalLabelPrefix', label: 'Prefixe numerique', placeholder: '0' },
      { key: 'minimalAccessTitle', label: "Titre de l'ecran verrouille", placeholder: 'ACCES RESTREINT' }
    ],
    stepFields: [
      { key: 'sideNote', label: 'Note discrete', placeholder: 'Ex: souvenir 01' }
    ]
  }
];

const storyMedia = {
  firstLightVideo: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=165&oauth2_token_id=57447761',
  nightHands: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=1000',
  rainyStreet: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1000',
  quietHarborVideo: 'https://player.vimeo.com/external/517090082.sd.mp4?s=01edb39b3a7a9deaf41846b0d9127add3c3f8e5b&profile_id=165&oauth2_token_id=57447761',
  dawn: 'https://images.unsplash.com/photo-1549487289-53eafeb8ee2c?auto=format&fit=crop&q=80&w=1000',
  music: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000',
  celebration: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1000'
};

const memoryImages = [
  storyMedia.nightHands.replace('w=1000', 'w=500'),
  storyMedia.rainyStreet.replace('w=1000', 'w=500'),
  storyMedia.dawn.replace('w=1000', 'w=500'),
  storyMedia.music.replace('w=1000', 'w=500')
];

const demoMusicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

const buildMusicMeta = (base: Record<string, any>, title: string, note: string, tracks: MusicTrack[] = []) => ({
  ...base,
  musicMode: tracks.length > 1 ? 'playlist' : 'single',
  musicTitle: title,
  musicArtist: 'A personnaliser',
  musicUrl: demoMusicUrl,
  playlistUrl: '',
  playlist: tracks.length > 0
    ? tracks
    : [
      { title, artist: 'Piste principale', url: demoMusicUrl },
      { title: 'Le refrain qui revient', artist: 'Votre choix', url: '' }
    ],
  musicNote: note
});

const templateStepPresets: Partial<Record<ThemeTemplate, Step[]>> = {
  cinematic: [
    {
      id: 'cinematic-1',
      title: 'Ouverture sur toi',
      content: "La premiere image est simple: le monde retient son souffle, puis ton sourire arrive et tout devient plus net. Cette histoire commence la ou ta lumiere a change la couleur de mes jours.",
      mediaType: 'video',
      mediaUrl: storyMedia.firstLightVideo,
      transition: 'fade',
      meta: { eyebrow: 'Scene 01 - Le signal', duration: '6 secondes' }
    },
    {
      id: 'cinematic-2',
      title: 'Les choses que je garde',
      content: "Je garde ta facon d'ecouter, ton courage discret, les petites phrases qui restent apres ton depart. Comme une capsule cachee dans le generique, chaque detail raconte pourquoi tu comptes autant.",
      mediaType: 'image',
      mediaUrl: storyMedia.nightHands,
      transition: 'zoom',
      meta: { eyebrow: 'Scene 02 - Capsule intime', duration: '7 secondes' }
    },
    {
      id: 'cinematic-3',
      title: 'La sequence des souvenirs',
      content: "Il y a des plans que je pourrais revoir cent fois: les rues improvisees, les silences heureux, les rires qui arrivent sans prevenir. Aucun effet special ne vaut ces morceaux de nous.",
      mediaType: 'none',
      transition: 'slide',
      type: 'gallery',
      meta: { eyebrow: 'Scene 03 - Montage souvenir', images: memoryImages }
    },
    {
      id: 'cinematic-4',
      title: 'Notre bande son',
      content: "Si cette histoire avait une musique, elle commencerait doucement, puis elle monterait au moment exact ou tu comprends que tu es aimee plus fort que les mots ne savent le dire.",
      mediaType: 'image',
      mediaUrl: storyMedia.music,
      transition: 'reveal',
      type: 'music',
      meta: buildMusicMeta(
        { eyebrow: 'Scene 04 - La melodie' },
        'Bande son du film',
        "Un moment a jouer comme une scene centrale: une piste, ou toute une playlist, pour accompagner l'emotion."
      )
    },
    {
      id: 'cinematic-5',
      title: 'La lettre en voix basse',
      content: "Je ne veux pas seulement te souhaiter une belle journee. Je veux que tu sentes, dans chaque phrase, que ta presence a laisse une empreinte douce et durable dans ma vie.",
      mediaType: 'video',
      mediaUrl: storyMedia.quietHarborVideo,
      transition: 'blur',
      meta: { eyebrow: 'Scene 05 - Monologue du coeur' }
    },
    {
      id: 'cinematic-6',
      title: 'Ce que les autres voient',
      content: "La camera recule et soudain on voit que je ne suis pas seul a reconnaitre ta lumiere.",
      mediaType: 'none',
      transition: 'fade',
      type: 'words',
      meta: {
        eyebrow: 'Scene 06 - Choeur',
        quotes: [
          { author: 'Marie', text: 'Tu as cette presence qui apaise meme les jours compliques.' },
          { author: 'Thomas', text: 'On se sent plus courageux quand tu es la.' },
          { author: 'Lea', text: 'Tu rends les moments ordinaires beaucoup plus beaux.' }
        ]
      }
    },
    {
      id: 'cinematic-7',
      title: 'Dernier plan, vraie surprise',
      content: "Le film ne se termine pas ici. Ce dernier plan ouvre une porte: celle du cadeau, du rire, de la suite. Et dans la lumiere finale, il y a une certitude: tu es precieuse.",
      mediaType: 'image',
      mediaUrl: storyMedia.celebration,
      transition: 'zoom',
      meta: { eyebrow: 'Scene finale - Revelation' }
    }
  ],
  timeline: [
    {
      id: 'timeline-1',
      title: 'Le jour ou tout a commence',
      content: "Il y a un avant et un apres. Avant, les jours passaient. Apres, certains instants ont commence a briller parce que tu y etais.",
      mediaType: 'image',
      mediaUrl: storyMedia.dawn,
      transition: 'fade',
      meta: { dateLabel: 'Premiere lumiere' }
    },
    {
      id: 'timeline-2',
      title: 'Les petites preuves',
      content: "Une attention, une reponse, un sourire quand il fallait. Les grandes histoires tiennent souvent dans de minuscules gestes que le coeur n'oublie pas.",
      mediaType: 'image',
      mediaUrl: storyMedia.nightHands,
      transition: 'slide',
      meta: { dateLabel: 'Les signes doux' }
    },
    {
      id: 'timeline-3',
      title: 'Les souvenirs accroches',
      content: "Chaque souvenir est une epingle sur notre ligne du temps. Certains sont lumineux, d'autres tendres, mais tous disent la meme chose: tu as rendu le chemin plus beau.",
      mediaType: 'none',
      transition: 'reveal',
      type: 'gallery',
      meta: { dateLabel: 'Album ouvert', images: memoryImages }
    },
    {
      id: 'timeline-4',
      title: 'La chanson du milieu',
      content: "Au milieu de l'histoire, il y a une musique. Pas forcement parfaite, mais elle porte nos silences, nos pas, nos retours, et tout ce qu'on n'a pas eu besoin d'expliquer.",
      mediaType: 'image',
      mediaUrl: storyMedia.music,
      transition: 'zoom',
      type: 'music',
      meta: buildMusicMeta(
        { dateLabel: 'Refrain commun' },
        'Playlist de notre ligne du temps',
        "Ajoute ici la chanson du souvenir, ou plusieurs pistes qui marquent les periodes importantes."
      )
    },
    {
      id: 'timeline-5',
      title: "La page que je t'ecris",
      content: "Cette page est la plus calme. Elle ne cherche pas a impressionner. Elle veut seulement te rappeler que tu es aimee avec patience, respect et beaucoup de tendresse.",
      mediaType: 'video',
      mediaUrl: storyMedia.quietHarborVideo,
      transition: 'blur',
      meta: { dateLabel: 'Lettre gardee' }
    },
    {
      id: 'timeline-6',
      title: 'Les voix autour de toi',
      content: "Sur la ligne, d'autres voix s'ajoutent. Elles dessinent le meme portrait avec des mots differents.",
      mediaType: 'none',
      transition: 'fade',
      type: 'words',
      meta: {
        dateLabel: 'Messages recus',
        quotes: [
          { author: 'Un ami', text: 'Tu as une maniere rare de faire sentir les gens importants.' },
          { author: 'Un proche', text: 'Ta joie reste longtemps apres ton passage.' },
          { author: 'Quelqu un qui tient a toi', text: "Tu merites d'etre celebree sans retenue." }
        ]
      }
    },
    {
      id: 'timeline-7',
      title: 'La suite commence ici',
      content: "La derniere etape n'est pas une fin. C'est un repere pour se souvenir que cette journee, et toi dedans, meritent une place a part.",
      mediaType: 'image',
      mediaUrl: storyMedia.celebration,
      transition: 'slide',
      meta: { dateLabel: 'Aujourd hui' }
    }
  ],
  scrapbook: [
    {
      id: 'scrapbook-1',
      title: 'A ouvrir doucement',
      content: "Sous cette photo, il y a une chose simple: ton arrivee a transforme beaucoup plus que tu ne l'imagines.",
      mediaType: 'image',
      mediaUrl: storyMedia.dawn,
      transition: 'fade',
      meta: { sticker: 'debut' }
    },
    {
      id: 'scrapbook-2',
      title: "Ce que j'aime garder",
      content: "Ta douceur, ton humour, ta facon de rendre une piece plus vivante. Je les colle ici comme des petits papiers qu'on ne veut jamais perdre.",
      mediaType: 'image',
      mediaUrl: storyMedia.nightHands,
      transition: 'zoom',
      meta: { sticker: 'precieux' }
    },
    {
      id: 'scrapbook-3',
      title: 'Le coin des photos',
      content: "Un carnet n'a pas besoin d'etre parfait. Il a seulement besoin de garder les traces vraies: celles qui font sourire sans prevenir.",
      mediaType: 'none',
      transition: 'slide',
      type: 'gallery',
      meta: { sticker: 'album', images: memoryImages }
    },
    {
      id: 'scrapbook-4',
      title: 'La chanson pliee',
      content: "Entre deux pages, j'ai glisse une musique. Elle sait dire la nostalgie, la joie, et cette petite chaleur qui revient quand je pense a toi.",
      mediaType: 'image',
      mediaUrl: storyMedia.music,
      transition: 'reveal',
      type: 'music',
      meta: buildMusicMeta(
        { sticker: 'refrain' },
        'La chanson glissee dans la page',
        "Une vraie piste audio, ou une playlist comme des petits papiers sonores colles au carnet."
      )
    },
    {
      id: 'scrapbook-5',
      title: 'Une note pour toi',
      content: "Si tu retrouves cette page un jour ou tu doutes, relis-la: tu es importante, tu fais du bien, et ta presence a une valeur immense.",
      mediaType: 'image',
      mediaUrl: storyMedia.rainyStreet,
      transition: 'blur',
      meta: { sticker: 'a relire' }
    },
    {
      id: 'scrapbook-6',
      title: 'Les mots colles par les autres',
      content: "D'autres mains ont ajoute leurs petits papiers. Ensemble, ils forment un portrait tendre de ce que tu offres au monde.",
      mediaType: 'none',
      transition: 'fade',
      type: 'words',
      meta: {
        sticker: 'temoins',
        quotes: [
          { author: 'Marine', text: "Tu es le genre de personne qu'on remercie d'exister." },
          { author: 'Noah', text: 'Avec toi, meme les petits moments ont une couleur.' },
          { author: 'Sarah', text: 'Tu as une lumiere tres douce, mais tres forte.' }
        ]
      }
    },
    {
      id: 'scrapbook-7',
      title: 'Derniere enveloppe',
      content: "La derniere page cache quelque chose. Un cadeau, oui, mais surtout une preuve: j'ai voulu prendre le temps de faire un monde pour toi.",
      mediaType: 'image',
      mediaUrl: storyMedia.celebration,
      transition: 'zoom',
      meta: { sticker: 'surprise' }
    }
  ],
  echo: [
    {
      id: 'echo-1',
      title: 'Ton nom dans le noir',
      content: "Au debut, tout est presque silencieux. Puis ton nom apparait comme une lumiere basse, celle qu'on suit quand le coeur cherche un endroit sur.",
      mediaType: 'image',
      mediaUrl: storyMedia.dawn,
      transition: 'fade',
      meta: { echoCaption: 'premiere trace' }
    },
    {
      id: 'echo-2',
      title: 'Les details revenus',
      content: "Ce ne sont pas les grands discours qui reviennent d'abord. Ce sont les details: une phrase, une facon de regarder, une patience qui a tout change.",
      mediaType: 'video',
      mediaUrl: storyMedia.firstLightVideo,
      transition: 'blur',
      meta: { echoCaption: 'memoire douce' }
    },
    {
      id: 'echo-3',
      title: 'Images sous la poussiere',
      content: "Sous la poussiere des jours, certains souvenirs n'ont jamais bouge. Ils attendaient seulement qu'on les eclaire.",
      mediaType: 'none',
      transition: 'reveal',
      type: 'gallery',
      meta: { echoCaption: 'fragments retrouves', images: memoryImages }
    },
    {
      id: 'echo-4',
      title: 'Une musique lointaine',
      content: "On dirait une chanson entendue depuis une autre piece: discrète, mais impossible a ignorer. C'est ce que ta presence fait dans ma memoire.",
      mediaType: 'image',
      mediaUrl: storyMedia.music,
      transition: 'slide',
      type: 'music',
      meta: buildMusicMeta(
        { echoCaption: 'refrain cache' },
        'Musique lointaine',
        "Un lien audio, YouTube, Spotify ou SoundCloud peut devenir l'echo musical de ce souvenir."
      )
    },
    {
      id: 'echo-5',
      title: 'La lettre retrouvee',
      content: "Je t'ecris comme on parle a voix basse dans une piece sombre: avec sincerite, sans decor inutile, pour que chaque mot trouve sa place.",
      mediaType: 'image',
      mediaUrl: storyMedia.rainyStreet,
      transition: 'zoom',
      meta: { echoCaption: 'papier ancien' }
    },
    {
      id: 'echo-6',
      title: 'Les voix dans le couloir',
      content: "Ecoute bien: il n'y a pas que ma voix. D'autres disent aussi ce que tu representes.",
      mediaType: 'none',
      transition: 'fade',
      type: 'words',
      meta: {
        echoCaption: 'voix proches',
        quotes: [
          { author: 'Ami', text: 'Ta presence calme les pieces trop lourdes.' },
          { author: 'Proche', text: "Tu fais partie des souvenirs qu'on garde." },
          { author: 'Confident', text: 'Tu as une tendresse qui reste.' }
        ]
      }
    },
    {
      id: 'echo-7',
      title: 'La lumiere finale',
      content: "Quand tout se revele enfin, il reste cette verite simple: tu comptes. Beaucoup. Et cette surprise est une maniere de te le laisser voir.",
      mediaType: 'image',
      mediaUrl: storyMedia.celebration,
      transition: 'blur',
      meta: { echoCaption: 'revelation' }
    }
  ],
  eclat: [
    {
      id: 'eclat-1',
      title: 'Boom, te voila',
      content: "Tu arrives et la journee change de tempo. Plus de couleur, plus de rire, plus de vie. Ce monde commence par ton energie.",
      mediaType: 'image',
      mediaUrl: storyMedia.dawn,
      transition: 'fade',
      meta: { badge: 'Ouverture solaire', accentColor: '#facc15' }
    },
    {
      id: 'eclat-2',
      title: 'Tes super-pouvoirs',
      content: "Transformer un moment banal en souvenir, faire rire au bon moment, donner du courage sans faire de bruit: voila ce que tu fais, souvent sans t'en rendre compte.",
      mediaType: 'video',
      mediaUrl: storyMedia.firstLightVideo,
      transition: 'zoom',
      meta: { badge: 'Pouvoirs doux', accentColor: '#f472b6' }
    },
    {
      id: 'eclat-3',
      title: 'Flashs de bonheur',
      content: "Voici les images qui sautent au coeur: elles n'ont pas besoin d'etre parfaites, elles ont juste besoin d'etre vraies.",
      mediaType: 'none',
      transition: 'slide',
      type: 'gallery',
      meta: { badge: 'Album vibrant', accentColor: '#22d3ee', images: memoryImages }
    },
    {
      id: 'eclat-4',
      title: 'Monte le son',
      content: "Cette etape a le gout d'un refrain qu'on chante trop fort. Aujourd'hui, on celebre sans economiser la joie.",
      mediaType: 'image',
      mediaUrl: storyMedia.music,
      transition: 'reveal',
      type: 'music',
      meta: buildMusicMeta(
        { badge: 'Refrain lumineux', accentColor: '#a3e635' },
        'Playlist qui explose de joie',
        "Mets une chanson directe, ou une suite de pistes pour faire monter la celebration."
      )
    },
    {
      id: 'eclat-5',
      title: 'Le mot qui touche',
      content: "Sous les couleurs, il y a quelque chose de tres simple: merci d'etre toi. Merci pour ce que tu offres, pour ce que tu traverses, pour ce que tu inspires.",
      mediaType: 'image',
      mediaUrl: storyMedia.rainyStreet,
      transition: 'blur',
      meta: { badge: 'Coeur ouvert', accentColor: '#fb923c' }
    },
    {
      id: 'eclat-6',
      title: "Ils l'ont dit aussi",
      content: "La fete devient plus grande quand les voix de ceux qui t'aiment s'ajoutent a la mienne.",
      mediaType: 'none',
      transition: 'fade',
      type: 'words',
      meta: {
        badge: 'Pluie de mots',
        accentColor: '#f472b6',
        quotes: [
          { author: 'Ami', text: 'Tu rends les gens plus joyeux autour de toi.' },
          { author: 'Famille', text: 'On est fiers de la personne que tu es.' },
          { author: 'Proche', text: 'Tu merites une journee immense.' }
        ]
      }
    },
    {
      id: 'eclat-7',
      title: 'Surprise en couleurs',
      content: "Dernier clic, dernier eclat: ce cadeau est une explosion de merci, de tendresse, et d'envie de te voir sourire.",
      mediaType: 'image',
      mediaUrl: storyMedia.celebration,
      transition: 'zoom',
      meta: { badge: 'Final joyeux', accentColor: '#facc15' }
    }
  ],
  murmure: [
    {
      id: 'murmure-1',
      title: 'Reste un instant',
      content: "Avant de continuer, respire. Ce monde ne crie pas. Il vient seulement te dire, doucement, que tu comptes.",
      mediaType: 'image',
      mediaUrl: storyMedia.dawn,
      transition: 'fade',
      meta: { whisper: 'tout doucement' }
    },
    {
      id: 'murmure-2',
      title: 'Ce que je vois',
      content: "Je vois ta force quand tu penses etre fatiguee. Je vois ta douceur quand tu crois ne rien faire de special. Je vois tout cela, et je voulais te le rendre.",
      mediaType: 'image',
      mediaUrl: storyMedia.nightHands,
      transition: 'blur',
      meta: { whisper: 'je le vois' }
    },
    {
      id: 'murmure-3',
      title: 'Quelques images lentes',
      content: "Les souvenirs les plus tendres ne font pas de bruit. Ils restent contre le coeur, comme des photos gardees dans une poche.",
      mediaType: 'none',
      transition: 'reveal',
      type: 'gallery',
      meta: { whisper: 'souvenirs bas', images: memoryImages }
    },
    {
      id: 'murmure-4',
      title: 'Une musique pour le calme',
      content: "Il y a une musique dans ta maniere d'etre la. Elle ne force rien. Elle accompagne, elle rassure, elle reste.",
      mediaType: 'image',
      mediaUrl: storyMedia.music,
      transition: 'fade',
      type: 'music',
      meta: buildMusicMeta(
        { whisper: 'ecoute' },
        'Musique pour le calme',
        "Un lien discret suffit: MP3, YouTube, Spotify, SoundCloud, ou une petite playlist lente."
      )
    },
    {
      id: 'murmure-5',
      title: 'La phrase que je garde',
      content: "Si je devais ne garder qu'une phrase, ce serait celle-ci: le monde est plus doux dans les endroits ou tu passes.",
      mediaType: 'video',
      mediaUrl: storyMedia.quietHarborVideo,
      transition: 'blur',
      meta: { whisper: 'a garder' }
    },
    {
      id: 'murmure-6',
      title: 'Des voix tres proches',
      content: "D'autres ont parle doucement aussi. Leurs mots ne cherchent pas a briller, seulement a etre vrais.",
      mediaType: 'none',
      transition: 'slide',
      type: 'words',
      meta: {
        whisper: 'ils savent',
        quotes: [
          { author: 'Une voix', text: 'Tu es un refuge pour beaucoup plus de gens que tu ne crois.' },
          { author: 'Une autre', text: 'Ta gentillesse a quelque chose de rare.' },
          { author: 'Quelqu un', text: "Merci d'etre cette presence-la." }
        ]
      }
    },
    {
      id: 'murmure-7',
      title: 'Ouvre quand tu veux',
      content: "La surprise est la, mais il n'y a pas d'urgence. Elle t'attend comme ce site t'attendra: avec patience, avec tendresse.",
      mediaType: 'image',
      mediaUrl: storyMedia.celebration,
      transition: 'fade',
      meta: { whisper: 'pour toi' }
    }
  ],
  romance: [
    {
      id: 'romance-1',
      title: 'Ma premiere page',
      content: "J'ai commence cette lettre avec une seule envie: que tu sentes, des les premieres lignes, que cette journee a ete pensee pour toi.",
      mediaType: 'image',
      mediaUrl: storyMedia.dawn,
      transition: 'fade',
      meta: { signature: 'Au commencement' }
    },
    {
      id: 'romance-2',
      title: 'Ce que ton coeur laisse',
      content: "Tu as cette facon de poser de la douceur la ou les autres passent trop vite. Tu laisses des traces fines, mais profondes.",
      mediaType: 'image',
      mediaUrl: storyMedia.nightHands,
      transition: 'zoom',
      meta: { signature: 'Avec admiration' }
    },
    {
      id: 'romance-3',
      title: 'Nos images tendres',
      content: "J'ai reuni quelques morceaux de lumiere. Pas pour raconter toute l'histoire, mais pour rappeler qu'elle est belle.",
      mediaType: 'none',
      transition: 'slide',
      type: 'gallery',
      meta: { signature: 'Album du coeur', images: memoryImages }
    },
    {
      id: 'romance-4',
      title: 'Le refrain de nous',
      content: "Certaines chansons ressemblent a des lieux. Celle-ci ressemble a un endroit ou je peux penser a toi sans avoir besoin de parler.",
      mediaType: 'image',
      mediaUrl: storyMedia.music,
      transition: 'reveal',
      type: 'music',
      meta: buildMusicMeta(
        { signature: 'En musique' },
        'Le refrain de nous',
        "Choisis la vraie chanson, ou cree une playlist intime comme une lettre que l'on ecoute."
      )
    },
    {
      id: 'romance-5',
      title: 'Ce que je voulais te dire',
      content: "Tu merites les gestes qui prennent du temps. Tu merites les mots qui restent. Tu merites une attention qui ne cherche pas a etre parfaite, seulement sincere.",
      mediaType: 'video',
      mediaUrl: storyMedia.quietHarborVideo,
      transition: 'blur',
      meta: { signature: 'Avec tout mon amour' }
    },
    {
      id: 'romance-6',
      title: "Ceux qui t'aiment aussi",
      content: "Il y a dans les mots des autres une confirmation douce: ta lumiere ne touche pas qu'un seul coeur.",
      mediaType: 'none',
      transition: 'fade',
      type: 'words',
      meta: {
        signature: 'Ils te voient aussi',
        quotes: [
          { author: 'Marie', text: 'Tu as un coeur qui sait rendre les autres plus calmes.' },
          { author: 'Thomas', text: "Tu fais partie des personnes qu'on a de la chance de connaitre." },
          { author: 'Lea', text: 'Ta presence a une elegance simple et rare.' }
        ]
      }
    },
    {
      id: 'romance-7',
      title: 'La derniere enveloppe',
      content: "Si cette lettre s'ouvre sur une surprise, c'est parce que je voulais que la fin soit aussi vivante que ce que tu m'inspires.",
      mediaType: 'image',
      mediaUrl: storyMedia.celebration,
      transition: 'zoom',
      meta: { signature: 'Pour aujourd hui, et apres' }
    }
  ],
  starlight: [
    {
      id: 'starlight-1',
      title: 'La premiere etoile',
      content: "Il suffit parfois d'une seule lumiere pour que la nuit cesse d'etre vide. Pour moi, cette lumiere a souvent porte ton nom.",
      mediaType: 'image',
      mediaUrl: storyMedia.dawn,
      transition: 'fade',
      meta: { words: 'Debut,Lumiere,Presence' }
    },
    {
      id: 'starlight-2',
      title: 'Ta constellation cachee',
      content: "Autour de toi, il y a des qualites qui brillent a des distances differentes: douceur, courage, humour, patience. Ensemble, elles dessinent une carte.",
      mediaType: 'image',
      mediaUrl: storyMedia.nightHands,
      transition: 'zoom',
      meta: { words: 'Douceur,Courage,Humour,Patience' }
    },
    {
      id: 'starlight-3',
      title: 'Les astres souvenirs',
      content: "Chaque image est une etoile ancienne. Quand on les relie, on retrouve le chemin de ce que nous avons vecu.",
      mediaType: 'none',
      transition: 'reveal',
      type: 'gallery',
      meta: { words: 'Souvenirs,Chemin,Nous', images: memoryImages }
    },
    {
      id: 'starlight-4',
      title: 'La chanson orbitale',
      content: "Il y a des musiques qui tournent autour du coeur comme une lune fidele. Celle-ci garde la memoire de ce que je ressens pour toi.",
      mediaType: 'image',
      mediaUrl: storyMedia.music,
      transition: 'slide',
      type: 'music',
      meta: buildMusicMeta(
        { words: 'Refrain,Lune,Memoire' },
        'Chanson orbitale',
        "Un morceau ou une playlist peut tourner autour de cette constellation de souvenirs."
      )
    },
    {
      id: 'starlight-5',
      title: 'Le voeu silencieux',
      content: "Mon voeu est simple: que tu te voies un peu plus comme nous te voyons. Precieuse. Forte. Rare. Necessaire.",
      mediaType: 'video',
      mediaUrl: storyMedia.quietHarborVideo,
      transition: 'blur',
      meta: { words: 'Precieuse,Forte,Rare,Necessaire' }
    },
    {
      id: 'starlight-6',
      title: 'Les etoiles des autres',
      content: "D'autres points s'allument autour de toi. Chacun porte une voix, un merci, une preuve.",
      mediaType: 'none',
      transition: 'fade',
      type: 'words',
      meta: {
        words: 'Merci,Joie,Tendresse,Chance',
        quotes: [
          { author: 'Ami', text: 'Tu es une etoile calme, mais on te remarque toujours.' },
          { author: 'Proche', text: 'Tu rends notre ciel plus doux.' },
          { author: 'Confident', text: 'Ta lumiere aide les autres a avancer.' }
        ]
      }
    },
    {
      id: 'starlight-7',
      title: 'La constellation finale',
      content: "Quand toutes les lumieres sont reliees, il reste ce dessin: un cadeau pour toi, trace avec tout ce que tu representes.",
      mediaType: 'image',
      mediaUrl: storyMedia.celebration,
      transition: 'zoom',
      meta: { words: 'Cadeau,Final,Amour,Toi' }
    }
  ],
  minimal: [
    {
      id: 'minimal-1',
      title: 'Tu es la',
      content: "Pas besoin d'en dire trop. Ta presence suffit a changer la piece.",
      mediaType: 'image',
      mediaUrl: storyMedia.dawn,
      transition: 'fade',
      meta: { sideNote: 'constat 01' }
    },
    {
      id: 'minimal-2',
      title: 'Ce qui reste',
      content: "Une attention. Un rire. Une phrase juste. Ce sont de petites choses. Elles restent longtemps.",
      mediaType: 'image',
      mediaUrl: storyMedia.nightHands,
      transition: 'slide',
      meta: { sideNote: 'memoire 02' }
    },
    {
      id: 'minimal-3',
      title: 'Images',
      content: "Quelques preuves silencieuses. Rien a expliquer.",
      mediaType: 'none',
      transition: 'reveal',
      type: 'gallery',
      meta: { sideNote: 'archive 03', images: memoryImages }
    },
    {
      id: 'minimal-4',
      title: 'Son',
      content: "Une musique pour accompagner ce qui ne se formule pas toujours.",
      mediaType: 'image',
      mediaUrl: storyMedia.music,
      transition: 'zoom',
      type: 'music',
      meta: buildMusicMeta(
        { sideNote: 'piste 04' },
        'Piste 04',
        "Un lien simple, propre, et remplacable par la vraie chanson ou par une playlist."
      )
    },
    {
      id: 'minimal-5',
      title: 'Lettre',
      content: "Tu comptes. Plus que tu ne le mesures. Cette phrase est simple. Elle est vraie.",
      mediaType: 'video',
      mediaUrl: storyMedia.quietHarborVideo,
      transition: 'blur',
      meta: { sideNote: 'note 05' }
    },
    {
      id: 'minimal-6',
      title: 'Temoins',
      content: "D'autres le disent aussi.",
      mediaType: 'none',
      transition: 'fade',
      type: 'words',
      meta: {
        sideNote: 'voix 06',
        quotes: [
          { author: 'Ami', text: 'Tu fais du bien.' },
          { author: 'Proche', text: 'Tu es rare.' },
          { author: 'Nous', text: 'Reste toi.' }
        ]
      }
    },
    {
      id: 'minimal-7',
      title: 'Cadeau',
      content: "La surprise est ici. Le reste etait seulement une maniere de te preparer a recevoir un peu de ce que tu donnes.",
      mediaType: 'image',
      mediaUrl: storyMedia.celebration,
      transition: 'fade',
      meta: { sideNote: 'final 07' }
    }
  ]
};

const classicConfigKeys = [
  'classicTheme',
  'classicTransition',
  'unlockCode',
  'pinCode',
  'audioUrl',
  'introText1',
  'introText2',
  'introText3',
  'capsuleCards',
  'galleryPhotos',
  'playlistTitle',
  'playlistSubtitle',
  'playlistMode',
  'playlistUrl',
  'playlistNote',
  'playlistTracks',
  'letterParts',
  'friendMessages',
  'defaultWords',
  'surpriseTitle',
  'surpriseSubtitle',
  'surpriseText',
  'transitionMessages',
  'guestbookForm'
];

const getTemplateConfigKeys = (templateId: ThemeTemplate) => (
  templateId === 'classic'
    ? classicConfigKeys
    : templateProfiles.find((profile) => profile.id === templateId)?.settings.map((field) => field.key) || []
);

const pickConfig = (config: Record<string, any>, keys: string[]) => keys.reduce<Record<string, any>>((picked, key) => {
  if (Object.prototype.hasOwnProperty.call(config, key)) {
    picked[key] = config[key];
  }
  return picked;
}, {});

function FieldControl({ field, value, onChange }: { field: FieldConfig; value: string; onChange: (value: string) => void }) {
  const commonClass = 'w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none';

  return (
    <div>
      <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">{field.label}</label>
      {field.type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={`${commonClass} min-h-[80px] resize-none`}
        />
      ) : field.type === 'select' ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className={commonClass}>
          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value} className="bg-[#141415]">
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={commonClass}
        />
      )}
      {field.helper && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{field.helper}</p>}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h4 className="text-sm font-bold text-slate-300 mb-3">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function AppShell({ initialStory }: { initialStory: Story }) {
  const [initialDraft] = useState<StudioDraft | null>(() => readStudioDraft());
  const [story, setStory] = useState<Story>(() => ({
    ...(initialDraft?.story || initialStory),
    steps: clone(initialDraft?.story?.steps || templateStepPresets[initialStory.themeTemplate] || initialStory.steps)
  }));
  const [activeTab, setActiveTab] = useState<'content' | 'theme'>('theme');
  const [templateConfigs, setTemplateConfigs] = useState<Partial<Record<ThemeTemplate, Record<string, any>>>>(() => ({
    ...(initialDraft?.templateConfigs || {
      [initialStory.themeTemplate]: initialStory.config || {}
    })
  }));
  const [templateSteps, setTemplateSteps] = useState<Partial<Record<ThemeTemplate, Step[]>>>(() => ({
    ...(initialDraft?.templateSteps || {
      [initialStory.themeTemplate]: clone(templateStepPresets[initialStory.themeTemplate] || initialStory.steps)
    })
  }));
  const [externalMessages, setExternalMessages] = useState<ExternalMessage[]>([]);
  const [copiedShareStepId, setCopiedShareStepId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(initialDraft ? 'saved' : 'idle');
  const [lastSavedAt, setLastSavedAt] = useState(initialDraft?.savedAt || '');
  const [publishMessage, setPublishMessage] = useState('');
  const hasTrackedInitialState = useRef(false);

  const activeProfile = templateProfiles.find((profile) => profile.id === story.themeTemplate) || templateProfiles[0];
  const classicExternalMessages = externalMessages
    .filter((message) => !message.template || message.template === 'classic')
    .filter((message) => !message.stepId || message.stepId === 'classic-guestbook')
    .map((message) => ({
      text: message.text,
      author: message.author,
      word: message.word
    }));
  const previewConfig = story.themeTemplate === 'classic' && classicExternalMessages.length > 0
    ? {
      ...(story.config || {}),
      friendMessages: [
        ...(Array.isArray(story.config?.friendMessages) ? story.config.friendMessages : defaultClassicContent.friendMessages),
        ...classicExternalMessages
      ]
    }
    : story.config;
  const storyForPreview: Story = {
    ...story,
    config: previewConfig,
    steps: story.steps.map((step) => {
      if (step.type !== 'words') return step;

      const scopedMessages = externalMessages
        .filter((message) => !message.template || message.template === story.themeTemplate)
        .filter((message) => !message.stepId || message.stepId === step.id)
        .map((message) => ({
          text: message.text,
          author: message.author,
          word: message.word
        }));

      if (scopedMessages.length === 0) return step;

      const existingQuotes = Array.isArray(step.meta?.quotes) ? step.meta?.quotes : [];

      return {
        ...step,
        meta: {
          ...(step.meta || {}),
          quotes: [...existingQuotes, ...scopedMessages]
        }
      };
    })
  };

  useEffect(() => {
    let isMounted = true;

    fetch('/api/messages', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : []))
      .then((messages) => {
        if (isMounted && Array.isArray(messages)) {
          setExternalMessages(messages);
        }
      })
      .catch(() => {
        if (isMounted) {
          setExternalMessages([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasTrackedInitialState.current) {
      hasTrackedInitialState.current = true;
      return;
    }

    setHasUnsavedChanges(true);
    setPublishMessage('');
    setSaveStatus((status) => status === 'saving' ? status : 'idle');
  }, [story, templateConfigs, templateSteps]);

  const saveDraft = () => {
    const savedAt = new Date().toISOString();
    const draft: StudioDraft = {
      story,
      templateConfigs,
      templateSteps,
      savedAt
    };

    setSaveStatus('saving');

    try {
      window.localStorage.setItem(studioDraftStorageKey, JSON.stringify(draft));
      setLastSavedAt(savedAt);
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      return true;
    } catch {
      setSaveStatus('error');
      return false;
    }
  };

  const handlePublish = () => {
    const saved = saveDraft();
    if (!saved) {
      setPublishMessage("Impossible de publier: la sauvegarde a echoue.");
      return;
    }

    setPublishMessage('Brouillon sauvegarde. Publication prete a etre connectee.');
  };

  const renderPreview = () => {
    switch (storyForPreview.themeTemplate) {
      case 'cinematic': return <CinematicTemplate story={storyForPreview} />;
      case 'timeline': return <TimelineTemplate story={storyForPreview} />;
      case 'scrapbook': return <ScrapbookTemplate story={storyForPreview} />;
      case 'echo': return <EchoTemplate story={storyForPreview} />;
      case 'eclat': return <EclatTemplate story={storyForPreview} />;
      case 'murmure': return <MurmureTemplate story={storyForPreview} />;
      case 'romance': return <RomanceTemplate story={storyForPreview} />;
      case 'starlight': return <StarlightTemplate story={storyForPreview} />;
      case 'minimal': return <MinimalTemplate story={storyForPreview} />;
      case 'classic': return <ClassicTemplate story={storyForPreview} />;
      default: return <ClassicTemplate story={storyForPreview} />;
    }
  };

  const updateStep = (index: number, key: string, value: any) => {
    const newSteps = [...story.steps];
    newSteps[index] = { ...newSteps[index], [key]: value };
    setStory({ ...story, steps: newSteps });
    setTemplateSteps((prev) => ({
      ...prev,
      [story.themeTemplate]: newSteps
    }));
  };

  const updateStoryConfig = (key: string, value: any) => {
    const nextConfig = {
      ...(story.config || {}),
      [key]: value
    };
    setStory({ ...story, config: nextConfig });
    setTemplateConfigs((prev) => ({
      ...prev,
      [story.themeTemplate]: nextConfig
    }));
  };

  const updateStepMeta = (index: number, key: string, value: any) => {
    const newSteps = [...story.steps];
    const step = newSteps[index];
    newSteps[index] = { ...step, meta: { ...(step.meta || {}), [key]: value } };
    setStory({ ...story, steps: newSteps });
    setTemplateSteps((prev) => ({
      ...prev,
      [story.themeTemplate]: newSteps
    }));
  };

  const applyClassicConfigDefaults = (config: Record<string, any>) => {
    const classicConfig = pickConfig(config, classicConfigKeys);

    return {
      classicTheme: classicConfig.classicTheme ?? defaultClassicContent.templateId ?? 'romance',
      classicTransition: classicConfig.classicTransition ?? defaultClassicContent.transitionType ?? 'fade',
      unlockCode: classicConfig.unlockCode ?? classicConfig.pinCode ?? defaultClassicContent.unlockCode ?? '',
      audioUrl: classicConfig.audioUrl ?? defaultClassicContent.audioUrl ?? '',
      introText1: classicConfig.introText1 ?? defaultClassicContent.introText1,
      introText2: classicConfig.introText2 ?? defaultClassicContent.introText2,
      introText3: classicConfig.introText3 ?? defaultClassicContent.introText3,
      capsuleCards: classicConfig.capsuleCards ?? clone(defaultClassicContent.capsuleCards),
      galleryPhotos: classicConfig.galleryPhotos ?? clone(defaultClassicContent.galleryPhotos),
      playlistTitle: classicConfig.playlistTitle ?? defaultClassicContent.playlistTitle,
      playlistSubtitle: classicConfig.playlistSubtitle ?? defaultClassicContent.playlistSubtitle,
      playlistMode: classicConfig.playlistMode ?? defaultClassicContent.playlistMode ?? 'single',
      playlistUrl: classicConfig.playlistUrl ?? defaultClassicContent.playlistUrl ?? '',
      playlistNote: classicConfig.playlistNote ?? defaultClassicContent.playlistNote ?? '',
      playlistTracks: classicConfig.playlistTracks ?? clone(defaultClassicContent.playlistTracks || []),
      letterParts: classicConfig.letterParts ?? clone(defaultClassicContent.letterParts),
      friendMessages: classicConfig.friendMessages ?? clone(defaultClassicContent.friendMessages),
      defaultWords: classicConfig.defaultWords ?? clone(defaultClassicContent.defaultWords || []),
      surpriseTitle: classicConfig.surpriseTitle ?? defaultClassicContent.surpriseTitle,
      surpriseSubtitle: classicConfig.surpriseSubtitle ?? defaultClassicContent.surpriseSubtitle,
      surpriseText: classicConfig.surpriseText ?? defaultClassicContent.surpriseText,
      transitionMessages: classicConfig.transitionMessages ?? clone(defaultClassicContent.transitionMessages || []),
      guestbookForm: {
        ...clone(defaultClassicContent.guestbookForm || {}),
        ...(classicConfig.guestbookForm || {})
      }
    };
  };

  const buildTemplateConfig = (templateId: ThemeTemplate, config: Record<string, any>) => {
    if (templateId === 'classic') {
      return applyClassicConfigDefaults(config);
    }

    return {
      ...templateDefaults[templateId],
      ...pickConfig(config, getTemplateConfigKeys(templateId))
    };
  };

  const selectTemplate = (templateId: ThemeTemplate) => {
    const currentTemplateConfig = buildTemplateConfig(story.themeTemplate, story.config || {});
    const currentTemplateSteps = story.steps;
    const savedTemplateConfig = templateId === story.themeTemplate
      ? currentTemplateConfig
      : templateConfigs[templateId] || {};
    const nextTemplateConfig = buildTemplateConfig(templateId, savedTemplateConfig);
    const nextTemplateSteps = templateId === story.themeTemplate
      ? currentTemplateSteps
      : clone(templateSteps[templateId] || templateStepPresets[templateId] || currentTemplateSteps);

    setTemplateConfigs((prev) => ({
      ...prev,
      [story.themeTemplate]: currentTemplateConfig,
      [templateId]: nextTemplateConfig
    }));
    setTemplateSteps((prev) => ({
      ...prev,
      [story.themeTemplate]: currentTemplateSteps,
      [templateId]: nextTemplateSteps
    }));
    setStory({
      ...story,
      themeTemplate: templateId,
      config: nextTemplateConfig,
      steps: nextTemplateSteps
    });
    setActiveTab('content');
  };

  const removeStep = (index: number) => {
    const newSteps = [...story.steps];
    newSteps.splice(index, 1);
    setStory({ ...story, steps: newSteps });
    setTemplateSteps((prev) => ({
      ...prev,
      [story.themeTemplate]: newSteps
    }));
  };

  const addStep = () => {
    const newSteps: Step[] = [
      ...story.steps,
      { id: `s${Date.now()}`, title: 'Nouvelle etape', content: 'Votre texte ici...', mediaType: 'none', transition: 'fade' }
    ];
    setStory({ ...story, steps: newSteps });
    setTemplateSteps((prev) => ({
      ...prev,
      [story.themeTemplate]: newSteps
    }));
  };

  const getConfigValue = (key: string) => {
    const defaultValue = templateDefaults[story.themeTemplate]?.[key] || '';
    return String(story.config?.[key] ?? defaultValue);
  };

  const getClassicValue = (key: keyof AppContent | string) => {
    return String(story.config?.[key] ?? (defaultClassicContent as any)[key] ?? '');
  };

  const getClassicArray = <T,>(key: keyof AppContent): T[] => {
    const value = story.config?.[key] ?? (defaultClassicContent as any)[key];
    return Array.isArray(value) ? value as T[] : [];
  };

  const updateClassicArrayItem = (field: keyof AppContent, index: number, itemField: string, value: string) => {
    const list = [...getClassicArray<any>(field)];
    list[index] = { ...(list[index] || {}), [itemField]: value };
    updateStoryConfig(field, list);
  };

  const updateClassicStringArrayItem = (field: keyof AppContent, index: number, value: string) => {
    const list = [...getClassicArray<string>(field)];
    list[index] = value;
    updateStoryConfig(field, list);
  };

  const addClassicArrayItem = (field: keyof AppContent, emptyItem: any) => {
    updateStoryConfig(field, [...getClassicArray<any>(field), emptyItem]);
  };

  const removeClassicArrayItem = (field: keyof AppContent, index: number) => {
    updateStoryConfig(field, getClassicArray<any>(field).filter((_, i) => i !== index));
  };

  const getGuestbookValue = (key: keyof NonNullable<AppContent['guestbookForm']>) => {
    const form = {
      ...(defaultClassicContent.guestbookForm || {}),
      ...(story.config?.guestbookForm || {})
    };
    return String(form[key] || '');
  };

  const updateGuestbookField = (key: keyof NonNullable<AppContent['guestbookForm']>, value: string) => {
    updateStoryConfig('guestbookForm', {
      ...(defaultClassicContent.guestbookForm || {}),
      ...(story.config?.guestbookForm || {}),
      [key]: value
    });
  };

  const getStepMetaArray = <T,>(step: Step, key: string): T[] => {
    const value = step.meta?.[key];
    return Array.isArray(value) ? value as T[] : [];
  };

  const updateStepImages = (stepIndex: number, images: string[]) => updateStepMeta(stepIndex, 'images', images);

  const updateStepQuotes = (stepIndex: number, quotes: { text: string; author: string }[]) => updateStepMeta(stepIndex, 'quotes', quotes);

  const updateStepPlaylist = (stepIndex: number, playlist: MusicTrack[]) => updateStepMeta(stepIndex, 'playlist', playlist);

  const buildExternalFormUrl = (template: ThemeTemplate, stepId: string, stepTitle: string) => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    const params = new URLSearchParams({
      template,
      step: stepId,
      name: story.recipientName,
      story: story.title,
      stepTitle
    });

    return `${origin}/message?${params.toString()}`;
  };

  const buildShareUrl = (step: Step) => buildExternalFormUrl(story.themeTemplate, step.id, step.title);

  const copyShareUrl = async (stepId: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // The visible input remains available when clipboard permissions are denied.
    }

    setCopiedShareStepId(stepId);
    window.setTimeout(() => setCopiedShareStepId(null), 1800);
  };

  const renderModelContentFields = () => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="font-semibold text-white mb-1 text-sm">Contenu propre au modele</h3>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        Ces champs appartiennent uniquement au modele {activeProfile.label}.
      </p>
      <div className="space-y-3">
        {activeProfile.settings.map((field) => (
          <div key={field.key}>
            <FieldControl
              field={field}
              value={getConfigValue(field.key)}
              onChange={(value) => updateStoryConfig(field.key, value)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderClassicEditor = () => {
    const capsuleCards = getClassicArray<AppContent['capsuleCards'][number]>('capsuleCards');
    const galleryPhotos = getClassicArray<AppContent['galleryPhotos'][number]>('galleryPhotos');
    const letterParts = getClassicArray<string>('letterParts');
    const friendMessages = getClassicArray<AppContent['friendMessages'][number]>('friendMessages');
    const classicPlaylistMode = String(story.config?.playlistMode || 'single');
    const classicPlaylistTracks = Array.isArray(story.config?.playlistTracks)
      ? story.config.playlistTracks as MusicTrack[]
      : [];
    const updateClassicPlaylistTrack = (trackIndex: number, field: keyof MusicTrack, value: string) => {
      const nextTracks = [...classicPlaylistTracks];
      nextTracks[trackIndex] = { ...(nextTracks[trackIndex] || { title: '' }), [field]: value };
      updateStoryConfig('playlistTracks', nextTracks);
    };
    const classicShareStepId = 'classic-guestbook';
    const classicShareUrl = buildExternalFormUrl(
      'classic',
      classicShareStepId,
      getGuestbookValue('title') || 'Formulaire de temoignage'
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contenu V1 Original</label>
        </div>

        <SectionCard title="0. Securite">
          <FieldControl field={{ key: 'unlockCode', label: "Code d'acces", placeholder: 'Ex: 1234' }} value={getConfigValue('unlockCode')} onChange={(value) => updateStoryConfig('unlockCode', value.slice(0, 4).replace(/[^0-9]/g, ''))} />
          <FieldControl field={{ key: 'classicTheme', label: 'Style visuel', type: 'select', options: classicThemeOptions }} value={getConfigValue('classicTheme') || 'romance'} onChange={(value) => updateStoryConfig('classicTheme', value)} />
          <FieldControl field={{ key: 'classicTransition', label: 'Transition', type: 'select', options: classicTransitionOptions }} value={getConfigValue('classicTransition') || 'fade'} onChange={(value) => updateStoryConfig('classicTransition', value)} />
        </SectionCard>

        <SectionCard title="1. Introduction">
          <FieldControl field={{ key: 'introText1', label: 'Accroche principale' }} value={getClassicValue('introText1')} onChange={(value) => updateStoryConfig('introText1', value)} />
          <FieldControl field={{ key: 'introText2', label: 'Introduction paragraphe 1', type: 'textarea' }} value={getClassicValue('introText2')} onChange={(value) => updateStoryConfig('introText2', value)} />
          <FieldControl field={{ key: 'introText3', label: 'Introduction paragraphe 2', type: 'textarea' }} value={getClassicValue('introText3')} onChange={(value) => updateStoryConfig('introText3', value)} />
        </SectionCard>

        <SectionCard title="2. Capsule temporelle">
          {capsuleCards.map((card, index) => (
            <div key={index} className="bg-black/20 border border-white/5 rounded-lg p-3 relative space-y-3">
              <FieldControl field={{ key: 'title', label: `Titre carte ${index + 1}` }} value={card.title} onChange={(value) => updateClassicArrayItem('capsuleCards', index, 'title', value)} />
              <FieldControl field={{ key: 'content', label: 'Contenu au dos', type: 'textarea' }} value={card.content} onChange={(value) => updateClassicArrayItem('capsuleCards', index, 'content', value)} />
              <button onClick={() => removeClassicArrayItem('capsuleCards', index)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={() => addClassicArrayItem('capsuleCards', { title: 'Nouveau titre', content: 'Nouveau contenu' })} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-slate-400 hover:text-white flex items-center justify-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Ajouter une carte
          </button>
        </SectionCard>

        <SectionCard title="3. Galerie photos">
          {galleryPhotos.map((photo, index) => (
            <div key={index} className="bg-black/20 border border-white/5 rounded-lg p-3 relative space-y-3">
              <FieldControl field={{ key: 'url', label: `URL image ${index + 1}` }} value={photo.url} onChange={(value) => updateClassicArrayItem('galleryPhotos', index, 'url', value)} />
              <FieldControl field={{ key: 'caption', label: 'Legende', type: 'textarea' }} value={photo.caption} onChange={(value) => updateClassicArrayItem('galleryPhotos', index, 'caption', value)} />
              <button onClick={() => removeClassicArrayItem('galleryPhotos', index)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={() => addClassicArrayItem('galleryPhotos', { url: '', caption: '' })} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-slate-400 hover:text-white flex items-center justify-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Ajouter une photo
          </button>
        </SectionCard>

        <SectionCard title="4. Playlist">
          <FieldControl field={{ key: 'playlistTitle', label: 'Titre de la chanson' }} value={getClassicValue('playlistTitle')} onChange={(value) => updateStoryConfig('playlistTitle', value)} />
          <FieldControl field={{ key: 'playlistSubtitle', label: 'Duree / sous-titre' }} value={getClassicValue('playlistSubtitle')} onChange={(value) => updateStoryConfig('playlistSubtitle', value)} />
          <FieldControl field={{ key: 'audioUrl', label: 'Lien de la musique' }} value={getConfigValue('audioUrl')} onChange={(value) => updateStoryConfig('audioUrl', value)} />
          <FieldControl
            field={{
              key: 'playlistMode',
              label: 'Mode musical',
              type: 'select',
              options: [
                { value: 'single', label: 'Une musique' },
                { value: 'playlist', label: 'Playlist' }
              ]
            }}
            value={classicPlaylistMode}
            onChange={(value) => updateStoryConfig('playlistMode', value)}
          />
          <FieldControl
            field={{ key: 'playlistNote', label: 'Note de playlist', type: 'textarea', placeholder: 'Pourquoi cette musique ou cette playlist accompagne la suite...' }}
            value={getClassicValue('playlistNote')}
            onChange={(value) => updateStoryConfig('playlistNote', value)}
          />
          {classicPlaylistMode === 'playlist' && (
            <div className="space-y-3">
              <FieldControl
                field={{ key: 'playlistUrl', label: 'Lien playlist complete', placeholder: 'Spotify playlist, YouTube playlist, SoundCloud...' }}
                value={getClassicValue('playlistUrl')}
                onChange={(value) => updateStoryConfig('playlistUrl', value)}
              />
              {classicPlaylistTracks.map((track, trackIndex) => (
                <div key={trackIndex} className="bg-black/20 border border-white/5 rounded-lg p-3 relative space-y-2">
                  <FieldControl
                    field={{ key: 'title', label: `Titre piste ${trackIndex + 1}` }}
                    value={track.title || ''}
                    onChange={(value) => updateClassicPlaylistTrack(trackIndex, 'title', value)}
                  />
                  <FieldControl
                    field={{ key: 'artist', label: 'Artiste / souvenir' }}
                    value={track.artist || ''}
                    onChange={(value) => updateClassicPlaylistTrack(trackIndex, 'artist', value)}
                  />
                  <FieldControl
                    field={{ key: 'url', label: 'Lien piste', placeholder: 'MP3, YouTube, Spotify ou SoundCloud' }}
                    value={track.url || ''}
                    onChange={(value) => updateClassicPlaylistTrack(trackIndex, 'url', value)}
                  />
                  <button onClick={() => updateStoryConfig('playlistTracks', classicPlaylistTracks.filter((_, i) => i !== trackIndex))} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={() => updateStoryConfig('playlistTracks', [...classicPlaylistTracks, { title: '', artist: '', url: '' }])} className="w-full py-2 border border-dashed border-white/20 rounded-lg text-slate-400 hover:text-white flex items-center justify-center gap-2 text-xs">
                <Plus className="w-3 h-3" /> Ajouter une piste
              </button>
            </div>
          )}
        </SectionCard>

        <SectionCard title="5. Lettre interactive">
          {letterParts.map((part, index) => (
            <div key={index} className="relative">
              <FieldControl field={{ key: `letter-${index}`, label: `Paragraphe ${index + 1}`, type: 'textarea' }} value={part} onChange={(value) => updateClassicStringArrayItem('letterParts', index, value)} />
              <button onClick={() => removeClassicArrayItem('letterParts', index)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={() => addClassicArrayItem('letterParts', '')} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-slate-400 hover:text-white flex items-center justify-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Ajouter un paragraphe
          </button>
        </SectionCard>

        <SectionCard title="6. Mur des proches">
          {friendMessages.map((message, index) => (
            <div key={index} className="bg-black/20 border border-white/5 rounded-lg p-3 relative space-y-3">
              <FieldControl field={{ key: 'text', label: 'Message', type: 'textarea' }} value={message.text} onChange={(value) => updateClassicArrayItem('friendMessages', index, 'text', value)} />
              <FieldControl field={{ key: 'author', label: 'Auteur' }} value={message.author} onChange={(value) => updateClassicArrayItem('friendMessages', index, 'author', value)} />
              <FieldControl field={{ key: 'word', label: 'Mot dans le coeur' }} value={message.word || ''} onChange={(value) => updateClassicArrayItem('friendMessages', index, 'word', value)} />
              <button onClick={() => removeClassicArrayItem('friendMessages', index)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={() => addClassicArrayItem('friendMessages', { text: '', author: '', word: '' })} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-slate-400 hover:text-white flex items-center justify-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Ajouter un message
          </button>
          <FieldControl
            field={{ key: 'defaultWords', label: 'Mots par defaut du coeur', type: 'textarea' }}
            value={getClassicArray<string>('defaultWords').join('\n')}
            onChange={(value) => updateStoryConfig('defaultWords', splitLines(value))}
          />
        </SectionCard>

        <SectionCard title="Formulaire de temoignage">
          <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-xl p-3 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-400/15 text-indigo-200 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-indigo-100 uppercase tracking-wider">Lien partageable V1</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Les messages envoyes ici rejoignent le mur des proches du modele original.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                readOnly
                value={classicShareUrl}
                className="flex-1 bg-black/25 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-slate-300 outline-none"
              />
              <button
                onClick={() => copyShareUrl(classicShareStepId, classicShareUrl)}
                className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-colors"
                aria-label="Copier le lien V1"
              >
                {copiedShareStepId === classicShareStepId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={classicShareUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg border border-white/10 text-slate-300 flex items-center justify-center hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Ouvrir le formulaire V1"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <FieldControl field={{ key: 'title', label: 'Titre du formulaire' }} value={getGuestbookValue('title')} onChange={(value) => updateGuestbookField('title', value)} />
          <FieldControl field={{ key: 'description', label: 'Description', type: 'textarea' }} value={getGuestbookValue('description')} onChange={(value) => updateGuestbookField('description', value)} />
          <FieldControl field={{ key: 'submitText', label: 'Texte du bouton' }} value={getGuestbookValue('submitText')} onChange={(value) => updateGuestbookField('submitText', value)} />
          <FieldControl field={{ key: 'successTitle', label: 'Titre succes' }} value={getGuestbookValue('successTitle')} onChange={(value) => updateGuestbookField('successTitle', value)} />
          <FieldControl field={{ key: 'successMessage', label: 'Message succes', type: 'textarea' }} value={getGuestbookValue('successMessage')} onChange={(value) => updateGuestbookField('successMessage', value)} />
        </SectionCard>

        <SectionCard title="Transitions entre les etapes">
          <FieldControl
            field={{ key: 'transitionMessages', label: 'Phrases de transition', type: 'textarea', helper: 'Une phrase par ligne.' }}
            value={getClassicArray<string>('transitionMessages').join('\n')}
            onChange={(value) => updateStoryConfig('transitionMessages', splitLines(value))}
          />
        </SectionCard>

        <SectionCard title="7. Surprise finale">
          <FieldControl field={{ key: 'surpriseTitle', label: 'Titre principal', type: 'textarea' }} value={getClassicValue('surpriseTitle')} onChange={(value) => updateStoryConfig('surpriseTitle', value)} />
          <FieldControl field={{ key: 'surpriseSubtitle', label: 'Sous-titre' }} value={getClassicValue('surpriseSubtitle')} onChange={(value) => updateStoryConfig('surpriseSubtitle', value)} />
          <FieldControl field={{ key: 'surpriseText', label: 'Message de conclusion', type: 'textarea' }} value={getClassicValue('surpriseText')} onChange={(value) => updateStoryConfig('surpriseText', value)} />
        </SectionCard>
      </div>
    );
  };

  const renderStepMetaEditor = (step: Step, index: number) => {
    const images = getStepMetaArray<string>(step, 'images');
    const quotes = getStepMetaArray<{ text: string; author: string }>(step, 'quotes');
    const playlist = getStepMetaArray<MusicTrack>(step, 'playlist');
    const musicMode = step.meta?.musicMode === 'single' ? 'single' : 'playlist';
    const shareUrl = buildShareUrl(step);

    return (
      <div className="space-y-3 pt-3 border-t border-white/5">
        <FieldControl
          field={{ key: 'transition', label: 'Transition de cette etape', type: 'select', options: transitionOptions }}
          value={step.transition || 'fade'}
          onChange={(value) => updateStep(index, 'transition', value)}
        />
        <FieldControl
          field={{ key: 'type', label: "Type d'etape", type: 'select', options: stepTypeOptions }}
          value={step.type || 'standard'}
          onChange={(value) => updateStep(index, 'type', value === 'standard' ? undefined : value)}
        />

        {activeProfile.stepFields.map((field) => (
          <div key={field.key}>
            <FieldControl
              field={field}
              value={String(step.meta?.[field.key] || '')}
              onChange={(value) => updateStepMeta(index, field.key, value)}
            />
          </div>
        ))}

        {step.type === 'gallery' && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase block">Images de galerie</label>
            {images.map((image, imageIndex) => (
              <div key={imageIndex} className="flex gap-2">
                <input
                  type="text"
                  value={image}
                  onChange={(event) => {
                    const nextImages = [...images];
                    nextImages[imageIndex] = event.target.value;
                    updateStepImages(index, nextImages);
                  }}
                  placeholder={`URL image ${imageIndex + 1}`}
                  className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none"
                />
                <button onClick={() => updateStepImages(index, images.filter((_, i) => i !== imageIndex))} className="text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={() => updateStepImages(index, [...images, ''])} className="w-full py-2 border border-dashed border-white/20 rounded-lg text-slate-400 hover:text-white flex items-center justify-center gap-2 text-xs">
              <Plus className="w-3 h-3" /> Ajouter une image
            </button>
          </div>
        )}

        {step.type === 'words' && (
          <div className="space-y-2">
            <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-xl p-3 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-400/15 text-indigo-200 flex items-center justify-center shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-indigo-100 uppercase tracking-wider">Formulaire externe pour les proches</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Ce lien ouvre un formulaire public adapte au style {activeProfile.label}.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-black/25 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-slate-300 outline-none"
                />
                <button
                  onClick={() => copyShareUrl(step.id, shareUrl)}
                  className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-colors"
                  aria-label="Copier le lien"
                >
                  {copiedShareStepId === step.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-lg border border-white/10 text-slate-300 flex items-center justify-center hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Ouvrir le formulaire"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <label className="text-xs font-semibold text-slate-400 uppercase block">Messages / citations</label>
            {quotes.map((quote, quoteIndex) => (
              <div key={quoteIndex} className="bg-black/20 border border-white/5 rounded-lg p-3 relative space-y-2">
                <FieldControl
                  field={{ key: 'text', label: 'Texte', type: 'textarea' }}
                  value={quote.text}
                  onChange={(value) => {
                    const nextQuotes = [...quotes];
                    nextQuotes[quoteIndex] = { ...quote, text: value };
                    updateStepQuotes(index, nextQuotes);
                  }}
                />
                <FieldControl
                  field={{ key: 'author', label: 'Auteur' }}
                  value={quote.author}
                  onChange={(value) => {
                    const nextQuotes = [...quotes];
                    nextQuotes[quoteIndex] = { ...quote, author: value };
                    updateStepQuotes(index, nextQuotes);
                  }}
                />
                <button onClick={() => updateStepQuotes(index, quotes.filter((_, i) => i !== quoteIndex))} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={() => updateStepQuotes(index, [...quotes, { text: '', author: '' }])} className="w-full py-2 border border-dashed border-white/20 rounded-lg text-slate-400 hover:text-white flex items-center justify-center gap-2 text-xs">
              <Plus className="w-3 h-3" /> Ajouter une citation
            </button>
          </div>
        )}

        {step.type === 'music' && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase block">Musique reelle / playlist</label>
            <FieldControl
              field={{
                key: 'musicMode',
                label: 'Mode musical',
                type: 'select',
                options: [
                  { value: 'single', label: 'Une musique' },
                  { value: 'playlist', label: 'Playlist' }
                ]
              }}
              value={musicMode}
              onChange={(value) => updateStepMeta(index, 'musicMode', value)}
            />
            <FieldControl
              field={{ key: 'musicTitle', label: 'Titre du bloc musique', placeholder: 'Ex: Notre bande son' }}
              value={String(step.meta?.musicTitle || '')}
              onChange={(value) => updateStepMeta(index, 'musicTitle', value)}
            />
            <FieldControl
              field={{ key: 'musicNote', label: 'Note autour de la musique', type: 'textarea', placeholder: 'Pourquoi cette musique compte...' }}
              value={String(step.meta?.musicNote || '')}
              onChange={(value) => updateStepMeta(index, 'musicNote', value)}
            />

            {musicMode === 'single' ? (
              <>
                <FieldControl
                  field={{ key: 'musicArtist', label: 'Artiste / sous-titre', placeholder: 'Ex: La chanson de ce moment' }}
                  value={String(step.meta?.musicArtist || '')}
                  onChange={(value) => updateStepMeta(index, 'musicArtist', value)}
                />
                <FieldControl
                  field={{ key: 'musicUrl', label: 'Lien de la musique', placeholder: 'MP3, YouTube, Spotify ou SoundCloud' }}
                  value={String(step.meta?.musicUrl || '')}
                  onChange={(value) => updateStepMeta(index, 'musicUrl', value)}
                />
              </>
            ) : (
              <div className="space-y-3">
                <FieldControl
                  field={{ key: 'playlistUrl', label: 'Lien playlist complete', placeholder: 'Spotify playlist, YouTube playlist, SoundCloud...' }}
                  value={String(step.meta?.playlistUrl || '')}
                  onChange={(value) => updateStepMeta(index, 'playlistUrl', value)}
                />
                {playlist.map((track, trackIndex) => (
                  <div key={trackIndex} className="bg-black/20 border border-white/5 rounded-lg p-3 relative space-y-2">
                    <FieldControl
                      field={{ key: 'title', label: `Titre piste ${trackIndex + 1}` }}
                      value={track.title || ''}
                      onChange={(value) => {
                        const nextPlaylist = [...playlist];
                        nextPlaylist[trackIndex] = { ...track, title: value };
                        updateStepPlaylist(index, nextPlaylist);
                      }}
                    />
                    <FieldControl
                      field={{ key: 'artist', label: 'Artiste / souvenir' }}
                      value={track.artist || ''}
                      onChange={(value) => {
                        const nextPlaylist = [...playlist];
                        nextPlaylist[trackIndex] = { ...track, artist: value };
                        updateStepPlaylist(index, nextPlaylist);
                      }}
                    />
                    <FieldControl
                      field={{ key: 'url', label: 'Lien piste', placeholder: 'MP3, YouTube, Spotify ou SoundCloud' }}
                      value={track.url || ''}
                      onChange={(value) => {
                        const nextPlaylist = [...playlist];
                        nextPlaylist[trackIndex] = { ...track, url: value };
                        updateStepPlaylist(index, nextPlaylist);
                      }}
                    />
                    <button onClick={() => updateStepPlaylist(index, playlist.filter((_, i) => i !== trackIndex))} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={() => updateStepPlaylist(index, [...playlist, { title: '', artist: '', url: '' }])} className="w-full py-2 border border-dashed border-white/20 rounded-lg text-slate-400 hover:text-white flex items-center justify-center gap-2 text-xs">
                  <Plus className="w-3 h-3" /> Ajouter une piste
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const savedTimeLabel = formatSavedTime(lastSavedAt);
  const saveStatusText = saveStatus === 'saving'
    ? 'Sauvegarde...'
    : saveStatus === 'error'
      ? 'Sauvegarde impossible'
      : hasUnsavedChanges
        ? 'Modifications non sauvegardees'
        : saveStatus === 'saved'
          ? `Brouillon sauvegarde${savedTimeLabel ? ` a ${savedTimeLabel}` : ''}`
          : 'Aucun brouillon sauvegarde';

  return (
    <div className="min-h-screen w-full lg:h-screen flex flex-col lg:flex-row bg-[#0A0A0B] font-sans overflow-y-auto lg:overflow-hidden text-slate-200">
      <div className="w-full lg:w-[440px] xl:w-[480px] max-h-[70vh] lg:max-h-none lg:h-full flex flex-col bg-[#141415] border-b lg:border-b-0 lg:border-r border-white/10 shrink-0 shadow-2xl relative z-10">
        <div className="p-4 sm:p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 text-white mb-6">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center justify-center">
                <Crown className="w-5 h-5 text-indigo-100" />
                <Heart className="w-2.5 h-2.5 text-rose-400 absolute bottom-0 right-0 fill-rose-400" />
              </div>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight">Un Petit Monde</h1>
              <p className="text-xs text-slate-400 font-medium">Studio de Creation Pro</p>
            </div>
          </div>

          <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'theme' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Modele
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'content' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Contenu
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
          {activeTab === 'theme' ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-medium text-white mb-4 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> Choisissez votre univers
                </h3>
                <div className="grid gap-3">
                  {templateProfiles.map((template) => {
                    const Icon = template.icon;
                    const isActive = story.themeTemplate === template.id;
                    return (
                      <button
                        key={template.id}
                        onClick={() => selectTemplate(template.id)}
                        className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden ${
                          isActive
                            ? 'bg-indigo-500/10 border-indigo-500'
                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        {template.premium && (
                          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider font-bold bg-amber-500 text-black px-2 py-0.5 rounded-full">
                            Pro
                          </span>
                        )}
                        <Icon className={`w-6 h-6 mb-3 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <div className={`font-medium mb-1 ${isActive ? 'text-white' : 'text-slate-200'}`}>{template.label}</div>
                        <div className="text-xs text-slate-500">{template.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Titre de l'histoire</label>
                  <input
                    type="text"
                    value={story.title}
                    onChange={(event) => setStory({ ...story, title: event.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Dedicace / Pour qui</label>
                  <input
                    type="text"
                    value={story.recipientName}
                    onChange={(event) => setStory({ ...story, recipientName: event.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {story.themeTemplate !== 'classic' && renderModelContentFields()}

              {story.themeTemplate === 'classic' ? (
                renderClassicEditor()
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Parcours ({story.steps.length})</label>
                  </div>

                  <div className="space-y-4">
                    {story.steps.map((step, index) => (
                      <div key={step.id} className="bg-white/5 border border-white/10 rounded-xl p-4 relative group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 cursor-grab text-slate-500 hover:text-white">
                            <GripVertical className="w-4 h-4" />
                            <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-400">Etape {index + 1}</span>
                          </div>
                          <button onClick={() => removeStep(index)} className="text-slate-500 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Titre..."
                            value={step.title}
                            onChange={(event) => updateStep(index, 'title', event.target.value)}
                            className="w-full bg-transparent text-white font-medium placeholder-slate-600 outline-none text-sm"
                          />
                          <textarea
                            placeholder="Racontez ce moment..."
                            value={step.content}
                            onChange={(event) => updateStep(index, 'content', event.target.value)}
                            className="w-full bg-black/20 rounded-lg p-3 text-sm text-slate-300 placeholder-slate-600 outline-none min-h-[80px] resize-none border border-white/5 focus:border-white/20"
                          />

                          <div className="flex flex-col sm:flex-row gap-2">
                            <select
                              value={step.mediaType}
                              onChange={(event) => updateStep(index, 'mediaType', event.target.value)}
                              className="bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none"
                            >
                              {mediaOptions.map((option) => (
                                <option key={option.value} value={option.value} className="bg-[#141415]">
                                  {option.label}
                                </option>
                              ))}
                            </select>

                            {step.mediaType !== 'none' && (
                              <input
                                type="text"
                                placeholder="URL du media..."
                                value={step.mediaUrl || ''}
                                onChange={(event) => updateStep(index, 'mediaUrl', event.target.value)}
                                className="min-w-0 flex-1 bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none"
                              />
                            )}
                          </div>

                          {renderStepMetaEditor(step, index)}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addStep}
                      className="w-full py-3 border border-dashed border-white/20 rounded-xl text-slate-400 hover:text-white flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/5 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Ajouter
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 shrink-0 bg-[#141415] space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={saveDraft}
              disabled={saveStatus === 'saving'}
              className="flex-1 border border-white/15 text-white font-bold text-sm py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saveStatus === 'saved' && !hasUnsavedChanges ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              Sauvegarder
            </button>
            <button
              onClick={handlePublish}
              disabled={saveStatus === 'saving'}
              className="flex-1 bg-white text-black font-bold text-sm py-3 rounded-lg hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              Publier
            </button>
          </div>
          <div className="min-h-5 text-[11px] leading-relaxed text-slate-500">
            <span className={saveStatus === 'error' ? 'text-red-300' : hasUnsavedChanges ? 'text-amber-300' : 'text-emerald-300'}>
              {saveStatusText}
            </span>
            {publishMessage && <span className="block text-slate-400 mt-1">{publishMessage}</span>}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[72vh] lg:min-h-0 bg-black relative flex flex-col">
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-50 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] sm:text-xs text-white uppercase tracking-wider font-semibold">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Preview
        </div>
        <div className="flex-1 min-h-[72vh] lg:min-h-0 overflow-hidden relative">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}
