import { describe, it, expect } from 'vitest';
import { buildOrderLink, formatPKR } from '../js/whatsapp.js';

describe('buildOrderLink', () => {
  it('builds wa.me link with prefilled English order message', () => {
    const url = buildOrderLink({
      number: '923338726133',
      product: { brand: 'Burberry', name_en: 'Her EDT', price: 3499 },
      lang: 'en',
    });
    expect(url).toContain('https://wa.me/923338726133');
    expect(url).toContain('Burberry');
    expect(url).toContain('Her%20EDT');
    expect(url).toContain('3%2C499');
    expect(url).toContain('10ml');
  });

  it('builds wa.me link with Urdu message when lang=ur', () => {
    const url = buildOrderLink({
      number: '923338726133',
      product: { brand: 'Burberry', name_ur: 'ہر EDT', price: 3499 },
      lang: 'ur',
    });
    expect(url).toContain('https://wa.me/923338726133');
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('السلام');
    expect(decoded).toContain('ہر EDT');
  });

  it('escapes URL-unsafe characters', () => {
    const url = buildOrderLink({
      number: '923338726133',
      product: { brand: 'X & Y', name_en: 'A/B', price: 100 },
      lang: 'en',
    });
    expect(url).not.toContain(' ');
    expect(url).toContain('%26');
    expect(url).toContain('%2F');
  });
});

describe('formatPKR', () => {
  it('formats numbers with thousand separators', () => {
    expect(formatPKR(3499)).toBe('3,499');
    expect(formatPKR(459)).toBe('459');
    expect(formatPKR(45118)).toBe('45,118');
  });
});
