import { MESSAGE_TYPES, isExtensionMessage } from '@/lib/messaging';
import { blobToBase64 } from '@/lib/resume/transfer';
import { resumeDownloadName } from '@/lib/resume';
import { getDefaultResume } from '@/lib/storage';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (
      !isExtensionMessage(message) ||
      message.type !== MESSAGE_TYPES.getDefaultResume
    ) {
      return;
    }

    void (async () => {
      const result = await getDefaultResume();
      if (!result.ok) {
        sendResponse({ ok: false, error: result.error.message });
        return;
      }

      const { record, blob } = result.data;
      sendResponse({
        ok: true,
        name: resumeDownloadName(record),
        mimeType: record.mimeType || blob.type,
        base64: await blobToBase64(blob),
      });
    })();

    return true;
  });
});
