import { DashboardShell } from '@/components/layout/DashboardShell';
import { ToastProvider } from '@/components/ui';
import { DASHBOARD_ROUTES } from '@/navigation/routes';
import { useHashRoute } from '@/navigation/use-hash-route';
import { ApplicationsPage } from '@/pages/dashboard/ApplicationsPage';
import { OverviewPage } from '@/pages/dashboard/OverviewPage';
import { ProfilePage } from '@/pages/dashboard/ProfilePage';
import { ResumesPage } from '@/pages/dashboard/ResumesPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';

export function App() {
  const route = useHashRoute();

  return (
    <ToastProvider>
      <DashboardShell route={route}>
        {route === DASHBOARD_ROUTES.overview ? <OverviewPage /> : null}
        {route === DASHBOARD_ROUTES.profile ? <ProfilePage /> : null}
        {route === DASHBOARD_ROUTES.resumes ? <ResumesPage /> : null}
        {route === DASHBOARD_ROUTES.applications ? <ApplicationsPage /> : null}
        {route === DASHBOARD_ROUTES.settings ? <SettingsPage /> : null}
      </DashboardShell>
    </ToastProvider>
  );
}
