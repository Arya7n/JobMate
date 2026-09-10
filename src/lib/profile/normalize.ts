import { createEmptyEducation, createEmptyExperience, createEmptyLinks, createEmptyPersonal, createEmptyProfile } from './defaults';
import { PROFILE_SCHEMA_VERSION, type EducationEntry, type ExperienceEntry, type PersonalInfo, type ProfessionalLinks, type Profile } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function readPersonal(value: unknown): PersonalInfo {
  const fallback = createEmptyPersonal();
  if (!isRecord(value)) {
    return fallback;
  }

  return {
    firstName: asString(value.firstName),
    middleName: asString(value.middleName),
    lastName: asString(value.lastName),
    preferredName: asString(value.preferredName),
    email: asString(value.email),
    phone: asString(value.phone),
    country: asString(value.country),
    city: asString(value.city),
    state: asString(value.state),
    postalCode: asString(value.postalCode),
  };
}

function readLinks(value: unknown): ProfessionalLinks {
  const fallback = createEmptyLinks();
  if (!isRecord(value)) {
    return fallback;
  }

  return {
    linkedin: asString(value.linkedin),
    github: asString(value.github),
    portfolio: asString(value.portfolio),
    website: asString(value.website),
    otherUrl: asString(value.otherUrl),
  };
}

function readEducation(value: unknown): EducationEntry {
  const fallback = createEmptyEducation();
  if (!isRecord(value)) {
    return fallback;
  }

  return {
    id: asString(value.id) || fallback.id,
    institution: asString(value.institution),
    degree: asString(value.degree),
    fieldOfStudy: asString(value.fieldOfStudy),
    startDate: asString(value.startDate),
    endDate: asString(value.endDate),
    gpa: asString(value.gpa),
    description: asString(value.description),
  };
}

function readExperience(value: unknown): ExperienceEntry {
  const fallback = createEmptyExperience();
  if (!isRecord(value)) {
    return fallback;
  }

  const current = asBoolean(value.current);

  return {
    id: asString(value.id) || fallback.id,
    company: asString(value.company),
    jobTitle: asString(value.jobTitle),
    location: asString(value.location),
    startDate: asString(value.startDate),
    endDate: current ? '' : asString(value.endDate),
    current,
    description: asString(value.description),
  };
}

function readSkills(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  const skills: string[] = [];

  for (const item of value) {
    const skill = asString(item);
    if (skill.length === 0) {
      continue;
    }

    const key = skill.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    skills.push(skill);
  }

  return skills;
}

export function normalizeProfile(value: unknown): Profile {
  if (!isRecord(value)) {
    return createEmptyProfile();
  }

  const education = Array.isArray(value.education)
    ? value.education.filter(isRecord).map(readEducation)
    : [];
  const experience = Array.isArray(value.experience)
    ? value.experience.filter(isRecord).map(readExperience)
    : [];

  return {
    version: PROFILE_SCHEMA_VERSION,
    personal: readPersonal(value.personal),
    links: readLinks(value.links),
    education,
    experience,
    skills: readSkills(value.skills),
  };
}

export function serializeProfile(profile: Profile): string {
  return JSON.stringify(normalizeProfile(profile));
}

export function deserializeProfile(raw: unknown): Profile {
  if (typeof raw === 'string') {
    try {
      return normalizeProfile(JSON.parse(raw) as unknown);
    } catch {
      return createEmptyProfile();
    }
  }

  return normalizeProfile(raw);
}

export function profilesEqual(left: Profile, right: Profile): boolean {
  return serializeProfile(left) === serializeProfile(right);
}
