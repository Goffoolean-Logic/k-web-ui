export const K_ICON_NAMES = [
  'chevron-left',
  'chevron-right',
  'chevron-down',
  'chevron-first',
  'chevron-last',
  'arrow-down',
  'info',
  'success',
  'warning',
  'danger',
  'close',
  'loading',
  'sun',
  'moon',
  'github',
] as const;

export type KIconName = (typeof K_ICON_NAMES)[number];

export type KIconSize = 'xs' | 'sm' | 'lg';

/**
 * Decorative kit icon. Markup is a span; the glyph is the CSS mask.
 *
 *   button.append(createIcon('chevron-left'));
 */
export function createIcon(name: KIconName, size?: KIconSize): HTMLSpanElement {
  const el = document.createElement('span');
  el.className = size
    ? `k-icon k-icon--${name} k-icon--${size}`
    : `k-icon k-icon--${name}`;
  el.setAttribute('aria-hidden', 'true');
  return el;
}

/** Wraps an icon in `.k-spin` so the glyph rotates. */
export function createSpin(
  name: KIconName = 'loading',
  size?: KIconSize,
): HTMLSpanElement {
  const el = document.createElement('span');
  el.className = 'k-spin';
  el.append(createIcon(name, size));
  return el;
}
