import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string;
  onCheckedChange: (checked: boolean) => void;
}

export function Checkbox({
  className,
  label,
  checked,
  onCheckedChange,
  id,
  ...props
}: CheckboxProps) {
  const inputId = id ?? props.name;

  return (
    <label
      htmlFor={inputId}
      className="inline-flex items-center gap-2 text-sm text-ink"
    >
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        className={cn(
          'h-4 w-4 rounded border-border text-accent accent-accent',
          className,
        )}
        onChange={(event) => onCheckedChange(event.target.checked)}
        {...props}
      />
      {label}
    </label>
  );
}
