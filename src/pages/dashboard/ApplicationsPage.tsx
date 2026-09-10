import { useEffect, useMemo, useState } from 'react';
import { IconBriefcase, IconPlus } from '@/components/icons';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Modal,
  Select,
  Textarea,
  useToast,
} from '@/components/ui';
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type JobApplication,
} from '@/lib/applications';
import {
  deleteApplication,
  getApplications,
  getResumes,
  saveApplication,
  subscribeApplications,
  type ApplicationInput,
} from '@/lib/storage';
import type { ResumeRecord } from '@/lib/resume';

const emptyDraft = (): ApplicationInput => ({
  company: '',
  position: '',
  url: '',
  dateApplied: new Date().toISOString().slice(0, 10),
  status: 'saved',
  resumeId: undefined,
  notes: '',
});

export function ApplicationsPage() {
  const { showToast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<ApplicationInput>(emptyDraft);
  const [editingId, setEditingId] = useState<string | undefined>();

  useEffect(() => {
    void Promise.all([getApplications(), getResumes()]).then(
      ([appsResult, resumesResult]) => {
        if (appsResult.ok) {
          setApplications(appsResult.data);
        }
        if (resumesResult.ok) {
          setResumes(resumesResult.data);
        }
        setLoading(false);
      },
    );

    return subscribeApplications(setApplications);
  }, []);

  const resumeNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const resume of resumes) {
      map.set(resume.id, resume.name);
    }
    return map;
  }, [resumes]);

  const openCreate = () => {
    setEditingId(undefined);
    setDraft({
      ...emptyDraft(),
      resumeId: resumes.find((item) => item.isDefault)?.id,
    });
    setEditorOpen(true);
  };

  const openEdit = (application: JobApplication) => {
    setEditingId(application.id);
    setDraft({
      company: application.company ?? '',
      position: application.position ?? '',
      url: application.url ?? '',
      dateApplied: application.dateApplied ?? '',
      status: application.status,
      resumeId: application.resumeId,
      notes: application.notes ?? '',
    });
    setEditorOpen(true);
  };

  const onSave = async () => {
    const result = await saveApplication({
      ...draft,
      id: editingId,
    });
    if (!result.ok) {
      showToast(result.error.message);
      return;
    }

    setEditorOpen(false);
    showToast(editingId ? 'Application updated' : 'Application saved');
  };

  const onDelete = async (id: string) => {
    const result = await deleteApplication(id);
    if (!result.ok) {
      showToast(result.error.message);
      return;
    }
    showToast('Application deleted');
  };

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Track where you applied, what you sent, and where each role stands."
        actions={
          <Button onClick={openCreate}>
            <IconPlus className="h-4 w-4" />
            Add application
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-muted">Loading applications…</p>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<IconBriefcase className="h-4 w-4" />}
          title="No applications yet"
          description="When you start tracking roles, they'll appear here with status, resume used, and notes."
          action={
            <Button variant="secondary" onClick={openCreate}>
              Add application
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-muted/60 text-xs text-ink-muted">
              <tr>
                <th className="px-4 py-2.5 font-medium">Company</th>
                <th className="px-4 py-2.5 font-medium">Position</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Resume</th>
                <th className="px-4 py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr
                  key={application.id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3 text-ink">
                    {application.company || '—'}
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {application.position || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge>
                      {APPLICATION_STATUS_LABELS[application.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {application.resumeId
                      ? resumeNameById.get(application.resumeId) ?? '—'
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(application)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void onDelete(application.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={editorOpen}
        title={editingId ? 'Edit application' : 'Add application'}
        onClose={() => setEditorOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void onSave()}>Save</Button>
          </>
        }
      >
        <div className="grid gap-3">
          <Input
            label="Company"
            value={draft.company ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                company: event.target.value,
              }))
            }
          />
          <Input
            label="Position"
            value={draft.position ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                position: event.target.value,
              }))
            }
          />
          <Input
            label="URL"
            value={draft.url ?? ''}
            onChange={(event) =>
              setDraft((current) => ({ ...current, url: event.target.value }))
            }
          />
          <Input
            label="Date applied"
            type="date"
            value={draft.dateApplied ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                dateApplied: event.target.value,
              }))
            }
          />
          <Select
            label="Status"
            value={draft.status}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                status: event.target.value as ApplicationStatus,
              }))
            }
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {APPLICATION_STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
          <Select
            label="Resume"
            value={draft.resumeId ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                resumeId: event.target.value || undefined,
              }))
            }
          >
            <option value="">None</option>
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.name}
                {resume.isDefault ? ' (default)' : ''}
              </option>
            ))}
          </Select>
          <Textarea
            label="Notes"
            rows={3}
            value={draft.notes ?? ''}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
          />
        </div>
      </Modal>
    </div>
  );
}
