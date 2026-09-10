import type { PersonalInfo, Profile } from './types';

export function getDisplayName(profile: Profile): string {
  const preferred = profile.personal.preferredName.trim();
  if (preferred.length > 0) {
    return preferred;
  }

  return profile.personal.firstName.trim();
}

export function formatAddress(personal: PersonalInfo): string {
  const region = [personal.state, personal.postalCode]
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join(' ');
  const locality = [personal.city.trim(), region]
    .filter((part) => part.length > 0)
    .join(', ');

  return [locality, personal.country.trim()]
    .filter((part) => part.length > 0)
    .join(', ');
}

export const QUICK_COPY_ACTIONS = [
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'github', label: 'GitHub' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'address', label: 'Address' },
] as const;

export type QuickCopyId = (typeof QUICK_COPY_ACTIONS)[number]['id'];

export function getQuickCopyValue(
  profile: Profile,
  id: QuickCopyId,
): string {
  switch (id) {
    case 'email':
      return profile.personal.email.trim();
    case 'phone':
      return profile.personal.phone.trim();
    case 'linkedin':
      return profile.links.linkedin.trim();
    case 'github':
      return profile.links.github.trim();
    case 'portfolio':
      return profile.links.portfolio.trim();
    case 'address':
      return formatAddress(profile.personal);
  }
}
