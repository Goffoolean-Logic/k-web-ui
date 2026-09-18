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

export const HERO_PHRASES = [
  { text: 'Worried about frameworks?', end: 'letter' },
  { text: 'Need something simple and flexible?', end: 'letter' },
  { text: 'Just want a UI library that works?', end: 'logo' },
] as const;

export const HERO_TIMING = {
  typeMs: 45,
  deleteMs: 18,
  kPauseMs: 650,
  holdMs: 900,
  lastHoldMs: 3000,
  restTypeMs: 70,
  fadeMs: 560,
  moveMs: 1100,
  revealDelayMs: 400,
} as const;

interface HeroIntroEls {
  root: HTMLElement;
  intro: HTMLElement;
  prompt: HTMLElement;
  letter: HTMLElement;
  logo: HTMLElement;
  rest: HTMLElement;
  caret: HTMLElement;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function queryEls(root: HTMLElement): HeroIntroEls | null {
  const intro = root.querySelector('[data-hero-intro]');
  const prompt = root.querySelector('[data-hero-prompt]');
  const letter = root.querySelector('[data-hero-letter]');
  const logo = root.querySelector('[data-hero-logo]');
  const rest = root.querySelector('[data-hero-rest]');
  const caret = root.querySelector('[data-hero-caret]');

  if (
    !(intro instanceof HTMLElement) ||
    !(prompt instanceof HTMLElement) ||
    !(letter instanceof HTMLElement) ||
    !(logo instanceof HTMLElement) ||
    !(rest instanceof HTMLElement) ||
    !(caret instanceof HTMLElement)
  ) {
    return null;
  }

  return {
    root,
    intro,
    prompt,
    letter,
    logo,
    rest,
    caret,
  };
}

function wait(ms: number, signal: AbortSignal): Promise<boolean> {
  if (signal.aborted) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const id = window.setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve(true);
    }, ms);

    const onAbort = (): void => {
      window.clearTimeout(id);
      resolve(false);
    };

    signal.addEventListener('abort', onAbort, { once: true });
  });
}

async function typeText(
  node: HTMLElement,
  text: string,
  ms: number,
  signal: AbortSignal,
): Promise<boolean> {
  node.textContent = '';
  for (const char of text) {
    if (signal.aborted) {
      return false;
    }
    node.textContent += char;
    if (!(await wait(ms, signal))) {
      return false;
    }
  }
  return true;
}

async function deleteText(
  node: HTMLElement,
  ms: number,
  signal: AbortSignal,
): Promise<boolean> {
  while (node.textContent) {
    if (signal.aborted) {
      return false;
    }
    node.textContent = node.textContent.slice(0, -1);
    if (!(await wait(ms, signal))) {
      return false;
    }
  }
  return true;
}

async function moveLogoLeft(
  els: HeroIntroEls,
  signal: AbortSignal,
  first = els.logo.getBoundingClientRect(),
): Promise<boolean> {
  els.root.dataset.heroState = 'settling';
  const last = els.logo.getBoundingClientRect();
  const dx = first.left - last.left;
  const dy = first.top - last.top;

  if (prefersReducedMotion() || (Math.abs(dx) < 1 && Math.abs(dy) < 1)) {
    return !signal.aborted;
  }

  const animation = els.logo.animate(
    [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
    {
      duration: HERO_TIMING.moveMs,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    },
  );

  await Promise.race([
    animation.finished.then(
      () => true,
      () => false,
    ),
    wait(HERO_TIMING.moveMs + 50, signal),
  ]);

  animation.cancel();
  els.logo.style.transform = '';
  return !signal.aborted;
}

function hideAnswer(els: HeroIntroEls): void {
  els.letter.hidden = true;
  els.logo.hidden = true;
}

function showComplete(els: HeroIntroEls, skipped: boolean): void {
  els.prompt.textContent = '';
  els.prompt.style.opacity = '';
  els.prompt.style.transition = '';
  els.letter.hidden = true;
  els.logo.hidden = false;
  els.rest.textContent = HERO_TITLE_REST;
  els.caret.hidden = true;
  els.intro.classList.add('k-wordmark');
  if (skipped) {
    els.root.dataset.heroSkipped = 'true';
  }
  els.root.dataset.heroState = 'done';
}

function preparePlaying(els: HeroIntroEls): void {
  els.prompt.textContent = '';
  hideAnswer(els);
  els.rest.textContent = '';
  els.caret.hidden = false;
}

async function playPhrases(
  els: HeroIntroEls,
  signal: AbortSignal,
): Promise<boolean> {
  for (const [index, phrase] of HERO_PHRASES.entries()) {
    const last = index === HERO_PHRASES.length - 1;
    hideAnswer(els);

    if (
      !(await typeText(els.prompt, phrase.text, HERO_TIMING.typeMs, signal))
    ) {
      return false;
    }

    if (!(await wait(HERO_TIMING.kPauseMs, signal))) {
      return false;
    }

    if (phrase.end === 'letter') {
      els.letter.hidden = false;
    } else {
      els.logo.hidden = false;
    }

    const hold = last ? HERO_TIMING.lastHoldMs : HERO_TIMING.holdMs;
    if (!(await wait(hold, signal))) {
      return false;
    }

    if (last) {
      return true;
    }

    hideAnswer(els);
    if (!(await deleteText(els.prompt, HERO_TIMING.deleteMs, signal))) {
      return false;
    }
  }

  return !signal.aborted;
}

async function morphToTitle(
  els: HeroIntroEls,
  signal: AbortSignal,
): Promise<boolean> {
  els.caret.hidden = true;
  els.letter.hidden = true;
  els.logo.hidden = false;
  els.prompt.style.transition = `opacity ${HERO_TIMING.fadeMs}ms ease`;
  els.prompt.style.opacity = '0';
  if (!(await wait(HERO_TIMING.fadeMs, signal))) {
    return false;
  }

  const first = els.logo.getBoundingClientRect();
  els.prompt.textContent = '';
  els.prompt.style.opacity = '';
  els.prompt.style.transition = '';

  if (!(await moveLogoLeft(els, signal, first))) {
    return false;
  }

  els.caret.hidden = false;
  if (
    !(await typeText(els.rest, HERO_TITLE_REST, HERO_TIMING.restTypeMs, signal))
  ) {
    return false;
  }

  els.caret.hidden = true;
  return wait(HERO_TIMING.revealDelayMs, signal);
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

  preparePlaying(els);
  root.dataset.heroState = 'playing';

  const controller = new AbortController();
  const skip = (): void => {
    if (root.dataset.heroState === 'done') {
      return;
    }
    controller.abort();
  };

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

  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);

  void (async () => {
    const played = await playPhrases(els, controller.signal);
    if (played) {
      await morphToTitle(els, controller.signal);
    }
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    showComplete(els, controller.signal.aborted);
  })();
}
