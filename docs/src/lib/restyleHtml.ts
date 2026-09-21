/** Copied source for /showcase/restyle/. Keep the CSS in sync with docs.css. */

export const restyleButtonHtml = `<style>
  .btn-capsule {
    border-radius: 999px;
    padding-inline: 1.5rem;
  }
</style>
<button type="button" class="k-btn k-btn--primary">Save</button>
<button type="button" class="k-btn k-btn--primary btn-capsule">Save</button>
<button type="button" class="k-btn k-btn--secondary btn-capsule">Cancel</button>`;

export const restyleGaugeHtml = `<style>
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
<k-gauge id="upload-square" class="k-gauge"></k-gauge>
<k-gauge id="upload-arc" class="k-gauge gauge-arc"></k-gauge>`;

/** Copyable TypeScript for the half-circle gauge example. */
export const restyleGaugeTs = `import 'k-web-ui/js';

const reading = { value: 64, max: 100, label: 'Upload', format: '%' };

document.getElementById('upload-square').options = reading;
document.getElementById('upload-arc').options = reading;
`;
