import { IconSettings, IconSparkles } from '@/components/icons';
import { Button, Card, ToastProvider } from '@/components/ui';
import { APP_NAME } from '@/lib/app-meta';
import { DASHBOARD_ROUTES } from '@/navigation/routes';
import { getGreeting } from '@/utils/greeting';
import { openDashboard } from '@/utils/open-dashboard';

const QUICK_COPY_ACTIONS = [
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'github', label: 'GitHub' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
] as const;

function PopupView() {
  const greeting = getGreeting();

  return (
    <div className="flex min-h-[520px] flex-col bg-canvas">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/icon-32.png" alt="" className="h-5 w-5 rounded-[4px]" />
          <span className="text-sm font-medium tracking-tight">{APP_NAME}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Open settings"
          className="h-8 w-8 px-0"
          onClick={() => void openDashboard(DASHBOARD_ROUTES.settings)}
        >
          <IconSettings className="h-4 w-4" />
        </Button>
      </header>

      <div className="flex flex-1 flex-col px-4 py-4">
        <p className="text-base font-medium tracking-tight">{greeting}</p>
        <p className="mt-1 text-xs text-ink-muted">
          Your job application assistant.
        </p>

        <Card className="mt-4" padding="sm">
          <p className="text-xs font-medium text-ink-muted">Application detected</p>
          <p className="mt-2 text-sm text-ink">No application detected.</p>
          <p className="mt-1 text-xs text-ink-subtle">
            You can still use Quick Copy and the dashboard.
          </p>
          <Button className="mt-3 w-full" disabled>
            <IconSparkles className="h-4 w-4" />
            Autofill
          </Button>
        </Card>

        <div className="mt-5">
          <p className="mb-2 text-xs font-medium text-ink-muted">Quick Copy</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_COPY_ACTIONS.map((action) => (
              <Button
                key={action.id}
                variant="secondary"
                size="sm"
                disabled
                title="Add this in your profile first"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-border px-4 py-3">
        <button
          type="button"
          className="text-sm text-ink-muted transition-colors hover:text-ink"
          onClick={() => void openDashboard()}
        >
          Open Dashboard →
        </button>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <PopupView />
    </ToastProvider>
  );
}
