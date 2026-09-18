export type KScrollbarAxis = 'x' | 'y' | 'both';

export type KScrollbarSize = 'sm' | 'lg';

export type KScrollbarOptions = {
  axis?: KScrollbarAxis;
  target?: string;
  autohide?: boolean;
  size?: KScrollbarSize;
};

export type KScrollbarMetrics = {
  scrollTop: number;
  scrollLeft: number;
};

export type KScrollbarState = {
  root: HTMLElement;
  viewport: HTMLElement;
  vTrack: HTMLElement;
  vThumb: HTMLElement;
  hTrack: HTMLElement;
  hThumb: HTMLElement;
  axis: KScrollbarAxis;
  mode: 'wrap' | 'target';
  autohide: boolean;
  dragging: boolean;
  dragAxis: 'x' | 'y' | null;
  dragPointer: number | null;
  dragStartPos: number;
  dragStartScroll: number;
  silent: boolean;
  signal: AbortSignal;
};
