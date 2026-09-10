import { IconPlus, IconTrash } from '@/components/icons';
import { Button, Checkbox, Input, Textarea } from '@/components/ui';
import { createEmptyExperience, type ExperienceEntry } from '@/lib/profile';
import { SectionCard } from './SectionCard';

export function ExperienceSection({
  value,
  onChange,
}: {
  value: ExperienceEntry[];
  onChange: (value: ExperienceEntry[]) => void;
}) {
  const add = () => {
    onChange([...value, createEmptyExperience()]);
  };

  const update = (id: string, patch: Partial<ExperienceEntry>) => {
    onChange(
      value.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    );
  };

  const remove = (id: string) => {
    onChange(value.filter((entry) => entry.id !== id));
  };

  return (
    <SectionCard
      title="Experience"
      description="Roles you may copy into work history fields."
      action={
        <Button variant="secondary" size="sm" onClick={add}>
          <IconPlus className="h-3.5 w-3.5" />
          Add experience
        </Button>
      }
    >
      {value.length === 0 ? (
        <p className="text-sm text-ink-subtle">No experience added yet.</p>
      ) : (
        <div className="grid gap-4">
          {value.map((entry, index) => (
            <div
              key={entry.id}
              className="rounded-md border border-border bg-canvas/60 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-ink-muted">
                  Role {index + 1}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Remove role ${index + 1}`}
                  onClick={() => remove(entry.id)}
                >
                  <IconTrash className="h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  id={`${entry.id}-company`}
                  label="Company"
                  value={entry.company}
                  onChange={(event) =>
                    update(entry.id, { company: event.target.value })
                  }
                />
                <Input
                  id={`${entry.id}-title`}
                  label="Job title"
                  value={entry.jobTitle}
                  onChange={(event) =>
                    update(entry.id, { jobTitle: event.target.value })
                  }
                />
                <div className="sm:col-span-2">
                  <Input
                    id={`${entry.id}-location`}
                    label="Location"
                    value={entry.location}
                    onChange={(event) =>
                      update(entry.id, { location: event.target.value })
                    }
                  />
                </div>
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
                  disabled={entry.current}
                  value={entry.current ? '' : entry.endDate}
                  onChange={(event) =>
                    update(entry.id, { endDate: event.target.value })
                  }
                />
                <div className="sm:col-span-2">
                  <Checkbox
                    id={`${entry.id}-current`}
                    label="Current position"
                    checked={entry.current}
                    onCheckedChange={(current) =>
                      update(entry.id, {
                        current,
                        endDate: current ? '' : entry.endDate,
                      })
                    }
                  />
                </div>
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
