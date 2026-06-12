import { checkSupabaseHealth } from '../lib/supabaseHealth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    return res.status(200).json(await checkSupabaseHealth());
  } catch (error) {
    console.error('Unable to check Supabase health', error);
    return res.status(500).json({ error: 'Unable to check Supabase health' });
  }
}
