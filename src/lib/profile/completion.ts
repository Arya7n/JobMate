import type { Profile } from './types';

const CHECKPOINT_COUNT = 10;

function filled(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Ten equally weighted checkpoints keep the score explainable:
 * core identity, one professional link, and one of each history section.
 */
export function getProfileCompletion(profile: Profile): number {
  const { personal, links, education, experience, skills } = profile;

  const checkpoints = [
    filled(personal.firstName),
    filled(personal.lastName),
    filled(personal.email),
    filled(personal.phone),
    filled(personal.city),
    filled(personal.country),
    filled(links.linkedin) ||
      filled(links.github) ||
      filled(links.portfolio) ||
      filled(links.website) ||
      filled(links.otherUrl),
    education.some((entry) => filled(entry.institution)),
    experience.some((entry) => filled(entry.company) && filled(entry.jobTitle)),
    skills.length > 0,
  ];

  const complete = checkpoints.filter(Boolean).length;
  return Math.round((complete / CHECKPOINT_COUNT) * 100);
}
