import { Input } from '@/components/ui';
import type { ProfessionalLinks } from '@/lib/profile';
import { SectionCard } from './SectionCard';

export function LinksSection({
  value,
  onChange,
}: {
  value: ProfessionalLinks;
  onChange: (value: ProfessionalLinks) => void;
}) {
  const update = (field: keyof ProfessionalLinks, next: string) => {
    onChange({ ...value, [field]: next });
  };

  return (
    <SectionCard
      title="Professional links"
      description="URLs you reuse on applications and recruiter forms."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          id="links-linkedin"
          label="LinkedIn"
          inputMode="url"
          placeholder="https://linkedin.com/in/…"
          value={value.linkedin}
          onChange={(event) => update('linkedin', event.target.value)}
        />
        <Input
          id="links-github"
          label="GitHub"
          inputMode="url"
          placeholder="https://github.com/…"
          value={value.github}
          onChange={(event) => update('github', event.target.value)}
        />
        <Input
          id="links-portfolio"
          label="Portfolio"
          inputMode="url"
          placeholder="https://"
          value={value.portfolio}
          onChange={(event) => update('portfolio', event.target.value)}
        />
        <Input
          id="links-website"
          label="Personal website"
          inputMode="url"
          placeholder="https://"
          value={value.website}
          onChange={(event) => update('website', event.target.value)}
        />
        <div className="sm:col-span-2">
          <Input
            id="links-otherUrl"
            label="Other professional URL"
            inputMode="url"
            placeholder="https://"
            value={value.otherUrl}
            onChange={(event) => update('otherUrl', event.target.value)}
          />
        </div>
      </div>
    </SectionCard>
  );
}
