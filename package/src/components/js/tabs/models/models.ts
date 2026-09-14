export type KTabItem = {
  label: string;
  content: string | Node;
};

export type KTabsOptions = {
  items: KTabItem[];
  /** Accessible name for the generated tablist. */
  label?: string;
  selected?: number;
  /** When true (default), arrow keys, Home, and End move between tabs. */
  keyboard?: boolean;
};

export type KTabsState = {
  root: HTMLElement;
  tabs: HTMLElement[];
  panels: HTMLElement[];
  keyboard: boolean;
};
