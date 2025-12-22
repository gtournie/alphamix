import { cleanupHtml, getDomFromUrl, LAROUSSE_HTML_WORDS_DIR, LAROUSSE_ORIGIN } from "./_helpers.js"
import fs, { promises as fsPromises } from 'fs';
import { basename, join } from 'path';
import { PromisePool } from '@supercharge/promise-pool'


const ORIGIN = LAROUSSE_ORIGIN;
const ALL = new Set();
const ERRORS = new Set();

(async function () {
  console.time('t1')

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  for (const letter of letters) {

    const WORD_LINKS = [];
    const DIR = join(LAROUSSE_HTML_WORDS_DIR, letter);
    fs.rmSync(DIR, { recursive: true, force: true });
    fs.mkdirSync(DIR, { recursive: true });

    const $ = await getDomFromUrl(`${ORIGIN}/index/dictionnaires/francais`)
    const links = $('section.content h1:contains(' + letter.toLowerCase() + ') + ul a')

    console.log('===== ' + letter + ' =====')
    console.log('Lecture (' + links.length + ')')

    for (const link of links) {
      // console.log('')
      // process.stdout.write('(' + $(link).text().trim() + ') ')

      const $2 = await getDomFromUrl(ORIGIN + $(link).attr('href'))
      const wordLinks = $2('section.content a')

      for (const wordLink of wordLinks) {
        // process.stdout.write('.')
        const link = $2(wordLink)
        const href = link.attr('href')
        const word = link.children().remove().end().text().trim().replace(/\//g, '_')
        WORD_LINKS.push([word, ORIGIN + href])
        ALL.add(word)
      }
    }

    // console.log('')
    // console.log('')
    console.log('Ecriture (' + WORD_LINKS.length + ')')
    await PromisePool
      .for(WORD_LINKS)
      .withConcurrency(24)
      .handleError(async (error) => {
        throw error
      })
      .onTaskFinished((item, pool) => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(pool.processedPercentage().toFixed(2) + '%')
      })
      .process(async ([word, url]) => {
        const larousseId = basename(url)
        let response = await fetch(url);
        let html = await response.text();

        // let response, html
        // try {
        //   html = await fsPromises.readFile(join(DIR, `${larousseId}-${word}.txt`));
        // } catch (e) {
        //   return null;
        // }
        // let corrupted = html.indexOf('AdresseDefinition') < 0;
        // if (!corrupted) return
        // fs.unlinkSync(join(DIR, `${larousseId}-${word}.txt`))
        // return null

        let retries = 0;
        while (++retries < 3 && html.indexOf('AdresseDefinition') < 0) {
          response = await fetch(url);
          html = await response.text();
        }
        if (html.indexOf('AdresseDefinition') < 0) {
          // console.log("WARNING: file corrupted? ", decodeURIComponent(url))
          ERRORS.add(word)
        } else {
          html = await cleanupHtml(html);
          await fsPromises.writeFile(join(DIR, `${larousseId}-${word}.txt`), html);
        }
        return null;
      })
  }

  const noBackup = []
  for (const error of ERRORS) {
    if (!ALL.has(error)) {
      noBackup.push(error);
    }
  }
  if (noBackup.length > 0) {
    console.log("Word(s) with url error with no backup: ")
    console.log(' - ' + noBackup.join(' - '))
  }

  console.log('')
  console.timeEnd('t1')
})();