// Mini dictionary for solver tests — not a real French dictionary, just enough words
// to support scenarios in src2/core/game/solver.test.ts. Covers all 26 latin letters.
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
