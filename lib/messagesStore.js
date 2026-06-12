import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseTable = process.env.SUPABASE_MESSAGES_TABLE || 'messages';

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

function getLocalMessagesPath() {
  return path.join(process.cwd(), 'messages.json');
}

function normalizeMessage(row) {
  return {
    text: row.text,
    author: row.author,
    word: row.word || '',
  };
}

function readLocalMessages() {
  const filePath = getLocalMessagesPath();

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

function writeLocalMessages(messages) {
  fs.writeFileSync(getLocalMessagesPath(), JSON.stringify(messages, null, 2));
}

export async function requestSupabase(pathname, options = {}) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${pathname}`, {
    ...options,
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${errorText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getMessages() {
  if (!hasSupabaseConfig()) {
    return readLocalMessages();
  }

  const rows = await requestSupabase(`${supabaseTable}?select=*&order=created_at.asc`);
  return rows.map(normalizeMessage);
}

export async function addMessage({ text, author, word }) {
  if (!hasSupabaseConfig()) {
    const messages = readLocalMessages();
    messages.push({ text, author, word });
    writeLocalMessages(messages);
    return messages;
  }

  await requestSupabase(supabaseTable, {
    method: 'POST',
    body: JSON.stringify({ text, author, word }),
  });

  return getMessages();
}

export async function deleteMessage(index) {
  if (!hasSupabaseConfig()) {
    const messages = readLocalMessages();

    if (index >= messages.length) {
      return null;
    }

    messages.splice(index, 1);
    writeLocalMessages(messages);
    return messages;
  }

  const rows = await requestSupabase(`${supabaseTable}?select=id&order=created_at.asc`);
  const target = rows[index];

  if (!target) {
    return null;
  }

  await requestSupabase(`${supabaseTable}?id=eq.${target.id}`, {
    method: 'DELETE',
  });

  return getMessages();
}
