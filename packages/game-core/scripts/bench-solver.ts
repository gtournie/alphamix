/**
 * Benchmark harness for Board.moves().
 *
 * Usage:
 *   bun run bench                                       # measure, write JSON
 *   bun run bench --compare <path/to/baseline.json>     # measure + diff vs baseline
 *   bun run bench --scenarios=main                      # subset (comma-separated)
 *   bun run bench --samples=30                          # override main/light sample count
 *
 * Output JSON: .claude/tmp/bench-solver/<iso>_<shortsha>_<branch>.json
 *
 * Design notes (see /Users/guillaume/.claude/plans for the full rationale):
 * - Custom harness, not tinybench — its warmup model (100 ms budget = 1 call here)
 *   does not fit a 70 ms workload.
 * - Warmup: 15–30 iterations, early-exit on steady-state (last-5-samples within
 *   ±5% of their median) to leave FTL tier time to finalise on JSC.
 * - GC: Bun.gc(true) before each measured sample. Isolates GC pauses outside the
 *   measurement while keeping allocator pressure inside moves() (part of the
 *   workload we're optimising).
 * - Board instance is constructed once per scenario and reused. moves() is pure
 *   (no writes to Board state) — verified by inspection of Board.ts L226-247.
 * - Significance: |Δp50| > 2·√(sd_now²+sd_base²). Simple heuristic, not a rigorous
 *   t-test, but sufficient to stop celebrating 2% wins inside noise.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Board } from '../src2/core/game/Board';
import { loadLocale, parseRack, emptyGrid } from '../src2/core/game/__test-utils__/solver-fixtures';

// ---------- CLI ----------

interface Cli {
  compare?: string;
  scenarios: Set<string>;
  samplesOverride?: number;
  warmupMax: number;
  outDir: string;
  noGc: boolean;
}

function parseCli(argv: string[]): Cli {
  const cli: Cli = {
    scenarios: new Set(['main', 'light', 'heavy']),
    warmupMax: 30,
    outDir: path.resolve(import.meta.dir, '../../../.claude/tmp/bench-solver'),
    noGc: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--compare') cli.compare = argv[++i];
    else if (a.startsWith('--compare=')) cli.compare = a.slice('--compare='.length);
    else if (a.startsWith('--scenarios=')) cli.scenarios = new Set(a.slice('--scenarios='.length).split(','));
    else if (a.startsWith('--samples=')) cli.samplesOverride = Number(a.slice('--samples='.length));
    else if (a.startsWith('--warmup=')) cli.warmupMax = Number(a.slice('--warmup='.length));
    else if (a.startsWith('--out=')) cli.outDir = a.slice('--out='.length);
    else if (a === '--no-gc') cli.noGc = true;
  }
  return cli;
}

// ---------- Fixtures ----------

const MID_GAME_GRID = [
  '...............',
  '...........T.V.',
  '..........JOUES',
  '...........N.L.',
  '..........AN.A.',
  '.......MOFLE.TA',
  '....G.....O...X',
  '...BADER..I...A',
  '....R.WURMS...I',
  '..FADEE.......U',
  '....E.SALEE....',
  'T.ZOU..HIT.....',
  'I.E.R..........',
  'POKES..........',
  'E..............',
];

interface Scenario {
  name: string;
  makeGrid: () => string[][];
  rack: string;
  samples: number;
}

const SCENARIOS: Scenario[] = [
  {
    name: 'main',
    makeGrid: () => MID_GAME_GRID.map(l => [...l]),
    rack: 'PTBYE??',
    samples: 50,
  },
  {
    name: 'light',
    makeGrid: () => emptyGrid(),
    rack: 'ETAOINS',
    samples: 50,
  },
  {
    // 3 blanks on mid-game grid — stresses blank-handling dominance above the
    // 2-blank `main` scenario, without hitting combinatorial explosion
    // (4 blanks ~= 3.4 s/call, 7 blanks doesn't return within a minute).
    name: 'heavy',
    makeGrid: () => MID_GAME_GRID.map(l => [...l]),
    rack: 'PTBY???',
    samples: 10,
  },
];

// ---------- Harness core ----------

interface ScenarioResult {
  name: string;
  rack: string;
  moveCount: number;
  warmupSamples: number[];
  warmupSettled: number | null; // iteration index where steady-state was detected
  samples: number[];
  summary: StatsSummary;
}

interface StatsSummary {
  min: number;
  p50: number;
  p95: number;
  p99: number;
  max: number;
  mean: number;
  sd: number;
  rme: number; // relative margin of error (1.96·stderr/mean, percent)
}

function gcIfAvailable(): void {
  const b = (globalThis as { Bun?: { gc?: (force: boolean) => void } }).Bun;
  if (b?.gc) {
    b.gc(true);
    return;
  }
  const g = (globalThis as { gc?: () => void }).gc;
  if (g) g();
}

// Reference sink so a smart JIT doesn't elide the pure-looking moves() call.
// `any` here is fine — it's scratch state.
let __sink: unknown;

function isSteadyState(window5: number[]): boolean {
  if (window5.length < 5) return false;
  const sorted = [...window5].sort((a, b) => a - b);
  const median = sorted[2];
  if (median <= 0) return false;
  return (sorted[4] - sorted[0]) / median < 0.05;
}

function summarise(samples: number[]): StatsSummary {
  const sorted = [...samples].sort((a, b) => a - b);
  const n = sorted.length;
  const pick = (p: number) => sorted[Math.min(n - 1, Math.floor(p * n))];
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const variance = sorted.reduce((a, b) => a + (b - mean) ** 2, 0) / (n > 1 ? n - 1 : 1);
  const sd = Math.sqrt(variance);
  const stderr = sd / Math.sqrt(n);
  const rme = mean > 0 ? (1.96 * stderr / mean) * 100 : 0;
  return {
    min: sorted[0],
    p50: sorted[Math.floor(n * 0.5)],
    p95: pick(0.95),
    p99: pick(0.99),
    max: sorted[n - 1],
    mean,
    sd,
    rme,
  };
}

function benchOne(scenario: Scenario, cli: Cli): ScenarioResult {
  const locale = loadLocale('fr');
  const board = new Board(locale, scenario.makeGrid(), parseRack(locale, [...scenario.rack]));

  // Fail-loud: a fixture producing 0 moves means something is broken.
  const probe = board.moves();
  if (probe.size === 0) {
    throw new Error(`bench-solver: scenario "${scenario.name}" produced 0 moves — fixture broken`);
  }
  const moveCount = probe.size;

  const warmupSamples: number[] = [];
  let warmupSettled: number | null = null;
  for (let i = 0; i < cli.warmupMax; i++) {
    if (!cli.noGc) gcIfAvailable();
    const t0 = performance.now();
    __sink = board.moves();
    warmupSamples.push(performance.now() - t0);
    if (i >= 14 && isSteadyState(warmupSamples.slice(-5))) {
      warmupSettled = i;
      break;
    }
  }

  const nSamples = cli.samplesOverride ?? scenario.samples;
  const samples: number[] = [];
  for (let i = 0; i < nSamples; i++) {
    if (!cli.noGc) gcIfAvailable();
    const t0 = performance.now();
    __sink = board.moves();
    samples.push(performance.now() - t0);
  }

  return {
    name: scenario.name,
    rack: scenario.rack,
    moveCount,
    warmupSamples,
    warmupSettled,
    samples,
    summary: summarise(samples),
  };
}

// ---------- Output ----------

function fmtMs(ms: number): string {
  return ms.toFixed(2);
}

function printHeader(envInfo: EnvInfo): void {
  console.log(`bench-solver — FR Scrabble Board.moves()`);
  console.log(`env    ${envInfo.runtime} · ${envInfo.os} · ${envInfo.arch}`);
  console.log(`git    ${envInfo.git.branch} @ ${envInfo.git.sha}${envInfo.git.dirty ? ' (dirty)' : ''}`);
  console.log(`date   ${envInfo.timestamp}`);
  console.log('');
}

function printTable(results: ScenarioResult[]): void {
  const pad = (s: string, n: number) => s.padStart(n);
  console.log(`scenario  rack     moves   min     p50     p95     p99     max     sd      rme%`);
  for (const r of results) {
    const s = r.summary;
    console.log(
      `${r.name.padEnd(9)} ${r.rack.padEnd(8)} ${pad(String(r.moveCount), 5)}  ${pad(fmtMs(s.min), 6)}  ${pad(fmtMs(s.p50), 6)}  ${pad(fmtMs(s.p95), 6)}  ${pad(fmtMs(s.p99), 6)}  ${pad(fmtMs(s.max), 6)}  ${pad(fmtMs(s.sd), 6)}  ${pad(s.rme.toFixed(2), 5)}`
    );
  }
  console.log('');
  const warm = results.map(r =>
    r.warmupSettled !== null ? `${r.name} iter ${r.warmupSettled}` : `${r.name} max`
  ).join(' · ');
  console.log(`warmup settled: ${warm}`);
}

function printDelta(baseline: BenchOutput, now: ScenarioResult[]): void {
  console.log('');
  console.log(`vs baseline ${baseline.env.git.sha}${baseline.env.git.dirty ? '+dirty' : ''} (${baseline.env.timestamp})`);
  console.log('');
  console.log(`scenario  p50 now   p50 base  Δ           Δ%       significant?`);
  for (const r of now) {
    const base = baseline.scenarios.find(s => s.name === r.name);
    if (!base) {
      console.log(`${r.name.padEnd(9)} (not in baseline)`);
      continue;
    }
    const dP50 = r.summary.p50 - base.summary.p50;
    const dPct = base.summary.p50 > 0 ? (dP50 / base.summary.p50) * 100 : 0;
    const combinedSd = Math.sqrt(r.summary.sd ** 2 + base.summary.sd ** 2);
    const significant = combinedSd > 0 && Math.abs(dP50) > 2 * combinedSd;
    const arrow = dP50 < 0 ? '↓' : dP50 > 0 ? '↑' : '=';
    const sigCell = significant ? `yes ${arrow}` : `no`;
    console.log(
      `${r.name.padEnd(9)} ${r.summary.p50.toFixed(2).padStart(7)}   ${base.summary.p50.toFixed(2).padStart(7)}   ${(dP50 > 0 ? '+' : '') + dP50.toFixed(2)} ms`.padEnd(54) +
      `  ${(dPct > 0 ? '+' : '') + dPct.toFixed(1)}%`.padEnd(8) +
      `  ${sigCell}`
    );
  }
}

interface EnvInfo {
  runtime: string;
  os: string;
  arch: string;
  timestamp: string;
  git: { branch: string; sha: string; dirty: boolean };
}

interface BenchOutput {
  env: EnvInfo;
  scenarios: ScenarioResult[];
}

function collectEnv(): EnvInfo {
  const runtime = typeof (globalThis as { Bun?: { version: string } }).Bun !== 'undefined'
    ? `Bun ${(globalThis as { Bun: { version: string } }).Bun.version}`
    : `Node ${process.version}`;
  const os = `${process.platform} ${process.arch}`;
  let branch = 'unknown';
  let sha = 'unknown';
  let dirty = false;
  try {
    branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    sha = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    dirty = execSync('git status --porcelain', { encoding: 'utf8' }).trim().length > 0;
  } catch {
    // Not a git repo or git not installed — fine for the harness.
  }
  return {
    runtime,
    os,
    arch: process.arch,
    timestamp: new Date().toISOString(),
    git: { branch, sha, dirty },
  };
}

function writeJson(output: BenchOutput, outDir: string): string {
  fs.mkdirSync(outDir, { recursive: true });
  const safeStamp = output.env.timestamp.replace(/[:.]/g, '-');
  const name = `${safeStamp}_${output.env.git.sha}${output.env.git.dirty ? '+dirty' : ''}_${output.env.git.branch.replace(/[^a-zA-Z0-9_-]/g, '-')}.json`;
  const p = path.join(outDir, name);
  fs.writeFileSync(p, JSON.stringify(output, null, 2));
  return p;
}

// ---------- Main ----------

function main(): void {
  const cli = parseCli(process.argv.slice(2));
  const env = collectEnv();
  printHeader(env);

  const results: ScenarioResult[] = [];
  for (const s of SCENARIOS) {
    if (!cli.scenarios.has(s.name)) continue;
    results.push(benchOne(s, cli));
  }

  printTable(results);

  let baseline: BenchOutput | null = null;
  if (cli.compare) {
    try {
      baseline = JSON.parse(fs.readFileSync(cli.compare, 'utf8'));
    } catch (e) {
      console.error(`Failed to load baseline ${cli.compare}: ${(e as Error).message}`);
    }
  }
  if (baseline) printDelta(baseline, results);

  const output: BenchOutput = { env, scenarios: results };
  const jsonPath = writeJson(output, cli.outDir);
  console.log('');
  console.log(`JSON written to ${jsonPath}`);
}

main();
