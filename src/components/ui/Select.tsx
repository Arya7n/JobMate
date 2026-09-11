import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
}

export function Select({
  className,
  label,
  hint,
  id,
  children,
  ...props
}: SelectProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex flex-col gap-1.5" htmlFor={inputId}>
      {label ? (
        <span className="text-xs font-medium text-ink-muted">{label}</span>
      ) : null}
      <select
        id={inputId}
        className={cn(
          'h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink',
          'outline-none transition-colors focus:border-accent/40 focus:ring-2 focus:ring-accent/15',
          'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {hint ? <span className="text-xs text-ink-subtle">{hint}</span> : null}
    </label>
  );
}
