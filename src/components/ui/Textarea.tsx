import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export function Textarea({
  className,
  label,
  hint,
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex flex-col gap-1.5" htmlFor={inputId}>
      {label ? (
        <span className="text-xs font-medium text-ink-muted">{label}</span>
      ) : null}
      <textarea
        id={inputId}
        rows={rows}
        className={cn(
          'w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-subtle',
          'outline-none transition-colors focus:border-accent/40 focus:ring-2 focus:ring-accent/15',
          'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted',
          className,
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-ink-subtle">{hint}</span> : null}
    </label>
  );
}
