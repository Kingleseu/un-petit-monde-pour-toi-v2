import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getContent, resetContent, saveContent } from './lib/contentStore.js';
import { addMessage, deleteMessage, getMessages } from './lib/messagesStore.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/content', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.json(await getContent());
  } catch (e) {
    console.error('Error reading content', e);
    res.status(500).json({ error: 'Failed to read content' });
  }
});

app.put('/api/content', async (req, res) => {
  try {
    res.json(await saveContent(req.body));
  } catch (e) {
    console.error('Error saving content', e);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

app.delete('/api/content', async (req, res) => {
  try {
    res.json(await resetContent());
  } catch (e) {
    console.error('Error resetting content', e);
    res.status(500).json({ error: 'Failed to reset content' });
  }
});

// API to get messages
app.get('/api/messages', async (req, res) => {
  try {
    res.json(await getMessages());
  } catch (e) {
    console.error('Error reading messages', e);
    res.status(500).json({ error: 'Failed to read messages' });
  }
});

// API to save a message
app.post('/api/messages', async (req, res) => {
  const { text, author, word } = req.body;
  if (!text || !author) {
    return res.status(400).json({ error: 'Text and author are required' });
  }

  try {
    const messages = await addMessage({ text, author, word });
    res.json({ success: true, messages });
  } catch (e) {
    console.error('Error writing message', e);
    return res.status(500).json({ error: 'Failed to save message' });
  }
});

// API to delete a message by index
app.delete('/api/messages', async (req, res) => {
  const index = Number(req.query.index);
  if (!Number.isInteger(index) || index < 0) {
    return res.status(400).json({ error: 'Valid message index is required' });
  }

  try {
    const messages = await deleteMessage(index);
    if (!messages) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ success: true, messages });
  } catch (e) {
    console.error('Error deleting message', e);
    return res.status(500).json({ error: 'Failed to delete message' });
  }
});

// All other requests serve index.html (SPA routing fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
