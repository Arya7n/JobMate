import { describe, expect, it } from 'vitest';
import {
  createEmptyApplicationStore,
  deserializeApplicationStore,
  normalizeApplicationStore,
  serializeApplicationStore,
  getApplicationStats,
} from '@/lib/storage/application-storage';

describe('application store serialization', () => {
  it('round-trips applications and drops invalid rows', () => {
    const store = normalizeApplicationStore({
      applications: [
        {
          id: 'app-1',
          company: 'Google',
          position: 'Software Engineer',
          status: 'applied',
        },
        { company: 'Missing id', status: 'offer' },
      ],
    });

    expect(store.applications).toHaveLength(1);
    const restored = deserializeApplicationStore(
      serializeApplicationStore(store),
    );
    expect(restored).toEqual(store);
  });

  it('defaults unknown status and empty payloads', () => {
    expect(normalizeApplicationStore(null)).toEqual(
      createEmptyApplicationStore(),
    );
    expect(
      normalizeApplicationStore({
        applications: [{ id: 'x', status: 'nope' }],
      }).applications[0]?.status,
    ).toBe('saved');
  });

  it('computes overview stats', () => {
    const stats = getApplicationStats([
      {
        id: '1',
        status: 'applied',
      },
      {
        id: '2',
        status: 'interview',
      },
      {
        id: '3',
        status: 'offer',
      },
      {
        id: '4',
        status: 'saved',
      },
    ]);

    expect(stats).toEqual({
      total: 4,
      applied: 1,
      interviews: 1,
      offers: 1,
    });
  });
});
