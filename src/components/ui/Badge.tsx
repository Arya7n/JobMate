import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'accent' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClass: Record<BadgeTone, string> = {
  neutral: 'bg-surface-muted text-ink-muted',
  success: 'bg-accent-soft text-success',
  warning: 'bg-[#f6efd9] text-warning',
  accent: 'bg-accent-soft text-accent',
  danger: 'bg-danger-soft text-danger',
};

export function Badge({
  className,
  tone = 'neutral',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide',
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}
