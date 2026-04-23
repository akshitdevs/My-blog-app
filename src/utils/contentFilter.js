// utils/contentFilter.js
import { englishBadWords, hindiBadWords} from "../conf/BadWords";

// ================================
// STRONG ENGLISH WORDS
// ================================

//MERGE
const blockedWords = [...englishBadWords, ...hindiBadWords];
const blockedNames = ["akshit"];

// ================================
// 🔥 NORMALIZE FUNCTION
// ================================
function normalize(text) {
  // lower case, replace leet/char tricks, remove non-alphanumeric
  return text
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[!1]/g, "i")
    .replace(/0/g, "o")
    .replace(/\$/g, "s")
    .replace(/\s+/g, "") // remove spaces for f u c k detection
    .replace(/[^a-z0-9]/g, "");
}

// ================================
// CHECK IF TEXT CONTAINS BLOCKED WORD
// ================================
export function containsBlockedWord(text) {
  if (!text) return false;

  const raw = text.toLowerCase();
  const normalized = normalize(text);

  const directMatch = blockedWords.some(word => raw.includes(word));
  const normalizedMatch = blockedWords.some(word => normalized.includes(normalize(word)));
  const nameMatch = blockedNames.some(name => normalized.includes(normalize(name)));

  return directMatch || normalizedMatch || nameMatch;
}

// ================================
// CENSOR WORD
// ================================
function censorWord(word) {
  if (!word) return "";
  if (word.length <= 2) return "**";
  return word[0] + "*".repeat(word.length - 2) + word[word.length - 1];
}

// ================================
// CENSOR TEXT
// ================================
export function censorText(text) {
  if (!text) return text;

  return text.replace(/\b\w+\b/g, (word) => {
    const normalizedWord = normalize(word);

    const isBlocked = blockedWords.some(bw => normalize(bw) === normalizedWord);
    const isNameBlocked = blockedNames.some(name => normalize(name) === normalizedWord);

    if (isBlocked || isNameBlocked) {
      return censorWord(word);
    }
    return word;
  });
}

// ================================
// HTML SAFE CENSOR
// ================================
export function censorHTML(html) {
  if (!html) return "";

  // replace only text nodes between tags
  return html.replace(/>([^<]+)</g, (match, textContent) => {
    const censored = censorText(textContent);
    return `>${censored}<`;
  });
}