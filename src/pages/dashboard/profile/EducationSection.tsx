import { IconPlus, IconTrash } from '@/components/icons';
import { Button, Input, Textarea } from '@/components/ui';
import { createEmptyEducation, type EducationEntry } from '@/lib/profile';
import { SectionCard } from './SectionCard';

export function EducationSection({
  value,
  onChange,
}: {
  value: EducationEntry[];
  onChange: (value: EducationEntry[]) => void;
}) {
  const add = () => {
    onChange([...value, createEmptyEducation()]);
  };

  const update = (id: string, patch: Partial<EducationEntry>) => {
    onChange(
      value.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    );
  };

  const remove = (id: string) => {
    onChange(value.filter((entry) => entry.id !== id));
  };

  return (
    <SectionCard
      title="Education"
      description="Add every school you may need on an application."
      action={
        <Button variant="secondary" size="sm" onClick={add}>
          <IconPlus className="h-3.5 w-3.5" />
          Add education
        </Button>
      }
    >
      {value.length === 0 ? (
        <p className="text-sm text-ink-subtle">No education added yet.</p>
      ) : (
        <div className="grid gap-4">
          {value.map((entry, index) => (
            <div
              key={entry.id}
              className="rounded-xl border border-border bg-canvas/60 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-ink-muted">
                  School {index + 1}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Remove school ${index + 1}`}
                  onClick={() => remove(entry.id)}
                >
                  <IconTrash className="h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  id={`${entry.id}-institution`}
                  label="Institution"
                  value={entry.institution}
                  onChange={(event) =>
                    update(entry.id, { institution: event.target.value })
                  }
                />
                <Input
                  id={`${entry.id}-degree`}
                  label="Degree"
                  value={entry.degree}
                  onChange={(event) =>
                    update(entry.id, { degree: event.target.value })
                  }
                />
                <Input
                  id={`${entry.id}-field`}
                  label="Field of study"
                  value={entry.fieldOfStudy}
                  onChange={(event) =>
                    update(entry.id, { fieldOfStudy: event.target.value })
                  }
                />
                <Input
                  id={`${entry.id}-gpa`}
                  label="GPA"
                  value={entry.gpa}
                  onChange={(event) =>
                    update(entry.id, { gpa: event.target.value })
                  }
                />
                <Input
                  id={`${entry.id}-start`}
                  label="Start date"
                  type="month"
                  value={entry.startDate}
                  onChange={(event) =>
                    update(entry.id, { startDate: event.target.value })
                  }
                />
                <Input
                  id={`${entry.id}-end`}
                  label="End date"
                  type="month"
                  value={entry.endDate}
                  onChange={(event) =>
                    update(entry.id, { endDate: event.target.value })
                  }
                />
                <div className="sm:col-span-2">
                  <Textarea
                    id={`${entry.id}-description`}
                    label="Description"
                    rows={3}
                    value={entry.description}
                    onChange={(event) =>
                      update(entry.id, { description: event.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
