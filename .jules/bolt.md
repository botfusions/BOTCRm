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
