import { PROFILE_SCHEMA_VERSION, type EducationEntry, type ExperienceEntry, type PersonalInfo, type ProfessionalLinks, type Profile } from './types';

export function createEmptyPersonal(): PersonalInfo {
  return {
    firstName: '',
    middleName: '',
    lastName: '',
    preferredName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    state: '',
    postalCode: '',
  };
}

export function createEmptyLinks(): ProfessionalLinks {
  return {
    linkedin: '',
    github: '',
    portfolio: '',
    website: '',
    otherUrl: '',
  };
}

export function createEmptyEducation(): EducationEntry {
  return {
    id: crypto.randomUUID(),
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    gpa: '',
    description: '',
  };
}

export function createEmptyExperience(): ExperienceEntry {
  return {
    id: crypto.randomUUID(),
    company: '',
    jobTitle: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  };
}

export function createEmptyProfile(): Profile {
  return {
    version: PROFILE_SCHEMA_VERSION,
    personal: createEmptyPersonal(),
    links: createEmptyLinks(),
    education: [],
    experience: [],
    skills: [],
  };
}
