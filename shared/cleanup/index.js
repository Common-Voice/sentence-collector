import * as en from './languages/en';
import * as fr from './languages/fr';

const CLEANUPS = {
  en,
  fr
};

const DEFAULT_CLEANUP_LANGUAGE = 'en';
const DEFAULT_CLEANUP = CLEANUPS[DEFAULT_CLEANUP_LANGUAGE];

export function cleanupSentences(language, sentences) {
  const cleanup = getCleanupFor(language);

  const sorted = sortSentences(cleanup, sentences);
  const spaceCleaned = clean(cleanup, sorted);
  return spaceCleaned;
}

function sortSentences(cleanup, sentences) {
  return cleanup.sortSentences(sentences);
}

function clean(cleanup, sentences) {
  return cleanup.clean(sentences);
}

function getCleanupFor(language) {
  return CLEANUPS[language] || DEFAULT_CLEANUP;
}
