export const THEME_STORAGE_KEY = "portfolio-theme";

export function applyTheme() {
  if (typeof document === "undefined") return;
  window.sessionStorage.removeItem(THEME_STORAGE_KEY);
  document.documentElement.dataset.theme = "dark";
  document.documentElement.dataset.themeSource = "fixed";
}
