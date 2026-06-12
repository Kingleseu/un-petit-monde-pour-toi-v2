import { hasSupabaseConfig } from './messagesStore.js';
import { randomUUID } from 'crypto';

const bucketName = process.env.SUPABASE_GALLERY_BUCKET || 'gallery-images';

function parseDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);

  if (!match) {
    throw new Error('Invalid image data');
  }

  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], 'base64'),
  };
}

function getExtension(mimeType) {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/gif') return 'gif';
  return 'jpg';
}

export async function uploadGalleryImage(dataUrl) {
  if (!hasSupabaseConfig()) {
    return { url: dataUrl };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const { mimeType, buffer } = parseDataUrl(dataUrl);
  const extension = getExtension(mimeType);
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = `gallery/${fileName}`;

  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucketName}/${filePath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      apikey: supabaseServiceRoleKey,
      'Content-Type': mimeType,
      'x-upsert': 'true',
    },
    body: buffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase image upload failed: ${response.status} ${errorText}`);
  }

  return {
    url: `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`,
  };
}
