import { defaultContent } from './defaultContent.js';
import { hasSupabaseConfig, requestSupabase } from './messagesStore.js';

const TABLES = {
  settings: 'site_settings',
  guestbook: 'guestbook_form',
  capsule: 'capsule_cards',
  gallery: 'gallery_photos',
  letter: 'letter_parts',
  friendMessages: 'friend_messages',
  defaultWords: 'default_words',
  transitions: 'transition_messages',
};

function byPosition(a, b) {
  return a.position - b.position;
}

function mergeContent(content) {
  return {
    ...defaultContent,
    ...content,
    guestbookForm: {
      ...defaultContent.guestbookForm,
      ...(content.guestbookForm || {}),
    },
  };
}

function fromSettings(row) {
  if (!row) {
    return {};
  }

  return {
    recipientName: row.recipient_name,
    introText1: row.intro_text_1,
    introText2: row.intro_text_2,
    introText3: row.intro_text_3,
    playlistTitle: row.playlist_title,
    playlistSubtitle: row.playlist_subtitle,
    surpriseTitle: row.surprise_title,
    surpriseSubtitle: row.surprise_subtitle,
    surpriseText: row.surprise_text,
    unlockCode: row.unlock_code || '',
    audioUrl: row.audio_url || '',
  };
}

function toSettings(content) {
  return {
    id: 1,
    recipient_name: content.recipientName,
    intro_text_1: content.introText1,
    intro_text_2: content.introText2,
    intro_text_3: content.introText3,
    playlist_title: content.playlistTitle,
    playlist_subtitle: content.playlistSubtitle,
    surprise_title: content.surpriseTitle,
    surprise_subtitle: content.surpriseSubtitle,
    surprise_text: content.surpriseText,
    unlock_code: content.unlockCode || '',
    audio_url: content.audioUrl || '',
  };
}

function fromGuestbook(row) {
  if (!row) {
    return {};
  }

  return {
    title: row.title,
    description: row.description,
    authorLabel: row.author_label,
    authorPlaceholder: row.author_placeholder,
    wordLabel: row.word_label,
    wordPlaceholder: row.word_placeholder,
    messageLabel: row.message_label,
    messagePlaceholder: row.message_placeholder,
    submitText: row.submit_text,
    submittingText: row.submitting_text,
    successTitle: row.success_title,
    successMessage: row.success_message,
    writeAnotherText: row.write_another_text,
  };
}

function toGuestbook(content) {
  const form = content.guestbookForm || defaultContent.guestbookForm;

  return {
    id: 1,
    title: form.title,
    description: form.description,
    author_label: form.authorLabel,
    author_placeholder: form.authorPlaceholder,
    word_label: form.wordLabel,
    word_placeholder: form.wordPlaceholder,
    message_label: form.messageLabel,
    message_placeholder: form.messagePlaceholder,
    submit_text: form.submitText,
    submitting_text: form.submittingText,
    success_title: form.successTitle,
    success_message: form.successMessage,
    write_another_text: form.writeAnotherText,
  };
}

async function getRows(table) {
  return requestSupabase(`${table}?select=*&order=position.asc`);
}

async function replaceRows(table, rows) {
  await requestSupabase(`${table}?id=neq.0`, { method: 'DELETE' });

  if (rows.length === 0) {
    return;
  }

  await requestSupabase(table, {
    method: 'POST',
    body: JSON.stringify(rows),
  });
}

async function upsertSingleton(table, row) {
  await requestSupabase(table, {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(row),
  });
}

export async function getContent() {
  if (!hasSupabaseConfig()) {
    return defaultContent;
  }

  const [settings, guestbook, capsule, gallery, letter, friendMessages, defaultWords, transitions] = await Promise.all([
    requestSupabase(`${TABLES.settings}?select=*&id=eq.1`),
    requestSupabase(`${TABLES.guestbook}?select=*&id=eq.1`),
    getRows(TABLES.capsule),
    getRows(TABLES.gallery),
    getRows(TABLES.letter),
    getRows(TABLES.friendMessages),
    getRows(TABLES.defaultWords),
    getRows(TABLES.transitions),
  ]);

  return mergeContent({
    ...fromSettings(settings[0]),
    guestbookForm: fromGuestbook(guestbook[0]),
    capsuleCards: capsule.sort(byPosition).map(row => ({ title: row.title, content: row.content })),
    galleryPhotos: gallery.sort(byPosition).map(row => ({ url: row.url, caption: row.caption })),
    letterParts: letter.sort(byPosition).map(row => row.text),
    friendMessages: friendMessages.sort(byPosition).map(row => ({ text: row.text, author: row.author, word: row.word || '' })),
    defaultWords: defaultWords.sort(byPosition).map(row => row.word),
    transitionMessages: transitions.sort(byPosition).map(row => row.text),
  });
}

export async function saveContent(content) {
  const normalizedContent = mergeContent(content);

  if (!hasSupabaseConfig()) {
    return normalizedContent;
  }

  await Promise.all([
    upsertSingleton(TABLES.settings, toSettings(normalizedContent)),
    upsertSingleton(TABLES.guestbook, toGuestbook(normalizedContent)),
    replaceRows(TABLES.capsule, normalizedContent.capsuleCards.map((item, index) => ({
      position: index,
      title: item.title,
      content: item.content,
    }))),
    replaceRows(TABLES.gallery, normalizedContent.galleryPhotos.map((item, index) => ({
      position: index,
      url: item.url,
      caption: item.caption,
    }))),
    replaceRows(TABLES.letter, normalizedContent.letterParts.map((text, index) => ({
      position: index,
      text,
    }))),
    replaceRows(TABLES.friendMessages, normalizedContent.friendMessages.map((item, index) => ({
      position: index,
      text: item.text,
      author: item.author,
      word: item.word || '',
    }))),
    replaceRows(TABLES.defaultWords, (normalizedContent.defaultWords || []).map((word, index) => ({
      position: index,
      word,
    }))),
    replaceRows(TABLES.transitions, (normalizedContent.transitionMessages || []).map((text, index) => ({
      position: index,
      text,
    }))),
  ]);

  return getContent();
}

export async function resetContent() {
  return saveContent(defaultContent);
}
