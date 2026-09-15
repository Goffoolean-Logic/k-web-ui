# Theme playground

Override kit tokens and copy a theme into your project.

The kit is tokens. Change `--k-primary` and every primary button follows. You do not restyle each class.

Paste the CSS after the `k-web-ui` import. Put `data-theme="light"`, `dark`, or `auto` on the document root. The live editor is at [/theme-playground/](/theme-playground/).

See [Colors](/foundations/colors.md) for what each token is for, and [Styles](/foundations/styles.md) for radius, shadow, and the focus ring.

```css
/* Paste after the k-web-ui stylesheet.
   Components already read these tokens. */

:root {
  --k-radius: 0.125rem;
  --k-radius-lg: 0.125rem;

  --k-field: #fdba74;
  --k-field-fg: #000000;
  --k-border: #f97316;

  --k-primary: #c2410c;
  --k-primary-fg: #ffffff;
  --k-primary-hover: #9a3412;

  --k-ring: #f97316;
}

:root,
[data-theme='light'] {
  color-scheme: light;

  --k-surface: #fff7ed;
  --k-surface-raised: #ffedd5;
  --k-surface-hard: #fdba74;
  --k-surface-soft: #fff7ed;
  --k-fg: #000000;
  --k-fg-muted: #9a3412;

  --k-accent: #000000;
  --k-accent-fg: #ffffff;
  --k-accent-hover: #431407;

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

[data-theme='dark'] {
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

@media (prefers-color-scheme: dark) {
  [data-theme='auto'] {
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
}
```
