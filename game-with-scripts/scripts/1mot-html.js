import { __dirname, cleanupHtml, getDomFromUrl, LAROUSSE_HTML_WORDS_DIR, LAROUSSE_ORIGIN } from "./_helpers.js"
import fs, { promises as fsPromises } from 'fs';
import { basename, join } from 'path';
import { PromisePool } from '@supercharge/promise-pool'


const ORIGIN = "https://1mot.net/";
const FIRST_WORD = "aa";
const ALL = new Set();
const ERRORS = new Set();


const DIR = join(__dirname, '..', 'data', '1mot');
// fs.rmSync(DIR, { recursive: true, force: true });
fs.mkdirSync(DIR, { recursive: true });

let limit = 500000;

(async function () {
  let currentWord = 'fa';
  let currentLetter;
  let counter = 0;
  let error = null;
  let done = false;
  let lastWordSaved;

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  for (const letter of letters) {
    fs.mkdirSync(join(DIR, letter), { recursive: true });
  }
  console.log(letters.join(', '))

  const offset = new Date().getTimezoneOffset() * 60 * 1000
  let now = Date.now() - offset;
  console.time('t1')

  do {
    // Write info
    if (currentLetter !== currentWord.charAt(0)) {
      if (currentLetter) console.log('');
      currentLetter = currentWord.charAt(0);
      if (!letters.includes(currentLetter.toUpperCase())) {
        done = true;
        break;
      }
      console.log("==== " + currentLetter.toUpperCase() + " ====")
      counter = 0;
      now = Date.now() - offset;
    }
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(new Date(Date.now() - now).toLocaleTimeString('fr-FR') + ' ' + ++counter + ' ' + currentWord);

    try {
      // Get word's html
      const $ = await getDomFromUrl(ORIGIN + currentWord);
      // Cleanup
      $.root().find('script,style,noscript,meta,link,img').remove();
      // Save it
      await fsPromises.writeFile(join(DIR, currentLetter, `${currentWord}.html.txt`), $.root().html());
      lastWordSaved = currentWord
      // Get next word
      currentWord = $('a:contains(Mot suivant)').attr('href');
      if (!currentWord) {
        error = "Page corrupted? Can't find next word. " + ORIGIN + currentWord
      }
    } catch(err) {
      error = err;
    }
    
    // if (--limit < 0) {
    //   console.log("\nBye bye")
    //   console.timeEnd('t1')
    //   process.exit(0)
    // }
  } while(!error && currentWord !== FIRST_WORD && !done);

  if (error) {
    console.log('\nERROR')
    console.log(error)
  }
  console.log('\nlast word saved: ', lastWordSaved)
  console.timeEnd('t1')
})();