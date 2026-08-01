import type { BrokerAdapter } from "./types";

// Built directly against a real IBI export sample (~/Downloads/data.xlsx, analyzed 2026-08-01).
// `isIsraeli` is verified only for the values that sample actually contains (all foreign) — the
// positive (Israeli) case is the natural inverse of that rule, not yet confirmed against a real
// Israeli row. See "Portfolio import" in architecture/DECISIONS.md.

// Bidi control chars (LRM/RLM/embedding/override marks) seen mixed into `שם נייר` for
// ticker+Hebrew-name rows, e.g. "AMZN" + these + "אמאזון". Built from numeric char codes rather
// than embedding the (invisible, easy to mis-copy) characters themselves in source.
const BIDI_MARK_CODES = [0x200e, 0x200f, 0x202a, 0x202b, 0x202c, 0x202d, 0x202e];
const BIDI_MARKS_PATTERN = new RegExp(
  `[${BIDI_MARK_CODES.map((code) => String.fromCharCode(code)).join("")}]`,
  "g",
);

function stripBidiMarks(text: string): string {
  return text.replace(BIDI_MARKS_PATTERN, "");
}

// `שם נייר` shapes seen in the real sample (after stripping bidi marks) — tried in order, first
// match wins. The Hebrew-block range (U+0590-U+05FF) is built from numeric char codes, like the
// bidi marks above, rather than embedding the characters themselves in source. No regex `u` flag
// needed this way — tsconfig's implied target doesn't support \p{} property escapes.
const HEBREW_BLOCK_RANGE = `${String.fromCharCode(0x0590)}-${String.fromCharCode(0x05ff)}`;
const TICKER_PATTERNS = [
  /\(([A-Z.]+)\)\s*$/, // "ADV MICRO(AMD)", "INVESCO  (QQQ)"
  /^([A-Z]+)\s+US$/, // "GOOG US", "VOO US", "META US"
  new RegExp(`^([A-Z]+)\\s+[${HEBREW_BLOCK_RANGE}]`), // "AMZN" + (stripped marks) + "אמאזון"
];

// `סוג נייר` values seen in the real sample: "מניה זרה בחו״ל" (foreign stock), "קרנות נאמנות
// זרות" (foreign funds), "מט״ח מזומן" (foreign-currency cash). Cash needs its own marker —
// "מזומן" doesn't contain "זר", so a plain foreign-word check alone would miscount it as Israeli.
const NON_ISRAELI_MARKERS = ["זר", "מזומן"];

export const ibiAdapter: BrokerAdapter = {
  id: "ibi",
  label: "IBI Trade",
  headerRow: 0,
  columns: {
    name: "שם נייר",
    securityNumber: "מספר נייר",
    ticker: "סימבול",
    securityType: "סוג נייר",
    currency: "מטבע",
    quantity: "כמות נוכחית",
    price: "שער",
    marketValue: "שווי נוכחי",
    precomputedPercentage: "אחוז אחזקה",
  },
  extractTicker(entity) {
    if (entity.ticker) return entity.ticker; // empty in practice in the real sample, but trust it if ever populated
    const cleanName = stripBidiMarks(entity.name);
    for (const pattern of TICKER_PATTERNS) {
      const match = cleanName.match(pattern);
      if (match) return match[1];
    }
    return null;
  },
  isIsraeli(entity) {
    const type = entity.securityType ?? "";
    return !NON_ISRAELI_MARKERS.some((marker) => type.includes(marker));
  },
};
