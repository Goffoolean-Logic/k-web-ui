export type KGaugeSize = 'sm' | 'lg';

export type KGaugeVariant = 'info' | 'success' | 'warning' | 'danger';

export type KGaugeOptions = {
  value?: number;
  max?: number;
  size?: KGaugeSize;
  variant?: KGaugeVariant;
  label?: string;
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
