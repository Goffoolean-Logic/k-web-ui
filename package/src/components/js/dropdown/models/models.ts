export type KDropdownItem = {
  label: string;
  href?: string;
};

export type KDropdownOptions = {
  items: KDropdownItem[];
  trigger: string;
  /** When true, picking an item writes its label onto the trigger. */
  select?: boolean;
};

export type KDropdownState = {
  root: HTMLElement;
  trigger: HTMLElement;
  menu: HTMLElement;
  items: HTMLElement[];
  open: boolean;
  select: boolean;
};
