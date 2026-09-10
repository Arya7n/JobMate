import { describe, expect, it } from 'vitest';
import { formatAddress, getDisplayName, getQuickCopyValue } from './display';
import { normalizeProfile } from './normalize';

describe('profile display helpers', () => {
  it('prefers preferred name, then first name', () => {
    expect(
      getDisplayName(
        normalizeProfile({
          personal: { firstName: 'Aryan', preferredName: 'Ari' },
        }),
      ),
    ).toBe('Ari');

    expect(
      getDisplayName(normalizeProfile({ personal: { firstName: 'Aryan' } })),
    ).toBe('Aryan');
  });

  it('formats a compact address', () => {
    expect(
      formatAddress(
        normalizeProfile({
          personal: {
            city: 'Austin',
            state: 'TX',
            postalCode: '78701',
            country: 'United States',
          },
        }).personal,
      ),
    ).toBe('Austin, TX 78701, United States');
  });

  it('maps quick-copy fields onto profile values', () => {
    const profile = normalizeProfile({
      personal: {
        email: 'aryan@example.com',
        city: 'Austin',
        country: 'United States',
      },
      links: { github: 'https://github.com/arya7n' },
    });

    expect(getQuickCopyValue(profile, 'email')).toBe('aryan@example.com');
    expect(getQuickCopyValue(profile, 'github')).toBe(
      'https://github.com/arya7n',
    );
    expect(getQuickCopyValue(profile, 'address')).toBe(
      'Austin, United States',
    );
  });
});
