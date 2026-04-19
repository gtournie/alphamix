/**
 * Type declarations for the Emscripten-generated `gaddag.js` module. Kept
 * minimal — only the members we actually touch from TypeScript. Re-run
 * `bun run build` inside this directory to regenerate the `.js`/`.wasm`; the
 * surface below must then still match (`_convert_dawg_to_gaddag` signature,
 * heap views, allocator exports).
 */

export interface GaddagModule {
  HEAPU32: Uint32Array;
  _malloc(size: number): number;
  _free(ptr: number): void;
  _convert_dawg_to_gaddag(
    inputPtr: number,
    inLen: number,
    alphabetLen: number,
    inputConsumedPtr: number,
    outLenPtr: number
  ): number;
}

declare const factory: (moduleArg?: Partial<GaddagModule>) => Promise<GaddagModule>;
export default factory;
