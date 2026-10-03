export interface CounterState {
  name: string;
  count: number;
}

export type CounterAction =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'rename'; name: string };

export const DEFAULT_NAME = 'My Counter';
export const MAX_NAME_LENGTH = 40;

export const initialCounterState: CounterState = { name: DEFAULT_NAME, count: 0 };

export function normalizeName(rawName: string): string {
  return rawName.trim().slice(0, MAX_NAME_LENGTH);
}

export function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'increment':
      return state.count >= Number.MAX_SAFE_INTEGER ? state : { ...state, count: state.count + 1 };
    case 'decrement':
      return state.count <= Number.MIN_SAFE_INTEGER ? state : { ...state, count: state.count - 1 };
    case 'reset':
      return state.count === 0 ? state : { ...state, count: 0 };
    case 'rename': {
      const name = normalizeName(action.name);
      return name === '' || name === state.name ? state : { ...state, name };
    }
  }
}
