import { describe, it, expect } from 'vitest';
import { matchesFilter } from '../js/gallery.js';

const men = { type: 'men', price: 2000 };
const women = { type: 'women', price: 800 };
const unisex = { type: 'unisex', price: 1500 };
const premium = { type: 'men', price: 4000 };

describe('matchesFilter', () => {
  it('all returns every product', () => {
    [men, women, unisex, premium].forEach(p => expect(matchesFilter(p, 'all')).toBe(true));
  });

  it('men includes men + unisex, excludes women', () => {
    expect(matchesFilter(men, 'men')).toBe(true);
    expect(matchesFilter(unisex, 'men')).toBe(true);
    expect(matchesFilter(women, 'men')).toBe(false);
  });

  it('women includes women + unisex, excludes men', () => {
    expect(matchesFilter(women, 'women')).toBe(true);
    expect(matchesFilter(unisex, 'women')).toBe(true);
    expect(matchesFilter(men, 'women')).toBe(false);
  });

  it('under-1k matches only < 1000', () => {
    expect(matchesFilter(women, 'under-1k')).toBe(true);
    expect(matchesFilter(unisex, 'under-1k')).toBe(false);
  });

  it('1k-2500 matches inclusive range', () => {
    expect(matchesFilter(men, '1k-2500')).toBe(true);
    expect(matchesFilter(unisex, '1k-2500')).toBe(true);
    expect(matchesFilter(premium, '1k-2500')).toBe(false);
  });

  it('premium matches > 2500', () => {
    expect(matchesFilter(premium, 'premium')).toBe(true);
    expect(matchesFilter(men, 'premium')).toBe(false);
  });
});
