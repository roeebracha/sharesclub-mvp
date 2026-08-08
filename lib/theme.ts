export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "theme";

export function resolveTheme(stored: string | null, prefersDarkOS: boolean): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return prefersDarkOS ? "dark" : "light";
}

// Inline <script> tags can't `import`, so this string literally mirrors
// resolveTheme's precedence (explicit stored choice wins, else OS). Keep the
// two in sync if the logic ever changes.
export function themeBootScript(): string {
  const key = JSON.stringify(THEME_STORAGE_KEY);
  return `(function(){try{var s=localStorage.getItem(${key});var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var d=s==="light"||s==="dark"?s:(m?"dark":"light");if(d==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;
}
