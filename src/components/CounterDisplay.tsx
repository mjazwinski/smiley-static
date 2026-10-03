interface CounterDisplayProps {
  count: number;
}

export default function CounterDisplay({ count }: CounterDisplayProps) {
  const toneClass = count < 0 ? 'text-danger' : count > 0 ? 'text-success' : 'text-body';

  return (
    <div className="counter-display flex-grow-1 d-flex align-items-center justify-content-center">
      <output role="status" aria-label="Count" aria-live="polite" className={`counter-value ${toneClass}`}>
        {count}
      </output>
    </div>
  );
}
