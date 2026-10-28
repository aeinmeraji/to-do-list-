# Todo List MVP - Local-Only Task Plan

## Scope and working rules

- The application is **local only**: React, Tailwind CSS, and browser LocalStorage.
- Do not add a backend, authentication, cloud sync, hosting, release, deployment, CI/CD, or production-serving work.
- Keep one shared task/list state and persistence path; views and panels must not make their own copies of app data.
- Store task dates as `YYYY-MM-DD` and use the application clock for Today.

## Definition of done

The MVP is complete when a user can create, view, edit, reschedule, complete, delete, search, and categorize local tasks; use Today, Upcoming, and Calendar; create lists; and retain data after refreshing the browser.

---

## Phase 1 - Foundation and local data

### Tasks

- [x] Set up the React, Tailwind, application shell, responsive layout, and shared UI controls.
- [x] Define `Task`, `TaskList`, default lists, date helpers, and stable IDs.
- [x] Implement one versioned LocalStorage read/write layer with malformed-data fallback.
- [x] Implement the shared task/list store: create, update, complete/uncomplete, delete task, and create list.

### Exit criteria

- [x] The app renders without runtime errors.
- [x] Tasks and lists survive refresh, and invalid LocalStorage data does not crash the app.
- [x] All data mutations flow through the shared store.

---

## Phase 2 - Core task workflow

### Tasks

- [x] Build Today with quick task creation, title validation, task rows, completion toggle, and empty state.
- [x] Build the details panel with editable title, description, date, time, and list.
- [x] Save task edits through the shared store and update the active view immediately.
- [x] Add delete confirmation and safely clear the selected task after deletion.
- [x] Keep the selected task and selected date synchronized after edits, deletes, and navigation.

### Exit criteria

- [x] A user can create, edit, complete/uncomplete, reschedule, and delete a task locally.
- [x] A changed task is reflected in the list and remains correct after refresh.

---

## Phase 3 - Views and calendar

### Tasks

- [x] Implement Today and Calendar navigation with selected-date state.
- [x] Build month navigation, date selection, today/selected-date states, and task indicators in Calendar.
- [x] Ensure Calendar task creation uses the selected date.
- [x] Build Upcoming from tasks dated after today, ordered by date.
- [x] Reuse the shared task-row behavior across Today, Upcoming, and Calendar-related task lists.

### Exit criteria

- [x] Today, Upcoming, and Calendar all show data from the same local store.
- [x] Selecting or creating from a calendar date uses that exact date.
- [x] Upcoming excludes today and past tasks.

---

## Phase 4 - Lists, search, and polish

### Tasks

- [x] Add the Lists section with persisted list names and colors.
- [x] Add new-list validation and list filtering without duplicating task state.
- [x] Add search over task title and description in the active view, plus a no-results state and clear action.
- [x] Confirm essential accessibility: labels for controls, keyboard reachability, focus states, and accessible icon buttons.
- [x] Handle essential edge cases: empty submissions, long task text, empty views, narrow screens, and unsaved-edit protection when changing or closing a task.

### Exit criteria

- [x] A new list can be created, assigned, filtered, and restored after refresh.
- [x] Search updates immediately after task edits, completion changes, or deletion.
- [x] Core workflows remain usable on narrow screens and with keyboard navigation.

---

## Phase 5 - Minimal local verification

### Required checks

- [x] Add only focused unit tests for date filtering and LocalStorage malformed-data fallback/persistence.
- [x] Run the existing lint, typecheck, and test commands successfully.

### Exit criteria

- [x] The focused data-layer tests pass.
- [x] Lint, typecheck, and tests pass locally.
- [x] The verified code path remains local-only with no backend or external service involved.

---

## Explicitly out of scope

- Authentication, accounts, backend APIs, online databases, cloud sync, or external integrations.
- Deployment, hosting, release phases, production build/release gates, CI/CD, and publish documentation.
- Notifications, reminders, recurring tasks, subtasks, tags, drag and drop, and advanced filters.
- Google Calendar, Apple Calendar, and Outlook integrations.
