import { Story } from './types_v2';

export const sampleStory: Story = {
  id: 'st_1',
  title: 'L\'Éternité dans un Instant',
  recipientName: 'Mon Âme Sœur',
  themeTemplate: 'romance',
  config: {
    pinCode: '0000', // Exemple de code
  },
  steps: [
    {
      id: 's1',
      title: 'Le premier souffle',
      content: 'Avant toi, le monde était en noir et blanc. Et puis, tu m\'as regardé, et toutes les couleurs se sont réveillées d\'un coup. Ce premier sourire restera gravé dans mon âme.',
      mediaType: 'video',
      mediaUrl: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=165&oauth2_token_id=57447761',
      transition: 'fade'
    },
    {
      id: 's2',
      title: 'L\'étincelle de nos nuits',
      content: 'C\'était à l\'abri des regards, éclairés par la seule lumière des étoiles. Nos mains se sont frôlées. Tout mon univers s\'est réécrit dans le creux de ta paume.',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=1000',
      transition: 'zoom'
    },
    {
      id: 's3',
      title: 'Perdus pour mieux se trouver',
      content: 'Je me souviens de ce jour de pluie, perdus dans des rues inconnues. On riait à en perdre haleine. À cet instant précis, j\'ai su. J\'ai su que mon foyer, c\'était toi.',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1000',
      transition: 'slide'
    },
    {
      id: 's4',
      title: 'Une promesse silencieuse',
      content: 'Quand le monde devient sourd et que la tempête s\'abat, c\'est dans le silence de tes bras que je trouve la paix. Tu es mon ancre, ma douceur, ma certitude.',
      mediaType: 'video',
      mediaUrl: 'https://player.vimeo.com/external/517090082.sd.mp4?s=01edb39b3a7a9deaf41846b0d9127add3c3f8e5b&profile_id=165&oauth2_token_id=57447761',
      transition: 'blur'
    },
    {
      id: 's5',
      title: 'L\'Aube de notre monde',
      content: 'Ceci n\'est que le commencement. Chaque jour à tes côtés est une nouvelle ligne d\'une poésie qui ne s\'écrira jamais sans toi. Je t\'aime, au-delà des mots, au-delà du temps.',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1549487289-53eafeb8ee2c?auto=format&fit=crop&q=80&w=1000',
      transition: 'fade'
    },
    {
      id: 's6',
      title: 'La Galerie Souvenir',
      content: 'Chaque instant capture une partie de nous.',
      mediaType: 'none',
      transition: 'fade',
      type: 'gallery',
      meta: {
        images: [
          'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=500',
          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=500',
          'https://images.unsplash.com/photo-1549487289-53eafeb8ee2c?auto=format&fit=crop&q=80&w=500',
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=500'
        ]
      }
    },
    {
      id: 's7',
      title: 'Quelques mots des autres',
      content: 'Parce que nous ne sommes pas les seuls à voir ta lumière.',
      mediaType: 'none',
      transition: 'fade',
      type: 'words',
      meta: {
        quotes: [
          { author: 'Marie', text: 'Tu as cette lumière qui fait du bien, cette présence qui rassure.' },
          { author: 'Thomas', text: 'Rien ne me fait plus plaisir que de te voir sourire aujourd\'hui.' },
          { author: 'Léa', text: 'Une année de plus pour briller et inspirer tout le monde autour de toi.' }
        ]
      }
    }
  ]
};
