import { cleanupHtml, getContentFromUrl, LAROUSSE_HTML_CONJUGATION_DIR } from "./_helpers.js"
import fs, { promises as fsPromises } from 'fs';
import { join } from 'path';
import { PromisePool } from '@supercharge/promise-pool'
import db from '../data/larousse-html/extracted.json' with { type: "json" }

const OUTPUT_DIR = LAROUSSE_HTML_CONJUGATION_DIR;
fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

(async function () {
  console.time('t1');

  await PromisePool
    .for(db)
    .withConcurrency(24)
    .handleError(async (error) => {
      throw error
    })
    .onTaskFinished((item, pool) => {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(pool.processedPercentage().toFixed(0) + '%')
    })
    .process(async (row) => {
      if (!row.conjugateLink) return;

      let html = await getContentFromUrl(row.conjugateLink);
      let retries = 0;
      while (++retries < 3 && html.indexOf('art-conj') < 0) {
        html = await getContentFromUrl(row.conjugateLink);
      }
      if (html.indexOf('art-conj') < 0) {
        console.log("WARNING: file corrupted? ", decodeURIComponent(row.conjugateLink))
      }

      html = await cleanupHtml(html);
      await fsPromises.writeFile(join(OUTPUT_DIR, `${row.key}.txt`), html);
    })

  console.timeEnd('t1')
})();