import { describe, expect, it } from 'vitest';
import { createEmptyProfile } from './defaults';
import { deserializeProfile, normalizeProfile, serializeProfile } from './normalize';

describe('normalizeProfile', () => {
  it('returns an empty profile for invalid values', () => {
    expect(normalizeProfile(null)).toEqual(createEmptyProfile());
    expect(normalizeProfile('nope')).toEqual(createEmptyProfile());
    expect(normalizeProfile(12)).toEqual(createEmptyProfile());
  });

  it('fills missing personal fields and ignores extras', () => {
    const profile = normalizeProfile({
      personal: {
        firstName: '  Aryan  ',
        extra: 'ignore',
      },
      links: {
        github: 'https://github.com/arya7n',
      },
    });

    expect(profile.personal.firstName).toBe('Aryan');
    expect(profile.personal.email).toBe('');
    expect(profile.links.github).toBe('https://github.com/arya7n');
    expect(profile.version).toBe(1);
  });

  it('dedupes skills case-insensitively and drops blanks', () => {
    const profile = normalizeProfile({
      skills: ['TypeScript', ' typescript ', '', 'React'],
    });

    expect(profile.skills).toEqual(['TypeScript', 'React']);
  });

  it('clears end date when experience is current', () => {
    const profile = normalizeProfile({
      experience: [
        {
          id: 'exp-1',
          company: 'Acme',
          jobTitle: 'Engineer',
          current: true,
          endDate: '2024-01',
        },
      ],
    });

    expect(profile.experience[0]?.endDate).toBe('');
    expect(profile.experience[0]?.current).toBe(true);
  });
});

describe('profile serialization', () => {
  it('round-trips a complete profile', () => {
    const profile = normalizeProfile({
      personal: {
        firstName: 'Aryan',
        lastName: 'Shah',
        email: 'aryan@example.com',
        phone: '555-0100',
        city: 'Austin',
        country: 'United States',
      },
      links: {
        linkedin: 'https://linkedin.com/in/aryan',
      },
      education: [
        {
          id: 'edu-1',
          institution: 'State University',
          degree: 'BS',
        },
      ],
      experience: [
        {
          id: 'exp-1',
          company: 'Acme',
          jobTitle: 'Engineer',
        },
      ],
      skills: ['TypeScript'],
    });

    const restored = deserializeProfile(serializeProfile(profile));
    expect(restored).toEqual(profile);
  });

  it('deserializes stored objects and invalid JSON strings', () => {
    const stored = {
      personal: { firstName: 'Aryan' },
    };

    expect(deserializeProfile(stored).personal.firstName).toBe('Aryan');
    expect(deserializeProfile('{not json')).toEqual(createEmptyProfile());
  });
});
