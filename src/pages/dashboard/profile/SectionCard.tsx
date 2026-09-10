import type { ReactNode } from 'react';
import { Card } from '@/components/ui';

export function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-ink">{title}</h2>
          <p className="mt-1 text-xs text-ink-muted">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}
