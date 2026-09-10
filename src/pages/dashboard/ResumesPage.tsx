import { IconFile, IconPlus } from '@/components/icons';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, EmptyState } from '@/components/ui';

export function ResumesPage() {
  return (
    <div>
      <PageHeader
        title="Resumes"
        description="Keep multiple versions locally and mark one as default."
        actions={
          <Button disabled>
            <IconPlus className="h-4 w-4" />
            Upload resume
          </Button>
        }
      />

      <EmptyState
        icon={<IconFile className="h-4 w-4" />}
        title="No resumes uploaded"
        description="Upload PDFs or documents, name them, and set a default. Files stay on this device — nothing is uploaded to a server."
      />
    </div>
  );
}
