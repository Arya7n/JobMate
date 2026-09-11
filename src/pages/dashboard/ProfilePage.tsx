import { useEffect, type FormEvent } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, useToast } from '@/components/ui';
import { useProfileEditor } from '@/hooks/use-profile';
import { EducationSection } from './profile/EducationSection';
import { ExperienceSection } from './profile/ExperienceSection';
import { LinksSection } from './profile/LinksSection';
import { PersonalSection } from './profile/PersonalSection';
import { SkillsSection } from './profile/SkillsSection';

export function ProfilePage() {
  const {
    profile,
    setProfile,
    status,
    errorMessage,
    saving,
    dirty,
    save,
    discard,
    reload,
  } = useProfileEditor();
  const { showToast } = useToast();

  useEffect(() => {
    if (!dirty) {
      return;
    }

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const saved = await save();
    if (saved) {
      showToast('Profile saved');
    }
  };

  if (status === 'loading') {
    return (
      <div>
        <PageHeader
          title="Profile"
          description="Your professional identity — stored once, reused on every application."
        />
        <p className="text-sm text-ink-muted">Loading profile…</p>
      </div>
    );
  }

  if (status === 'error' && !dirty) {
    return (
      <div>
        <PageHeader
          title="Profile"
          description="Your professional identity — stored once, reused on every application."
        />
        <p className="text-sm text-ink-muted">
          {errorMessage ?? "Couldn't load your profile."}
        </p>
        <Button className="mt-3" variant="secondary" onClick={() => void reload()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <form className="pb-16" onSubmit={(event) => void onSubmit(event)}>
      <PageHeader
        title="Profile"
        description="Your professional identity — stored once on this device."
      />

      <div className="grid gap-4">
        <PersonalSection
          value={profile.personal}
          onChange={(personal) => setProfile({ ...profile, personal })}
        />
        <LinksSection
          value={profile.links}
          onChange={(links) => setProfile({ ...profile, links })}
        />
        <EducationSection
          value={profile.education}
          onChange={(education) => setProfile({ ...profile, education })}
        />
        <ExperienceSection
          value={profile.experience}
          onChange={(experience) => setProfile({ ...profile, experience })}
        />
        <SkillsSection
          value={profile.skills}
          onChange={(skills) => setProfile({ ...profile, skills })}
        />
      </div>

      <div className="sticky bottom-0 z-10 mt-6 -mx-4 border-t border-border bg-canvas/90 px-4 py-3 shadow-[0_-8px_24px_rgb(22_21_19_/_0.04)] backdrop-blur md:-mx-8 md:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={!dirty || saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={!dirty || saving}
            onClick={discard}
          >
            Discard
          </Button>
          <p className="text-xs text-ink-subtle">
            {errorMessage
              ? errorMessage
              : dirty
                ? 'Unsaved changes stay on this page until you save.'
                : 'Saved on this device.'}
          </p>
        </div>
      </div>
    </form>
  );
}
