import { describe, it, expect } from 'vitest';
import { TileBag } from './TileBag';

describe('new empty TileBag', () => {
  it('should create a random bag', () => {
    const bag = new TileBag();
    expect(bag.length).toBeGreaterThan(0);
    expect(bag.content).toMatch(/^[A-Z\?]+$/);
  });

  it('should draw tiles in the correct order', () => {
    const bag = new TileBag();
    expect(bag.content).toBe(bag.draw(bag.content.length).join(''));

    const bag2 = new TileBag();
    const bag2Content = bag2.content;
    const drawnTiles = bag2.draw(3);
    expect(drawnTiles.length).toBe(3);
    expect(drawnTiles.join('')).toBe(bag2Content.slice(0, 3));
    const drawnTiles2 = bag2.draw(3);
    expect(drawnTiles2.length).toBe(3);
    expect(drawnTiles2.join('')).toBe(bag2Content.slice(3, 6));
  });

  it('should not draw more tiles than available', () => {
    const bag = new TileBag();
    const bagContent = bag.content;
    let tiles;
    let allTiles = [];
    while ((tiles = bag.draw()).length > 0) {
      allTiles.push(...tiles);
    }
    expect(allTiles.length).toBe(bagContent.length);
    expect(allTiles.join('')).toBe(bagContent);
  });
});

describe('TileBag based on originalBag and empty history', () => {
  it('should create a bag based on originalBag', () => {
    const originalBag = 'SODAQTSRDHEINBARMGNARIOKAPETZAGNIRRI?LSENEOJESEILOWEETEUSRTAIEOAFLUUCVEEOAUNLMHFEXUBM?PYDNILUTIEVACSTE';
    const bag = new TileBag(originalBag, '');
    expect(bag.length).toBe(originalBag.length);
    expect(bag.content).toBe(originalBag);
  });

  it('should draw tiles in the correct order', () => {
    const originalBag = 'H?JQIAEMEZANVBEIIHFFAALTPKYUMOMUDNSOUDEXERTICNCEIROEAUUWPSEALNEISLEOAIDTTIESEENRUASET?NLSLTOORARREVGBG';
    const bag = new TileBag(originalBag, '');
    expect(bag.length).toBe(originalBag.length);
    expect(bag.content).toBe(originalBag);
    let tiles;
    let allTiles = [];
    while ((tiles = bag.draw()).length > 0) {
      allTiles.push(...tiles);
    }
    expect(allTiles.join('')).toBe(originalBag);
  });
});

describe('TileBag based on originalBag and game history', () => {
  it('should create a bag based on history', () => {
    const originalBag = 'SODAQTSRDHEINBARMGNARIOKAPETZAGNIRRI?LSENEOJESEILOWEETEUSRTAIEOAFLUUCVEEOAUNLMHFEXUBM?PYDNILUTIEVACSTE';
    const history = '=SODAQTS=RDHEINB-77QAT:ARM|84NIBRD:GNARI!-94I'; // Last turn is in process (player hasn't draw yet)
    const bag = new TileBag(originalBag, history);
    expect(bag.length).toBe(originalBag.length - (7 + 7 + 3 + 5));
    expect(bag.content).toBe('OKAPETZAGNIRRI?LSENEOJESEILOWEETEUSRTAIEOAFLUUCVEEOAUNLMHFEXUBM?PYDNILUTIEVACSTE');
  });

  it('should create a bag based on history and have a change tile turn', () => {
    const originalBag = 'SODAQTSRDHEINBARMGNARIOKAPETZAGNIRRI?LSENEOJESEILOWEETEUSRTAIEOAFLUUCVEEOAUNLMHFEXUBM?PYDNILUTIEVACSTE';
    const history = '=SODAQTS=RDHEINB-77QAT:ARM|84NIBRD:GNARI!SOS';
    let bag = new TileBag(originalBag, history);
    expect(bag.length).toBe(originalBag.length - (7 + 7 + 3 + 5) + 3);

    // On change tile turn, shuffle is deterministic. There is no chance this test pass one day (unless you change something!)
    expect(bag.content === 'OKAPETZAGNIRRI?LSENEOJESEILOWEETEUSRTAIEOAFLUUCVEEOAUNLMHFEXUBM?PYDNILUTIEVACSTESOS').toBe(false);
    expect(bag.content === 'SOSOKAPETZAGNIRRI?LSENEOJESEILOWEETEUSRTAIEOAFLUUCVEEOAUNLMHFEXUBM?PYDNILUTIEVACSTE').toBe(false);
    expect(bag.content.indexOf('OKAPETZAGNIRRI?LSENEOJESEILOWEETEUSRTAIEOAFLUUCVEEOAUNLMHFEXUBM?PYDNILUTIEVACSTE') >= 0).toBe(false);
    expect(bag.draw(3).join('') === 'SOS').toBe(false);
    bag = new TileBag(originalBag, history);
    expect(bag.draw(3).join('') === 'OKA').toBe(false);
  });

  it('should create a bag based on history and have a change tile turn - shuffle must return the same bag content', () => {
    const originalBag = 'SODAQTSRDHEINBARMGNARIOKAPETZAGNIRRI?LSENEOJESEILOWEETEUSRTAIEOAFLUUCVEEOAUNLMHFEXUBM?PYDNILUTIEVACSTE';
    let history = '=SODAQTS=RDHEINB-77QAT:ARM|84NIBRD:GNARI!SOS';
    let bag = new TileBag(originalBag, history);
    expect(bag.content).toBe('OSENEOJESEILOWEETKEUSRTAIEOAFALUUCVEEOAUNLMHFEXUBM?PPYDNILUTIEVACSETESOSTZAGNIRRI?L');
    bag = new TileBag(originalBag, history);
    expect(bag.content).toBe('OSENEOJESEILOWEETKEUSRTAIEOAFALUUCVEEOAUNLMHFEXUBM?PPYDNILUTIEVACSETESOSTZAGNIRRI?L');

    history = '=SODAQTS=RDHEINB-77QAT:ARM|84NIBRD:GNARI!SOSARM';
    expect(new TileBag(originalBag, history).content).toBe(new TileBag(originalBag, history).content);
    expect(new TileBag(originalBag, history).draw(7).join('')).toBe(new TileBag(originalBag, history).draw(7).join(''));

    history = '=SODAQTS=RDHEINB-77QAT:ARM|84NIBRD:GNARI!SOSARM:OSENEO-94I!OOEE';
    expect(new TileBag(originalBag, history).content).toBe(new TileBag(originalBag, history).content);
    expect(new TileBag(originalBag, history).draw(7).join('')).toBe(new TileBag(originalBag, history).draw(7).join(''));
    expect(new TileBag(originalBag, history).draw(14).join('')).toBe('KESEILOWEETEAU');
  });

  // it('should draw tiles in the correct order', () => {
  //   const originalBag = 'H?JQIAEMEZANVBEIIHFFAALTPKYUMOMUDNSOUDEXERTICNCEIROEAUUWPSEALNEISLEOAIDTTIESEENRUASET?NLSLTOORARREVGBG';
  //   const bag = new TileBag(originalBag, '');
  //   expect(bag.length).toBe(originalBag.length);
  //   expect(bag.content).toBe(originalBag);
  //   let tiles;
  //   let allTiles = [];
  //   while ((tiles = bag.draw()).length > 0) {
  //     allTiles.push(...tiles);
  //   }
  //   expect(allTiles.join('')).toBe(originalHistory);
  // });
});
