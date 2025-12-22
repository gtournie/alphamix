import * as cheerio from 'cheerio';
import { tidy } from 'htmltidy2';
import fs, { promises as fsPromises } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import ascii from '../lib/ascii.js';
import { exec, spawn } from 'child_process';

export const __dirname = dirname(fileURLToPath(import.meta.url));
export const LAROUSSE_HTML_DIR = join(__dirname, '..', 'data', 'larousse-html');
export const LAROUSSE_HTML_WORDS_DIR = join(LAROUSSE_HTML_DIR, 'words');
export const LAROUSSE_HTML_CONJUGATION_DIR = join(LAROUSSE_HTML_DIR, 'conjugation');

export const LAROUSSE_ORIGIN = 'https://www.larousse.fr'


const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
export const WIKTIONARY_HTML_DIR = join(__dirname, '..', 'data', 'wiktionary');
for(const letter of LETTERS) {
  fs.mkdirSync(join(WIKTIONARY_HTML_DIR, letter), { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// e.g. {\displaystyle {\text{NH}}_{4}^{+}}
// function renderTex(tex, dir = '') {
//   let open = 0;
//   let text = '';
//   let index = 0;
//   while (index < tex.length) {
//     let c = tex.charAt(index);
//     if (c === '{' && tex.charAt(index + 1) === "\\") {
//       ++index;
//       ++open;
//       let content = "";
//       do {
//         ++index;
//         if (index > tex.length) throw new Error('Tex malformed: directive')
//         let curC = tex.charAt(index)
//         if (curC === '{') ++open
//         if (curC === '}') --open
//         if (open) content += curC;
//       } while (open > 0);
//       let directive;
//       content = content.replace(/^[a-zA-Z]+\s/, function($1) {
//         directive = $1;
//         return '';
//       })
//       content = "{\\" + content + "}";
//       text += "{\\" + directive + renderTex(content, directive.trim()) + "}";
//       ++index;
//       continue;
//     }
//     if (dir === 'displaystyle' && open === 0 && c === "_{") {
//       ++index;
//       let content = "";
//       do {
//         ++index;
//         if (index > tex.length) throw new Error('Tex malformed: displaystyle')
//         let curC = tex.charAt(index)
//         if (curC === '{') ++open
//         if (curC === '}') --open
//         if (open) content += curC;
//       } while (open > 0);
//       text += "_{" + content.replace(/[a-zA-Z0-9]/g, function() {
//       }) + "}";
//       ++index;
//       continue;
//     }
//     if (c === '{') {
//       ++open;
//     } else if (c === '}') {
//       --open
//     } else {
//       if (open === 1) text += c;
//       if (open > 1) throw new Error("Tex malformed: don't know what to do")
//     }
//     ++index;
//   }
//   return text;
// }

export async function detex(tex) {
  return new Promise(function (resolve, reject) {
    let stdout = '';
    let process = spawn('detex');
    process.stdin.write('"' + tex + '"');
    process.stdout.on('data', function (buf) {
      stdout += buf.toString();
    });
    process.on('exit', function (code) {
      if (code === 0) {
        // Transform
        stdout = stdout.replace(/_/g, '').replace(/[\^]/g, '').trim();
        if (stdout.startsWith('"') && stdout.endsWith('"')) {
          stdout = stdout.slice(1, -1).trim();
        }
        resolve(stdout);
      } else {
        reject(stderr);
      }
    });
    process.on('error', function (err) {
      reject(err);
    });
    process.stdin.end();
  });
}

async function fileExists(filePath) {
  try {
    await fsPromises.stat(filePath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
}

function getDomFromContent(content) {
  const $ = cheerio.load(content);
  return $;
}

export async function getContentFromUrl(url) {
  const response = await fetch(url);
  const html = await response.text();
  return html;
}

export async function getDomFromUrl(url) {
  const html = await getContentFromUrl(url);
  return getDomFromContent(html);
}

export async function getDomFromFile(url) {
  const html = await fsPromises.readFile(url, 'utf-8');
  return getDomFromContent(html);
}

export async function cleanupHtml(html) {
  const $ = cheerio.load(html);
  $.root().find('script,style,noscript,meta,link').remove();
  html = $.root().html();
  return new Promise(async (resolve, reject) => {
    tidy(html, { indent: true, hideComments: true, wrap: 100000 }, function (err, html) {
      return err ? reject(err) : resolve(html);
    })
  })
}

export function normalize(str) {
  return str.replace(/'/g, "’").replace(/ +/g, ' ').replace(/\s+/g, ' ').trim();
}

function wiktionaryMissingDef(word, target) {
  return (/\sdéfinition\smanquante\s/.test(' ' + target.text() + ' ')
    || target.find('a[href="https://fr.wiktionary.org/w/index.php?title=' + word + '&action=edit"]').length);
}

export async function getLongerDef(word, def) {
  const filepath = join(join(WIKTIONARY_HTML_DIR, ascii(word.charAt(0)).toUpperCase()), `${word}.html.txt`);
  const doesFileExists = await fileExists(filepath);
  let $;
  if (doesFileExists) {
    $ = await getDomFromFile(filepath);
  } else {
    await sleep(50);
    let html = await getContentFromUrl('https://fr.wiktionary.org/wiki/' + word);
    html = await cleanupHtml(html);
    await fsPromises.writeFile(filepath, html);
    $ = getDomFromContent(html);
  }

  const targets = $($(
    [
      'div[lang="fr"] > p b:contains(' + word + ') + a[title="Annexe:Prononciation/français"]',
      'div[lang="fr"] > p b:contains(' + word + ') + .ligne-de-forme',
      'div[lang="fr"] > p b:contains(' + word + ') + *[title="Prononciation à préciser"]',
      'div[lang="fr"] > p i b:contains(' + word + '):first',
      'div[lang="fr"] > p b:contains(' + word + '):first'
    ].join(',')
  )[0]).closest('p').nextAll('ol,ul').first().find('> li').toArray();

  // Cleanup
  targets.forEach(t => $(t).find('ul,ol,math *').remove());
  let target = $(targets.filter(target => $(target).text().trim() && !wiktionaryMissingDef(word, $(target)))[0] || targets[0]);

  // Transform (math)
  for (let m of target.find('math').toArray()) {
    m = $(m);
    let tex = m.attr('alttext');
    let detext = (await detex(tex)) || '';
    try {
      m.replaceWith(detext);
    } catch(e) {
      console.log("\nDetex error: ", tex, err);
    }

    console.log('\nFOUND math: ', tex, detext, word);
  }
  let lDef = normalize(target.text());
  lDef = lDef.replace(/→ voir \S+$/, '').trim();
  const normLDef = lDef.toLowerCase();

  if (!normLDef) {
    console.log("\nWARNING: selector broken?", word);
    return { broken: true, missing: false, def };
  }
  if (wiktionaryMissingDef(word, target)) {
    console.log("\nWARNING: longer def not found!", word);
    return { broken: false, missing: true, def };
  }

  // const normDef = normalize(def).replace(/…$/, '').toLowerCase()
  // const comp = (long, short) => long && short && long.startsWith(short) 
  // if (!comp(normLDef, normDef) && !comp(normLDef.replace(/^\([^\)]+\)\.?\s+/, ''), normDef.replace(/^\([^\)]+\)\.?\s+/, ''))) {
  //   console.log("\nWARNING: weird longer def: ", word);
  //   console.log("  " + def)
  //   console.log("  " + lDef)
  // }
  return { broken: false, missing: false, def: lDef };
}


// Doesn't worf for "occire"
// export async function getMood(conj) {
//   const DIC_SEARCH = 'https://www.dictionnaire-academie.fr/search'
//   let response = await fetch(DIC_SEARCH, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Accept': 'application/json'
//     },
//     body: new URLSearchParams({ term: conj, options: 1 })
//   })
//   let json = await response.json()
//   if (!json.result.length || !json.result[0]) return null
//   const searchURL = json.result[0].url
//   let $ = await getDomFromUrl(searchURL);
//   const url = join(DIC_SEARCH, $('a:contains(conjugaison)').attr('href'));
//   $ = await getDomFromUrl(url);
//   return $('td:contains(' + conj + '):first').closest('table').prevAll('h4:first').text()
// }