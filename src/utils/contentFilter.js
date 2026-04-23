import * as FilterPackage from "bad-words";
import { englishBadWords, hindiBadWords } from "../conf/BadWords.js";

// safely resolve constructor (works in Vite + Node + CJS/ESM mix)
const Filter =
    FilterPackage.default ??
    FilterPackage.Filter ??
    FilterPackage;

const filter = new Filter();

// extend library with your custom words
filter.addWords(...englishBadWords, ...hindiBadWords);

// combining everything into one list for our custom checks
const blockedWords = [...englishBadWords, ...hindiBadWords];

// just some names we don’t want showing up
const blockedNames = ["akshit"];

// helps us clean text so people can’t easily bypass filters using tricks
function normalize(text) {
  return text
      .toLowerCase()
      .replace(/[@4]/g, "a")
      .replace(/[!1]/g, "i")
      .replace(/0/g, "o")
      .replace(/\$/g, "s")
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");
}

// breaks sentence into words so we can check properly (important for Hinglish)
function tokenize(text) {
  return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
}

// checks if a word exists as a proper standalone word (avoids false matches like “chutney”)
function hasWordBoundaryMatch(text, word) {
  const pattern = new RegExp(`\\b${word}\\b`, "i");
  return pattern.test(text);
}

// simple similarity check to catch small typos like “fuk” or “chutiyaa”
function similarity(a, b) {
  let matches = 0;
  const len = Math.min(a.length, b.length);

  for (let i = 0; i < len; i++) {
    if (a[i] === b[i]) matches++;
  }

  return matches / Math.max(a.length, b.length);
}

// main function: tells if a message contains abusive words or not
export function containsBlockedWord(text) {
  if (!text) return false;

  const normalized = normalize(text);

  // 1. library check
  if (filter.isProfane(text)) return true;

  // 2. check against fully cleaned text
  for (const word of blockedWords) {
    const cleanWord = normalize(word);

    if (normalized.includes(cleanWord)) {
      return true;
    }
  }

  // 3. blocked names
  for (const name of blockedNames) {
    if (normalized.includes(normalize(name))) {
      return true;
    }
  }

  return false;
}

// turns abusive words into something partially hidden
function censorWord(word) {
  if (!word) return "";
  if (word.length <= 2) return "**";
  return word[0] + "*".repeat(word.length - 2) + word[word.length - 1];
}

// replaces bad words in a sentence with censored version
export function censorText(text) {
  if (!text) return text;

  return text.replace(/\b\w+\b/g, (word) => {
    const normalizedWord = normalize(word);

    const isBlocked =
        filter.isProfane(word) ||
        blockedWords.includes(normalizedWord);

    const isNameBlocked = blockedNames.some(
        name => normalize(name) === normalizedWord
    );

    if (isBlocked || isNameBlocked) {
      return censorWord(word);
    }

    return word;
  });
}

// same censor logic but safe for HTML content
export function censorHTML(html) {
  if (!html) return "";

  return html.replace(/>([^<]+)</g, (match, textContent) => {
    const censored = censorText(textContent);
    return `>${censored}<`;
  });
}