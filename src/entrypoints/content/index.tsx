import ReactDOM from 'react-dom/client';
import { autofillFields, type FillResult } from '@/lib/autofill';
import { scanDocument } from '@/lib/detection';
import { isExtensionMessage, MESSAGE_TYPES } from '@/lib/messaging';
import { getProfile, getSettings } from '@/lib/storage';
import { getPageScanSummary, type PageScanSummary } from '@/lib/site';
import { AutofillPanel } from './AutofillPanel';

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  runAt: 'document_idle',
  cssInjectionMode: 'ui',
  async main(ctx) {
    let latestScan: PageScanSummary = getPageScanSummary();
    let panelOpen = false;
    let lastResult: FillResult | null = null;
    let root: ReactDOM.Root | null = null;

    const ui = await createShadowRootUi(ctx, {
      name: 'jobmate-autofill',
      position: 'inline',
      anchor: 'body',
      onMount(container) {
        const mount = document.createElement('div');
        container.append(mount);
        root = ReactDOM.createRoot(mount);
        render();
        return root;
      },
      onRemove(mounted) {
        mounted?.unmount();
        root = null;
      },
    });

    function render() {
      if (!root) {
        return;
      }

      root.render(
        <AutofillPanel
          open={panelOpen}
          scan={latestScan}
          lastResult={lastResult}
          onClose={() => {
            panelOpen = false;
            render();
          }}
          onAutofill={() => {
            void runAutofill().then(() => {
              panelOpen = true;
              render();
            });
          }}
        />,
      );
    }

    function refreshScan() {
      latestScan = getPageScanSummary();
      if (latestScan.detected && latestScan.high >= 1) {
        panelOpen = true;
        ui.mount();
      }
      render();
    }

    async function runAutofill(): Promise<
      FillResult & { ok: boolean; error?: string }
    > {
      const [profileResult, settingsResult] = await Promise.all([
        getProfile(),
        getSettings(),
      ]);

      if (!profileResult.ok) {
        return {
          ok: false,
          error: profileResult.error.message,
          filled: [],
          skipped: [],
          planned: 0,
        };
      }

      const settings = settingsResult.ok ? settingsResult.data : undefined;
      const fields = scanDocument();
      const result = autofillFields(fields, profileResult.data, settings);
      lastResult = result;
      latestScan = getPageScanSummary();
      return { ok: true, ...result };
    }

    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (!isExtensionMessage(message)) {
        return;
      }

      if (message.type === MESSAGE_TYPES.getScan) {
        latestScan = getPageScanSummary();
        sendResponse(latestScan);
        return true;
      }

      if (message.type === MESSAGE_TYPES.autofill) {
        void runAutofill().then((result) => {
          panelOpen = true;
          ui.mount();
          render();
          sendResponse(result);
        });
        return true;
      }

      return undefined;
    });

    let debounce: number | undefined;
    const observer = new MutationObserver(() => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => {
        const previous = latestScan.total;
        latestScan = getPageScanSummary();
        if (latestScan.total !== previous && latestScan.detected) {
          ui.mount();
          panelOpen = true;
          render();
        }
      }, 400);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    ctx.onInvalidated(() => {
      observer.disconnect();
      window.clearTimeout(debounce);
    });

    refreshScan();
  },
});
