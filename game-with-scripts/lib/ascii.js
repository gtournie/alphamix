export const ASCII_TO_ACCENT = {
  a: "áàâäãåāąă",
  ae: "æ",
  c: "çćčĉċ",
  d: "ðďđ",
  e: "éèêëēęěĕė",
  f: "ƒſ",
  g: "ĝğġģ",
  h: "ĥħ",
  i: "íìîïīĩĭįı",
  ij: "ĳ",
  j: "ĵ",
  J: "Ĵ",
  k: "ķĸ",
  l: "łľĺļŀ",
  n: "ñńňņŉŋ",
  o: "óòôöõøōőŏ",
  oe: "œ",
  p: "þ",
  r: "ŕřŗ",
  s: "śšşŝș",
  ss: "ß",
  t: "ťţŧț",
  u: "úùûüūůűŭũų",
  w: "ŵ",
  y: "ýŷÿ",
  z: "žżź",
  // No, that's not a good idea to produce uppercase from lowercase... ;-)
  A: "ÁÀÂÄÃÅĀĄĂ",
  AE: "Æ",
  C: "ÇĆČĈĊ",
  D: "ÐĎĐ",
  E: "ÉÈÊËĒĘĚĔĖ",
  F: "Ƒ",
  G: "ĜĞĠĢ",
  H: "ĤĦ",
  I: "ÍÌÎÏĪĨĬĮİ",
  IJ: "Ĳ",
  K: "Ķ",
  L: "ŁĽĹĻĿ",
  N: "ÑŃŇŅŊ",
  O: "ÓÒÔÖÕØŌŐŎ",
  OE: "Œ",
  P: "Þ",
  R: "ŔŘŖ",
  S: "ŚŠŞŜȘ",
  T: "ŤŢŦȚ",
  U: "ÚÙÛÜŪŮŰŬŨŲ",
  W: "Ŵ",
  Y: "ÝŶŸ",
  Z: "ŽŻŹ"
};

export const ACCENT_TO_ASCII = {};
let REG_CONVERT = '';
Object.keys(ASCII_TO_ACCENT).forEach(function (k) {
  let value = ASCII_TO_ACCENT[k];
  REG_CONVERT += value;
  for (let i = 0, len = value.length; i < len; ++i)
    ACCENT_TO_ASCII[value.charAt(i)] = k;
});
REG_CONVERT = new RegExp('[' + REG_CONVERT + ']', 'g');

export default function ascii(text) {
  return text.replace(REG_CONVERT, _replace);
}

function _replace(char) {
  return ACCENT_TO_ASCII[char];
}