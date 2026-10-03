import { describe, expect, it } from 'vitest';
import {
  counterReducer,
  initialCounterState,
  MAX_NAME_LENGTH,
  type CounterState,
} from '../src/state/counterReducer';

const state = (overrides: Partial<CounterState> = {}): CounterState => ({
  ...initialCounterState,
  ...overrides,
});

describe('counterReducer', () => {
  it('increments the count', () => {
    expect(counterReducer(state({ count: 2 }), { type: 'increment' })).toEqual({
      name: 'My Counter',
      count: 3,
    });
  });

  it('decrements the count and can go negative', () => {
    const once = counterReducer(state(), { type: 'decrement' });
    expect(once.count).toBe(-1);
    expect(counterReducer(once, { type: 'decrement' }).count).toBe(-2);
  });

  it('does not mutate the previous state', () => {
    const before = state({ count: 5 });
    counterReducer(before, { type: 'increment' });
    expect(before).toEqual({ name: 'My Counter', count: 5 });
  });

  it('resets the count to 0 and keeps the name', () => {
    expect(counterReducer(state({ name: 'Cups', count: -7 }), { type: 'reset' })).toEqual({
      name: 'Cups',
      count: 0,
    });
  });

  it('returns the same reference when resetting an already-zero count', () => {
    const before = state();
    expect(counterReducer(before, { type: 'reset' })).toBe(before);
  });

  describe('rename', () => {
    it('trims whitespace', () => {
      expect(counterReducer(state(), { type: 'rename', name: '  Coffee  ' }).name).toBe('Coffee');
    });

    it(`truncates to ${MAX_NAME_LENGTH} characters`, () => {
      expect(MAX_NAME_LENGTH).toBe(40);
      const next = counterReducer(state(), { type: 'rename', name: 'x'.repeat(60) });
      expect(next.name).toBe('x'.repeat(MAX_NAME_LENGTH));
    });

    it('keeps the count when renaming', () => {
      expect(counterReducer(state({ count: 4 }), { type: 'rename', name: 'Tea' })).toEqual({
        name: 'Tea',
        count: 4,
      });
    });

    it.each(['', '   ', '\t\n'])('ignores empty/whitespace name %j', (name) => {
      const before = state({ name: 'Keep', count: 1 });
      expect(counterReducer(before, { type: 'rename', name })).toBe(before);
    });

    it('returns the same reference when the normalized name is unchanged', () => {
      const before = state({ name: 'Same' });
      expect(counterReducer(before, { type: 'rename', name: 'Same' })).toBe(before);
      expect(counterReducer(before, { type: 'rename', name: '  Same ' })).toBe(before);
    });
  });

  describe('safe-integer bounds', () => {
    it('does not increment past Number.MAX_SAFE_INTEGER', () => {
      const before = state({ count: Number.MAX_SAFE_INTEGER });
      expect(counterReducer(before, { type: 'increment' })).toBe(before);
    });

    it('does not decrement past Number.MIN_SAFE_INTEGER', () => {
      const before = state({ count: Number.MIN_SAFE_INTEGER });
      expect(counterReducer(before, { type: 'decrement' })).toBe(before);
    });

    it('can still reach the bounds from one step away', () => {
      expect(
        counterReducer(state({ count: Number.MAX_SAFE_INTEGER - 1 }), { type: 'increment' }).count,
      ).toBe(Number.MAX_SAFE_INTEGER);
      expect(
        counterReducer(state({ count: Number.MIN_SAFE_INTEGER + 1 }), { type: 'decrement' }).count,
      ).toBe(Number.MIN_SAFE_INTEGER);
    });
  });
});
