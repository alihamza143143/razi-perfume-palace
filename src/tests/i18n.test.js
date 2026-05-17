import { describe, it, expect, beforeEach } from 'vitest';
import { getLang, setLang } from '../js/i18n.js';

describe('i18n storage', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  });

  it('defaults to en if nothing stored', () => {
    expect(getLang()).toBe('en');
  });

  it('persists set lang to localStorage', () => {
    setLang('ur');
    expect(localStorage.getItem('razi-locale')).toBe('ur');
    expect(getLang()).toBe('ur');
  });

  it('setting lang updates <html lang> and dir', () => {
    setLang('ur');
    expect(document.documentElement.lang).toBe('ur');
    expect(document.documentElement.dir).toBe('rtl');
    setLang('en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });
});
