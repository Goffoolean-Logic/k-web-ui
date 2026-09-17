# Restyle

Same markup. Your CSS. A different look.

Don't like the kit look? It's CSS. Paste your own rules after the `k-web-ui` import and they win, because they're unlayered. [How it works](/how-it-works.md) covers the cascade. You don't fork a component to change its shape.

These examples keep the markup from the [button](/components/button.md) and [gauge](/components/gauge.md) pages. The extra class is yours.

## Capsule buttons

`.k-btn` uses `--k-radius`, which is 2px. Round the corners and it reads as a capsule. Variants and sizes still apply.

```html
<style>
  .btn-capsule {
    border-radius: 999px;
    padding-inline: 1.5rem;
  }
</style>
<button type="button" class="k-btn k-btn--primary">Save</button>
<button type="button" class="k-btn k-btn--primary btn-capsule">Save</button>
<button type="button" class="k-btn k-btn--secondary btn-capsule">Cancel</button>
```

## Half-circle gauge

The kit gauge is three sides of a square. `--k-gauge-amount` is how far the fill has gone along those sides. Hide the segments and paint `.k-gauge__frame` from the same token. The fill runs left to right along the top of a semicircle. The tag still writes the hidden progress, the reading, and the caption.

```html
<style>
  k-gauge.gauge-arc .k-gauge__seg {
    display: none;
  }

  k-gauge.gauge-arc .k-gauge__frame {
    --k-arc-angle: calc(270deg + var(--k-gauge-amount) * 180deg / 100%);
    border-radius: 50%;
    background:
      radial-gradient(
        circle at calc(var(--k-gauge-thickness) / 2) 50%,
        var(--k-gauge-color) calc(var(--k-gauge-thickness) / 2),
        transparent calc(var(--k-gauge-thickness) / 2 + 0.5px)
      ),
      radial-gradient(
        circle at calc(100% - var(--k-gauge-thickness) / 2) 50%,
        var(--k-gauge-track) calc(var(--k-gauge-thickness) / 2),
        transparent calc(var(--k-gauge-thickness) / 2 + 0.5px)
      ),
      radial-gradient(
        circle at
          calc(
            50% + sin(var(--k-arc-angle)) * 50% - sin(var(--k-arc-angle)) *
              var(--k-gauge-thickness) / 2
          )
          calc(
            50% - cos(var(--k-arc-angle)) * 50% + cos(var(--k-arc-angle)) *
              var(--k-gauge-thickness) / 2
          ),
        var(--k-gauge-color) calc(var(--k-gauge-thickness) / 2),
        transparent calc(var(--k-gauge-thickness) / 2 + 0.5px)
      ),
      conic-gradient(
        from 270deg,
        var(--k-gauge-color) calc(var(--k-gauge-amount) * 180deg / 100%),
        var(--k-gauge-track) calc(var(--k-gauge-amount) * 180deg / 100%) 180deg,
        transparent 180deg
      );
    -webkit-mask: radial-gradient(
      farthest-side,
      transparent calc(100% - var(--k-gauge-thickness)),
      #000 calc(100% - var(--k-gauge-thickness) + 0.5px)
    );
    mask: radial-gradient(
      farthest-side,
      transparent calc(100% - var(--k-gauge-thickness)),
      #000 calc(100% - var(--k-gauge-thickness) + 0.5px)
    );
  }

  k-gauge.gauge-arc > .k-gauge__value {
    padding-bottom: 1.35rem;
  }

  k-gauge.gauge-arc > .k-gauge__label {
    align-self: center;
    padding-top: 1.35rem;
    padding-bottom: 0;
  }
</style>
<k-gauge id="upload-square" class="k-gauge" value="64" max="100" label="Upload" text="64%"></k-gauge>
<k-gauge id="upload-arc" class="k-gauge gauge-arc" value="64" max="100" label="Upload" text="64%"></k-gauge>
```
