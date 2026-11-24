# Pocket Official — Mandatory Architecture Rules

These instructions apply to ALL development tasks, including new features, enhancements, bug fixes, refactoring, and UI modifications.

## 1. Feature-Based Code Organization (MANDATORY)

Follow the project's feature-based Clean Architecture.

All page-specific presentation code MUST belong to its respective feature directory under:

`src/presentation/{feature-name}/`

Each feature owns its:
- HTML markup and templates.
- CSS styles, animations, and responsive layouts.
- JavaScript behavior, rendering, and event handlers.
- Feature-specific UI components.
- Feature-specific interactions and presentation logic.

Example:

```text
src/presentation/
├── dashboard/
│   ├── dashboard.html
│   ├── dashboard.css
│   ├── dashboard.js
│   └── components/
│
├── transactions/
│   ├── transactions.html
│   ├── transactions.css
│   ├── transactions.js
│   └── components/
│
└── accounts/
    ├── accounts.html
    ├── accounts.css
    ├── accounts.js
    └── components/
```

Apply this organization consistently to every screen in the application.

## 2. Shared Components

All UI components reused by two or more screens MUST be placed inside:

`src/presentation/common/`

Examples:
- Navigation bars
- Buttons and FABs
- Cards
- Dropdowns
- Modals
- Icons
- Typography
- Forms and input fields
- Scrollbars
- Badges
- Loading indicators
- Other reusable UI elements

Organize shared components into logical subdirectories.

Do not duplicate shared components across feature directories.

If an existing feature-specific component becomes shared, extract it into the common directory and update all references.

## 3. Strict Separation of Responsibilities

NEVER introduce page-specific markup, styling, or behavior into global application files.

Avoid placing feature-specific code inside:
- `index.html`
- `src/app/app.js`
- `src/app/app.css`
- `src/app/router.js`
- Other global application files.

These files must remain focused on application-wide responsibilities such as initialization, routing, global styles, and component coordination.

Exceptions are permitted only for genuinely application-wide functionality.

## 4. Mandatory Rules for Every Modification

Before implementing any change:

1. Identify the affected feature or screen.
2. Inspect its existing presentation directory.
3. Identify whether the affected component is feature-specific or shared.
4. Modify the appropriate existing HTML, CSS, and JavaScript files.
5. Create new files only when necessary.
6. Update imports, exports, dependencies, and component references.
7. Ensure the change does not introduce duplicated implementations.

**Never place page-specific code in a centralized file merely because it is easier or faster.**

## 5. Progressive Refactoring

When modifying existing code that violates this architecture:

- Move page-specific HTML into its corresponding feature directory.
- Move page-specific CSS into its corresponding feature directory.
- Move page-specific JavaScript into its corresponding feature directory.
- Extract reusable components into `presentation/common/`.
- Remove obsolete implementations after verifying successful migration.
- Update all affected references.

Do not leave newly modified features dependent on unnecessary monolithic implementations.

Existing code should be progressively migrated whenever it is encountered during development. Do not perform unrelated, large-scale migrations unless explicitly requested.

## 6. Clean Architecture Principles

Maintain separation between:

- `presentation/` — UI, rendering, and interactions.
- `domain/` — Business entities, rules, and use cases.
- `data/` — Repositories, data sources, and persistence.
- `core/` — Shared utilities, constants, and configurations.
- `infrastructure/` — External integrations and third-party implementations.
- `app/` — Application initialization, routing, and coordination.

Use vanilla HTML, CSS, and JavaScript with ES modules.

Keep business logic independent of DOM manipulation and presentation-specific code.

Avoid circular dependencies, unnecessary global variables, and overengineering.

## 7. Preserve Existing Functionality

Architecture improvements must never compromise existing functionality.

Preserve:
- Existing UI appearance and responsive behavior.
- Navigation and screen transitions.
- User interactions and event listeners.
- Financial calculations and business rules.
- Local storage and existing data structures.
- Firebase integration and synchronization.
- Charts, reports, and settings.
- PWA functionality and service worker behavior.

Do not introduce unnecessary redesigns, framework migrations, or breaking changes.

## 8. Mandatory Pre-Completion Checklist

Before completing every development task, verify:

- [ ] Page-specific HTML is inside its feature directory.
- [ ] Page-specific CSS is inside its feature directory.
- [ ] Page-specific JavaScript is inside its feature directory.
- [ ] Shared components are inside `presentation/common/`.
- [ ] No unnecessary feature-specific code was added to global files.
- [ ] Existing modules were reused where appropriate.
- [ ] No duplicated components or implementations were introduced.
- [ ] All imports, exports, and asset paths are correct.
- [ ] No circular dependencies or duplicate event listeners were introduced.
- [ ] Existing functionality remains operational.

If any requirement is violated, correct it before considering the task complete.

## ULTIMATE RULE

**Every feature owns its presentation. Every reusable component belongs to the common presentation layer. Global files coordinate the application, not individual screens.**

This rule is mandatory for ALL future development. Never sacrifice architectural consistency for implementation convenience.