import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-hover focus-visible:ring-accent/30',
  secondary:
    'border border-border bg-surface text-ink hover:bg-surface-muted focus-visible:ring-accent/20',
  ghost:
    'text-ink-muted hover:bg-surface-muted hover:text-ink focus-visible:ring-accent/20',
  danger:
    'bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger/30',
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-45',
        size === 'sm' ? 'h-8 rounded-lg px-2.5 text-xs' : 'h-9 rounded-lg px-3.5 text-sm',
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
}
