import { useEffect, useReducer } from 'react';
import { counterReducer } from '../state/counterReducer';
import { loadCounterState, saveCounterState } from '../state/storage';

export function useCounter() {
  const [state, dispatch] = useReducer(counterReducer, undefined, loadCounterState);

  useEffect(() => {
    saveCounterState(state);
  }, [state]);

  return {
    name: state.name,
    count: state.count,
    increment: () => dispatch({ type: 'increment' }),
    decrement: () => dispatch({ type: 'decrement' }),
    reset: () => dispatch({ type: 'reset' }),
    rename: (name: string) => dispatch({ type: 'rename', name }),
  };
}
