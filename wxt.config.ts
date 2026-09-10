import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type WxtViteConfig } from 'wxt';

/**
 * Permissions:
 * - storage: profile, resumes metadata, applications, settings
 * - tabs / scripting / activeTab: popup ↔ content-script autofill messaging
 *
 * Host access (http/https) is required so JobMate can detect application forms
 * on arbitrary career sites. Page contents never leave the device.
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
    permissions: ['storage', 'tabs', 'scripting', 'activeTab'],
    host_permissions: ['http://*/*', 'https://*/*'],
    options_ui: {
      page: 'dashboard.html',
      open_in_tab: true,
    },
  },
});
