import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { useProfileSnapshot } from '@/hooks/use-profile';
import { getProfileCompletion } from '@/lib/profile';
import {
  getApplicationStats,
  getApplications,
  subscribeApplications,
} from '@/lib/storage';
import type { JobApplication } from '@/lib/applications';
import { DASHBOARD_ROUTES, dashboardHash } from '@/navigation/routes';

export function OverviewPage() {
  const { profile, status } = useProfileSnapshot();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const completion = status === 'ready' ? getProfileCompletion(profile) : 0;
  const stats = getApplicationStats(applications);

  useEffect(() => {
    void getApplications().then((result) => {
      if (result.ok) {
        setApplications(result.data);
      }
    });
    return subscribeApplications(setApplications);
  }, []);

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
            <Badge tone={completion >= 80 ? 'success' : 'accent'}>
              {completion}%
            </Badge>
          </CardHeader>
          <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-accent transition-[width]"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
            Counts name, email, phone, location, a professional link, education,
            experience, and skills.{' '}
            <a
              href={dashboardHash(DASHBOARD_ROUTES.profile)}
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              Edit profile
            </a>
          </p>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Applications</CardTitle>
              <CardDescription>
                {stats.total === 0
                  ? 'Nothing tracked yet.'
                  : `${stats.total} total in your pipeline.`}
              </CardDescription>
            </div>
          </CardHeader>
          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <Stat label="Total" value={String(stats.total)} />
            <Stat label="Applied" value={String(stats.applied)} />
            <Stat label="Interviews" value={String(stats.interviews)} />
            <Stat label="Offers" value={String(stats.offers)} />
          </dl>
          <p className="mt-4 text-xs text-ink-subtle">
            <a
              href={dashboardHash(DASHBOARD_ROUTES.applications)}
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              Manage applications
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-muted/80 px-3 py-2.5">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-subtle">
        {label}
      </dt>
      <dd className="mt-1 text-lg font-medium tracking-tight text-ink">{value}</dd>
    </div>
  );
}
