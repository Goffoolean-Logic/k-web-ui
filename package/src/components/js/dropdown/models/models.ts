export type KDropdownItem = {
  label: string;
  href?: string;
};

export type KDropdownOptions = {
  items: KDropdownItem[];
  /** Visible name on the generated trigger. */
  label?: string;
};

export type KDropdownState = {
  root: HTMLElement;
  trigger: HTMLElement;
  menu: HTMLElement;
  items: HTMLElement[];
  open: boolean;
};
