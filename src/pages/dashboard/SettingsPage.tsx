import { useState } from 'react';
import { IconShield } from '@/components/icons';
import { PageHeader } from '@/components/layout/PageHeader';
import { APP_NAME, APP_VERSION } from '@/lib/app-meta';
import { DEFAULT_SETTINGS } from '@/lib/settings';
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Modal,
  Select,
  Tabs,
} from '@/components/ui';

type SettingsTab = 'general' | 'privacy';

export function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('general');
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Control how JobMate behaves. Your data stays on this device."
      />

      <Tabs
        tabs={[
          { id: 'general', label: 'General' },
          { id: 'privacy', label: 'Privacy' },
        ]}
        value={tab}
        onChange={setTab}
      >
        {tab === 'general' ? (
          <div className="grid gap-4 md:max-w-xl">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Autofill safety</CardTitle>
                  <CardDescription>
                    Defaults that keep you in control. Persistence arrives with the autofill engine.
                  </CardDescription>
                </div>
              </CardHeader>
              <div className="grid gap-4">
                <Select
                  label="High-confidence fields"
                  disabled
                  value={DEFAULT_SETTINGS.fillHighConfidenceOnly ? 'high' : 'all'}
                  hint="Only high-confidence fields will be filled automatically."
                >
                  <option value="high">Fill high-confidence only</option>
                  <option value="all">Fill high and medium confidence</option>
                </Select>
                <Select
                  label="Existing values"
                  disabled
                  value={DEFAULT_SETTINGS.overwriteExistingValues ? 'overwrite' : 'keep'}
                  hint="JobMate will not overwrite fields you already typed."
                >
                  <option value="keep">Keep existing values</option>
                  <option value="overwrite">Overwrite existing values</option>
                </Select>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>About</CardTitle>
                  <CardDescription>
                    {APP_NAME} {APP_VERSION}
                  </CardDescription>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setAboutOpen(true)}>
                  Details
                </Button>
              </CardHeader>
            </Card>
          </div>
        ) : (
          <Card className="md:max-w-2xl">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-accent-soft text-accent">
              <IconShield className="h-4 w-4" />
            </div>
            <CardTitle>Local-first by design</CardTitle>
            <div className="mt-3 space-y-3 text-sm text-ink-muted">
              <p>
                {APP_NAME} stores your profile, resumes, and application history on this
                device using Chrome extension storage. Nothing is sent to a JobMate server.
              </p>
              <ul className="list-disc space-y-1.5 pl-4">
                <li>No account and no cloud sync in this version.</li>
                <li>No browsing history collection.</li>
                <li>No analytics, advertising, or password access.</li>
                <li>Page contents are never uploaded.</li>
              </ul>
              <p>
                Autofill runs in your browser. You choose when fields are filled, and
                low-confidence fields are left alone.
              </p>
            </div>
          </Card>
        )}
      </Tabs>

      <Modal
        open={aboutOpen}
        title={`About ${APP_NAME}`}
        onClose={() => setAboutOpen(false)}
        footer={
          <Button variant="secondary" onClick={() => setAboutOpen(false)}>
            Close
          </Button>
        }
      >
        <p>
          A personal job application assistant. Version {APP_VERSION}. Built to save you
          time without taking control away from you.
        </p>
      </Modal>
    </div>
  );
}
