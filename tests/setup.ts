import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Node 25+ ships its own (non-functional without --localstorage-file) Web Storage globals,
// which shadow jsdom's. Point the globals back at jsdom's real Storage instances.
const jsdomWindow = (globalThis as { jsdom?: { window: Window } }).jsdom?.window;
if (jsdomWindow) {
  for (const key of ['localStorage', 'sessionStorage'] as const) {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      enumerable: true,
      get: () => jsdomWindow[key],
    });
  }
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
