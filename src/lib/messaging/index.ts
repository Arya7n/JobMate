import { browser } from 'wxt/browser';
import {
  isExtensionMessage,
  MESSAGE_TYPES,
  type ExtensionMessage,
} from './types';
import type { FillResult } from '@/lib/autofill';
import type { PageScanSummary } from '@/lib/site';

export async function sendToActiveTab<T>(
  message: ExtensionMessage,
): Promise<T | null> {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab?.id || tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://')) {
    return null;
  }

  try {
    return (await browser.tabs.sendMessage(tab.id, message)) as T;
  } catch {
    return null;
  }
}

export async function requestPageScan(): Promise<PageScanSummary | null> {
  return sendToActiveTab<PageScanSummary>({ type: MESSAGE_TYPES.getScan });
}

export async function requestAutofill(): Promise<
  (FillResult & { ok: boolean; error?: string }) | null
> {
  return sendToActiveTab({ type: MESSAGE_TYPES.autofill });
}

export { MESSAGE_TYPES, isExtensionMessage, type ExtensionMessage };
