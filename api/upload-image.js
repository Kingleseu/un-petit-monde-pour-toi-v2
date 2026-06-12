import { uploadGalleryImage } from '../lib/imageStore.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    return res.status(200).json(await uploadGalleryImage(image));
  } catch (error) {
    console.error('Unable to upload image', error);
    return res.status(500).json({ error: 'Unable to upload image' });
  }
}
