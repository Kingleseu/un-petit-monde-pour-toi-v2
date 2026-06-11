import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

const messagesFilePath = path.join(__dirname, 'messages.json');

// Helper to read messages from JSON file safely
function getMessages() {
  let messages = [];
  if (fs.existsSync(messagesFilePath)) {
    try {
      messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf-8'));
    } catch (e) {
      console.error("Error reading messages.json", e);
    }
  }
  return messages;
}

// API to get messages
app.get('/api/messages', (req, res) => {
  res.json(getMessages());
});

// API to save a message
app.post('/api/messages', (req, res) => {
  const { text, author, word } = req.body;
  if (!text || !author) {
    return res.status(400).json({ error: 'Text and author are required' });
  }

  const messages = getMessages();
  messages.push({ text, author, word });
  
  try {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
  } catch (e) {
    console.error("Error writing messages.json", e);
    return res.status(500).json({ error: 'Failed to save message' });
  }

  res.json({ success: true, messages });
});

// API to delete a message by index
app.delete('/api/messages', (req, res) => {
  const index = Number(req.query.index);
  if (!Number.isInteger(index) || index < 0) {
    return res.status(400).json({ error: 'Valid message index is required' });
  }

  const messages = getMessages();
  if (index >= messages.length) {
    return res.status(404).json({ error: 'Message not found' });
  }

  messages.splice(index, 1);

  try {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
  } catch (e) {
    console.error("Error writing messages.json", e);
    return res.status(500).json({ error: 'Failed to delete message' });
  }

  res.json({ success: true, messages });
});

// All other requests serve index.html (SPA routing fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
