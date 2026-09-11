import type { FieldType } from '@/lib/autofill/types';
import type { Profile } from '@/lib/profile/types';

export function getProfileValueForField(
  profile: Profile,
  type: FieldType,
): string {
  const { personal, links, education, experience } = profile;
  const latestEducation = education[0];
  const latestExperience = experience[0];

  switch (type) {
    case 'firstName':
      return personal.firstName;
    case 'middleName':
      return personal.middleName;
    case 'lastName':
      return personal.lastName;
    case 'preferredName':
      return personal.preferredName || personal.firstName;
    case 'fullName':
      return [personal.firstName, personal.middleName, personal.lastName]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(' ');
    case 'email':
      return personal.email;
    case 'phone':
      return personal.phone;
    case 'city':
      return personal.city;
    case 'state':
      return personal.state;
    case 'country':
      return personal.country;
    case 'postalCode':
      return personal.postalCode;
    case 'linkedin':
      return links.linkedin;
    case 'github':
      return links.github;
    case 'portfolio':
      return links.portfolio;
    case 'website':
      return links.website || links.portfolio;
    case 'school':
      return latestEducation?.institution ?? '';
    case 'degree':
      return latestEducation?.degree ?? '';
    case 'fieldOfStudy':
      return latestEducation?.fieldOfStudy ?? '';
    case 'company':
      return latestExperience?.company ?? '';
    case 'jobTitle':
      return latestExperience?.jobTitle ?? '';
    case 'resume':
    case 'unknown':
      return '';
  }
}
