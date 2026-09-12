export type KPaginationOptions = {
  count: number;
  page?: number;
  onChange?: (page: number) => void;
};

export type KPaginationState = {
  root: HTMLElement;
  count: number;
  page: number;
  onChange?: (page: number) => void;
  buttons: HTMLButtonElement[];
  signal: AbortSignal;
};
