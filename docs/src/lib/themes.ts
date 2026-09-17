/**
 * Docs site themes. Add a row here when a new `[data-theme]` ships.
 * `id` is the attribute value. `label` is what the switcher shows.
 */
export const DOCS_THEMES = [
  { id: 'k-light', label: 'K-light', icon: 'sun' },
  { id: 'k-dark', label: 'K-dark', icon: 'moon' },
] as const;

export type DocsTheme = (typeof DOCS_THEMES)[number];
export type DocsThemeId = DocsTheme['id'];

const LEGACY: Record<string, DocsThemeId> = {
  light: 'k-light',
  Light: 'k-light',
  dark: 'k-dark',
  Dark: 'k-dark',
};

export function themeByKey(value: string): DocsTheme | undefined {
  return DOCS_THEMES.find(
    (theme) => theme.id === value || theme.label === value,
  );
}

export function isDocsThemeId(value: string): value is DocsThemeId {
  return DOCS_THEMES.some((theme) => theme.id === value);
}

export function parseDocsTheme(
  value: unknown,
  fallback: DocsThemeId = 'k-light',
): DocsThemeId {
  if (typeof value !== 'string') return fallback;
  const match = themeByKey(value);
  if (match) return match.id;
  return LEGACY[value] ?? fallback;
}

export function themeIcon(value: string): DocsTheme['icon'] | undefined {
  return themeByKey(value)?.icon;
}

export function themeLabel(id: DocsThemeId): string {
  return themeByKey(id)?.label ?? id;
}

export const DOCS_THEME_IDS = DOCS_THEMES.map((theme) => theme.id);
