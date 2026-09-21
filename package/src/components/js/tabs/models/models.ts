import type { KIconName } from '../../icon.js';

export type KTabItem = {
  label: string;
  icon?: KIconName;
};

export type KTabsOptions = {
  items: KTabItem[];
};

export type KTabsSelection = {
  index: number;
  tab: HTMLElement;
  panel: HTMLElement;
  label: string;
};

export type KTabsState = {
  root: HTMLElement;
  tabs: HTMLElement[];
  panels: HTMLElement[];
  ink?: HTMLElement;
  keyboard: boolean;
  items?: KTabItem[];
};
