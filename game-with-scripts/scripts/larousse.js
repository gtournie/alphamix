import { getDomFromUrl } from "./_helpers.js"
import ascii from '../lib/ascii.js';
import plural from 'pluralize-fr';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const LETTER = 'Y'
const ORIGIN = 'https://www.larousse.fr'
const OUTPUT_FILE = join(__dirname, '..', 'data', `larousse-${LETTER}.json`);

const WORDS = [];

function fastWordCheck(word) {
  if (word.length < 2) return false;
  if (word.length > 15) return false;
  if (/[^a-z]/.test(word)) return false;
  return true;
}

(async function () {

  const $ = await getDomFromUrl(`${ORIGIN}/index/dictionnaires/francais`)
  const links = $('section.content h1:contains(' + LETTER.toLowerCase() + ') + ul a')

  for (const link of links) {
    process.stdout.write('(' + $(link).text().trim() + ') ')

    const $2 = await getDomFromUrl(ORIGIN + $(link).attr('href'))
    const wordLinks = $2('section.content a')


    for (const wordLink of wordLinks) {
      const href = $2(wordLink).attr('href')
      process.stdout.write('.')
      const $3 = await getDomFromUrl(ORIGIN + href)
      const originalWords = $3('#definition .AdresseDefinition').find('span.linkaudio, audio').remove().end()

      for (const originalWord of originalWords) {
        const addressDef = $3(originalWord);
        const conjugateLink = addressDef.next('.CatgramDefinition').find('a.lienconj').attr('href');
        let type = addressDef.next('.CatgramDefinition').children().remove().end().text().trim();
        const or = !type && addressDef.nextUntil('.AdresseDefinition').find('.LienAdresse').text().trim().toLowerCase() === 'ou';
        let typeCheck;
        if (or) {
          type = void 0;
          const nextDef = $(addressDef.next('.AdresseDefinition'));
          typeCheck = nextDef.next('.CatgramDefinition').children().remove().end().text().trim();
        }

        let text = addressDef.text();

        if (addressDef.find('span.ReformeOrtho').length) {
          addressDef.find('span.ReformeOrtho').remove();
          const refOrtho = addressDef.find('span.AdresseRefOrtho');
          text = refOrtho.text();
          refOrtho.remove();
          text = addressDef.text() + ',' + text;
        }
        if (addressDef.find('span.RemarqueDefinition').length) {
          if (addressDef.find('span.RemarqueDefinition').text().trim().toLowerCase() !== 'ou') {
            console.log('*** WEIRD span found', text, '***');
          }
          addressDef.find('span.RemarqueDefinition').replaceWith(',');
          text = addressDef.text();
        }
        if (addressDef.find('span').length) {
          console.log('*** WEIRD span found', text, '***');
        }

        text.split(',').forEach(w => {
          const word = ascii(w.trim()).toLowerCase()
          if (!fastWordCheck(word)) return;

          WORDS.push({ word, type, typeCheck, conjugateLink: conjugateLink ? ORIGIN + conjugateLink : void 0 });
        })
      }
      sleep(50);
    }
  }

  // Write the words to a file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(WORDS, null, 2));

})();