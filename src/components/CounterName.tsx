import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { MAX_NAME_LENGTH } from '../state/counterReducer';

interface CounterNameProps {
  name: string;
  onRename: (name: string) => void;
}

export default function CounterName({ name, onRename }: CounterNameProps) {
  const [draftName, setDraftName] = useState<string | null>(null);
  const isEditing = draftName !== null;

  const commit = () => {
    if (draftName === null) return;
    onRename(draftName);
    setDraftName(null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    commit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setDraftName(null);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="m-0">
        <input
          type="text"
          className="form-control form-control-lg counter-name-input text-center"
          aria-label="Counter name"
          value={draftName}
          maxLength={MAX_NAME_LENGTH}
          enterKeyHint="done"
          autoFocus
          onFocus={(event) => event.currentTarget.select()}
          onChange={(event) => setDraftName(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
        />
      </form>
    );
  }

  return (
    <button
      type="button"
      className="counter-name-button btn btn-link text-white text-decoration-none w-100 p-0"
      aria-label="Edit counter name"
      onClick={() => setDraftName(name)}
    >
      <h1 className="counter-name m-0 d-inline">{name}</h1>
      <i className="bi bi-pencil-fill counter-name-edit-icon ms-2" aria-hidden="true" />
    </button>
  );
}
