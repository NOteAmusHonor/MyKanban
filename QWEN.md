# MyKanban — QWEN.md

## Project Overview

**MyKanban** is a modern, real-time Kanban board application built with **Vue 3**, **TypeScript**, **Pinia**, and **Firebase** (Firestore + Auth). It supports multi-user collaboration with live data synchronization, drag-and-drop ticket management, and a polished glassmorphism UI with dark/light mode.

### Key Features

- **Ticket Management** — Create, edit, delete tickets with auto-incrementing IDs (`TK-1001`, `TK-1002`, ...)
- **Column Management** — Flexible columns with customizable colors; add, rename, delete columns
- **Drag & Drop** — Intuitive drag-and-drop to move tickets between columns and reorder within columns (via `vuedraggable` / Sortable.js)
- **Multi-User Realtime Sync** — All changes are visible to all users instantly via Firestore real-time listeners
- **Authentication** — Email/Password and Google Sign-In via Firebase Auth
- **Markdown Descriptions** — Ticket descriptions support Markdown with live preview (via `marked`)
- **Priority & Labels** — Four priority levels (Urgent/High/Medium/Low) with color coding; custom tags/labels
- **Assignees** — Assign tickets to team members with avatar initials
- **Board Statistics** — Overview of ticket distribution by column and priority
- **Dark/Light Mode** — Full theme system via CSS custom properties with smooth transitions
- **Keyboard Shortcuts** — `N` = new ticket, `C` = new column, `D` = toggle dark mode, `Esc` = close modal
- **Toast Notifications** — Non-intrusive success/error/info/warning toasts
- **Offline Persistence** — IndexedDB persistence via Firestore

### Architecture

```
src/
├── assets/
│   └── main.css              # CSS variables, design system, global styles
├── components/
│   ├── auth/
│   │   └── LoginScreen.vue   # Login/Register page with glassmorphism
│   ├── board/
│   │   ├── KanbanBoard.vue   # Main board layout (header, columns, modals)
│   │   ├── KanbanColumn.vue  # Single column with draggable ticket list
│   │   ├── KanbanTicket.vue  # Single ticket card (draggable)
│   │   └── BoardStats.vue    # Statistics overlay
│   ├── editor/
│   │   ├── TicketModal.vue   # Ticket create/edit modal with Markdown
│   │   └── ColumnModal.vue   # Column create/edit modal with color picker
│   └── ui/
│       ├── Button.vue        # Variant button component
│       ├── Badge.vue         # Priority/label badge component
│       ├── Avatar.vue        # User avatar with initials
│       ├── Modal.vue         # Generic modal (teleported to body)
│       └── Toast.vue         # Toast notification container
├── composables/
│   └── useKeyboard.ts        # Keyboard shortcuts composable
├── stores/
│   ├── auth.ts               # Auth store (login, register, Google sign-in, user profile)
│   ├── board.ts              # Board store (boards, columns, tickets, Firestore CRUD)
│   └── ui.ts                 # UI store (modals, toasts, theme, search state)
├── types/
│   └── index.ts              # All TypeScript interfaces
├── firebase/
│   └── config.ts             # Firebase initialization (Auth, Firestore, offline persistence)
├── router/
│   └── index.ts              # Vue Router with auth guards
├── utils/
│   └── helpers.ts            # Utility functions (avatar colors, initials, ticket ID formatting)
├── App.vue                   # Root component (router view + keyboard shortcuts)
└── main.ts                   # Entry point (Pinia, Router, global CSS)
```

### Data Model (Firestore)

| Collection | Key Fields |
|---|---|
| `users/{userId}` | `displayName`, `email`, `photoURL`, `color`, `createdAt` |
| `boards/{boardId}` | `name`, `createdBy`, `createdAt`, `members: string[]` |
| `columns/{columnId}` | `boardId`, `title`, `order`, `color`, `createdBy`, `createdAt` |
| `tickets/{ticketId}` | `boardId`, `columnId`, `ticketNumber`, `title`, `description`, `priority`, `labels`, `assigneeId`, `order`, `createdBy`, `createdAt`, `updatedAt` |
| `counters/{boardId}` | `ticketCount` (atomic counter for auto-incrementing ticket IDs) |

**Important:** All Firestore queries use **client-side filtering and sorting** to avoid requiring composite indexes. This was a deliberate design decision to simplify setup.

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Language | TypeScript (full type safety) |
| State Management | Pinia |
| Routing | Vue Router 5 |
| Backend / Database | Firebase Firestore (real-time listeners) |
| Authentication | Firebase Auth (Email/Password + Google) |
| Drag & Drop | vuedraggable 4 (Sortable.js wrapper) |
| Markdown | marked |
| Security | DOMPurify |
| Build Tool | Vite 8 |
| CSS | Custom properties (CSS variables), no framework |
| Font | Inter (Google Fonts) |

---

## Building and Running

### Prerequisites

- **Node.js** `^20.19.0` or `>=22.12.0`
- **npm** (or compatible package manager)
- A **Firebase project** with Firestore and Auth enabled (see `.env.example` for config keys)

### Environment Setup

Create a `.env` file in the project root with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Type-check and build for production
npm run build

# Build only (without type-checking)
npm run build-only

# Type-check only
npm run type-check

# Format source code with Prettier
npm run format

# Preview production build
npm run preview
```

---

## Development Conventions

### Coding Style

- **Vue 3 Composition API** exclusively with `<script setup lang="ts">` syntax
- **TypeScript** strict mode — all types must be defined; no `any` unless necessary
- **Pinia stores** use the composition-style setup (`defineStore('name', () => { ... })`)
- **Path aliases**: use `@/` to reference `src/` (e.g., `import { useAuthStore } from '@/stores/auth'`)
- **Component naming**: PascalCase for single-file components (e.g., `KanbanBoard.vue`)
- **Composables**: prefixed with `use` (e.g., `useKeyboard.ts`)

### CSS / Styling

- All styling uses **CSS custom properties** (variables) defined in `src/assets/main.css`
- Dark mode is the default; light mode is toggled via `.light` class on `<html>`
- Glassmorphism effects use `backdrop-filter: blur()` with semi-transparent backgrounds
- Animations use cubic-bezier easing for smooth transitions
- Utility classes available: `.flex`, `.flex-col`, `.items-center`, `.gap-sm`, `.gap-md`, etc.

### Firestore Strategy

- **No composite indexes** — all filtering and sorting is done client-side to avoid Firestore index configuration
- Real-time listeners (`onSnapshot`) are used for reactive data; cleanup happens in `onUnmounted` or via `cleanup()`
- Ticket IDs are generated via atomic Firestore transactions on a counter document
- Offline persistence is enabled via IndexedDB (with graceful error handling for unsupported browsers)

### Security

- Firebase Auth guards all routes — unauthenticated users are redirected to `/login`
- Firestore Security Rules should be set to require `request.auth != null` for all read/write operations
- User profiles are created in Firestore on first login (email or Google)

### Component Patterns

- **UI components** (`src/components/ui/`) are generic, reusable, and accept props for variant/size
- **Board components** (`src/components/board/`) are domain-specific and interact with stores directly
- **Editor modals** (`src/components/editor/`) handle create/edit forms and communicate with stores
- All modals are teleported to `<body>` via Vue's `<Teleport>` for proper z-index management
- Toasts are managed by the UI store with auto-dismiss (configurable duration)

---

## Key Implementation Details

### Auto-Incrementing Ticket IDs

Ticket numbers are generated using a Firestore counter document (`counters/{boardId}`). The `addTicket()` function uses `runTransaction()` to atomically increment the counter and read the new value, guaranteeing unique sequential IDs even under concurrent multi-user writes.

### Drag & Drop

`vuedraggable` is configured with `group: { name: 'tickets', pull: true, put: true }` to allow cross-column dragging. On drop, the `reorderTicketsInColumn()` or `moveTicket()` store methods update the `order` field in Firestore, which triggers reactive UI updates for all connected users.

### Keyboard Shortcuts

The `useKeyboard()` composable listens for global `keydown` events and respects input focus (ignores shortcuts when `<input>`, `<textarea>`, or `<select>` is focused). Active modals intercept `Esc` for closing.

---

## Known Limitations / TODOs

- Search and filter UI components are not yet implemented (the types exist in `TicketFilters`)
- Due date functionality is defined in types but not yet wired into the ticket modal
- Sort dropdown is planned but not implemented
- The `assignees` list in TicketModal currently shows partial IDs as fallback names (could be improved with a dedicated user directory)
- Column drag-reordering (moving entire columns) is not yet implemented
- Command palette (`Ctrl+K`) is planned but not built
