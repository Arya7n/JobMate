import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, Card, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export function OverviewPage() {
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
                Fill in your profile to unlock faster autofill.
              </CardDescription>
            </div>
            <Badge>0%</Badge>
          </CardHeader>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full w-0 rounded-full bg-accent" />
          </div>
          <p className="mt-3 text-xs text-ink-subtle">
            Personal details, links, education, experience, and skills will count toward this score.
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
