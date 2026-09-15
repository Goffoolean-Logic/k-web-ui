export type KGaugeSize = 'sm' | 'lg';

export type KGaugeVariant = 'info' | 'success' | 'warning' | 'danger';

export type KGaugeOptions = {
  value?: number;
  max?: number;
  ring?: boolean;
  block?: boolean;
  size?: KGaugeSize;
  variant?: KGaugeVariant;
  label?: string;
  text?: string;
  indeterminate?: boolean;
};
