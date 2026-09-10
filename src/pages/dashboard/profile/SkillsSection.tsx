import { type KeyboardEvent, useState } from 'react';
import { IconX } from '@/components/icons';
import { Button, Input } from '@/components/ui';
import { SectionCard } from './SectionCard';

export function SkillsSection({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  const addSkill = () => {
    const skill = draft.trim();
    if (skill.length === 0) {
      return;
    }

    const exists = value.some(
      (item) => item.toLowerCase() === skill.toLowerCase(),
    );
    if (!exists) {
      onChange([...value, skill]);
    }

    setDraft('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSkill();
    }
  };

  const remove = (skill: string) => {
    onChange(value.filter((item) => item !== skill));
  };

  return (
    <SectionCard
      title="Skills"
      description="A reusable list for application skill fields."
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            id="skill-draft"
            label="Add a skill"
            value={draft}
            placeholder="TypeScript"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <Button type="button" variant="secondary" onClick={addSkill}>
          Add
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="mt-3 text-sm text-ink-subtle">No skills added yet.</p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {value.map((skill) => (
            <li key={skill}>
              <span className="inline-flex items-center gap-1 rounded-md bg-surface-muted px-2 py-1 text-xs text-ink">
                {skill}
                <button
                  type="button"
                  className="rounded-sm text-ink-muted hover:text-ink"
                  aria-label={`Remove ${skill}`}
                  onClick={() => remove(skill)}
                >
                  <IconX className="h-3 w-3" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
