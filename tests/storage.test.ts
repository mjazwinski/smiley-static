import { afterEach, describe, expect, it, vi } from 'vitest';
import { initialCounterState } from '../src/state/counterReducer';
import { loadCounterState, saveCounterState, STORAGE_KEY } from '../src/state/storage';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('STORAGE_KEY', () => {
  it('is versioned', () => {
    expect(STORAGE_KEY).toBe('smiley-counter:v1');
  });
});

describe('loadCounterState', () => {
  it('returns the initial state when nothing is stored', () => {
    expect(loadCounterState()).toEqual(initialCounterState);
  });

  it('returns the initial state when JSON is corrupt', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(loadCounterState()).toEqual(initialCounterState);
  });

  it.each([
    ['null', null],
    ['a number', 42],
    ['an array', []],
    ['name not a string', { name: 5, count: 1 }],
    ['missing name', { count: 1 }],
    ['empty name', { name: '', count: 1 }],
    ['whitespace name', { name: '   ', count: 1 }],
    ['float count', { name: 'A', count: 1.5 }],
    ['string count', { name: 'A', count: '3' }],
    ['missing count', { name: 'A' }],
    ['unsafe integer count', { name: 'A', count: Number.MAX_SAFE_INTEGER + 1 }],
  ])('returns the initial state when shape is wrong (%s)', (_label, value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    expect(loadCounterState()).toEqual(initialCounterState);
  });

  it('returns the initial state when count is NaN', () => {
    localStorage.setItem(STORAGE_KEY, '{"name":"A","count":NaN}');
    expect(loadCounterState()).toEqual(initialCounterState);
  });

  it('loads a valid saved state', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: 'Coffee', count: 12 }));
    expect(loadCounterState()).toEqual({ name: 'Coffee', count: 12 });
  });

  it('loads a negative count', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: 'Debt', count: -3 }));
    expect(loadCounterState()).toEqual({ name: 'Debt', count: -3 });
  });

  it('normalizes the stored name', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: `  ${'y'.repeat(50)} `, count: 0 }));
    expect(loadCounterState().name).toBe('y'.repeat(40));
  });

  it('does not throw when localStorage.getItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => loadCounterState()).not.toThrow();
    expect(loadCounterState()).toEqual(initialCounterState);
    expect(spy).toHaveBeenCalled();
  });
});

describe('saveCounterState', () => {
  it('writes JSON under STORAGE_KEY', () => {
    saveCounterState({ name: 'Tea', count: -2 });
    expect(JSON.parse(localStorage.getItem('smiley-counter:v1')!)).toEqual({ name: 'Tea', count: -2 });
  });

  it('round-trips with loadCounterState', () => {
    saveCounterState({ name: 'Round', count: 99 });
    expect(loadCounterState()).toEqual({ name: 'Round', count: 99 });
  });

  it('does not throw when localStorage.setItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => saveCounterState({ name: 'X', count: 1 })).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });
});
