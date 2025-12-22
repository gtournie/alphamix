import fs from 'fs';
import { getDomFromUrl } from "./_helpers.js"
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ORIGIN = 'https://scrabble123.fr';
const OUTPUT_FILE = join(__dirname, '..', 'data', 'scrabble123.json');

const ALLOWED_WORDS = [];

(async function () {
  let n = 0;

  const $ = await getDomFromUrl(`${ORIGIN}/dictionnaire-du-scrabble`)
  const links = $('a')

  // Iterating over the list of links
  for (const link of links) {
    const a = $(link)
    const txt = a.text().trim()

    if (txt.toLowerCase().startsWith('liste des mots')) {
      console.log('');
      console.log(a.find('h2').remove().end().text().trim());

      const url = `${ORIGIN}${a.attr('href')}`
      const $ = await getDomFromUrl(url)
      const pageItems = $('.pagination .page-item a');

      for (const pageItem of pageItems) {
        const a = $(pageItem)
        const page = a.text().trim()

        if (!isNaN(page) && parseFloat(page) === parseInt(page, 10)) {
          const href = a.attr('href')
          process.stdout.write('.')
          const $ = await getDomFromUrl(href.startsWith('#') ? url : `${ORIGIN}${href}`)
          const words = $('a[href^="/dictionnaire-du-scrabble/"]').find('.badge').remove().end()

          for (const word of words) {
            ALLOWED_WORDS.push($(word).text().trim());
          }
        }
      }
    }
  }

  // Write the words to a file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(ALLOWED_WORDS, null, 2));
})();