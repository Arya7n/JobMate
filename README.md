# JobMate

A Chrome extension that stores your professional information locally, helps you autofill job applications, and tracks what you have submitted.

V1 is local-first: profile data, resumes, and application history stay on your device. There is no backend, account, or analytics.

## Current status

**V1 complete** for local use:

- Professional profile editor with typed on-device storage
- Resume manager (metadata in `chrome.storage`, files in IndexedDB)
- Field detection + confidence-based autofill content script
- Application tracker and dashboard stats
- Quick Copy from the popup
- Privacy-focused settings

## Architecture

```
src/
├── entrypoints/        Popup, dashboard, background, content script
├── pages/              Dashboard views
├── components/ui/      Shared design system
├── lib/                Domain modules (storage, profile, resumes, detection, autofill, …)
├── navigation/         Dashboard hash routing
└── assets/             Global styles and design tokens
```

Business logic lives under `src/lib`. React components call typed helpers such as `getProfile`, `saveResumeFromFile`, and `getApplications` — never `chrome.storage` directly.

## Development

```bash
npm install
npm run dev
```

```bash
npm run compile   # TypeScript check
npm run test      # Unit tests
npm run build     # Production build → .output/chrome-mv3
```

### Autofill fixture

After loading the extension, open:

`chrome-extension://<extension-id>/fixture-application.html`

Or serve `public/fixture-application.html` and use Autofill from the popup / on-page panel.

## Load in Chrome

1. Run `npm install` and `npm run build`.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the `jobMate/.output/chrome-mv3` folder.

Pin JobMate from the puzzle-piece menu. The toolbar icon opens the popup. **Open Dashboard** (or Options) opens the full dashboard.

## Permissions

- `storage` — profile, resume metadata, applications, settings
- `tabs`, `scripting`, `activeTab` — popup ↔ page autofill messaging
- Host access to `http://*/*` and `https://*/*` — detect and fill application forms on career sites

Page contents and profile data never leave your device. Passwords are never filled.
