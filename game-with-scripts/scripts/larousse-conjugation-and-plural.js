import { getDomFromFile, LAROUSSE_HTML_DIR, LAROUSSE_HTML_WORDS_DIR, LAROUSSE_ORIGIN } from "./_helpers.js"
import fs, { promises as fsPromises } from 'fs';
import { join } from 'path';
import { PromisePool } from '@supercharge/promise-pool'
import ascii from "../lib/ascii.js";
import db from '../data/larousse-html/extracted.json' with { type: "json" }

const OUTPUT_DIR = LAROUSSE_HTML_DIR;

nom: true 
adjectif: true
interjection: false
locution: 
préposition: false
verbe: false
conjonction: false
adverbe: false
pronom: 

function tryPlural(type) {
  return type.split(/\s(?:et\s*\/\s*ou|ou\s*\/\s*et|et|ou)\s/).some()


  if (type.startsWith('article')) return false;
  if (type.indexOf('article') > 0) throw new Error('unknow type: ', type);

  if (type === "interjection") return false



  const andOr = /\s(?:et\s*\/\s*ou|ou\s*\/\s*et|\set\s|\sou\s)\s/.test(type)
  const and = andOr || /\set\s/.test(type);
  const or = andOr || /\sou\s/.test(type);;
}

// [
//   'nom masculin',
//   'nom',
//   'nom féminin',
//   'nom et adjectif',
//   'nom féminin singulier',
//   'nom féminin et adjectif',
//   'nom masculin singulier',
//   'nom masculin ou féminin',
//   'nom masculin et adjectif',
//   "nom féminin (nom masculin selon l'Académie)",
//   'nom masculin ou (vieilli) féminin',
//   'nom féminin ou nom masculin',
//   'nom masculin ou quelquefois féminin',
//   'nom féminin et adjectif féminin',
//   'nom masculin et adjectif masculin',
//   'nom féminin ou masculin',
//   'nom masculin (le plus souvent au pluriel)',
//   'nom masculin ou nom féminin',
//   'nom masculin (parfois féminin au pluriel)',
//   'nom masculin',
//   'nom féminin',
//   'nom féminin et quelquefois masculin',
//   'nom féminin ou (vieilli) masculin',
//   'nom masculin (surtout pluriel)',
//   'nom masculin ou, vieilli, nom féminin',
//   'nom féminin (surtout pluriel)',

//   'nom pluriel',
//   'nom féminin pluriel ou nom masculin pluriel',
//   'nom féminin pluriel',
//   'nom masculin pluriel',

//   'nom masculin ou féminin et adjectif invariable',
//   'nom féminin et adjectif invariable',
//   'nom masculin invariable et adjectif invariable',
//   'nom invariable',
//   'nom masculin et adjectif invariable',
//   'nom masculin invariable',
//   'nom féminin invariable',
//   'nom invariable et adjectif invariable',
// ]

const TYPES_WITH_PLURAL = [
  "nom masculin",
  "nom masculin invariable",
  "nom",
  "nom féminin",
  "verbe transitif",
  "adjectif",
  "adverbe",
  "adjectif masculin et nom masculin",
  "verbe transitif indirect",
  "interjection",
  "adjectif et nom",
  "adjectif invariable",
  "adjectif invariable et nom masculin invariable",
  "nom et adjectif",
  "nom féminin singulier",
  "nom féminin et adjectif",
  "adjectif masculin",
  "nom féminin pluriel",
  "verbe intransitif",
  "adjectif féminin",
  "adjectif et nom masculin",
  "nom masculin singulier",
  "nom masculin pluriel",
  "verbe transitif ou verbe transitif indirect",
  "adjectif féminin et nom féminin",
  "nom masculin ou féminin",
  "adjectif et nom féminin",
  "verbe intransitif et verbe transitif indirect",
  "adjectif invariable et nom masculin",
  "adjectif invariable et nom",
  "nom féminin invariable",
  "nom masculin et adjectif",
  "nom féminin (nom masculin selon l'Académie)",
  "verbe transitif et verbe intransitif",
  "locution adverbiale",
  "adjectif et nom invariables",
  "nom masculin et adjectif invariable",
  "nom masculin ou (vieilli) féminin",
  "nom féminin ou nom masculin",
  "verbe impersonnel",
  "verbe transitif indirect et verbe intransitif",
  "préposition ou adverbe",
  "préposition",
  "nom masculin ou quelquefois féminin",
  "nom féminin et adjectif féminin",
  "verbe transitif et verbe transitif indirect",
  "adjectif et pronom indéfini",
  "pronom relatif et pronom interrogatif singulier",
  "conjonction",
  "pronom indéfini",
  "pronom relatif et pronom interrogatif pluriel",
  "nom féminin pluriel ou nom masculin pluriel",
  "verbe intransitif et verbe transitif",
  "nom invariable",
  "adjectif invariable et nom invariable",
  "adjectif et nom invariable",
  "nom invariable et adjectif invariable",
  "nom masculin et adjectif masculin",
  "conjonction et préposition",
  "nom féminin ou masculin",
  "interjection et nom masculin",
  "verbe transitif et intransitif",
  "pronom démonstratif",
  "adjectif démonstratif",
  "adjectif numéral cardinal",
  "adjectif numéral ordinal",
  "adjectif indéfini",
  "adjectif indéfini pluriel",
  "pronom indéfini pluriel",
  "adjectif et nom féminin invariables",
  "adjectif indéfini singulier",
  "adjectif invariable et adverbe",
  "adverbe interrogatif ou exclamatif",
  "adverbe exclamatif",
  "adverbe interrogatif et exclamatif",
  "adjectif masculin invariable",
  "adjectif (Invariable en genre)",
  "nom masculin (le plus souvent au pluriel)",
  "adjectif et nom masculin invariables",
  "nom masculin ou féminin et adjectif invariable",
  "pronom indéfini masculin singulier",
  "verbe transitif indirect et verbe transitif",
  "adverbe et nom masculin",
  "locution verbale",
  "pronom relatif invariable",
  "adjectif numéral cardinal invariable",
  "nom masculin ou nom féminin",
  "nom masculin (parfois féminin au pluriel)",
  "verbe transitif ou verbe intransitif",
  "pronom personnel féminin de la 3personne",
  "adverbe et pronom personnel",
  "nom masculin",
  "verbe transitif",
  "verbe intransitif",
  "nom féminin",
  "conjonction de coordination",
  "pronom personnel, 3personne masculin pluriel",
  "adverbe et adjectif invariable",
  "verbe transitif employé absolument",
  "verbe auxiliaire",
  "adverbe et nom masculin invariable",
  "nom pluriel",
  "verbe impersonnel et transitif",
  "pronom",
  "nom féminin et quelquefois masculin",
  "pronom personnel masculin de la 3personne",
  "pronom personnel masculin de la 3 personne",
  "locution prépositive",
  "locution adverbiale et adjectif",
  "pronom personnel",
  "nom féminin ou (vieilli) masculin",
  "pronom relatif",
  "adjectif relatif",
  "pronom interrogatif",
  "pronom personnel pluriel invariable de la 3personne",
  "adjectif possessif de la 3personne du pluriel",
  "pronom possessif",
  "nom masculin (surtout pluriel)",
  "pronom personnel masculin et féminin, ou pronom réfléchi de la 3personne",
  "nom masculin invariable et adjectif invariable",
  "nom féminin et adjectif invariable",
  "adjectif et nom masculin invariable",
  "pronom personnel de la 1 personne",
  "verbe impersonnel et verbe transitif indirect",
  "adjectif possessif",
  "pronom personnel accentué de la 1personne du singulier",
  "adjectif possessif de la 1personne du singulier",
  "nom masculin et adjectif invariables",
  "adjectif numéral invariable et nom masculin invariable",
  "adverbe de négation",
  "adjectif numéral invariable",
  "adjectif numéral ordinal et nom",
  "pronom personnel de la première personne du pluriel des deux genres",
  "adjectif invariable et nom féminin invariable",
  "pronom indéfini ou pronom personnel",
  "adjectif féminin pluriel",
  "adverbe interrogatif",
  "adverbe ou pronom relatif",
  "nom masculin ou, vieilli, nom féminin",
  "adjectif masculin pluriel",
  "adverbe et adjectif",
  "verbe intransitif et verbe impersonnel",
  "adjectif interrogatif et adjectif exclamatif",
  "adjectif qualificatif",
  "pronom relatif indéfini singulier",
  "pronom interrogatif ou pronom exclamatif",
  "pronom personnel réfléchi de la 3personne du singulier et du pluriel",
  "verbe transitif indirect et verbe impersonnel",
  "adverbe d'affirmation",
  "adverbe de quantité",
  "pronom possessif de la 3e personne",
  "pronom personnel réfléchi de la 3personne",
  "adjectif possessif de la 3personne du singulier",
  "adjectif (parfois considéré comme invariable en nombre)",
  "adjectif invariable et nom féminin",
  "pronom personnel accentué de la 2personne du singulier",
  "adjectif possessif de la 2personne du singulier",
  "adjectif invariable en genre",
  "nom féminin (surtout pluriel)",
  "pronom personnel de la deuxième personne du pluriel des deux genres",
  "adverbe et/ou pronom personnel",
  "adjectif numéral",
];


(async function () {
  console.time('t1');


  await PromisePool
    .for(db)
    .withConcurrency(128)
    .handleError(async (error) => {
      throw error
    })
    .onTaskFinished((item, pool) => {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(pool.processedPercentage().toFixed(0) + '%')
    })
    .process(async (row) => {

    })

  console.log('Sauvegarde')
  fs.writeFileSync(join(OUTPUT_DIR, 'extracted.json'), JSON.stringify(WORDS, null, 2));


})();