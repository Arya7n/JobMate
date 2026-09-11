import type { ReactNode } from 'react';
import {
  IconBriefcase,
  IconFile,
  IconLayout,
  IconSettings,
  IconUser,
} from '@/components/icons';
import { APP_NAME } from '@/lib/app-meta';
import {
  DASHBOARD_ROUTES,
  dashboardHash,
  type DashboardRoute,
} from '@/navigation/routes';
import { cn } from '@/utils/cn';

const NAV_ITEMS: ReadonlyArray<{
  route: DashboardRoute;
  label: string;
  icon: typeof IconLayout;
}> = [
  { route: DASHBOARD_ROUTES.overview, label: 'Overview', icon: IconLayout },
  { route: DASHBOARD_ROUTES.profile, label: 'Profile', icon: IconUser },
  { route: DASHBOARD_ROUTES.resumes, label: 'Resumes', icon: IconFile },
  {
    route: DASHBOARD_ROUTES.applications,
    label: 'Applications',
    icon: IconBriefcase,
  },
  { route: DASHBOARD_ROUTES.settings, label: 'Settings', icon: IconSettings },
];

export function DashboardShell({
  route,
  children,
}: {
  route: DashboardRoute;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border px-4 py-6 md:block">
          <div className="mb-8 flex items-center gap-2.5 px-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft">
              <img src="/icon-32.png" alt="" className="h-5 w-5 rounded-[4px]" />
            </span>
            <div>
              <p className="text-sm font-medium tracking-tight">{APP_NAME}</p>
              <p className="text-[11px] text-ink-subtle">Local workspace</p>
            </div>
          </div>
          <nav aria-label="Dashboard" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.route}
                item={item}
                active={item.route === route}
              />
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <nav
            aria-label="Dashboard"
            className="flex gap-1 overflow-x-auto border-b border-border bg-surface/80 px-4 py-2 backdrop-blur md:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.route}
                item={item}
                active={item.route === route}
                compact
              />
            ))}
          </nav>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-9">{children}</main>
        </div>
      </div>
    </div>
  );
}

function NavLink({
  item,
  active,
  compact = false,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  compact?: boolean;
}) {
  const Icon = item.icon;

  return (
    <a
      href={dashboardHash(item.route)}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2 rounded-lg text-sm transition-colors',
        compact ? 'whitespace-nowrap px-2.5 py-1.5' : 'px-2.5 py-2',
        active
          ? 'bg-accent-soft font-medium text-accent'
          : 'text-ink-muted hover:bg-surface-muted/80 hover:text-ink',
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </a>
  );
}
