// Mini dictionary for solver tests — not a real French dictionary, just enough words
// to support scenarios in src2/core/game/solver.test.ts. Covers all 26 latin letters.
//
// INVARIANT for solver.test.ts suite K4 ("hasLeftPart" guard):
// K4 places a lone Z at (7,7) with rack `?AAAAAA` and asserts that every vertical
// move covering (8,7) places exactly 'E' there. The assertion holds ONLY if ALL
// three of the following remain true:
//
//   (1) ZE is the only 2-letter word starting with Z in this dict. Adding ZA/ZO/
//       ZU/etc. would immediately relax the mask to allow those letters at (8,7)
//       and K4 would pass on a broken hasLeftPart regression.
//
//   (2) No 3+ letter Z-word starts with a non-E second letter (no ZA*, ZO*, ZU*,
//       …). Today the only Z-words are ZE / ZEN / ZERO / ZEBRE / ZOO — (3) below
//       handles ZOO. If someone later adds e.g. "ZAC", the vertical mask at (8,7)
//       would permit 'A' even without touching the 2-letter set.
//
//   (3) K4's rack must NOT contain any tile that could complete a longer Z-word
//       whose second letter isn't E. Today ZOO in the dict is SAFE because the
//       rack has no 'O' — so the solver can't extend downward `Z|O|O` by placing
//       two Os. If K4's rack changes (e.g. adds an 'O'), ZOO must be removed from
//       this dict OR the test assertion widened to accept 'E' OR 'O'.
//
// If you relax any of (1)-(3), update K4 accordingly at solver.test.ts (describe
// "K. GADDAG format invariants", section K4).
function om(o) { let m = new Map(), k = Object.keys(o); for (let i = k.length - 1; i >= 0; --i) m.set(k[i], o[k[i]]); return m; };
export default om({
  // 2-letter (for cross-words)
  "AA": "-", "AS": "-", "AT": "-", "CA": "-", "CE": "-",
  "DE": "-", "EN": "-", "ES": "-", "ET": "-", "EU": "-",
  "LA": "-", "LE": "-", "MA": "-", "ME": "-", "NE": "-",
  "NI": "-", "OR": "-", "OS": "-", "OU": "-", "RE": "-",
  "SA": "-", "SE": "-", "SI": "-", "TA": "-", "TE": "-",
  "TU": "-", "UN": "-", "VA": "-", "YE": "-", "ZE": "-",

  // 3-letter
  "AIR": "-", "ART": "-", "BAC": "-", "BAS": "-", "CAR": "-",
  "CAS": "-", "EAU": "-", "ETE": "-", "FER": "-", "KIF": "-",
  "MER": "-", "MIE": "-", "OIE": "-", "OSE": "-", "OUI": "-",
  "PAS": "-", "RAT": "-", "RUE": "-", "SAC": "-", "SUR": "-",
  "TAS": "-", "TES": "-", "THE": "-", "TOI": "-", "TON": "-",
  "TUE": "-", "USE": "-", "VER": "-", "VIE": "-", "VUE": "-",
  "YAK": "-", "YEN": "-", "ZEN": "-", "ZOO": "-",

  // 4-letter
  "BASE": "-", "CARS": "-", "CASE": "-", "CATS": "-", "CHAT": "-",
  "DATE": "-", "ECHO": "-", "JAZZ": "-", "KAKI": "-", "KIWI": "-",
  "MATE": "-", "MATS": "-", "ORES": "-", "OURS": "-", "PAGE": "-",
  "PATE": "-", "PATS": "-", "PAYE": "-", "PAYS": "-", "QUAI": "-",
  "RACE": "-", "RATE": "-", "RATS": "-", "ROSE": "-", "SACS": "-",
  "SALE": "-", "TARE": "-", "TARS": "-", "TATE": "-", "TAXI": "-",
  "TUBE": "-", "VASE": "-", "ZERO": "-",

  // 5-letter
  "BASES": "-", "CARRE": "-", "CARTE": "-", "CASES": "-", "CHATS": "-",
  "DAMES": "-", "DATES": "-", "JAUNE": "-", "MATES": "-", "ORAGE": "-",
  "PAGES": "-", "PATES": "-", "RATES": "-", "ROSES": "-", "SAGES": "-",
  "TARES": "-", "TARTE": "-", "TIRES": "-", "USAGE": "-", "WAGON": "-",
  "ZEBRE": "-",

  // 6-letter
  "BATEAU": "-", "ORANGE": "-", "PIRATE": "-",

  // 7-letter (bingo)
  "BATEAUX": "-", "MAITRES": "-", "ORANGES": "-", "PIRATES": "-",

  // 8-letter for D10 (W3+W3 on row 0 cols 0-7)
  "RATERONS": "-",
});
