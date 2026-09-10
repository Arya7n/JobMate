export interface PersonalInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface ProfessionalLinks {
  linkedin: string;
  github: string;
  portfolio: string;
  website: string;
  otherUrl: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Profile {
  personal: PersonalInfo;
  links: ProfessionalLinks;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
}
