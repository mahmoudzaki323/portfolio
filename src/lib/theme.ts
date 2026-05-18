export type PortfolioTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "portfolio-theme";

export function getAutoTheme(date = new Date()): PortfolioTheme {
  const hour = date.getHours();
  return hour >= 6 && hour < 19 ? "light" : "dark";
}

export function getStoredTheme(): PortfolioTheme | null {
  if (typeof window === "undefined") return null;
  const stored = window.sessionStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

export function getPreferredTheme(): PortfolioTheme {
  return getStoredTheme() ?? getAutoTheme();
}

export function applyTheme(theme: PortfolioTheme, source: "auto" | "manual") {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themeSource = source;
}
