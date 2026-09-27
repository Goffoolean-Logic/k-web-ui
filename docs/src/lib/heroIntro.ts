const ROOT_FONT_SIZE_PX = 16;

export function pxToRem(
  px: number,
  rootPx: number = ROOT_FONT_SIZE_PX,
): string {
  return `${px / rootPx}rem`;
}

/** Target hero title size: 72px, expressed in rem from a 16px root. */
export const HERO_TITLE_SIZE_PX = 72;
export const HERO_TITLE_SIZE_REM = pxToRem(HERO_TITLE_SIZE_PX);

export const HERO_TITLE_REST = '-Web-UI';

interface HeroIntroEls {
  root: HTMLElement;
  intro: HTMLElement;
  logo: HTMLElement;
  rest: HTMLElement;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function queryEls(root: HTMLElement): HeroIntroEls | null {
  const intro = root.querySelector('[data-hero-intro]');
  const logo = root.querySelector('[data-hero-logo]');
  const rest = root.querySelector('[data-hero-rest]');

  if (
    !(intro instanceof HTMLElement) ||
    !(logo instanceof HTMLElement) ||
    !(rest instanceof HTMLElement)
  ) {
    return null;
  }

  return { root, intro, logo, rest };
}

/** One span per character, parked on the positions of the original string. --i is 0 for the rightmost letter. */
function splitChars(root: HTMLElement, rest: HTMLElement): void {
  const textNode = rest.firstChild;
  if (!(textNode instanceof Text) || textNode.data.length === 0) {
    return;
  }

  const text = textNode.data;
  const fontSize = Number.parseFloat(getComputedStyle(rest).fontSize);
  const origin = rest.getBoundingClientRect();
  const range = document.createRange();
  const chars = [...text].map((char, index) => {
    range.setStart(textNode, index);
    range.setEnd(textNode, index + 1);
    const box = range.getBoundingClientRect();
    return {
      char,
      left: (box.left - origin.left) / fontSize,
    };
  });
  range.detach();

  rest.style.width = `${origin.width / fontSize}em`;
  rest.style.height = `${origin.height / fontSize}em`;
  rest.replaceChildren();
  chars.forEach((glyph, index) => {
    const span = document.createElement('span');
    span.className = 'hero-intro__char';
    span.style.setProperty('--i', String(chars.length - 1 - index));
    span.style.setProperty('--n', String(index));
    span.style.left = `${glyph.left}em`;
    span.textContent = glyph.char;
    rest.append(span);
  });
  root.style.setProperty('--letters', String(chars.length));
  root.dataset.heroChars = 'true';
}

function showComplete(els: HeroIntroEls, skipped: boolean): void {
  els.intro.classList.add('k-wordmark');
  if (skipped) {
    els.root.dataset.heroSkipped = 'true';
    els.rest.textContent = HERO_TITLE_REST;
    els.rest.style.width = '';
    els.rest.style.height = '';
  }
  els.root.dataset.heroState = 'done';
  for (const node of [els.logo, els.rest, ...els.rest.children]) {
    if (!(node instanceof HTMLElement)) {
      continue;
    }
    for (const animation of node.getAnimations()) {
      animation.cancel();
    }
    node.style.transform = '';
  }
}

export function playHeroIntro(): void {
  const root = document.querySelector<HTMLElement>('[data-hero]');
  if (!root || root.dataset.heroWired === 'true') {
    return;
  }

  const els = queryEls(root);
  if (!els) {
    return;
  }

  root.dataset.heroWired = 'true';

  if (prefersReducedMotion() || root.dataset.heroState === 'done') {
    showComplete(els, false);
    return;
  }

  els.rest.textContent = HERO_TITLE_REST;
  els.intro.classList.add('k-wordmark');
  root.dataset.heroState = 'playing';
  splitChars(root, els.rest);

  const onClick = (event: Event): void => {
    const node = event.target;
    const el =
      node instanceof Element
        ? node
        : node instanceof Node
          ? node.parentElement
          : null;
    if (
      el?.closest(
        '[data-hero] .actions, [data-hero-scroll], starlight-theme-select',
      )
    ) {
      return;
    }
    skip();
  };

  const onKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      skip();
    }
  };

  const onLogo = (event: AnimationEvent): void => {
    if (event.animationName !== 'hero-drop-logo' || event.target !== els.logo) {
      return;
    }
    els.logo.removeEventListener('animationend', onLogo);
    root.dataset.heroLaunch = 'true';
  };

  const onEnd = (event: AnimationEvent): void => {
    if (
      event.animationName !== 'hero-settle' ||
      event.target !== els.rest.lastElementChild ||
      root.dataset.heroState === 'done'
    ) {
      return;
    }
    els.rest.removeEventListener('animationend', onEnd);
    els.logo.removeEventListener('animationend', onLogo);
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    showComplete(els, false);
  };

  const skip = (): void => {
    if (root.dataset.heroState === 'done') {
      return;
    }
    els.rest.removeEventListener('animationend', onEnd);
    els.logo.removeEventListener('animationend', onLogo);
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    showComplete(els, true);
  };

  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  els.logo.addEventListener('animationend', onLogo);
  els.rest.addEventListener('animationend', onEnd);
}
