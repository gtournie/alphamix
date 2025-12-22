// import { describe, it, expect } from 'vitest';
// import { Board } from '@/core/game/Board';

// describe('Grid', () => {
//   it('should create an empty grid', () => {
//     const emptyGrid = Array(15).fill(null).map(() => Array(15).fill('.'));
//     const grid = new Board(emptyGrid);
//     expect(grid.grid.length).toBe(15);
//     expect(grid.grid[0].length).toBe(15);
//     expect(grid.grid[0][0].empty).toBe(true);
//   });

//   it('should solve a simple word', () => {
//     const grid = [
//       //12345678901234 
//       "               ", // 0
//       "           T V ", // 1
//       "          JOUES", // 2
//       "           N L ", // 3
//       "          AN A ", // 4
//       "       MOFLE TA", // 5
//       "    G     O   X", // 6
//       "   BADER  I   A", // 7
//       "    R WURMS   I", // 8
//       "  FADEE        ", // 9
//       "    E SALEE    ", // 10
//       "T ZOU  HIT     ", // 11
//       "I E R          ", // 12
//       "POKES          ", // 13
//       "E              ", // 14
//     ].map(line => line.split('').map(l => (l === ' ' ? Board.EMPTY_TILE : l)));

//     const gameGrid = new Board(grid);
//     const results = gameGrid.solve('BONJOUR');
//     expect(results.length).toBeGreaterThan(0);
//   });
// }); 