export interface AppSettings {
  fillHighConfidenceOnly: boolean;
  overwriteExistingValues: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  fillHighConfidenceOnly: true,
  overwriteExistingValues: false,
};
