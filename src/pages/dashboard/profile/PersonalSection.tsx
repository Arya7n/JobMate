import { Input } from '@/components/ui';
import type { PersonalInfo } from '@/lib/profile';
import { SectionCard } from './SectionCard';

export function PersonalSection({
  value,
  onChange,
}: {
  value: PersonalInfo;
  onChange: (value: PersonalInfo) => void;
}) {
  const update = (field: keyof PersonalInfo, next: string) => {
    onChange({ ...value, [field]: next });
  };

  return (
    <SectionCard
      title="Personal"
      description="The basics most applications ask for first."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <Input
          id="personal-firstName"
          label="First name"
          autoComplete="given-name"
          value={value.firstName}
          onChange={(event) => update('firstName', event.target.value)}
        />
        <Input
          id="personal-middleName"
          label="Middle name"
          autoComplete="additional-name"
          value={value.middleName}
          onChange={(event) => update('middleName', event.target.value)}
        />
        <Input
          id="personal-lastName"
          label="Last name"
          autoComplete="family-name"
          value={value.lastName}
          onChange={(event) => update('lastName', event.target.value)}
        />
        <div className="sm:col-span-3">
          <Input
            id="personal-preferredName"
            label="Preferred name"
            value={value.preferredName}
            onChange={(event) => update('preferredName', event.target.value)}
          />
        </div>
        <Input
          id="personal-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={value.email}
          onChange={(event) => update('email', event.target.value)}
        />
        <Input
          id="personal-phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          value={value.phone}
          onChange={(event) => update('phone', event.target.value)}
        />
        <Input
          id="personal-country"
          label="Country"
          autoComplete="country-name"
          value={value.country}
          onChange={(event) => update('country', event.target.value)}
        />
        <Input
          id="personal-city"
          label="City"
          autoComplete="address-level2"
          value={value.city}
          onChange={(event) => update('city', event.target.value)}
        />
        <Input
          id="personal-state"
          label="State"
          autoComplete="address-level1"
          value={value.state}
          onChange={(event) => update('state', event.target.value)}
        />
        <Input
          id="personal-postalCode"
          label="ZIP / Postal code"
          autoComplete="postal-code"
          value={value.postalCode}
          onChange={(event) => update('postalCode', event.target.value)}
        />
      </div>
    </SectionCard>
  );
}
