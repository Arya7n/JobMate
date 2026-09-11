import { useEffect, useRef, useState } from 'react';
import { IconFile, IconPlus } from '@/components/icons';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  EmptyState,
  Input,
  Modal,
  useToast,
} from '@/components/ui';
import {
  fileTypeLabel,
  formatFileSize,
  type ResumeRecord,
} from '@/lib/resume';
import {
  deleteResume,
  getResumes,
  openResume,
  renameResume,
  saveResumeFromFile,
  setDefaultResume,
  subscribeResumes,
} from '@/lib/storage';

export function ResumesPage() {
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [renameTarget, setRenameTarget] = useState<ResumeRecord | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    void getResumes().then((result) => {
      if (result.ok) {
        setResumes(result.data);
      }
      setLoading(false);
    });

    return subscribeResumes(setResumes);
  }, []);

  const onUpload = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) {
      return;
    }

    setBusy(true);
    const result = await saveResumeFromFile(file);
    setBusy(false);
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (!result.ok) {
      showToast(result.error.message);
      return;
    }

    showToast('Resume uploaded');
  };

  const onOpen = async (id: string) => {
    const result = await openResume(id);
    if (!result.ok) {
      showToast(result.error.message);
    }
  };

  const onDefault = async (id: string) => {
    const result = await setDefaultResume(id);
    if (!result.ok) {
      showToast(result.error.message);
      return;
    }
    showToast('Default resume updated');
  };

  const onDelete = async (id: string) => {
    setBusy(true);
    const result = await deleteResume(id);
    setBusy(false);
    if (!result.ok) {
      showToast(result.error.message);
      return;
    }
    showToast('Resume deleted');
  };

  const onRenameSave = async () => {
    if (!renameTarget) {
      return;
    }

    const result = await renameResume(renameTarget.id, renameValue);
    if (!result.ok) {
      showToast(result.error.message);
      return;
    }

    setRenameTarget(null);
    showToast('Resume renamed');
  };

  return (
    <div>
      <PageHeader
        title="Resumes"
        description="Keep multiple versions locally and mark one as default."
        actions={
          <>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(event) => void onUpload(event.target.files)}
            />
            <Button
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              <IconPlus className="h-4 w-4" />
              Upload resume
            </Button>
          </>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-muted">Loading resumes…</p>
      ) : resumes.length === 0 ? (
        <EmptyState
          icon={<IconFile className="h-4 w-4" />}
          title="No resumes uploaded"
          description="Upload PDFs or Word documents, name them, and set a default. Files stay on this device."
          action={
            <Button
              variant="secondary"
              onClick={() => inputRef.current?.click()}
            >
              Upload resume
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="rounded-xl border border-border bg-surface p-4 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <IconFile className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{resume.name}</p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {fileTypeLabel(resume.mimeType)} ·{' '}
                      {formatFileSize(resume.sizeBytes)}
                    </p>
                    {resume.isDefault ? (
                      <Badge tone="accent" className="mt-2">
                        Default
                      </Badge>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => void onOpen(resume.id)}
                  >
                    Open
                  </Button>
                  <Dropdown
                    trigger={
                      <Button variant="ghost" size="sm" aria-label="More actions">
                        •••
                      </Button>
                    }
                  >
                    {!resume.isDefault ? (
                      <DropdownItem onSelect={() => void onDefault(resume.id)}>
                        Set as default
                      </DropdownItem>
                    ) : null}
                    <DropdownItem
                      onSelect={() => {
                        setRenameTarget(resume);
                        setRenameValue(resume.name);
                      }}
                    >
                      Rename
                    </DropdownItem>
                    <DropdownItem onSelect={() => void onDelete(resume.id)}>
                      Delete
                    </DropdownItem>
                  </Dropdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={renameTarget !== null}
        title="Rename resume"
        onClose={() => setRenameTarget(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button onClick={() => void onRenameSave()}>Save</Button>
          </>
        }
      >
        <Input
          label="Name"
          value={renameValue}
          onChange={(event) => setRenameValue(event.target.value)}
        />
      </Modal>
    </div>
  );
}
