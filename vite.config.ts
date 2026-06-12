import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import dotenv from 'dotenv';
import { getContent, resetContent, saveContent } from './lib/contentStore.js';
import { addMessage, deleteMessage, getMessages } from './lib/messagesStore.js';

dotenv.config();

function readRequestBody(req: import('http').IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'api-messages-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const urlPath = req.url ? req.url.split('?')[0] : '';
            if (urlPath === '/api/content' && req.method === 'GET') {
              try {
                const content = await getContent();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(content));
              } catch (e) {
                console.error(e);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to read content' }));
              }
            } else if (urlPath === '/api/content' && req.method === 'PUT') {
              try {
                const data = await readRequestBody(req);
                const content = await saveContent(data);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(content));
              } catch (e) {
                console.error(e);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to save content' }));
              }
            } else if (urlPath === '/api/content' && req.method === 'DELETE') {
              try {
                const content = await resetContent();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(content));
              } catch (e) {
                console.error(e);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to reset content' }));
              }
            } else if (urlPath === '/api/messages' && req.method === 'GET') {
              try {
                const messages = await getMessages();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(messages));
              } catch (e) {
                console.error(e);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to read messages' }));
              }
            } else if (urlPath === '/api/messages' && req.method === 'POST') {
              try {
                const data = await readRequestBody(req);
                if (!data.text || !data.author) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Text and author are required' }));
                  return;
                }

                const messages = await addMessage({ text: data.text, author: data.author, word: data.word });
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, messages }));
              } catch (e) {
                console.error(e);
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid message data' }));
              }
            } else if (urlPath === '/api/messages' && req.method === 'DELETE') {
              const requestUrl = new URL(req.url || '', 'http://localhost');
              const index = Number(requestUrl.searchParams.get('index'));
              if (!Number.isInteger(index) || index < 0) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Valid message index is required' }));
                return;
              }

              try {
                const messages = await deleteMessage(index);
                if (!messages) {
                  res.statusCode = 404;
                  res.end(JSON.stringify({ error: 'Message not found' }));
                  return;
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, messages }));
              } catch (e) {
                console.error(e);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to delete message' }));
              }
            } else {
              next();
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
