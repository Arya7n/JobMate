import { IconBriefcase } from '@/components/icons';
import { PageHeader } from '@/components/layout/PageHeader';
import { APPLICATION_STATUS_LABELS } from '@/lib/applications';
import { Badge, EmptyState } from '@/components/ui';

export function ApplicationsPage() {
  return (
    <div>
      <PageHeader
        title="Applications"
        description="Track where you applied, what you sent, and where each role stands."
      />

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted/60 text-xs text-ink-muted">
            <tr>
              <th className="px-4 py-2.5 font-medium">Company</th>
              <th className="px-4 py-2.5 font-medium">Position</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="p-0">
                <EmptyState
                  className="rounded-none border-0"
                  icon={<IconBriefcase className="h-4 w-4" />}
                  title="No applications yet"
                  description="When you start tracking roles, they'll appear here with status, resume used, and notes."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {Object.values(APPLICATION_STATUS_LABELS).map((label) => (
          <Badge key={label}>{label}</Badge>
        ))}
      </div>
    </div>
  );
}
