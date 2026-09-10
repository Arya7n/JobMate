export const APPLICATION_STATUSES = [
  'saved',
  'applied',
  'online_assessment',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  saved: 'Saved',
  applied: 'Applied',
  online_assessment: 'Online Assessment',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export interface JobApplication {
  id: string;
  company?: string;
  position?: string;
  url?: string;
  dateApplied?: string;
  status: ApplicationStatus;
  resumeId?: string;
  notes?: string;
}
