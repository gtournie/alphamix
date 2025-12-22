import { History } from 'game-core/src/core/game/History';
import { services } from './src/domain/services';
import { TILE_BAG_NEW_CONTENT, TILE_DISTRIBUTION } from 'game-core/src/core/game/const';
import { Board } from 'game-core/src/core/game/Board';

(async () => {
  // await services.gameService.createGame('e74852f2-0161-45ff-abf5-9516a685397e', { userCount: 2 });
  // console.log('voilà !');

  // let history = '-73PESTES-67JEANS|44DEMRDaT-51HALZ|0APIFERET-B0LENIIVE|97FLGME-0BIQUE|70TYROiEN|19XI|1CUEL|22KAWS|13BAN|7BECOUAIS-59B|91USNT|14UN|9AHORA-C8ART|11RAM-E3LOUCDE-D5VOIE'
  // let playedTiles = ['', ''];

  // new History(history, 2, 0).forEach((entry, userIndex) => {
  //   playedTiles[userIndex] += entry.chars.replace(/[a-z]/g, '?');
  // })

  // let tileBag = '';
  // let willDraw: (null | number)[] = [7, 7];
  // new History(history, 2, 0).forEach((entry, userIndex, index) => {
  //   const len = entry.chars.length;
  //   if (willDraw[userIndex] !== null) {
  //     tileBag += playedTiles[userIndex].slice(0, willDraw[userIndex]);
  //     playedTiles[userIndex] = playedTiles[userIndex].slice(willDraw[userIndex])
  //   }
  //   willDraw[userIndex] = len;
  // });
  // [0, 1].forEach(userIndex => {
  //   if (willDraw[userIndex] !== null) {
  //     tileBag += playedTiles[userIndex].slice(0, willDraw[userIndex]);
  //     playedTiles[userIndex] = playedTiles[userIndex].slice(willDraw[userIndex])
  //   }
  // });

  // let full = TILE_BAG_NEW_CONTENT.slice(0);
  // tileBag.split('').forEach(c => full.splice(full.indexOf(c), 1));
  // tileBag += full.join('');

  // console.log(tileBag, tileBag.length, playedTiles[0].length + playedTiles[1].length)

  // PESTESDJEANSHAEMRD?TLZLENPIFERETIIVEFLGMETYIQUEXIKRO?ENAWSEUELBANBCOUNAUAISRTLUSNTHOROARAMUCVOIEDEOGIA

  // let gameUserIds = ['e74852f2-0161-45ff-abf5-9516a685397e', 'f0f3b0ac-76d3-499e-907b-3ea04025a1a0'];
  // const entries = [
  //   '-73PESTES',
  //   '-67JEANS',
  //   '|44DEMRDaT',
  //   '-51HALZ',
  //   '|0APIFERET',
  //   '-B0LENIIVE',
  //   '|97FLGME',
  //   '-0BIQUE',
  //   '|70TYROiEN',
  //   '|19XI',
  //   '|1CUEL',
  //   '|22KAWS',
  //   '|13BAN',
  //   '|7BECOUAIS',
  //   '-59B',
  //   '|91USNT',
  //   '|14UN',
  //   '|9AHORA',
  //   '-C8ART',
  //   '|11RAM',
  //   '-E3LOUCDE',
  //   '-D5VOIE',
  //   '-95O'
  // ];

  // let index = 0;
  // for (let entry of entries) {
  //   await services.gameService.playTurn(gameUserIds[index % 2], 'e3a1c290-c04d-429d-b3ae-413d11cca5e7', entry);
  //   ++index;
  // }

  const history = '=PESTESD=JEANSHA-73PESTES:EMRD?T-67JEANS:LZLEN|44DEMRDaT:PIFERET-51HALZ:IIVE|0APIFERET:FLGMETY-B0LENIIVE:IQUEXIK|97FLGME:RO?EN-0BIQUE:AWSE|70TYROiEN:UELBANB|19XI:CO|1CUEL:UNA|22KAWS:UAIS|13BAN:RTL|7BECOUAIS:USNTHOR-59B:O|91USNT:ARAM|14UN:UC|9AHORA:VOIE-C8ART:DEO|11RAM:GIA-E3LOUCDE-D5VOIE-95O';
  // let draw = '';
  // new History(history).forEach(entry => (draw += entry.drawn));

  // console.log(draw, draw.length, 'PESTESDJEANSHAEMRD?TLZLENPIFERETIIVEFLGMETYIQUEXIKRO?ENAWSEUELBANBCOUNAUAISRTLUSNTHOROARAMUCVOIEDEAGIO'.length);
  const b = Board.buildFromHistory(history);
  b.displayGrid(b.hGrid);
})();
