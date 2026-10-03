import { useState } from 'react';
import { useCounter } from './hooks/useCounter';
import CounterName from './components/CounterName';
import CounterDisplay from './components/CounterDisplay';
import CounterControls from './components/CounterControls';
import ConfirmResetDialog from './components/ConfirmResetDialog';

export default function App() {
  const { name, count, increment, decrement, reset, rename } = useCounter();
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const confirmReset = () => {
    reset();
    setIsConfirmingReset(false);
  };

  return (
    <div className="app-shell d-flex flex-column">
      <header className="app-header bg-dark text-white">
        <div className="app-column px-3 py-3">
          <CounterName name={name} onRename={rename} />
        </div>
      </header>

      <main className="app-column flex-grow-1 d-flex flex-column px-3">
        <CounterDisplay count={count} />
        <CounterControls
          onIncrease={increment}
          onDecrease={decrement}
          onReset={() => setIsConfirmingReset(true)}
        />
      </main>

      {isConfirmingReset && (
        <ConfirmResetDialog
          counterName={name}
          onConfirm={confirmReset}
          onCancel={() => setIsConfirmingReset(false)}
        />
      )}
    </div>
  );
}
