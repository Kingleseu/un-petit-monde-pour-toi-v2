import fs from 'fs';
import path from 'path';

function readMessages() {
  const filePath = path.join(process.cwd(), 'messages.json');

  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error('Unable to read messages.json', error);
    return [];
  }
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(readMessages());
  }

  if (req.method === 'POST') {
    return res.status(503).json({
      error:
        'Message persistence needs a database or storage provider when deployed on Vercel.',
    });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
