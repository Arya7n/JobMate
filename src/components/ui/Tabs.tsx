import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface TabItem<Id extends string = string> {
  id: Id;
  label: string;
}

export interface TabsProps<Id extends string> {
  tabs: ReadonlyArray<TabItem<Id>>;
  value: Id;
  onChange: (id: Id) => void;
  children: ReactNode;
}

export function Tabs<Id extends string>({
  tabs,
  value,
  onChange,
  children,
}: TabsProps<Id>) {
  return (
    <div>
      <div
        role="tablist"
        className="mb-5 flex gap-1 border-b border-border"
      >
        {tabs.map((tab) => {
          const selected = tab.id === value;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={cn(
                '-mb-px border-b-2 px-3 py-2 text-sm transition-colors',
                selected
                  ? 'border-ink font-medium text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink',
              )}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">{children}</div>
    </div>
  );
}
