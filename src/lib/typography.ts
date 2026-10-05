const NBSP = "\xa0";

// One- and two-letter words plus a few common short prepositions/conjunctions.
const SHORT_WORD =
  /(?<=^|[\s(«"\xa0])([а-яё]{1,2}|для|или|что|как|при|без|над|под|про)[ \t]+/giu;

/**
 * Russian typesetting: binds short words to the next word and keeps em dashes
 * on the previous line, so lines never end with a hanging "в", "и", "на"…
 */
export function tie(text: string): string {
  return text.replace(SHORT_WORD, `$1${NBSP}`).replace(/[ \t]+—/g, `${NBSP}—`);
}
