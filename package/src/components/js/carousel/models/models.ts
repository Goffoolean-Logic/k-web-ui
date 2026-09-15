export type KCarouselSlide = {
  content?: string | Node;
  src?: string;
  alt?: string;
};

export type KCarouselOptions = {
  items: Array<{ content: string | Node }>;
  index?: number;
  loop?: boolean;
  keyboard?: boolean;
  autoscroll?: boolean;
};

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
