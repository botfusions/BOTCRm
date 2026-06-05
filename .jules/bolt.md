## 2024-05-15 - [React 19 Re-render Optimization in Lists]
**Learning:** In React 19, functional components that render large lists without item-level memoization (`React.memo`) still suffer from O(N) re-renders when the parent state (like a search query or a toggle menu) changes. Even if the list items themselves haven't changed, they are re-evaluated. Stabilizing event handlers with `useCallback` is critical when passing them to memoized children to prevent the memoization from breaking.

**Action:** Always extract list items into separate components wrapped in `React.memo` and use `useCallback` for any functions passed as props to these items.

## 2024-06-05 - [Optimizing CRM Contact and Company Lists]
**Learning:** Large listing components like `Contacts.tsx` and `Companies.tsx` were re-rendering hundreds of items on every search keystroke. Extracted items into `ContactCard`, `ContactRow`, `CompanyCard`, and `CompanyRow` and wrapped them in `React.memo`. Used `useCallback` with functional state updates for all handlers to stabilize props and ensure O(1) re-render efficiency (only modified/entering/exiting items re-render).

**Action:** Applied to `Contacts.tsx` and `Companies.tsx`. Added `loading="lazy"` to images to optimize scroll performance.
