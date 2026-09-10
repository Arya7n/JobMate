import { IconUser } from '@/components/icons';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, EmptyState } from '@/components/ui';

const SECTIONS = [
  'Personal details',
  'Professional links',
  'Education',
  'Experience',
  'Skills',
] as const;

export function ProfilePage() {
  return (
    <div>
      <PageHeader
        title="Profile"
        description="Your professional identity — stored once, reused on every application."
      />

      <EmptyState
        icon={<IconUser className="h-4 w-4" />}
        title="No profile yet"
        description="Add personal details, education, experience, and skills here. JobMate will keep this data on your device and use it to fill applications with your permission."
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Card key={section} padding="sm">
            <p className="text-sm font-medium text-ink">{section}</p>
            <p className="mt-1 text-xs text-ink-subtle">Ready to edit in the next update.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
