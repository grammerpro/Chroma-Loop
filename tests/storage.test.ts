import { describe, it, expect, beforeEach } from 'vitest';
import { Storage } from '../src/storage';

describe('Storage', () => {
  let storage: Storage;

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    storage = new Storage();
  });

  it('should get and set strings', () => {
    storage.set('test', 'value');
    expect(storage.get('test')).toBe('value');
  });

  it('should get and set numbers', () => {
    storage.setNumber('score', 100);
    expect(storage.getNumber('score')).toBe(100);
  });

  it('should get and set booleans', () => {
    storage.setBoolean('muted', true);
    expect(storage.getBoolean('muted')).toBe(true);
  });

  it('should return default values', () => {
    expect(storage.getNumber('missing', 42)).toBe(42);
    expect(storage.getBoolean('missing', true)).toBe(true);
  });
});
