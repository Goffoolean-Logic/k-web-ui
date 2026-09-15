export type KPaginationOptions = {
  count: number;
  page?: number;
};

export type KPaginationState = {
  root: HTMLElement;
  count: number;
  page: number;
  buttons: HTMLButtonElement[];
  signal: AbortSignal;
};
