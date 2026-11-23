# Pocket Official

Pocket is a vanilla HTML, CSS, and JavaScript expense tracker. It supports accounts, transactions, budgets, savings goals, reports, categories, Firebase synchronization, PWA installation, and local backups.

## Architecture

The project uses feature-based presentation modules plus a lightweight clean architecture:

```text
src/
  app/                    Application entry point, router, component loader
  core/                   Constants, utilities, helpers, configuration
  domain/                 Entities, repository contracts, use cases
  data/                   Repository implementations and local storage
  infrastructure/         Firebase, Chart.js, and browser integrations
  presentation/
    common/               Reusable navigation, FAB, forms, modals, cards
    dashboard/
    transactions/
    cashback/
    recurring/
    accounts/
    budgets/
    goals/
    shopping-lists/
    reports/
    categories/
    profile/
    settings/
    onboarding/
```

Presentation code owns UI and interactions. Domain code is framework-independent. Data code owns persistence. Infrastructure contains external integrations. The app layer initializes and coordinates the modules.

### Runtime compatibility

`src/app/pocket-app-legacy.js` is the compatibility implementation extracted from the original monolithic application. It preserves the existing feature behavior and `pera.v1` local-storage key while the modular boundaries are introduced incrementally. `src/app/app.js` initializes the Chart.js and Firebase integrations, enhancement scripts, router, and compatibility runtime.

The legacy renderer will be split into feature-owned renderers and domain services in future incremental migrations. It is intentionally kept intact for this refactor to avoid feature or data loss.

## Adding a screen

1. Create `src/presentation/<feature>/`.
2. Add `<feature>.html`, `<feature>.css`, and `<feature>.js`.
3. Export a `feature` descriptor and `initializeFeature()` from the JavaScript module.
4. Register the view in `src/app/router.js`.
5. Add the HTML fragment and static assets to the service worker cache when needed.

Example:

```js
export const feature = {
  id: 'example',
  title: 'Example',
  html: 'example.html',
  css: 'example.css',
};

export function initializeFeature() {
  document.documentElement.dataset.feature = feature.id;
}
```

## Adding a reusable component

Put components used by two or more screens under `src/presentation/common/<component>/`. Each component should have:

- `component.html` for markup, where markup is reusable
- `component.css` for component styles
- `component.js` for explicit initialization and cleanup

Initialize components through `createComponentLoader()` in `src/app/component-loader.js`. Screen-only components belong in that screen directory. Components must remove listeners and timers during cleanup when they are destroyed or replaced.

## Navigation

The bottom navigation is a shared component at `src/presentation/common/navigation/navbar.html`. It posts a `pocket-navbar-navigate` message to the parent page. The existing Pocket renderer handles route state and browser history. The ES-module router in `src/app/router.js` coordinates feature view changes.

## Data and Firebase

The local data key remains `pera.v1`. A backup/replacement is cleaned and normalized before it is loaded. Firebase synchronization is isolated in `src/infrastructure/firebase/firebase-sync.js`.

The local-storage data source, repository contract, and repository implementation live in `src/data/storage`, `src/domain/repositories`, and `src/data/repositories`.

## Development

Serve the repository with any static server from the repository root. ES modules and Firebase imports require HTTP or HTTPS; opening `index.html` with `file://` is not supported for the full modular runtime.

```powershell
python -m http.server 8080
```

Open `http://localhost:8080`.

## Verification

Before deployment:

1. Confirm all navigation views render.
2. Record, edit, delete, and transfer transactions.
3. Add accounts, budgets, goals, categories, and shopping lists.
4. Refresh and confirm `pera.v1` persists.
5. Test theme and date-format settings.
6. Test report filters and Chart.js rendering.
7. Test backup export/import.
8. Test Firebase sign-in and synchronization if Firebase is configured.
9. Reload in an offline browser session and confirm PWA assets are available.
