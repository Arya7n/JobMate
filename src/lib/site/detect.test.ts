import { describe, expect, it } from 'vitest';
import {
  isLikelyJobApplication,
  looksLikeApplicationPage,
} from './detect';

describe('looksLikeApplicationPage', () => {
  it('matches known ATS hosts', () => {
    expect(
      looksLikeApplicationPage(
        'https://boards.greenhouse.io/acme/jobs/123',
        'Acme',
      ),
    ).toBe(true);
    expect(
      looksLikeApplicationPage(
        'https://jobs.lever.co/acme/abc',
        'Engineering',
      ),
    ).toBe(true);
    expect(
      looksLikeApplicationPage(
        'https://acme.myworkdayjobs.com/en-US/Careers',
        'Careers',
      ),
    ).toBe(true);
  });

  it('matches career / apply paths and the local fixture URL', () => {
    expect(
      looksLikeApplicationPage(
        'https://acme.com/careers/apply',
        'Join Acme',
      ),
    ).toBe(true);
    expect(
      looksLikeApplicationPage(
        'https://localhost/fixture-application.html',
        'Software Engineer Application — JobMate Fixture',
      ),
    ).toBe(true);
  });

  it('does not treat generic sites as applications from body copy like "apply"', () => {
    expect(
      looksLikeApplicationPage(
        'https://mail.google.com/mail/u/0/#inbox',
        'Inbox',
        'Apply filters to your messages. This application uses cookies.',
      ),
    ).toBe(false);
    expect(
      looksLikeApplicationPage(
        'https://shop.example.com/checkout',
        'Checkout',
        'Apply a promo code to your order.',
      ),
    ).toBe(false);
    expect(
      looksLikeApplicationPage(
        'https://example.com/contact',
        'Contact us',
        'Send a message and we will get back to you.',
      ),
    ).toBe(false);
  });
});

describe('isLikelyJobApplication', () => {
  it('ignores login and contact forms even when email or name fields exist', () => {
    expect(
      isLikelyJobApplication({
        url: 'https://github.com/login',
        title: 'Sign in',
        fieldTypes: ['email'],
      }),
    ).toBe(false);

    expect(
      isLikelyJobApplication({
        url: 'https://example.com/contact',
        title: 'Contact',
        fieldTypes: ['firstName', 'lastName', 'email'],
      }),
    ).toBe(false);

    expect(
      isLikelyJobApplication({
        url: 'https://example.com/account/signup',
        title: 'Create account',
        fieldTypes: ['firstName', 'email', 'phone'],
      }),
    ).toBe(false);
  });

  it('detects a job form on a careers URL with identity fields', () => {
    expect(
      isLikelyJobApplication({
        url: 'https://acme.com/careers/software-engineer/apply',
        title: 'Software Engineer',
        fieldTypes: ['firstName', 'lastName', 'email'],
      }),
    ).toBe(true);
  });

  it('detects custom forms that ask for multiple job-specific fields', () => {
    expect(
      isLikelyJobApplication({
        url: 'https://acme.com/join',
        title: 'Join the team',
        fieldTypes: ['linkedin', 'github', 'email'],
      }),
    ).toBe(true);

    expect(
      isLikelyJobApplication({
        url: 'https://acme.com/careers/apply',
        title: 'Software Engineer',
        fieldTypes: ['email', 'resume'],
      }),
    ).toBe(true);
  });

  it('does not detect a careers listing with only a location filter', () => {
    expect(
      isLikelyJobApplication({
        url: 'https://acme.com/careers',
        title: 'Acme',
        fieldTypes: ['city'],
      }),
    ).toBe(false);
  });

  it('requires fields even on an ATS host', () => {
    expect(
      isLikelyJobApplication({
        url: 'https://boards.greenhouse.io/acme/jobs/123',
        title: 'Backend Engineer',
        fieldTypes: [],
      }),
    ).toBe(false);

    expect(
      isLikelyJobApplication({
        url: 'https://boards.greenhouse.io/acme/jobs/123',
        title: 'Backend Engineer',
        fieldTypes: ['firstName', 'email'],
      }),
    ).toBe(true);
  });
});
