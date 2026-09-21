export type KCarouselState = {
  root: HTMLElement;
  track: HTMLElement;
  slides: HTMLElement[];
  dots: HTMLButtonElement[];
  prev: HTMLButtonElement;
  next: HTMLButtonElement;
  index: number;
  loop: boolean;
  keyboard: boolean;
  autoscroll: boolean;
  autoscrollPaused?: boolean;
  autoscrollTimer?: ReturnType<typeof setTimeout>;
};

/** @deprecated Kept for export compatibility; content is linked by id. */
export type KCarouselSlide = {
  content?: string | Node;
  src?: string;
  alt?: string;
};

/** @deprecated Kept for export compatibility. */
export type KCarouselOptions = {
  index?: number;
  loop?: boolean;
  keyboard?: boolean;
  autoscroll?: boolean;
};
