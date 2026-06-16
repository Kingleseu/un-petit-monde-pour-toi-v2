import fs from 'fs';
import path from 'path';

function getSupabaseUrl() {
  return process.env.SUPABASE_URL;
}

function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

function getSupabaseMessagesTable() {
  return process.env.SUPABASE_MESSAGES_TABLE || 'messages';
}

export function hasSupabaseConfig() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}

function getLocalMessagesPath() {
  return path.join(process.cwd(), 'messages.json');
}

function normalizeMessage(row) {
  return {
    text: row.text,
    author: row.author,
    word: row.word || '',
    template: row.template || '',
    stepId: row.stepId || row.step_id || '',
    recipientName: row.recipientName || row.recipient_name || '',
    createdAt: row.createdAt || row.created_at || '',
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
  const supabaseUrl = getSupabaseUrl();
  const supabaseServiceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }

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

  const supabaseTable = getSupabaseMessagesTable();
  const rows = await requestSupabase(`${supabaseTable}?select=*&order=created_at.asc`);
  return rows.map(normalizeMessage);
}

export async function addMessage({ text, author, word, template, stepId, recipientName }) {
  const message = {
    text,
    author,
    word: word || '',
    template: template || '',
    stepId: stepId || '',
    recipientName: recipientName || '',
    createdAt: new Date().toISOString(),
  };

  if (!hasSupabaseConfig()) {
    const messages = readLocalMessages();
    messages.push(message);
    writeLocalMessages(messages);
    return messages;
  }

  const supabaseTable = getSupabaseMessagesTable();
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

  const supabaseTable = getSupabaseMessagesTable();
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
