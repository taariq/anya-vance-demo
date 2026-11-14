// Harness lane: shared Vitest configuration consumed by the unit lane's
// tests/tutorial.test.js (C-4). jsdom environment is required because
// tutorial.js's render() (per MODULE_INTERFACES.json) manipulates DOM nodes
// via data-testid hooks, which must be exercised without a real browser.
// @ts-check
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/tutorial.test.js'],
  },
});
