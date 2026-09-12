export type KCarouselItem = {
  content: string | Node;
};

export type KCarouselOptions = {
  items: KCarouselItem[];
  index?: number;
  loop?: boolean;
  keyboard?: boolean;
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
};
