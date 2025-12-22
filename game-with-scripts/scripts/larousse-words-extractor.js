import { getDomFromFile, LAROUSSE_HTML_DIR, LAROUSSE_HTML_WORDS_DIR, LAROUSSE_ORIGIN } from "./_helpers.js"
import fs, { promises as fsPromises } from 'fs';
import { join } from 'path';
import { PromisePool } from '@supercharge/promise-pool'
import ascii from "../lib/ascii.js";

const OUTPUT_DIR = LAROUSSE_HTML_DIR;

const WORDS = [];
const TYPES = new Set();
const WORD_CHECK_REG = /[^a-z]/
const KEYS = new Set()

let conjugateLinkCnt = 0
let fileCnt = 0;
let duplicates = 0;

let id = 0;

function getType(def) {
  let siblings = def.nextUntil('.AdresseDefinition');
  if (!siblings.length) siblings = def.nextAll()
  return siblings.filter('.CatgramDefinition').children().remove().end().text().trim()
}

(async function () {
  console.time('t1');

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  for (const letter of letters) {

    const WORDS_DIR = join(LAROUSSE_HTML_WORDS_DIR, letter);
    const files = await fsPromises.readdir(WORDS_DIR)

    console.log(letter + ' - ' + files.length + ' files to process')
    fileCnt += files.length
    await PromisePool
      .for(files)
      .withConcurrency(128)
      .handleError(async (error) => {
        throw error
      })
      // .onTaskFinished((item, pool) => {
      //   process.stdout.clearLine();
      //   process.stdout.cursorTo(0);
      //   process.stdout.write(pool.processedPercentage().toFixed(0) + '%')
      // })
      .process(async (file) => {
        const $ = await getDomFromFile(join(WORDS_DIR, file));
        const originalWords = $('.AdresseDefinition')
        if (!originalWords.length) {
          console.log("WARNING: file corrupted? ", file);
          return null
        }
        originalWords.find('span.linkaudio, audio').remove()

        for (const originalWord of originalWords) {
          const addressDef = $(originalWord);
          const conjugateLink = addressDef.nextAll('.CatgramDefinition:first').find('a.lienconj').attr('href');

          if (conjugateLink) ++conjugateLinkCnt;

          let def = $(addressDef[0]);
          let type;
          while (!type) {
            type = getType(def);
            if (type || !(def.nextUntil('.AdresseDefinition').find('.LienAdresse').text().trim().toLowerCase() === 'ou')) break;
            def = def.nextAll('.AdresseDefinition:first');
            if (!def.length) break;
          }
          type = type ? type.toLowerCase() : void 0;

          let text = addressDef.text();

          if (addressDef.find('span.ReformeOrtho').length) {
            if (addressDef.find('span.ReformeOrtho').length !== 2
              || addressDef.find('span.ReformeOrtho:first').text().trim().toLowerCase() !== '(réf. ortho.'
              || addressDef.find('span.ReformeOrtho:last').text().trim().toLowerCase() !== ')') {
              console.log('*** ReformOrtho', file)
            }
            addressDef.find('span.ReformeOrtho').remove();
            const refOrtho = addressDef.find('span.AdresseRefOrtho');
            text = refOrtho.toArray().map(s => $(s).text()).join(' ');
            refOrtho.remove();
            text = addressDef.text() + ',' + text;
          }
          if (addressDef.find('span.RemarqueDefinition').length) {
            addressDef.find('span.RemarqueDefinition').replaceWith(',');
            text = addressDef.text().trim().replace(/,+/g, ',').replace(/^,/, '').replace(/,$/, '');
          }
          if (addressDef.find('span').length) {
            addressDef.find('span').each((i, span) => {
              console.log('*** WEIRD span found', span.className, '***');
            })
          }

          text.split(',').forEach(w => {
            const word = ascii(w.trim())
            if (!word || WORD_CHECK_REG.test(word)) return;

            if (type) TYPES.add(type)
            const larousseId = +(file.split('-')[0])
            const key = `${larousseId}-${word}-${type}`
            if (!KEYS.has(key)) {
              WORDS.push({
                // id: ++id,
                key,
                larousseId,
                word,
                type,
                conjugateLink: conjugateLink ? LAROUSSE_ORIGIN + conjugateLink : void 0,
              });
              KEYS.add(key)
            } else {
              ++duplicates
            }
          })
        }
      })
  };

  console.log('Sauvegarde')
  fs.writeFileSync(join(OUTPUT_DIR, 'extracted.json'), JSON.stringify(WORDS, null, 2));

  console.timeEnd('t1')
  console.log('Files: ', fileCnt);
  console.log('Mots: ', WORDS.length);
  console.log('Duplicates: ', duplicates)
  console.log('conjugateLinkCnt: ', conjugateLinkCnt)
  console.log('types: ')
  console.log(' - ' + Array.from(TYPES).join('\n - '))
})();