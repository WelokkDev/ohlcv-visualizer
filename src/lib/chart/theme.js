const SHARED = {
  upColor: '#26a69a',
  downColor: '#ef5350',
};

export const lightTheme = {
  ...SHARED,
  background: '#ffffff',
  text: '#08060d',
  grid: '#eef0f3',
  border: '#e5e4e7',
  crosshair: '#9aa0a6',
};

export const darkTheme = {
  ...SHARED,
  background: '#16171d',
  text: '#e5e7eb',
  grid: '#22242c',
  border: '#2e303a',
  crosshair: '#6b7280',
};

export function getPreferredTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return lightTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? darkTheme
    : lightTheme;
}
