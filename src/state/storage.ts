import { initialCounterState, normalizeName, type CounterState } from './counterReducer';

export const STORAGE_KEY = 'smiley-counter:v1';

function isValidState(value: unknown): value is CounterState {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.name === 'string' &&
    normalizeName(candidate.name) !== '' &&
    Number.isSafeInteger(candidate.count)
  );
}

export function loadCounterState(): CounterState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return initialCounterState;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidState(parsed)) return initialCounterState;
    return { name: normalizeName(parsed.name), count: parsed.count };
  } catch {
    return initialCounterState;
  }
}

export function saveCounterState(state: CounterState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be full or blocked (e.g. private mode); the app keeps working in memory.
  }
}
