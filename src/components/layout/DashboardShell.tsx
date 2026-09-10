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
        <aside className="hidden w-56 shrink-0 border-r border-border px-4 py-6 md:block">
          <div className="mb-8 flex items-center gap-2 px-2">
            <img src="/icon-32.png" alt="" className="h-6 w-6 rounded-[5px]" />
            <span className="text-sm font-medium tracking-tight">{APP_NAME}</span>
          </div>
          <nav aria-label="Dashboard" className="flex flex-col gap-0.5">
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
            className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 md:hidden"
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
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
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
        'flex items-center gap-2 rounded-md text-sm transition-colors',
        compact ? 'whitespace-nowrap px-2.5 py-1.5' : 'px-2 py-1.5',
        active
          ? 'bg-surface-muted font-medium text-ink'
          : 'text-ink-muted hover:bg-surface-muted/70 hover:text-ink',
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </a>
  );
}
