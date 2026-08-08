import "@testing-library/jest-dom/vitest";

// Node 22+'s built-in global `localStorage` (a non-functional stub unless
// `--localstorage-file` is set) gets picked up as `window.localStorage` by
// this vitest/jsdom version instead of jsdom's own implementation — CI (Node
// 20, per .github/workflows/ci.yml) isn't affected, so this only replaces it
// when the existing one is actually broken.
if (typeof window !== "undefined" && typeof window.localStorage?.clear !== "function") {
  const store = new Map<string, string>();
  const polyfill: Storage = {
    getItem: (key) => (store.has(key) ? store.get(key)! : null),
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
  for (const target of [globalThis, window]) {
    Object.defineProperty(target, "localStorage", {
      value: polyfill,
      configurable: true,
      writable: true,
    });
  }
}

// jsdom doesn't implement matchMedia — guarded so a real browser/polyfill
// implementation is never clobbered.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}
