import type { KIconName } from '../../icon.js';

export type KTabItem = {
  content: string | Node;
  label?: string;
  /** Kit icon name, or a node such as a `.k-icon` span. */
  icon?: KIconName | Node;
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
  ink?: HTMLElement;
  keyboard: boolean;
};
