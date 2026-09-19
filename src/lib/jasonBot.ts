import { FaqEntry, FALLBACK_ANSWER, JASON_FAQ } from "./jasonFaq";

/**
 * Scores every FAQ entry against a message and returns the best-matching
 * answer, or the fallback when nothing scores well enough. No external
 * calls, no cost - this is the entire "brain" behind Jason.
 *
 * Bag-of-words overlap rather than strict phrase matching, because real
 * questions rarely repeat a keyword phrase verbatim - "does it write
 * anything back to Etsy" doesn't literally contain "write back", but it
 * should still match. Each entry's keyword phrases are flattened into a set
 * of significant words (stopwords removed); a message scores an entry by
 * how many of those words it contains, plus a bonus if a full keyword
 * phrase does appear verbatim (for the cases where it does - a stronger,
 * more specific signal than word overlap alone).
 */
const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "i", "you", "your", "it", "its", "this", "that", "my", "me",
  "do", "does", "did", "doing", "can", "could", "will", "would", "should",
  "to", "of", "for", "on", "in", "at", "with", "and", "or", "but",
  "what", "how", "when", "where", "why", "who", "which",
]);

function normalize(text: string) {
  const cleaned = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { words: new Set(cleaned.split(" ").filter(Boolean)), joined: cleaned };
}

function significantWords(keywords: string[]): Set<string> {
  const words = new Set<string>();
  for (const kw of keywords) {
    for (const w of kw.toLowerCase().split(" ")) {
      if (w && !STOPWORDS.has(w)) words.add(w);
    }
  }
  return words;
}

// Precomputed once at module load, not per request.
const ENTRY_WORDS = new WeakMap<FaqEntry, Set<string>>();
for (const entry of JASON_FAQ) {
  ENTRY_WORDS.set(entry, significantWords(entry.keywords));
}

const MIN_SCORE = 2;

export function jasonAnswer(message: string): string {
  const { words, joined } = normalize(message);
  if (!words.size) return FALLBACK_ANSWER;

  let bestScore = 0;
  let bestEntry: FaqEntry | null = null;

  for (const entry of JASON_FAQ) {
    const entryWords = ENTRY_WORDS.get(entry)!;
    let score = 0;
    for (const w of words) {
      if (entryWords.has(w)) score += 1;
    }
    for (const kw of entry.keywords) {
      if (kw.includes(" ") && joined.includes(kw.toLowerCase())) {
        score += 2; // verbatim phrase is a stronger signal than word overlap alone
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (!bestEntry) return FALLBACK_ANSWER;
  return bestScore >= (bestEntry.minScore ?? MIN_SCORE) ? bestEntry.answer : FALLBACK_ANSWER;
}
