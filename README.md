# Smiley Counter

Smiley Counter is a small, mobile-first web app for counting smileys, or anything else you want to keep a running tally of. Every happy moment gets a tap on the smile button, every sad one a tap on the sad face, and the score is always one glance away on your phone.

It is a pure single-page app built with React, TypeScript and Bootstrap 5. There is no backend: the counter lives entirely in your browser's `localStorage`.

## Features

- **One counter with an editable name.** The name sits at the top of the screen. Tap it, type a new name, then press Enter to save or Escape to cancel.
- **Count smileys up and down.**
  - 🙂 Smile button (green) adds one.
  - 🙁 Sad face button (amber) takes one away. The count can go below zero.
  - ⚡ Lightning button (red) resets the count to zero after you confirm.
- **Built for phones.** The buttons are large and easy to tap on 6–8 inch screens. They stack vertically when the phone is held upright and line up in a row in landscape or on larger screens.
- **Remembers your count.** The name and count are saved automatically and are still there after you close or reload the page.

## Running the app locally

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19 or newer (22 LTS recommended), which includes npm.

### Steps

1. Clone the repository and open the project folder:

   ```bash
   git clone <repository-url>
   cd smiley-static
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser.

### Trying it on your phone

Start the dev server so it is reachable from your local network:

```bash
npm run dev -- --host
```

Vite prints a `Network` address such as `http://192.168.1.20:5173`. Open that address on a phone connected to the same Wi-Fi network.

To preview the phone layout on a computer instead, open your browser's developer tools and turn on device emulation (Ctrl+Shift+M in Chrome and Edge).

## Other commands

| Command | What it does |
| --- | --- |
| `npm test` | Runs the unit and component tests (Vitest). |
| `npm run build` | Type-checks the code and builds the static site into `dist/`. |
| `npm run preview` | Serves the production build locally at http://localhost:4173. |

## Deploying

`npm run build` produces a fully static site in `dist/`. Asset paths are relative, so the folder can be uploaded as-is to any static host (GitHub Pages, Netlify, Azure Static Web Apps, or a plain web server), including under a sub-path.

## Project structure

```text
src/
├─ App.tsx                 # Page layout: name, count, buttons, reset dialog
├─ components/             # CounterName, CounterDisplay, CounterControls, ConfirmResetDialog
├─ hooks/useCounter.ts     # Counter state wired to localStorage
├─ state/                  # Counter logic (reducer) and localStorage load/save
└─ styles/app.css          # Mobile-focused styling on top of Bootstrap
tests/                     # Vitest + React Testing Library tests
```
