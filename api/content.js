import { getContent, resetContent, saveContent } from '../lib/contentStore.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(await getContent());
    } catch (error) {
      console.error('Unable to read content', error);
      return res.status(500).json({ error: 'Unable to read content' });
    }
  }

  if (req.method === 'PUT') {
    try {
      return res.status(200).json(await saveContent(req.body));
    } catch (error) {
      console.error('Unable to save content', error);
      return res.status(500).json({ error: 'Unable to save content' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      return res.status(200).json(await resetContent());
    } catch (error) {
      console.error('Unable to reset content', error);
      return res.status(500).json({ error: 'Unable to reset content' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}
