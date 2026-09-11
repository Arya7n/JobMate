import type { FillResult } from '@/lib/autofill';
import type { PageScanSummary } from '@/lib/site';

export const MESSAGE_TYPES = {
  getScan: 'jobmate/get-scan',
  scanUpdated: 'jobmate/scan-updated',
  autofill: 'jobmate/autofill',
  autofillResult: 'jobmate/autofill-result',
  getDefaultResume: 'jobmate/get-default-resume',
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

export type ExtensionMessage =
  | { type: typeof MESSAGE_TYPES.getScan }
  | { type: typeof MESSAGE_TYPES.scanUpdated; payload: PageScanSummary }
  | { type: typeof MESSAGE_TYPES.autofill }
  | {
      type: typeof MESSAGE_TYPES.autofillResult;
      payload: FillResult & { ok: boolean; error?: string };
    }
  | { type: typeof MESSAGE_TYPES.getDefaultResume };

export function isExtensionMessage(value: unknown): value is ExtensionMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    typeof (value as { type: unknown }).type === 'string' &&
    (Object.values(MESSAGE_TYPES) as string[]).includes(
      (value as { type: string }).type,
    )
  );
}
