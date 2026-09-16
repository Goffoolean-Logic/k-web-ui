/**
 * Starter theme for the docs playground. Same tokens the kit ships.
 * Hex so a consumer can edit without chasing palette variables.
 */
export const STARTER_THEME_CSS = `/* Paste after the k-web-ui stylesheet.
   Components already read these tokens. */

:root {
  --k-radius: 0.125rem;
  --k-radius-lg: 0.125rem;

  --k-field: #fdba74;
  --k-field-fg: #000000;
  --k-border: #f97316;

  --k-primary: #c2410c;
  --k-primary-fg: #ffffff;
  --k-primary-hover: #f97316;

  --k-ring: #f97316;
}

:root,
[data-theme='k-light'] {
  color-scheme: light;

  --k-surface: #fff7ed;
  --k-surface-raised: #ffedd5;
  --k-surface-hard: #fdba74;
  --k-surface-soft: #fff7ed;
  --k-fg: #000000;
  --k-fg-muted: #9a3412;

  --k-accent: #000000;
  --k-accent-fg: #ffffff;
  --k-accent-hover: #9a3412;

  --k-danger: #dc2626;
  --k-danger-fg: #ffffff;

  --k-info: #2563eb;
  --k-info-fg: #ffffff;

  --k-success: #15803d;
  --k-success-fg: #ffffff;

  --k-warning: #c2410c;
  --k-warning-fg: #ffffff;

  --k-shadow-1: 0 1px 2px rgb(15 23 42 / 0.08);
  --k-shadow-2: 0 4px 14px rgb(15 23 42 / 0.12);
  --k-shadow-3: 0 16px 40px rgb(15 23 42 / 0.18);
}

[data-theme='k-dark'] {
  color-scheme: dark;

  --k-surface: #000000;
  --k-surface-raised: #0d0f12;
  --k-surface-hard: #1a1d21;
  --k-surface-soft: #000000;
  --k-fg: #ffffff;
  --k-fg-muted: #fdba74;

  --k-accent: #ffffff;
  --k-accent-fg: #000000;
  --k-accent-hover: #ffedd5;

  --k-danger: #f87171;
  --k-danger-fg: #450a0a;

  --k-info: #60a5fa;
  --k-info-fg: #172554;

  --k-success: #4ade80;
  --k-success-fg: #052e16;

  --k-warning: #fb923c;
  --k-warning-fg: #431407;

  --k-shadow-1: 0 1px 2px rgb(0 0 0 / 0.7), 0 0 0 1px rgb(255 255 255 / 0.04);
  --k-shadow-2: 0 8px 20px rgb(0 0 0 / 0.65), 0 0 0 1px rgb(255 255 255 / 0.06);
  --k-shadow-3: 0 20px 50px rgb(0 0 0 / 0.75), 0 0 0 1px rgb(255 255 255 / 0.08);
}
`;

const HOST = '.k-playground__stage';

/** Keep playground edits on the stage so the docs chrome does not move. */
export function scopeThemeCss(css: string): string {
  const rewritten = css
    .replaceAll(':root', ':scope')
    .replace(/(?<!:scope)\[data-theme=/g, ':scope[data-theme=');
  return `@scope (${HOST}) {\n${rewritten}\n}`;
}

export type TokenScope = 'shared' | 'light' | 'dark';

export type ColorToken = {
  scope: TokenScope;
  name: string;
  value: string;
};

const HEX_DECL = /(--k-[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\b/g;

const SCOPE_OPEN: Record<TokenScope, RegExp> = {
  shared: /:root\s*\{/,
  light: /:root\s*,\s*\[data-theme=['"]k-light['"]\]\s*\{/,
  dark: /\[data-theme=['"]k-dark['"]\]\s*\{/,
};

function braceInner(
  css: string,
  openBraceIndex: number,
): { start: number; end: number } | null {
  let depth = 0;
  for (let i = openBraceIndex; i < css.length; i += 1) {
    if (css[i] === '{') {
      depth += 1;
    } else if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        return { start: openBraceIndex + 1, end: i };
      }
    }
  }
  return null;
}

function findScopeBlock(
  css: string,
  scope: TokenScope,
): { start: number; end: number } | null {
  const match = SCOPE_OPEN[scope].exec(css);
  if (!match) {
    return null;
  }
  return braceInner(css, match.index + match[0].length - 1);
}

function hexDeclsIn(css: string, start: number, end: number): ColorToken[] {
  const slice = css.slice(start, end);
  const tokens: ColorToken[] = [];
  HEX_DECL.lastIndex = 0;
  let match = HEX_DECL.exec(slice);
  while (match) {
    tokens.push({
      scope: 'shared',
      name: match[1],
      value: normalizeHex(match[2]) ?? match[2].toLowerCase(),
    });
    match = HEX_DECL.exec(slice);
  }
  return tokens;
}

/** Expand #rgb / #rrggbb to a 6-digit hex the picker can round-trip. */
export function normalizeHex(value: string): string | null {
  const raw = value.trim();
  const hex = raw.startsWith('#') ? raw.slice(1) : raw;
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(hex)) {
    return null;
  }
  if (hex.length === 3) {
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`.toLowerCase();
  }
  return `#${hex.slice(0, 6)}`.toLowerCase();
}

export function readColorTokens(css: string): ColorToken[] {
  const out: ColorToken[] = [];
  for (const scope of ['shared', 'light', 'dark'] as const) {
    const block = findScopeBlock(css, scope);
    if (!block) {
      continue;
    }
    for (const token of hexDeclsIn(css, block.start, block.end)) {
      out.push({ ...token, scope });
    }
  }
  return out;
}

function replaceHexInBlock(
  css: string,
  scope: TokenScope,
  name: string,
  value: string,
): string {
  const block = findScopeBlock(css, scope);
  if (!block) {
    return css;
  }
  const slice = css.slice(block.start, block.end);
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const next = slice.replace(
    new RegExp(`(${escaped}\\s*:\\s*)(#[0-9a-fA-F]{3,8})\\b`),
    `$1${value}`,
  );
  if (next === slice) {
    return css;
  }
  return css.slice(0, block.start) + next + css.slice(block.end);
}

/** Write a hex token. */
export function setColorToken(
  css: string,
  scope: TokenScope,
  name: string,
  value: string,
): string {
  const hex = normalizeHex(value);
  if (!hex) {
    return css;
  }
  return replaceHexInBlock(css, scope, name, hex);
}
