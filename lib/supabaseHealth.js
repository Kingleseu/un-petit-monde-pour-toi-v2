import { hasSupabaseConfig, requestSupabase } from './messagesStore.js';

const tables = [
  'site_settings',
  'guestbook_form',
  'capsule_cards',
  'gallery_photos',
  'letter_parts',
  'friend_messages',
  'default_words',
  'transition_messages',
  'messages',
];

export async function checkSupabaseHealth() {
  if (!hasSupabaseConfig()) {
    return {
      connected: false,
      error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
      tables: tables.map(name => ({ name, ok: false, count: null })),
    };
  }

  const results = await Promise.all(
    tables.map(async name => {
      try {
        const rows = await requestSupabase(`${name}?select=id&limit=1000`);
        return { name, ok: true, count: rows.length };
      } catch (error) {
        return {
          name,
          ok: false,
          count: null,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    })
  );

  let storage = { bucket: process.env.SUPABASE_GALLERY_BUCKET || 'gallery-images', ok: false };
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const response = await fetch(`${supabaseUrl}/storage/v1/bucket/${storage.bucket}`, {
      headers: {
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        apikey: supabaseServiceRoleKey,
      },
    });
    storage = { ...storage, ok: response.ok };
  } catch (error) {
    storage = {
      ...storage,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  return {
    connected: results.every(result => result.ok) && storage.ok,
    tables: results,
    storage,
  };
}
