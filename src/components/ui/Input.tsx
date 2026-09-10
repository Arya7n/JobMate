import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function Input({
  className,
  label,
  hint,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex flex-col gap-1.5" htmlFor={inputId}>
      {label ? (
        <span className="text-xs font-medium text-ink-muted">{label}</span>
      ) : null}
      <input
        id={inputId}
        className={cn(
          'h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-ink placeholder:text-ink-subtle',
          'outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-ink/10',
          'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted',
          className,
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-ink-subtle">{hint}</span> : null}
    </label>
  );
}
