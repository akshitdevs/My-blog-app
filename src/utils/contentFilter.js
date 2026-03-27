// utils/contentFilter.js

// ✅ English bad words
const englishBadWords = [
"fuck","fucker","fucking","fucked","motherfucker",
"shit","bullshit","shithead",
"bitch","bitches",
"asshole","ass","dumbass",
"bastard","bloody","bloodyhell",
"slut","whore","skank",
"dick","dickhead",
"pussy","cunt",
"cock","suck","sucker",
"jerk","jerkoff",
"retard","idiot","moron","stupid",
"loser","trash","garbage",
"damn","goddamn",
"crap","screw","screwed",
"nuts","lunatic","psycho",
"pervert","creep",
"freak","weirdo",
"scumbag","douche","douchebag",
"dipshit","jackass",
"twat","wanker",
"arse","arsehole",
"bollocks",
"prick","tool",
"numbnuts",
"shitface","shitbag",
"fuckface","fuckboy",
"asslicker",
"sonofabitch",
"shitstorm",
"piss","pissed",
"pisshead",
"shitshow",
"dammit",
"bugger",
"bloodyfool",
"shitbrains",
"fuckwit",
"shitlicker",
"motherfucking",
"arsewipe",
"shitstain",
"shitass",
"fucknut",
"cockhead",
"dickweed",
"shitforbrains",
"asshat",
"asswipe",
"butthead"
];

// ✅ Hindi / Hinglish bad words
const hindiBadWords = [
"madharchoud","madharchod","madhar chod","madar chod",
"madarchod","mc",
"behenchod","bc",
"bhosdike","bhosdiwala",
"chutiya","chutiyapa",
"gaand","gandu","gaandmar",
"lund","lodu","lode",
"chut","chutad",
"harami","haraamkhor",
"kuttiya","kutta","kamina",
"randi","randwa",
"tatti","tatte",
"bakchod","bakchodi",
"jhant","jhantu",
"bhenchod","bhenchot",
"bkl","bhenkelode",
"madar","madarjat",
"gandfat","gandmara",
"chodu","chodna",
"lavde","lavda",
"chapri","tapori",
"ullu","ullukapattha",
"haramzada",
"besharam",
"nalaayak",
"bewakoof",
"pagal","paagal",
"chirkut",
"gawar",
"ghatiya",
"bakwas",
"tharki",
"gandi",
"lafanga",
"fattu",
"gandmara"
];

// 🔥 merge all
const blockedWords = [...englishBadWords, ...hindiBadWords];

// 🔴 block your name strictly
const blockedNames = ["akshit"];


// ================================
// 🔥 NORMALIZE FUNCTION (ANTI-BYPASS)
// ================================
function normalize(text) {
  return text
    .toLowerCase()

    // common replacements
    .replace(/[@4]/g, "a")
    .replace(/[!1]/g, "i")
    .replace(/0/g, "o")
    .replace(/\$/g, "s")

    // remove spaces, emojis, symbols
    .replace(/[^a-z0-9]/g, "");
}


// ================================
// 🔥 REMOVE HTML (RTE SAFE)
// ================================
function stripHTML(html) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ");
}


// ================================
// 🔥 MAIN CHECK FUNCTION
// ================================
export function containsBlockedWord(text) {
  if (!text) return false;

  const raw = text.toLowerCase();
  const normalized = normalize(text);

  // 🔴 1. Direct match
  const directMatch = blockedWords.some(word =>
    raw.includes(word)
  );

  // 🟡 2. Normalized match (handles spacing + symbols)
  const normalizedMatch = blockedWords.some(word =>
    normalized.includes(normalize(word))
  );

  // 🔵 3. Pattern match (ULTRA IMPORTANT 🔥)
  const patternMatch = blockedWords.some(word => {
    const pattern = new RegExp(
      word.split("").join(".*"), // m.*a.*d.*a.*r...
      "i"
    );
    return pattern.test(raw);
  });

  // 🔴 4. Strict name block (akshit in any form)
  const nameMatch = blockedNames.some(name =>
    normalized.includes(name)
  );

  return directMatch || normalizedMatch || patternMatch || nameMatch;
}


// ================================
// 🔥 RTE SAFE CHECK
// ================================
export function containsBlockedWordInHTML(html) {
  const cleanText = stripHTML(html);
  return containsBlockedWord(cleanText);
}