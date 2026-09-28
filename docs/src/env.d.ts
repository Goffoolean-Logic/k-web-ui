/// <reference types="astro/client" />

declare module 'virtual:starlight/components/DraftContentNotice' {
  const DraftContentNotice: typeof import('@astrojs/starlight/components/DraftContentNotice.astro').default;
  export default DraftContentNotice;
}

declare module 'virtual:starlight/components/Pagination' {
  const Pagination: typeof import('@astrojs/starlight/components/Pagination.astro').default;
  export default Pagination;
}

export {};

declare global {
  interface Window {
    StarlightThemeProvider: {
      updatePickers: (theme?: string) => void;
    };
  }
}
