import { describe, expect, it } from 'vitest';
import { classifyFieldSignals, type FieldSignals } from './classify';

function signals(partial: Partial<FieldSignals>): FieldSignals {
  return {
    name: '',
    id: '',
    placeholder: '',
    ariaLabel: '',
    label: '',
    autocomplete: '',
    type: 'text',
    surroundingText: '',
    ...partial,
  };
}

describe('classifyFieldSignals', () => {
  it('maps common email variants to email with high confidence', () => {
    for (const name of [
      'email',
      'emailAddress',
      'candidate_email',
      'e-mail',
    ]) {
      const match = classifyFieldSignals(signals({ name }));
      expect(match.type).toBe('email');
      expect(match.confidence).toBe('high');
    }
  });

  it('maps phone variants to phone with high confidence', () => {
    for (const name of [
      'phone',
      'phoneNumber',
      'mobile',
      'mobileNumber',
      'telephone',
    ]) {
      const match = classifyFieldSignals(signals({ name }));
      expect(match.type).toBe('phone');
      expect(match.confidence).toBe('high');
    }
  });

  it('maps professional links', () => {
    expect(classifyFieldSignals(signals({ name: 'linkedin' })).type).toBe(
      'linkedin',
    );
    expect(classifyFieldSignals(signals({ name: 'github' })).type).toBe(
      'github',
    );
    expect(classifyFieldSignals(signals({ name: 'portfolio' })).type).toBe(
      'portfolio',
    );
  });

  it('maps name fields', () => {
    expect(classifyFieldSignals(signals({ name: 'firstName' })).type).toBe(
      'firstName',
    );
    expect(classifyFieldSignals(signals({ name: 'lastName' })).type).toBe(
      'lastName',
    );
  });

  it('uses autocomplete and input type as strong signals', () => {
    expect(
      classifyFieldSignals(signals({ autocomplete: 'email' })).type,
    ).toBe('email');
    expect(classifyFieldSignals(signals({ type: 'tel' })).type).toBe('phone');
  });

  it('keeps ambiguous essay fields low confidence / unknown', () => {
    const match = classifyFieldSignals(
      signals({
        name: 'summary',
        label: 'Professional summary',
        placeholder: 'Tell us about yourself',
      }),
    );
    expect(match.confidence).toBe('low');
    expect(match.type).toBe('unknown');
  });

  it('never classifies password fields as fillable profile data', () => {
    const match = classifyFieldSignals(
      signals({ name: 'password', type: 'password' }),
    );
    expect(match.type).toBe('unknown');
    expect(match.score).toBe(0);
  });
});
