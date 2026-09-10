import { describe, expect, it } from 'vitest';
import { getProfileValueForField } from './profile-values';
import { normalizeProfile } from '@/lib/profile';

describe('getProfileValueForField', () => {
  const profile = normalizeProfile({
    personal: {
      firstName: 'Aryan',
      middleName: 'K',
      lastName: 'Shah',
      email: 'aryan@example.com',
      phone: '555-0100',
      city: 'Austin',
      state: 'TX',
      country: 'United States',
      postalCode: '78701',
    },
    links: {
      linkedin: 'https://linkedin.com/in/aryan',
      github: 'https://github.com/arya7n',
      portfolio: 'https://aryan.dev',
    },
    education: [
      {
        id: 'edu-1',
        institution: 'State University',
        degree: 'BS',
        fieldOfStudy: 'CS',
      },
    ],
    experience: [
      {
        id: 'exp-1',
        company: 'Acme',
        jobTitle: 'Engineer',
      },
    ],
  });

  it('maps detected fields onto profile properties', () => {
    expect(getProfileValueForField(profile, 'email')).toBe(
      'aryan@example.com',
    );
    expect(getProfileValueForField(profile, 'phone')).toBe('555-0100');
    expect(getProfileValueForField(profile, 'linkedin')).toBe(
      'https://linkedin.com/in/aryan',
    );
    expect(getProfileValueForField(profile, 'github')).toBe(
      'https://github.com/arya7n',
    );
    expect(getProfileValueForField(profile, 'fullName')).toBe('Aryan K Shah');
    expect(getProfileValueForField(profile, 'school')).toBe(
      'State University',
    );
    expect(getProfileValueForField(profile, 'company')).toBe('Acme');
    expect(getProfileValueForField(profile, 'jobTitle')).toBe('Engineer');
  });
});
