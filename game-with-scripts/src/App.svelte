<script lang="ts">
  import { Board } from "@/core/game/Board";
  // const randomGrid = [
  //   //12345678901234
  //   "               ", // 0
  //   "           T V ", // 1
  //   "          JOUES", // 2
  //   "           N L ", // 3
  //   "          AN A ", // 4
  //   "       MOFLE TA", // 5
  //   "    G     O   X", // 6
  //   "   BADER  I   A", // 7
  //   "    R WURMS   I", // 8
  //   "  FADEE        ", // 9
  //   "    E SALEE    ", // 10
  //   "T ZOU  HIT     ", // 11
  //   "I E R          ", // 12
  //   "POKES          ", // 13
  //   "E              ", // 14
  // ].map((line) => line.split("").map((l) => (l === " " ? Board.EMPTY_TILE : l)));

  const randomGrid = [
    //12345678901234
    " NOLITION      ", // 0
    " IMINE B       ", // 1
    "       S       ", // 2
    "    P  E LUMA F", // 3
    "    ADEQUATE  O", // 4
    "    R  U      X", // 5
    "    T HE      E", // 6
    "   VIRUS      E", // 7
    "   R  T  BOWALS", // 8
    " V A  T  R     ", // 9
    " O CA E  A     ", // 10
    " C SUD P M     ", // 11
    " E   EOLIENNE  ", // 12
    " R GOY A Z     ", // 13
    "GIRON  F       ", // 14
  ].map((line) => line.split("").map((l) => (l === " " ? Board.EMPTY_TILE : l)));

  let grid = new Board(randomGrid);
  // console.time("solve");
  // grid.solve("PTBYE??")
  // grid.solve("PTBYE??")
  const start = performance.now();
  const results = grid.solve("IELUKTJ");
  const end = performance.now();
  let solving = `solve took ${end - start} milliseconds`;
  console.log(results.sort((a, b) => b.score - a.score).slice(0, 5));
  // console.timeEnd("solve");
  console.time("isGridValid");
  console.log(grid.isValid());
  console.timeEnd("isGridValid");

  grid.displayGrid(grid.grid);

  console.time("checkLetters");
  console.log(grid.checkLetters([
    { char: "B", x: 13, y: 8 },
    { char: "i", x: 13, y: 9 },
    { char: "o", x: 13, y: 10 },
    { char: "T", x: 13, y: 11 },
    { char: "Y", x: 13, y: 12 },
    { char: "P", x: 13, y: 13 },
    { char: "E", x: 13, y: 14 },
  ]));
  console.timeEnd("checkLetters");

</script>

<main class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Scrabble Game</h1>
  <p>{solving}</p>
  <!-- Le contenu du jeu sera ajouté ici -->
</main>

<style>
  /* Les styles spécifiques au composant seront ajoutés ici */
</style>
