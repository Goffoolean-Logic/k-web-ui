export type KGaugeSize = 'sm' | 'lg';

export type KGaugeVariant = 'info' | 'success' | 'warning' | 'danger';

export type KGaugeOptions = {
  value?: number;
  max?: number;
  size?: KGaugeSize;
  variant?: KGaugeVariant;
  label?: string;
  /**
   * How to write the dial reading from value.
   * Omit for a plain number. Pass "%" for a percent. Pass any other string
   * (e.g. "$", "€") to prefix the value as currency.
   * An explicit `text` still wins when you need a one-off string.
   */
  format?: string;
  text?: string;
  indeterminate?: boolean;
};

export function isGaugeSize(value: string | null): value is KGaugeSize {
  return value === 'sm' || value === 'lg';
}

export function isGaugeVariant(value: string | null): value is KGaugeVariant {
  return (
    value === 'info' ||
    value === 'success' ||
    value === 'warning' ||
    value === 'danger'
  );
}
