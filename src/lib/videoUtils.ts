export function isVideoUrl(url: string | undefined): boolean {
  if (!url) return false;
  const videoExtensions = /\.(mp4|webm|ogg|mov|m4v)($|\?)/i;
  const videoHosts = /(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com)/i;
  return videoExtensions.test(url) || videoHosts.test(url);
}

export function getEmbedUrl(url: string | undefined): string | null {
  if (!url) return null;
  
  // YouTube
  let match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1`;
  }
  
  // Vimeo
  match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i);
  if (match) {
    return `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1`;
  }
  
  return null;
}

export function getVideoThumbnail(url: string | undefined): string | null {
  if (!url) return null;
  let match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (match) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return null;
}
