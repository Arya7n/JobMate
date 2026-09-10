import { useEffect, useState } from 'react';
import { parseDashboardHash, type DashboardRoute } from './routes';

export function useHashRoute(): DashboardRoute {
  const [route, setRoute] = useState<DashboardRoute>(() =>
    parseDashboardHash(window.location.hash),
  );

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseDashboardHash(window.location.hash));
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}
