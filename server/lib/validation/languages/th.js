// Notes
// - Thai Unicode range: \u0E00-\u0E7F
// - Thai sentence is written without space between words.
// See discussion here:
// https://github.com/Common-Voice/sentence-collector/issues/318

// These classes of Thai characters are not allowed to be immediately repeated:
// - Lead vowels: \u0E40\u0E41\u0E42\u0E43\u0E44
// - Follow vowels: \u0E30\u0E32\u0E33\u0E45
// - Above vowels: \u0E31\u0E34\u0E35\u0E36\u0E37\u0E4D\u0E47
// - Below vowels: \u0E38\u0E39
// - Tone marks: \u0E48\u0E49\u0E4A\u0E4B
// - Phinthu: \u0E3A
// - Thanthakhat: \u0E4C
// - Nikhahit: \u0E4D
// - Yamakkan: \u0E4E

// These classes of Thai characters have a specific legitimate order.
// - Tone marks/Pinthu/Thanthakat/Nikhahit/Yamakkan can't immediately come after lead and follow vowels
// - Tone marks/Pinthu/Thanthakat/Nikhahit/Yamakkan can't immediately come before above and below vowels

// We count chars to validate instead of words.
// Target max time length for recorded speech: 7-10 seconds
const MIN_LENGTH = 2;
const MAX_LENGTH = 80;

const INVALIDATIONS = [{
  fn: (sentence) => {
    return sentence.length < MIN_LENGTH || sentence.length > MAX_LENGTH;
  },
  error: `Number of characters must be between ${MIN_LENGTH} and ${MAX_LENGTH} (inclusive)`,
}, {
  // Thai digits: \u0E50-\u0E59 (๐-๙)
  regex: /[0-9๐-๙]/,
  error: 'Sentence should not contain numbers',
}, {
  // < > + * \ # @ ^ [ ] ( ) /
  // Paiyannoi: \u0E2F ฯ (ellipsis, abbreviation)
  // Maiyamok: \u0E46 ๆ (repetition)
  // Fongman: \u0E4F ๏ (used as bullet)
  // Angkhankhu: \u0E5A ๚ (used to mark end of section/verse)
  // Khomut: \u0E5B ๛ (used to mark end of chapter/document)
  regex: /[<>+*\\#@^[\]()/\u0E2F\u0E46\u0E4F\u0E5A\u0E5B]/,
  error: 'Sentence should not contain symbols, including Paiyannoi and Maiyamok',
}, {
  // Latin character (foreign language) is not allowed
  regex: /[A-Za-z]/,
  error: 'Sentence should not contain latin alphabet characters',
}, {
  // Emoji range from https://www.regextester.com/106421 and
  // https://stackoverflow.com/questions/10992921/how-to-remove-emoji-code-using-javascript
  regex: /(\u00a9|\u00ae|[\u2000-\u3300]|[\u2580-\u27bf]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|[\ue000-\uf8ff])/,
  error: 'Sentence should not contain emojis',
}, {
  // These Thai chars cannot start the word:
  // - All vowels except lead vowels
  // - Tone marks
  // - Phinthu, Thanthakhat, Nikhahit, Yamakkan
  /* eslint-disable-next-line no-misleading-character-class */
  regex: /(^|\s)[\u0E30\u0E32\u0E33\u0E45\u0E31\u0E34\u0E35\u0E36\u0E37\u0E4D\u0E47\u0E38\u0E39\u0E48\u0E49\u0E4A\u0E4B\u0E3A\u0E4C\u0E4D\u0E4E]/,
  error: 'Word should not start with unexpected characters, like follow vowel and tone mark',
}, {
  // These Thai chars cannot end the word:
  // - Lead vowels
  regex: /[\u0E40\u0E41\u0E42\u0E43\u0E44](\s|$)/,
  error: 'Word should not end with leading vowels',
}, {
  // Any words consisting of letters with a period
  // inbetween are considered abbreviations or acronyms.
  // Abbreviations in Latin chars are disallowed by previous rules already.
  regex: /[ก-ฮ]\.[ก-ฮ]+\./,
  error: 'Sentence should not contain abbreviations',
}, {
  // Seven or more repeating characters in a row is likely a non-formal spelling or difficult to read.
  regex: /(.)\1{6}/,
  error: 'Sentence should not contain 7 or more of the same character in a row',
}, {
  regex: /[\u0E40\u0E41\u0E42\u0E43\u0E44]{2}/,
  error: 'Sentence should not contain repeating lead vowels',
}, {
  regex: /[\u0E32\u0E33\u0E45]{2}/,
  error: 'Sentence should not contain repeating follow vowels',
}, {
  regex: /\u0E30{2}/,
  error: 'Sentence should not contain repeating Sara A',
}, {
  regex: /\u0E3A{2}|\u0E4C{2}|\u0E4D{2}|\u0E4E{2}/,
  error: 'Sentence should not contain repeating Phinthu / Thanthakhat / Nikhahit / Yamakkan',
}, {
  regex: /[\u0E31\u0E34\u0E35\u0E36\u0E37\u0E4D\u0E47]{2}/,
  error: 'Sentence should not contain repeating above vowels',
}, {
  regex: /[\u0E38\u0E39]{2}/,
  error: 'Sentence should not contain repeating below vowels',
}, {
  regex: /[\u0E48\u0E49\u0E4A\u0E4B]{2}/,
  error: 'Sentence should not contain repeating tone marks',
}, {
  regex: /[\u0E40\u0E41\u0E42\u0E43\u0E44\u0E30\u0E32\u0E33\u0E45][\u0E48\u0E49\u0E4A\u0E4B\u0E3A\u0E4C\u0E4D\u0E4E]/,
  error: 'Sentence should not contain invalid symbols after lead/follow vowels',
}, {
  regex: /[\u0E48\u0E49\u0E4A\u0E4B\u0E3A\u0E4C\u0E4D\u0E4E][\u0E31\u0E34\u0E35\u0E36\u0E37\u0E4D\u0E47\u0E38\u0E39]/,
  error: 'Sentence should not contain invalid symbols before above/below vowels',
}, {
  regex: /[\u0E33\u0E45][\u0E30]/,
  error: 'Sentence should not contain Sara A after Sara Am or Lakkhangyao',
}, {
  regex: /[\u0E30][\u0E32\u0E33\u0E45]/,
  error: 'Sentence should not contain Sara Aa, Sara Am or Lakkhangyao after Sara A',
}, {
  regex: /[\u0E01-\u0E4Ea-zA-Z.,\-"'“”‘’\u0060?!:;]{55}/,
  error: 'Sentence should not contain more than 54 characters running without whitespace',
}];

module.exports = {
  INVALIDATIONS,
};
