import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'accent';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClass: Record<BadgeTone, string> = {
  neutral: 'bg-surface-muted text-ink-muted',
  success: 'bg-accent-soft text-success',
  warning: 'bg-[#f6efd9] text-warning',
  accent: 'bg-accent-soft text-accent',
};

export function Badge({
  className,
  tone = 'neutral',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium',
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}
