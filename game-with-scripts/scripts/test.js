import { cleanupHtml, detex, getDomFromFile } from "./_helpers.js"
import fs, { promises as fsPromises } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PromisePool } from '@supercharge/promise-pool'
// import db from '../data/1mot.json' with { type: "json" }

const __dirname = dirname(fileURLToPath(import.meta.url));

const DIR = join(__dirname, '..', 'data');
const ONE_MOT_DIR = join(DIR, '1mot');
// const db = {}

let count = 0;

function extractType(def) {
  let index = def.indexOf('.');
  while (index >= 0 && /\S/.test(def.charAt(--index))) { }
  def = def.slice(index + 1)
  let type;
  def = def.replace(/^(?:[a-z]+\.)+(?:\s+et\s+(?:[a-z]+\.)+)?/, function ($1) {
    type = $1;
    return '';
  }).trim()
  return { def, type }
}

function transformDef(def) {
  // Some color definitions are followed by an hex representation. Remove it!
  if (/#[0-9a-f]/i.test(def)) {
    def = def.replace(/\s+#[0-9a-f]{6}(…)?/gi, '').trim().replace(/\.\.$/, '.');
    // console.log('1+', def)
  }
  // In case of multiple definitions, remove the second one
  if (def.includes("1.") && def.includes('2.')) {
    console.log('################################')
    console.log('2+', def)
    // def = def.split(/[12]\.\s+/).filter(x => extractType(x).def).slice(0, 2).join('').trim();
    // console.log('2+', def)
  }
  return def;
}

(async function () {
  console.time('t1')

  console.log(
    (await detex("{\\displaystyle {\\text{NH}}_{4}^{+}}"))
  );

  // console.log(JSON.stringify(db.filter(n => {
  //   return (n.type || '').includes("locution")
  // }).map(n => n.word), null, 2))

  console.timeEnd('t1')
})();