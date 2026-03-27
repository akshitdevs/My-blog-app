// utils/contentFilter.js

// ================================
// ✅ STRONG ENGLISH WORDS
// ================================
const englishBadWords = [
  "fuck","fucker","fucking","fucked","motherfucker",
  "shit","bullshit","shithead",
  "bitch","bitches",
  "asshole","dumbass",
  "bastard",
  "slut","whore",
  "dick","dickhead",
  "pussy","cunt",
  "cock",
  "jerkoff",
  "retard","moron",
  "scumbag","douchebag",
  "dipshit","jackass",
  "twat","wanker",
  "arsehole",
  "prick"
];

// ================================
// ✅ STRONG HINGlish/HINDI ABUSE ONLY
// ================================
const hindiBadWords = [
  "madharchod", "madhar chod",
  "madarchod","madharchod",
  "behenchod","bhenchod",
  "bhosdike",
  "chutiya","chutiyapa",
  "gandmara",
  "lund","lodu","lavda",
  "chut",
  "randi",
  "jhant",
  "haramzada",
  "chodu",
  "tharki"
];

// 🔥 MERGE
const blockedWords = [...englishBadWords, ...hindiBadWords];
const blockedNames = ["akshit",];

// ================================
// 🔥 NORMALIZE FUNCTION
// ================================
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[!1]/g, "i")
    .replace(/0/g, "o")
    .replace(/\$/g, "s")
    .replace(/[^a-z0-9]/g, "");
}

// ================================
// 🔥 CHECK IF TEXT CONTAINS BLOCKED WORD
// ================================
export function containsBlockedWord(text) {
  if (!text) return false;

  const raw = text.toLowerCase();
  const normalized = normalize(text);

  // direct match
  const directMatch = blockedWords.some(word => raw.includes(word));

  // normalized match
  const normalizedMatch = blockedWords.some(word =>
    normalized.includes(normalize(word))
  );

  // strict name match
  const nameMatch = blockedNames.some(name =>
    normalized.includes(name)
  );

  return directMatch || normalizedMatch || nameMatch;
}

// ================================
// 🔥 CENSOR WORD
// ================================
function censorWord(word) {
  if (!word) return "";
  if (word.length <= 2) return "**";
  return word[0] + "*".repeat(word.length - 2) + word[word.length - 1];
}

// ================================
// 🔥 CENSOR TEXT
// ================================
export function censorText(text) {
  if (!text) return text;

  let result = text;

  try {
    const normalizedText = normalize(text);

    // exact word censor
    blockedWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      result = result.replace(regex, match => censorWord(match));
    });

    // normalized match censor
    blockedWords.forEach(word => {
      const normalizedWord = normalize(word);
      if (normalizedWord && normalizedText.includes(normalizedWord)) {
        const regex = new RegExp(word, "gi");
        result = result.replace(regex, match => censorWord(match));
      }
    });

    // name censor
    blockedNames.forEach(name => {
      const regex = new RegExp(name, "gi");
      result = result.replace(regex, censorWord(name));
    });

  } catch (err) {
    console.error("Censoring failed:", err);
    return text;
  }

  return result;
}

// ================================
// 🔥 HTML SAFE CENSOR
// ================================
function stripHTML(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
}

export function censorHTML(html) {
  const cleanText = stripHTML(html);
  return censorText(cleanText);
}