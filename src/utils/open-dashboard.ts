import { browser } from 'wxt/browser';
import {
  DASHBOARD_ROUTES,
  type DashboardRoute,
} from '@/navigation/routes';

export async function openDashboard(
  route: DashboardRoute = DASHBOARD_ROUTES.overview,
): Promise<void> {
  const url = browser.runtime.getURL(`/dashboard.html#/${route}`);
  await browser.tabs.create({ url });
}
