import { describe, expect, it } from 'vitest';
import { fileMatchesAccept } from './set-value';
import { resumeDownloadName } from '@/lib/resume';

describe('fileMatchesAccept', () => {
  const pdf = new File(['%PDF'], 'Resume.pdf', { type: 'application/pdf' });

  it('allows any file when accept is empty', () => {
    expect(fileMatchesAccept(pdf, '')).toBe(true);
  });

  it('matches pdf extensions and mime types used on job sites', () => {
    expect(fileMatchesAccept(pdf, '.pdf,.doc,.docx')).toBe(true);
    expect(fileMatchesAccept(pdf, 'application/pdf')).toBe(true);
    expect(fileMatchesAccept(pdf, 'image/*')).toBe(false);
  });
});

describe('resumeDownloadName', () => {
  it('adds a file extension when the stored name does not include one', () => {
    expect(
      resumeDownloadName({
        name: 'Aryan Shah Resume',
        mimeType: 'application/pdf',
      }),
    ).toBe('Aryan Shah Resume.pdf');
  });
});
