import { TILE_BAG_NEW_CONTENT, TILE_RACK_SIZE } from "./const";
import { History } from "./History";


export class TileBag {
  private bag: string[];

  // constructor(bag: string | string[] | null = null) {
  //   this.bag = bag ? (typeof bag === 'string' ? bag.split('') : bag) : TileBag.shuffle(TILE_BAG_NEW_CONTENT.slice(0));
  // }

  constructor(originalBag: string | null = null, gameHistory: string = '', forceShuffle = false) {
    if (originalBag) {
      let removeFromBag = '';
      let putBackToBag = '';
      new History(gameHistory).forEach(entry => {
        if (entry.isChangeTilesTurn) {
          putBackToBag += entry.chars;
        }
        removeFromBag += entry.drawn;
      });
      this.bag = originalBag.split('');
      for (let i = 0, len = removeFromBag.length; i < len; ++i) {
        const char = removeFromBag.charAt(i);
        const index = this.bag.indexOf(char);
        if (index < 0) throw new Error('// TODO');
        this.bag.splice(index, 1);
      }
      if (putBackToBag) {
        this.bag.push(...putBackToBag.split(''));
      }
      if (putBackToBag || forceShuffle) {
        // With the same bag and history, letters should always be drawn in the same order.
        // It means if you replay the same game (meaning with the same bag) and 
        // a player change exactly the same tiles as he did last time, he'll also
        // draw the same tiles. This is the behavior expected, as we want here
        // to replay the same game. The tiles should then get out in the same order if
        // you play exactly the same things as before.
        this.deterministicShuffle(putBackToBag);
      }
    } else {
      this.bag = TILE_BAG_NEW_CONTENT.slice(0);
      this.shuffle();
    }
  }

  get length() {
    return this.bag.length;
  }

  get isEmpty() {
    return this.bag.length === 0;
  }

  get content() {
    return this.bag.join('');
  }

  draw(count = TILE_RACK_SIZE) {
    return this.bag.splice(0, count);
  }

  shuffle() {
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
    }
  }

  deterministicShuffle(key: string) {
    this.bag = this.bag
      .map((item, index) => [item, this.simpleStringHash((index.toString(16) + item + key).toUpperCase())])
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(h => h[0]);
  }

  private simpleStringHash(str: string): string {
    let hash = 0;
    let result = "";
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
      result += Math.abs(hash).toString(16); // hexadécimal
    }
    return result;
  }
}