import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import fs from 'fs';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'api-messages-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const urlPath = req.url ? req.url.split('?')[0] : '';
            if (urlPath === '/api/messages' && req.method === 'GET') {
              const filePath = path.resolve(__dirname, 'messages.json');
              let messages = [];
              if (fs.existsSync(filePath)) {
                try {
                  messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                } catch (e) {
                  console.error(e);
                }
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(messages));
            } else if (urlPath === '/api/messages' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', () => {
                try {
                  const data = JSON.parse(body);
                  if (data.text && data.author) {
                    const filePath = path.resolve(__dirname, 'messages.json');
                    let messages = [];
                    if (fs.existsSync(filePath)) {
                      try {
                        messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                      } catch (e) {
                        console.error(e);
                      }
                    }
                    messages.push({ text: data.text, author: data.author, word: data.word });
                    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true, messages }));
                    return;
                  }
                } catch (e) {
                  console.error(e);
                }
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid message data' }));
              });
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
