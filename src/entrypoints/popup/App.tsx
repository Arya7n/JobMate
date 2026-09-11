import { useEffect, useState } from 'react';
import { IconSettings, IconSparkles } from '@/components/icons';
import { Button, Card, ToastProvider, useToast } from '@/components/ui';
import { useProfileSnapshot } from '@/hooks/use-profile';
import { APP_NAME } from '@/lib/app-meta';
import { copyToClipboard } from '@/lib/clipboard/copy';
import {
  getDisplayName,
  getQuickCopyValue,
  QUICK_COPY_ACTIONS,
} from '@/lib/profile';
import { requestAutofill, requestPageScan } from '@/lib/messaging';
import type { PageScanSummary } from '@/lib/site';
import { DASHBOARD_ROUTES } from '@/navigation/routes';
import { formatGreeting } from '@/utils/greeting';
import { openDashboard } from '@/utils/open-dashboard';
import { cn } from '@/utils/cn';

function PopupView() {
  const { profile } = useProfileSnapshot();
  const { showToast } = useToast();
  const greeting = formatGreeting(getDisplayName(profile));
  const [scan, setScan] = useState<PageScanSummary | null>(null);
  const [autofilling, setAutofilling] = useState(false);

  useEffect(() => {
    void requestPageScan().then(setScan);
  }, []);

  const onCopy = async (label: string, value: string) => {
    const copied = await copyToClipboard(value);
    if (copied) {
      showToast(`✓ ${label} copied`);
    }
  };

  const onAutofill = async () => {
    setAutofilling(true);
    const result = await requestAutofill();
    setAutofilling(false);

    if (!result) {
      showToast('Open a job application page first');
      return;
    }

    if (!result.ok) {
      showToast(result.error ?? 'Autofill failed');
      return;
    }

    showToast(`Filled ${result.filled.length} fields`);
    if (result.skipped.some((item) => item.reason === 'No resume uploaded')) {
      showToast('Upload a resume in the dashboard to attach it');
    }
    void requestPageScan().then(setScan);
  };

  const detected = Boolean(scan?.detected);
  const fillable = scan?.high ?? 0;

  return (
    <div className="flex min-h-[520px] flex-col bg-canvas">
      <header className="flex items-center justify-between border-b border-border bg-surface/70 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-soft">
            <img src="/icon-32.png" alt="" className="h-4 w-4 rounded-[3px]" />
          </span>
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
        <p className="text-[17px] font-medium tracking-tight">{greeting}</p>
        <p className="mt-1 text-xs text-ink-muted">
          Your job application assistant.
        </p>

        <Card className="mt-4" padding="sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-ink-muted">
              {detected ? 'Application detected' : 'Current page'}
            </p>
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                detected ? 'bg-accent' : 'bg-border-strong',
              )}
              aria-hidden
            />
          </div>
          {detected ? (
            <>
              <p className="mt-2 text-sm font-medium text-ink">
                {scan?.title || 'Application form'}
              </p>
              <p className="mt-1 text-xs text-ink-subtle">
                {scan?.total ?? 0} fields detected
                {fillable > 0 ? ` · ${fillable} high confidence` : ''}
              </p>
              <Button
                className="mt-3 w-full"
                disabled={autofilling || fillable === 0}
                onClick={() => void onAutofill()}
              >
                <IconSparkles className="h-4 w-4" />
                {autofilling ? 'Filling…' : 'Autofill'}
              </Button>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-ink">No application detected.</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-subtle">
                You can still use Quick Copy and the dashboard.
              </p>
              <Button className="mt-3 w-full" disabled>
                <IconSparkles className="h-4 w-4" />
                Autofill
              </Button>
            </>
          )}
        </Card>

        <div className="mt-5">
          <p className="mb-2 text-xs font-medium text-ink-muted">Quick Copy</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_COPY_ACTIONS.map((action) => {
              const value = getQuickCopyValue(profile, action.id);
              const hasValue = value.length > 0;

              return (
                <Button
                  key={action.id}
                  variant="secondary"
                  size="sm"
                  disabled={!hasValue}
                  title={
                    hasValue
                      ? `Copy ${action.label}`
                      : 'Add this in your profile first'
                  }
                  onClick={() => void onCopy(action.label, value)}
                >
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="border-t border-border bg-surface/60 px-4 py-3">
        <button
          type="button"
          className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
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
