import { cleanupHtml, getDomFromFile, getLongerDef } from "./_helpers.js"
import fs, { promises as fsPromises } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import ascii, { ACCENT_TO_ASCII } from "../lib/ascii.js";
import { PromisePool } from '@supercharge/promise-pool'

const __dirname = dirname(fileURLToPath(import.meta.url));

const DIR = join(__dirname, '..', 'data');
const ONE_MOT_DIR = join(DIR, '1mot');
const db = {}

let count = 0;
let undef = 0;
let notes = 0;
let verbs = 0;
let fixed = 0;
let changed = 0;
let incompleteDefs = 0;
let fullDefFound = 0;

const DEFECTIVE = {
  "sortissait": "sortissait v. (Défectif) Troisième personne du singulier de l'indicatif imparfait du verbe sortir.",
  "sortissaient": "sortissaient v. (Défectif) Troisième personne du pluriel de l'indicatif imparfait du verbe sortir.",
  "messierait": "messiérait v. (Défectif) Troisième personne du singulier du conditionnel présent du verbe messeoir.",
  "messieraient": "messiéraient v. (Défectif) Troisième personne du pluriel du conditionnel présent du verbe messeoir.",
  "messiera": "messiéra v. (Défectif) Troisième personne du singulier de l'indicatif du futur simple du verbe messeoir.",
  "messieront": "messiéront v. (Défectif) Troisième personne du pluriel de l'indicatif du futur simple du verbe messeoir.",
  "occirai": "occirai v. (Défectif) Première personne du singulier de l'indicatif du futur simple du verbe occire.",
  "occiras": "occiras v. (Défectif) Deuxième personne du singulier de l'indicatif du futur simple du verbe occire.",
  "occira": "occira v. (Défectif) Troisième personne du singulier de l'indicatif du futur simple du verbe occire.",
  "occirons": "occirons v. (Défectif) Première personne du pluriel de l'indicatif du futur simple du verbe occire.",
  "occirez": "occirez v. (Défectif) Deuxième personne du pluriel de l'indicatif du futur simple du verbe occire.",
  "occiront": "occiront v. (Défectif) Troisième personne du pluriel de l'indicatif du futur simple du verbe occire.",
  "occirais": "occirais v. (Défectif) Première personne du singulier du conditionnel présent du verbe occire.",
  "occirait": "occirait v. (Défectif) Troisième personne du singulier du conditionnel présent du verbe occire.",
  "occirions": "occirions v. (Défectif) Première personne du pluriel du conditionnel présent du verbe occire.",
  "occiriez": "occiriez v. (Défectif) Deuxième personne du pluriel du conditionnel présent du verbe occire.",
  "occiraient": "occiraient v. (Défectif) Troisième personne du pluriel du conditionnel présent du verbe occire.",
}

const VERB_EXCEPTIONS = {
  "maculerent": "maculèrent v. Troisième personne du pluriel du passé simple de l’indicatif de maculer.",
  "terminat": "terminât v. Troisième personne du singulier de l’imparfait du subjonctif du verbe terminer.",
}

// Pour les refs regarder : acotylédone <-> acotylédoné
// Attention aux defs qu ifinissent par '...'
// Check thallium
// Check couleurs avec #abcdefg

const CONJUGATION_MOOD = new Set([
  "Infinitif",
  "Indicatif présent",
  "Indicatif imparfait",
  "Indicatif futur simple",
  "Indicatif passé simple",
  "Subjonctif présent",
  "Subjonctif imparfait",
  "Conditionnel présent",
  "Impératif",
  "Participe passé",
  "Participe présent",
  "Défectif",
]);
let CONJUGATION_INSUFFICIENT_MOODS = Array.from(CONJUGATION_MOOD).filter(m => !["Infinitif", "Impératif", "Défectif", "Participe"].some(p => m.includes(p)))
CONJUGATION_INSUFFICIENT_MOODS.forEach((m) => {
  if (m.startsWith('Indicatif')) CONJUGATION_INSUFFICIENT_MOODS.push(m.replace('Indicatif', '').trim())
})
const CONJUGATION_MOOD_INSUFFICIENT_DEF_REG = new RegExp("^(" + CONJUGATION_INSUFFICIENT_MOODS.join('|') + ") du verbe", "i")

// const ODS_INFO_WORD_ALLOWED_CHARS = 'a-zA-Z' + Object.keys(ACCENT_TO_ASCII).join('')
const ODS_INFO_WORD_ALLOWED_CHARS = 'a-zA-ZáàâäãåāąăæçćčĉċðďđéèêëēęěĕėƒſĝğġģĥħíìîïīĩĭįıĳĵĴķĸłľĺļŀñńňņŉŋóòôöõøōőŏœþŕřŗśšşŝșßťţŧțúùûüūůűŭũųŵýŷÿžżźÁÀÂÄÃÅĀĄĂÆÇĆČĈĊÐĎĐÉÈÊËĒĘĚĔĖƑĜĞĠĢĤĦÍÌÎÏĪĨĬĮİĲĶŁĽĹĻĿÑŃŇŅŊÓÒÔÖÕØŌŐŎŒÞŔŘŖŚŠŞŜȘŤŢŦȚÚÙÛÜŪŮŰŬŨŲŴÝŶŸŽŻŹ';
const ODS_INFO_WORD_REG = new RegExp('^[' + ODS_INFO_WORD_ALLOWED_CHARS + '-]+\\.?')
const ODS_INFO_REMOVE_WORD_REG = new RegExp('^[' + ODS_INFO_WORD_ALLOWED_CHARS + '-]+\\.?(\\s*,\\s*[' + ODS_INFO_WORD_ALLOWED_CHARS + '-]+\\.?\\s*)*')

const TYPE_EXTRACT_REG = new RegExp('^(?:[' + ODS_INFO_WORD_ALLOWED_CHARS + ']+\\.)+(?:\\s+et\\s+(?:[' + ODS_INFO_WORD_ALLOWED_CHARS + ']+\\.)+)?')
const TYPE_CHECK = new RegExp('^([' + ODS_INFO_WORD_ALLOWED_CHARS + ']+\\.)+$')

function extractTypeAndDef(def, noWarn) {
  let index = def.indexOf('.');
  while (index >= 0 && /\S/.test(def.charAt(--index))) { }
  def = def.slice(index + 1)
  let type;
  def = def.replace(TYPE_EXTRACT_REG, function ($1) {
    type = $1;
    return '';
  }).trim()
  if (!type || type.split(/\s+et\s+/).some(t => !TYPE_CHECK.test(t))) {
    if (noWarn) return { def, type, brokenType: true }
    console.log('WARNING: weird type: ', type, def)
  }
  return { def, type }
}

function transformDef(def) {
  // Remove notes
  if (/Note d’usage/i.test(def)) {
    def = def.replace(/(?:— )?Note d’usage.*?$/, function () {
      ++notes;
      return '';
    }).trim();
  }
  // Some color definitions are followed by an hex representation. Remove it!
  if (/#[0-9a-f]/i.test(def)) {
    def = def.replace(/\s+#[0-9a-f]{6}(…)?/gi, '').trim().replace(/\.\.$/, '.');
    // console.log('(0)', def)
  }
  // In case of multiple definitions, remove the second one
  if (def.includes("1.") && def.includes('2.')) {
    const defArr = def.split(/[12]\.\s+/)
    // Type can be placed before 1. and 2.
    if (defArr.slice(1).some(x => extractTypeAndDef(x, true).brokenType)) {
      def = defArr.filter((x, i) => i === 0 || x).slice(0, 2).join('').trim();
    } else {
      def = defArr.filter((x, i) => i === 0 || extractTypeAndDef(x).def).slice(0, 2).join('').trim();
    }
    // console.log('(1)', def, word)
  }
  return def;
}

function getOdsInfo(txt, noWarn) {
  try {
    const word = txt.match(ODS_INFO_WORD_REG)[0];
    let def = txt.replace(ODS_INFO_REMOVE_WORD_REG, '').trim().replace(/^\([^\)]+\)\.?\s+/, '');
    def = transformDef(def);
    let info = extractTypeAndDef(def, noWarn)
    info.originalWord = word
    info.word = word.toLowerCase();
    info.full = [info.word, info.type, info.def].filter(x => x).join(' ').trim()
    return info
  } catch (e) {
    console.log('CRASH: ', txt)
    throw e
  }
}

function dedupe(arr) {
  return Array.from(new Set(arr));
}

(async function () {
  console.time('t1')

  // console.log(getOdsInfo("invar. adj. Abréviation fréquemment utilisée (particulièrement en grammaire) pour invariable."))
  // process.exit(0)

  const letters = 'A'.split('');
  for (const letter of letters) {
    const LETTER_DIR = join(ONE_MOT_DIR, letter)
    const files = await fsPromises.readdir(LETTER_DIR);

    await PromisePool
      .for(files)
      .withConcurrency(256)
      .handleError(async (error) => {
        throw error
      })
      .onTaskFinished((item, pool) => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(letter + ' ' + pool.processedPercentage().toFixed(0) + '%')
      })
      .process(async (file) => {
        const word = file.replace(/\.html\.txt$/, '')
        if (word.length <= 15) {
          const $ = await getDomFromFile(join(LETTER_DIR, file))
          // let def = $('h4:contains(WikWik.org) + ul li:first').text().trim()
          // def = def ? getOdsInfo(def).full : '';

          let wikWikDefs = $('h4:contains(WikWik.org) + ul li').toArray();
          let wikWikDefInfo = wikWikDefs.reduce((obj, wikWikDef, index) => {
            if (obj.done) return obj;
            let def = $(wikWikDef).text().trim()
            try {
              var info = def ? getOdsInfo(def, true) : {}
            } catch(e) {
              console.log('CRASH2:', word)
            }
            if (info.full && !info.brokenType) def = info.full
            if (!def.endsWith('…')) return { done: true, def, info, index }
            if (index === 0) {
              obj.def = def;
              obj.info = info;
            }
            return obj
          }, { done: false, def: '', info: { def: '' }, index: 0 })
          let def = wikWikDefInfo.def

          if (def && !wikWikDefInfo.done) {
            def = (await getLongerDef(wikWikDefInfo.info.originalWord, wikWikDefInfo.info.def));
            if (def === wikWikDefInfo.info.def) {
              ++incompleteDefs;
            }
            wikWikDefInfo.info.def = def
            // ++incompleteDefs;
            // console.log('not found:', word, def)
            // process.exit(0)
          }
          if (wikWikDefInfo.done && wikWikDefInfo.index !== 0) {
            ++fullDefFound;
            // console.log('found:', word, $('h4:contains(WikWik.org) + ul li:first').text().trim(), def)
          }

          // do {
          //   def = $(wikWikDefs[defIndex]).text().trim()
          //   def = def ? getOdsInfo(def).full : '';
          //   ++defIndex;
          // } while (def.endsWith('…') && defIndex < wikWikDefs.length);
          // if (defIndex >= wikWikDefs.length) {
          //   defIndex = 0;
          //   ++incompleteDefs;
          // }
          // def = $(wikWikDefs[defIndex]).text().trim()
          // def = def ? getOdsInfo(def).full : '';

          if ($(wikWikDefs[wikWikDefInfo.index]).text().trim() !== def) ++changed

          let odsInfo = wikWikDefInfo.info // def ? getOdsInfo(def) : { def: '' }
          let odsIngoDefLC = odsInfo.def.toLowerCase();
          if (odsIngoDefLC.startsWith('Forme conjuguée du verbe ') || CONJUGATION_MOOD_INSUFFICIENT_DEF_REG.test(odsIngoDefLC)) {
            def = VERB_EXCEPTIONS[word];
            if (!def) console.log("WARNING: missing verbe exception:", word);
            ++verbs;
          } else if (odsInfo.type === 'v.' && odsInfo.def.includes('du verbe')
            && !odsInfo.def.includes('personne')
            && !def.toLowerCase().includes(' participe ')
            && !odsIngoDefLC.includes('variante orthographique')
            && !odsIngoDefLC.includes('variante du verbe')
            && !odsIngoDefLC.includes('ancienne orthographe')
          ) {
            def = VERB_EXCEPTIONS[word];
            if (!def) console.log("WARNING: missing verbe exception:", word);
            ++verbs;
          }

          if (!def) {
            ++undef;
            odsInfo = getOdsInfo($('h4:contains(ODS) + ul li:first').text().trim());

            // Fix masculine word
            if (ascii(odsInfo.word) === word) {
              def = odsInfo.full
              // console.log(['M new'], def);
              if (def) ++fixed
            }

            if (!def) {
              const ods = $('h4:contains(ODS) + ul + ul li');
              for (const line of ods) {
                if (def) break;

                const txt = $(line).text().trim()

                // FIX feminine word
                const femTxts = txt.replace(/^Féminin\s+:\s/i, '');
                if (femTxts !== txt) {
                  const femTxtArr = femTxts.toLowerCase().trim().split(/\s+/);

                  for (const femTxt of femTxtArr) {
                    if (!/^[a-z]+$/.test(ascii(femTxt))) {
                      console.log('WEIRD feminine: ', word);
                    }
                    if (ascii(femTxt) === word) {

                      def = function () {
                        let mWordKey = ascii(odsInfo.word)
                        if (!(mWordKey in db)) {
                          console.log('ERROR: ', word, mWordKey)
                        }

                        if (odsInfo.def && (!db[mWordKey] || getOdsInfo(db[mWordKey]).type === 'v.')) {
                          // console.log('[M old]', db[mWordKey])
                          db[mWordKey] = odsInfo.full
                          // console.log('[M new]', db[mWordKey])
                          if (!db[mWordKey]) ++fixed
                        } else {
                          // console.log('[M    ]', db[mWordKey])
                        }
                        const mType = (db[mWordKey] ? getOdsInfo(db[mWordKey]).type : odsInfo.type) || ''
                        const fType = dedupe(mType.replace(/m\./g, 'f.').split(/\s+et\s+/)).join(' et ')

                        db[word] = [femTxt, fType, 'Féminin singulier de ' + odsInfo.word + '.'].filter(x => x).join(' ');
                        // console.log('[F new]', db[word])
                        ++fixed
                      }
                      break;
                    }
                  }
                  continue;
                }

                // Fix plural word
                const pluTxts = txt.replace(/^Pluriel\s+:\s/i, '')
                if (pluTxts !== txt) {
                  const pluTxtArr = pluTxts.toLowerCase().trim().split(/\s+/);

                  for (const pluTxt of pluTxtArr) {
                    if (!/^[a-z]+$/.test(ascii(pluTxt))) {
                      console.log('WEIRD plural: ', word);
                    }

                    if (ascii(pluTxt) === word) {
                      def = function () {
                        let mWordKey = ascii(odsInfo.word)
                        if (!(mWordKey in db)) {
                          console.log('ERROR: ', word, mWordKey)
                        }
                        if (odsInfo.def && (!db[mWordKey] || getOdsInfo(db[mWordKey]).type === 'v.')) {
                          // console.log('[M old]', db[mWordKey])
                          db[mWordKey] = odsInfo.full
                          // console.log('[M new]', db[mWordKey])
                          if (!db[mWordKey]) ++fixed
                        } else {
                          // console.log('[M    ]', db[mWordKey])
                        }
                        const mType = (db[mWordKey] ? getOdsInfo(db[mWordKey]).type : odsInfo.type) || ''
                        // const pType = dedupe(mType.replace(/m\./g, 'f.').split(/\s+et\s+/)).join(' et ')

                        db[word] = [pluTxt, mType, 'Pluriel de ' + odsInfo.word + '.'].filter(x => x).join(' ');
                        // console.log('[P new]', db[word])
                        ++fixed
                      }
                      break;
                    }
                  }
                  continue
                }

                // Fix verb word
                let mood;
                let verbTxts = txt.replace(/^([^:]+):\s/i, function (_, $1) {
                  mood = $1.trim();
                  if (!CONJUGATION_MOOD.has(mood)) {
                    console.log('WEIRD mood: ', mood, word)
                    process.exit(0);
                  }
                  return "";
                });
                if (verbTxts !== txt) {
                  const verbTxtArr = verbTxts.toLowerCase().trim().split(/\s+/);

                  for (const verbTxt of verbTxtArr) {
                    if (!/^[a-z]+$/.test(ascii(verbTxt))) {
                      console.log('WEIRD verb: ', word);
                    }

                    if (ascii(verbTxt) === word) {
                      if (mood.toLowerCase() === "défectif") {
                        def = DEFECTIVE[ascii(word)];
                        if (!def) {
                          console.log("WARNING: getMood broken? ", verbTxt)
                        }
                      } else {
                        def = [verbTxt, 'v.', mood + ' du verbe ' + odsInfo.word + '.'].filter(x => x).join(' ');
                      }
                      // console.log('[V new]', def)
                      ++fixed
                      break;
                    }
                  }
                  continue;
                }
              }
            }
          }

          db[word] = def;
          ++count;
        }
      })

    Object.keys(db).forEach((k) => {
      if (typeof db[k] === 'function') {
        db[k]();
      }
    })

    await fsPromises.writeFile(join(DIR, '1mot.json'), JSON.stringify(db, null, 2));
  }

  console.log('');
  console.log('Words: ', count, Object.keys(db).length);
  console.log('Notes removed: ', notes);
  console.log('Changes: ', changed);
  console.log('Incomplete defs: ', incompleteDefs);
  console.log('Longer def found: ', fullDefFound);
  console.log('Verbes to tweak: ', verbs);
  console.log('Missing defs: ', undef);
  console.log('Fixed defs: ', fixed);

  // console.log(JSON.stringify(db.filter(n => {
  //   return (n.type || '').includes("locution")
  // }).map(n => n.word), null, 2))

  console.timeEnd('t1')
})();

// azurante
// abstractrice