export const DASHBOARD_ROUTES = {
  overview: 'overview',
  profile: 'profile',
  resumes: 'resumes',
  applications: 'applications',
  settings: 'settings',
} as const;

export type DashboardRoute =
  (typeof DASHBOARD_ROUTES)[keyof typeof DASHBOARD_ROUTES];

const ROUTE_VALUES = new Set<string>(Object.values(DASHBOARD_ROUTES));

export function parseDashboardHash(hash: string): DashboardRoute {
  const value = hash.replace(/^#\/?/, '').split('/')[0] ?? '';

  if (ROUTE_VALUES.has(value)) {
    return value as DashboardRoute;
  }

  return DASHBOARD_ROUTES.overview;
}

export function dashboardHash(route: DashboardRoute): string {
  return `#/${route}`;
}
