import { addMessage, deleteMessage, getMessages } from '../lib/messagesStore.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(await getMessages());
    } catch (error) {
      console.error('Unable to read messages', error);
      return res.status(500).json({ error: 'Unable to read messages' });
    }
  }

  if (req.method === 'POST') {
    const { text, author, word } = req.body;
    if (!text || !author) {
      return res.status(400).json({ error: 'Text and author are required' });
    }

    try {
      const messages = await addMessage({ text, author, word });
      return res.status(200).json({ success: true, messages });
    } catch (error) {
      console.error('Unable to save message', error);
      return res.status(500).json({ error: 'Unable to save message' });
    }
  }

  if (req.method === 'DELETE') {
    const index = Number(req.query.index);
    if (!Number.isInteger(index) || index < 0) {
      return res.status(400).json({ error: 'Valid message index is required' });
    }

    try {
      const messages = await deleteMessage(index);
      if (!messages) {
        return res.status(404).json({ error: 'Message not found' });
      }

      return res.status(200).json({ success: true, messages });
    } catch (error) {
      console.error('Unable to delete message', error);
      return res.status(500).json({ error: 'Unable to delete message' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}
