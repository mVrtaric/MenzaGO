# AI Rules (Project Guidelines)

These rules help an AI (and humans) make consistent, maintainable changes to this app.

## Tech stack (quick facts)

- **Framework:** Next.js (App Router) with `app/` directory.
- **Language:** TypeScript.
- **UI foundation:** React + **shadcn/ui** components built on **Radix UI** primitives.
- **Styling:** Tailwind CSS (with `tailwind-merge`, `clsx`, and the `cn()` helper in `lib/utils.ts`).
- **Icons:** `lucide-react`.
- **Forms & validation:** `react-hook-form` + `zod` (+ `@hookform/resolvers`).
- **State management:** `zustand` (see `lib/store.ts`).
- **Charts & data viz:** `recharts` (via shadcn chart wrappers where applicable).
- **Dates:** `date-fns`.
- **Analytics:** `@vercel/analytics`.

## Library usage rules (what to use for what)

### 1) Routing & pages
- Use **Next.js App Router**:
  - Create routes under `app/` (e.g. `app/page.tsx`, `app/some-route/page.tsx`).
  - Use `layout.tsx` for shared layout.
- Do **not** add React Router.

### 2) UI components
- Prefer **shadcn/ui** components from `components/ui/*` for all common UI (buttons, dialogs, forms, tables, etc.).
- Do **not** edit `components/ui/*` unless absolutely necessary; instead, compose them into new components.
- Use **Radix UI** only indirectly through shadcn components unless you truly need a primitive that isn’t wrapped yet.

### 3) Styling conventions
- Use **Tailwind CSS** for all styling.
- Use `cn()` from `lib/utils.ts` to merge classes; do not hand-roll class merging.
- Keep styling co-located with components; avoid new global CSS unless required.

### 4) State management
- Use **Zustand** for shared/global client state (e.g. screen navigation, user session-like state).
- Prefer local React state (`useState`, `useMemo`, `useReducer`) for component-scoped state.

### 5) Forms & validation
- Use **react-hook-form** for forms.
- Use **zod** for schemas and validation; connect via `@hookform/resolvers/zod`.
- Use shadcn’s `Form` components (`components/ui/form`) for consistent UX.

### 6) Data formatting utilities
- Use **date-fns** for date parsing/formatting.
- Keep reusable helpers in `lib/` (e.g. `lib/data.ts` for static/mock data, `lib/utils.ts` for generic utilities).

### 7) Feedback, toasts, dialogs
- Use shadcn patterns:
  - Toasts: `components/ui/sonner` or existing toast utilities (`hooks/use-toast.ts`, `components/ui/toaster.tsx`).
  - Modals/overlays: shadcn `Dialog`, `Sheet`, `Drawer`.

### 8) Icons
- Use **lucide-react** icons only.
- Keep icon size consistent (commonly `h-4 w-4` or `h-5 w-5`) and inherit color via Tailwind classes.

### 9) File & component organization
- Route files live in `app/**/page.tsx`.
- Reusable UI components:
  - App-specific: `components/menza/**` (or create a new domain folder under `components/`).
  - Generic primitives: already in `components/ui/**`.
- Shared logic and data: `lib/**`.

### 10) Client vs server components
- Default to **server components** in `app/` where possible.
- Add `'use client'` only for components that need client-only features (state, effects, event handlers, Zustand, etc.).

## Change rules (how to make edits)

- Keep changes **small and focused**; don’t refactor unrelated code.
- Reuse existing components and patterns before introducing new dependencies.
- Maintain TypeScript correctness and existing code style.
