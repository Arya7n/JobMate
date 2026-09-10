import type { DetectedField } from '@/lib/detection';
import { getProfileValueForField } from '@/lib/mapping';
import type { Profile } from '@/lib/profile';
import type { AppSettings } from '@/lib/settings';
import { DEFAULT_SETTINGS } from '@/lib/settings';
import { getCurrentValue, setNativeValue } from './set-value';
import type { ConfidenceLevel } from './types';

export interface FillPlanItem {
  field: DetectedField;
  value: string;
  willFill: boolean;
  reason?: string;
}

export interface FillResult {
  filled: string[];
  skipped: Array<{ label: string; reason: string }>;
  planned: number;
}

function allowedConfidence(
  confidence: ConfidenceLevel,
  settings: AppSettings,
): boolean {
  if (confidence === 'high') {
    return true;
  }
  if (confidence === 'medium') {
    return !settings.fillHighConfidenceOnly;
  }
  return false;
}

export function buildFillPlan(
  fields: DetectedField[],
  profile: Profile,
  settings: AppSettings = DEFAULT_SETTINGS,
): FillPlanItem[] {
  return fields.map((field) => {
    const value = getProfileValueForField(profile, field.type).trim();
    if (!value) {
      return {
        field,
        value: '',
        willFill: false,
        reason: 'No profile value',
      };
    }

    if (!allowedConfidence(field.confidence, settings)) {
      return {
        field,
        value,
        willFill: false,
        reason:
          field.confidence === 'low'
            ? 'Low confidence'
            : 'Needs confirmation',
      };
    }

    const current = getCurrentValue(field.element).trim();
    if (current.length > 0 && !settings.overwriteExistingValues) {
      return {
        field,
        value,
        willFill: false,
        reason: 'Already filled',
      };
    }

    return { field, value, willFill: true };
  });
}

export function executeFillPlan(plan: FillPlanItem[]): FillResult {
  const filled: string[] = [];
  const skipped: Array<{ label: string; reason: string }> = [];

  for (const item of plan) {
    if (!item.willFill) {
      skipped.push({
        label: item.field.label,
        reason: item.reason ?? 'Skipped',
      });
      continue;
    }

    setNativeValue(item.field.element, item.value);
    filled.push(item.field.label);
  }

  return {
    filled,
    skipped,
    planned: plan.filter((item) => item.willFill).length,
  };
}

export function autofillFields(
  fields: DetectedField[],
  profile: Profile,
  settings: AppSettings = DEFAULT_SETTINGS,
): FillResult {
  return executeFillPlan(buildFillPlan(fields, profile, settings));
}
