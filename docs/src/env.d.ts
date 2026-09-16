/// <reference types="astro/client" />

export {};

declare global {
  interface Window {
    StarlightThemeProvider: {
      updatePickers: (theme?: string) => void;
    };
  }
}
