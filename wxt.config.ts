import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type WxtViteConfig } from 'wxt';

/**
 * V1 permissions:
 * - storage: persist profile, resumes, applications, and settings on-device.
 *
 * Host access is intentionally omitted in Phase 1. Autofill will request
 * the minimum host permissions needed when the content script ships.
 */
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  alias: {
    '@': './src',
  },
  vite: () =>
    ({
      plugins: [tailwindcss()],
    }) as WxtViteConfig,
  manifest: {
    name: 'JobMate',
    description:
      'Store your professional information once, autofill job applications, and track every submission — locally on your device.',
    permissions: ['storage'],
    options_ui: {
      page: 'dashboard.html',
      open_in_tab: true,
    },
  },
});
