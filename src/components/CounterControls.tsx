interface CounterControlsProps {
  onIncrease: () => void;
  onDecrease: () => void;
  onReset: () => void;
}

interface ControlButton {
  label: string;
  icon: string;
  variant: string;
  onClick: () => void;
}

export default function CounterControls({ onIncrease, onDecrease, onReset }: CounterControlsProps) {
  const buttons: ControlButton[] = [
    { label: 'Increase', icon: 'bi-emoji-smile', variant: 'btn-success', onClick: onIncrease },
    { label: 'Decrease', icon: 'bi-emoji-frown', variant: 'btn-warning', onClick: onDecrease },
    { label: 'Reset', icon: 'bi-lightning-charge-fill', variant: 'btn-danger counter-reset-button', onClick: onReset },
  ];

  return (
    <div className="counter-controls d-flex flex-column flex-sm-row gap-3">
      {buttons.map(({ label, icon, variant, onClick }) => (
        <button
          key={label}
          type="button"
          className={`counter-button btn btn-lg ${variant} flex-sm-fill`}
          aria-label={label}
          title={label}
          onClick={onClick}
        >
          <i className={`bi ${icon}`} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
