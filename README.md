# JobMate

A Chrome extension that stores your professional information locally, helps you autofill job applications, and tracks what you have submitted.

V1 is local-first: profile data, resumes, and application history stay on your device. There is no backend, account, or analytics.

## Current status

**Phase 2** is in place: typed local storage, a full profile editor, and save/load on-device. Resume files, autofill, and application tracking are not implemented yet.

## Architecture

```
src/
├── entrypoints/        Popup, dashboard page, background service worker
├── pages/              Dashboard views (Overview, Profile, Resumes, Applications, Settings)
├── components/ui/      Shared design system
├── lib/                Domain modules (storage, profile, resumes, applications, autofill, …)
├── navigation/         Dashboard hash routing
└── assets/             Global styles and design tokens
```

Business logic lives under `src/lib`. React components render UI and call typed helpers. Profile read/write goes through `getProfile` / `saveProfile` — never `chrome.storage` directly.

## Development

```bash
npm install
npm run dev
```

`npm run dev` builds the extension into `.output/chrome-mv3` and can open a Chrome instance with JobMate loaded.

```bash
npm run compile   # TypeScript check
npm run test      # Profile/storage unit tests
npm run build     # Production build → .output/chrome-mv3
```

## Load in Chrome

1. Run `npm install` and `npm run build`.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the `jobMate/.output/chrome-mv3` folder.

Pin JobMate from the puzzle-piece menu. The toolbar icon opens the popup. **Open Dashboard** (or the extension’s Options page) opens the full dashboard in a tab.

## Permissions

The extension requests only `storage`. Host access is not requested until autofill ships.
