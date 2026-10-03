import { useEffect, useId, useRef } from 'react';

interface ConfirmResetDialogProps {
  counterName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmResetDialog({ counterName, onConfirm, onCancel }: ConfirmResetDialogProps) {
  const titleId = useId();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <>
      <div
        className="modal d-block"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.target === event.currentTarget && onCancel()}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id={titleId} className="modal-title fs-4">
                Reset counter?
              </h2>
            </div>
            <div className="modal-body fs-5">
              <strong>{counterName}</strong> will be set back to 0.
            </div>
            <div className="modal-footer flex-nowrap">
              <button
                ref={cancelButtonRef}
                type="button"
                className="btn btn-lg btn-outline-secondary flex-fill dialog-button"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button type="button" className="btn btn-lg btn-danger flex-fill dialog-button" onClick={onConfirm}>
                Yes, reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}
