import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';

const STORAGE_KEY = 'smiley-counter:v1';

function renderApp() {
  const user = userEvent.setup();
  const utils = render(<App />);
  return { user, ...utils };
}

const count = () => screen.getByRole('status', { name: 'Count' });
const heading = () => screen.getByRole('heading', { level: 1 });
const editNameButton = () => screen.getByRole('button', { name: 'Edit counter name' });
const nameInput = () => screen.getByRole('textbox', { name: 'Counter name' });
const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');

describe('App', () => {
  describe('default render', () => {
    it('shows the default name and a zero count', () => {
      renderApp();
      expect(heading()).toHaveTextContent(/^My Counter$/);
      expect(editNameButton()).toContainElement(heading());
      expect(count()).toHaveTextContent(/^0$/);
    });

    it('renders the three control buttons and no dialog', () => {
      renderApp();
      expect(screen.getByRole('button', { name: 'Increase' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Decrease' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('increase / decrease', () => {
    it('increases the count', async () => {
      const { user } = renderApp();
      await user.click(screen.getByRole('button', { name: 'Increase' }));
      await user.click(screen.getByRole('button', { name: 'Increase' }));
      expect(count()).toHaveTextContent(/^2$/);
    });

    it('decreases the count below zero with a hyphen-minus', async () => {
      const { user } = renderApp();
      const decrease = screen.getByRole('button', { name: 'Decrease' });
      await user.click(decrease);
      await user.click(decrease);
      await user.click(decrease);
      expect(count().textContent?.trim()).toBe('-3');
    });
  });

  describe('reset flow', () => {
    async function openResetDialog() {
      const { user } = renderApp();
      const increase = screen.getByRole('button', { name: 'Increase' });
      await user.click(increase);
      await user.click(increase);
      await user.click(increase);
      expect(count()).toHaveTextContent(/^3$/);
      await user.click(screen.getByRole('button', { name: 'Reset' }));
      return { user, dialog: screen.getByRole('dialog') };
    }

    it('opens an accessible confirmation dialog', async () => {
      const { dialog } = await openResetDialog();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(within(dialog).getByRole('heading', { name: 'Reset counter?' })).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Yes, reset' })).toBeInTheDocument();
    });

    it('resets to 0 and closes when confirmed', async () => {
      const { user, dialog } = await openResetDialog();
      await user.click(within(dialog).getByRole('button', { name: 'Yes, reset' }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(count()).toHaveTextContent(/^0$/);
    });

    it('keeps the count and closes when cancelled', async () => {
      const { user, dialog } = await openResetDialog();
      await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(count()).toHaveTextContent(/^3$/);
    });

    it('keeps the count and closes on Escape', async () => {
      const { user } = await openResetDialog();
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(count()).toHaveTextContent(/^3$/);
    });
  });

  describe('rename', () => {
    it('shows a focused, prefilled input with maxLength 40 when editing', async () => {
      const { user } = renderApp();
      await user.click(editNameButton());
      const input = nameInput();
      expect(input).toHaveValue('My Counter');
      expect(input).toHaveFocus();
      expect(input).toHaveAttribute('maxLength', '40');
      expect(screen.queryByRole('button', { name: 'Edit counter name' })).not.toBeInTheDocument();
    });

    it('commits on Enter', async () => {
      const { user } = renderApp();
      await user.click(editNameButton());
      await user.clear(nameInput());
      await user.type(nameInput(), 'Coffee cups{Enter}');
      expect(screen.queryByRole('textbox', { name: 'Counter name' })).not.toBeInTheDocument();
      expect(heading()).toHaveTextContent(/^Coffee cups$/);
    });

    it('commits on blur', async () => {
      const { user } = renderApp();
      await user.click(editNameButton());
      await user.clear(nameInput());
      await user.type(nameInput(), 'Push-ups');
      await user.click(screen.getByRole('status', { name: 'Count' }));
      expect(screen.queryByRole('textbox', { name: 'Counter name' })).not.toBeInTheDocument();
      expect(heading()).toHaveTextContent(/^Push-ups$/);
    });

    it('cancels on Escape and restores the old name', async () => {
      const { user } = renderApp();
      await user.click(editNameButton());
      await user.clear(nameInput());
      await user.type(nameInput(), 'Discarded');
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('textbox', { name: 'Counter name' })).not.toBeInTheDocument();
      expect(heading()).toHaveTextContent(/^My Counter$/);
    });

    it.each([
      ['empty', ''],
      ['whitespace', '   '],
    ])('keeps the previous name when input is %s', async (_label, text) => {
      const { user } = renderApp();
      await user.click(editNameButton());
      await user.clear(nameInput());
      if (text) await user.type(nameInput(), text);
      await user.keyboard('{Enter}');
      expect(screen.queryByRole('textbox', { name: 'Counter name' })).not.toBeInTheDocument();
      expect(heading()).toHaveTextContent(/^My Counter$/);
    });
  });

  describe('persistence', () => {
    it('loads pre-seeded state from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: 'Saved', count: -7 }));
      renderApp();
      expect(heading()).toHaveTextContent(/^Saved$/);
      expect(count().textContent?.trim()).toBe('-7');
    });

    it('persists changes to localStorage', async () => {
      const { user } = renderApp();
      await user.click(screen.getByRole('button', { name: 'Increase' }));
      await user.click(screen.getByRole('button', { name: 'Increase' }));
      await user.click(editNameButton());
      await user.clear(nameInput());
      await user.type(nameInput(), 'Water{Enter}');
      expect(stored()).toEqual({ name: 'Water', count: 2 });

      await user.click(screen.getByRole('button', { name: 'Reset' }));
      await user.click(screen.getByRole('button', { name: 'Yes, reset' }));
      expect(stored()).toEqual({ name: 'Water', count: 0 });
    });

    it('survives an unmount and re-render', async () => {
      const { user, unmount } = renderApp();
      const decrease = screen.getByRole('button', { name: 'Decrease' });
      await user.click(decrease);
      await user.click(decrease);
      await user.click(editNameButton());
      await user.clear(nameInput());
      await user.type(nameInput(), 'Reloaded{Enter}');
      unmount();

      renderApp();
      expect(heading()).toHaveTextContent(/^Reloaded$/);
      expect(count().textContent?.trim()).toBe('-2');
    });
  });
});
