export { PROFILE_SCHEMA_VERSION } from './types';
export type {
  Profile,
  PersonalInfo,
  ProfessionalLinks,
  EducationEntry,
  ExperienceEntry,
} from './types';
export {
  createEmptyProfile,
  createEmptyPersonal,
  createEmptyLinks,
  createEmptyEducation,
  createEmptyExperience,
} from './defaults';
export {
  normalizeProfile,
  serializeProfile,
  deserializeProfile,
  profilesEqual,
} from './normalize';
export { getProfileCompletion } from './completion';
export {
  getDisplayName,
  formatAddress,
  getQuickCopyValue,
  QUICK_COPY_ACTIONS,
  type QuickCopyId,
} from './display';
