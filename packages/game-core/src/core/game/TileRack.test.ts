import { describe, it, expect } from 'vitest';
import { TileRack } from './TileRack';


describe('TileRack', () => {
  it('should check if rack conatins letters that appear once', () => {
    const rackChars = 'ABCDEFG';

    expect(new TileRack(rackChars).remove('BDF')).toBe(true);
    expect(new TileRack(rackChars).remove('ABCDEFG')).toBe(true);
    expect(new TileRack(rackChars).remove('BDH')).toBe(false);
    expect(new TileRack(rackChars).remove('ABCDEFH')).toBe(false);
  });

  it('should check if the rack contains letters that may appear more than once', () => {
    const rackChars = 'ABABAAC';

    expect(new TileRack(rackChars).remove('A')).toBe(true);
    expect(new TileRack(rackChars).remove('AA')).toBe(true);
    expect(new TileRack(rackChars).remove('AAA')).toBe(true);
    expect(new TileRack(rackChars).remove('AAAA')).toBe(true);
    expect(new TileRack(rackChars).remove('AAAAA')).toBe(false);
    expect(new TileRack(rackChars).remove('AB')).toBe(true);
    expect(new TileRack(rackChars).remove('ABB')).toBe(true);
    expect(new TileRack(rackChars).remove('BB')).toBe(true);
    expect(new TileRack(rackChars).remove('BBB')).toBe(false);
    expect(new TileRack(rackChars).remove('CAABB')).toBe(true);
  });

  it('should check if the rack contains blank chars', () => {
    const rackChars = 'AB?BA?C';

    expect(new TileRack(rackChars).remove('z')).toBe(true);
    expect(new TileRack(rackChars).remove('AByBAvC')).toBe(true);
    expect(new TileRack(rackChars).remove('BbB')).toBe(true);
    expect(new TileRack(rackChars).remove('BbBb')).toBe(true);
    expect(new TileRack(rackChars).remove('ABbBbc')).toBe(false);
    expect(new TileRack(rackChars).remove('AcBzBv')).toBe(false);
  });
});