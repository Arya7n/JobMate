import { describe, expect, it } from 'vitest';
import { getProfileCompletion } from './completion';
import { createEmptyProfile } from './defaults';
import { normalizeProfile } from './normalize';

describe('getProfileCompletion', () => {
  it('scores an empty profile at 0', () => {
    expect(getProfileCompletion(createEmptyProfile())).toBe(0);
  });

  it('scores obvious identity fields at 10% each', () => {
    const profile = normalizeProfile({
      personal: { firstName: 'Aryan' },
    });

    expect(getProfileCompletion(profile)).toBe(10);
  });

  it('reaches 100 when every checkpoint is filled', () => {
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
        github: 'https://github.com/arya7n',
      },
      education: [{ id: 'edu-1', institution: 'State University' }],
      experience: [{ id: 'exp-1', company: 'Acme', jobTitle: 'Engineer' }],
      skills: ['TypeScript'],
    });

    expect(getProfileCompletion(profile)).toBe(100);
  });

  it('does not count experience without both company and title', () => {
    const profile = normalizeProfile({
      experience: [{ id: 'exp-1', company: 'Acme' }],
    });

    expect(getProfileCompletion(profile)).toBe(0);
  });
});
