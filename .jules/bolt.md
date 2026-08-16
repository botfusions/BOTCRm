## 2024-05-29 - Dashboard Metric Calculation Optimization
**Learning:** Multiple passes over a dataset using `reduce`, `filter`, etc., can be consolidated into a single $O(N)$ pass within a `useMemo` block to improve performance and reduce intermediate array allocations. Moving static configuration objects outside of components and using `React.memo` effectively prevents unnecessary re-renders in heavy dashboard views.
**Action:** Always check for redundant array iterations in components that handle large datasets and consolidate them into single-pass calculations. Use `React.memo` and externalize static objects for frequently re-rendered UI elements like metric cards.

## 2024-05-30 - Code Splitting and Navigation Memoization
**Learning:** Route-level code splitting using `React.lazy` and `Suspense` significantly reduces the initial bundle size by decoupling heavy components (like those using `recharts` or `@google/genai`) from the main bundle. Memoizing static-but-localized configuration objects (like sidebar navigation) with `useMemo` prevents unnecessary object allocations and improves reconciliation performance during frequent state updates.
**Action:** Always consider lazy loading for components that are not part of the initial view or carry heavy dependencies. Use `useMemo` for configuration objects that depend on simple props like 'language' to avoid re-renders and GC pressure.

## 2024-05-31 - Memoized List Filtering and Search Optimization
**Learning:** Performing list filtering and string transformations (like `.toLowerCase()`) directly in the component body results in redundant computations on every re-render, especially during rapid input updates. Pre-calculating search term variations outside the filter loop and wrapping the result in `useMemo` significantly reduces CPU usage and improves input responsiveness for large lists.
**Action:** Always memoize derived lists that depend on search filters or status toggles. Ensure that invariant operations (like lowercasing the search term) are performed once before the filtering loop begins.

## 2026-06-02 - List Row Memoization and Lazy Loading
**Learning:** In components with frequent state updates (like AI input or manual forms) alongside a large list, re-rendering the entire list on every keystroke causes significant performance degradation. Extracting list items into a `React.memo`'d component effectively isolates re-renders to only the changed inputs. Additionally, native `loading="lazy"` on images reduces initial asset overhead for long lists.
**Action:** Extract and memoize list item components in views with interactive forms. Use stable callback props and native lazy loading for images in these components.

## 2024-06-05 - Company List Memoization and Style Stabilization
**Learning:** In list-heavy views like 'Companies', memoizing individual item components (`CompanyCard`, `CompanyRow`) combined with stabilizing style-related strings and icons via `useMemo` effectively isolates re-renders during rapid state changes like search filtering. This prevents the entire list from re-rendering on every keystroke, significantly improving input responsiveness.
**Action:** Extract list items into `React.memo` components and ensure all props passed to them (styles, callbacks) are referentially stable using `useMemo` and `useCallback`.

## 2024-07-05 - Landing Page State Isolation and Component Memoization
**Learning:** Toggling a simple top-level boolean state (like a modal visibility) can cause a full re-render of a complex landing page if event handlers are not stabilized. Stabilizing callbacks with `useCallback` and memoizing heavy sub-sections (`Hero`, `Grid`, `Pricing`) with `React.memo` ensures that UI feedback is near-instant without redundant execution of heavy motion animations. Hoisting large translation objects outside components also reduces GC pressure during these renders.
**Action:** Always wrap top-level landing page sections in `React.memo` and stabilize their event handlers when introducing global UI state like modals or drawers.

## 2026-06-06 - Input/Form State Isolation in Data-Heavy Master Views
**Learning:** Having interactive form/text input states (such as AI Metin Analiz and Quick Manual Save inputs) inline within the same component as a large lead database list causes full parent component and child table list re-renders on every keystroke. Moving these interactive input states into their own dedicated sub-components (`AICapturePanel` and `AddLeadModal`) and wrapping them with `React.memo` isolates state updates perfectly, rendering only the typing inputs instead of the entire table.
**Action:** Always isolate high-frequency interactive inputs (like textareas, inputs, and modals) into separate memoized components with stable callbacks (`useCallback`) to completely eliminate redundant child list layout/DOM reconciliation cycles.
