import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, Card, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { useProfileSnapshot } from '@/hooks/use-profile';
import { getProfileCompletion } from '@/lib/profile';
import { DASHBOARD_ROUTES, dashboardHash } from '@/navigation/routes';

export function OverviewPage() {
  const { profile, status } = useProfileSnapshot();
  const completion = status === 'ready' ? getProfileCompletion(profile) : 0;

  return (
    <div>
      <PageHeader
        title="Overview"
        description="A snapshot of your profile readiness and application pipeline."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Profile completion</CardTitle>
              <CardDescription>
                {completion === 0
                  ? 'Fill in your profile to unlock faster autofill.'
                  : 'Keep adding details to improve autofill coverage.'}
              </CardDescription>
            </div>
            <Badge tone={completion >= 80 ? 'success' : 'neutral'}>
              {completion}%
            </Badge>
          </CardHeader>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-accent transition-[width]"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-ink-subtle">
            Counts name, email, phone, location, a professional link, education,
            experience, and skills.{' '}
            <a
              href={dashboardHash(DASHBOARD_ROUTES.profile)}
              className="text-ink underline-offset-2 hover:underline"
            >
              Edit profile
            </a>
          </p>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Applications</CardTitle>
              <CardDescription>Nothing tracked yet.</CardDescription>
            </div>
          </CardHeader>
          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Stat label="Total" value="0" />
            <Stat label="Applied" value="0" />
            <Stat label="Interviews" value="0" />
            <Stat label="Offers" value="0" />
          </dl>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-subtle">{label}</dt>
      <dd className="mt-1 text-lg font-medium tracking-tight text-ink">{value}</dd>
    </div>
  );
}
