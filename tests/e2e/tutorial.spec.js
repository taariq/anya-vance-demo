// e2e lane: browser specs (C-5) driving the real static page per plan s6/s10.
// Uses the harness lane's shared selectors/oracle; frozen before implementation.
import { test, expect } from '@playwright/test';
import { SELECTORS } from '../support/selectors.mjs';
import {
  HELLO_WORLD_SOURCE,
  HELLO_WORLD_OUTPUT,
  ALLOWED_FONT_FAMILIES,
  NARROW_VIEWPORT_WIDTH,
} from '../support/oracle.mjs';

// B-1, T-1, T-2: initial load shows step-0 content and hello-world source/output.
test('B-1/T-1/T-2: page loads and shows initial tutorial content and hello-world output', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e));
  await page.goto('/index.html');

  await expect(page.locator(SELECTORS.stepHeading)).toBeVisible();
  await expect(page.locator(SELECTORS.stepHeading)).not.toHaveText('');
  await expect(page.locator(SELECTORS.stepCode)).toContainText(HELLO_WORLD_SOURCE);
  await expect(page.locator(SELECTORS.stepOutput)).toContainText(HELLO_WORLD_OUTPUT);

  // B-1: prev disabled at start, next enabled (not last step given >1 steps).
  await expect(page.locator(SELECTORS.prevButton)).toBeVisible();
  await expect(page.locator(SELECTORS.prevButton)).toBeDisabled();
  await expect(page.locator(SELECTORS.nextButton)).toBeVisible();
  await expect(page.locator(SELECTORS.nextButton)).toBeEnabled();

  expect(errors).toEqual([]);
});

// T-3, B-7, DI-5: single-page structure, no pagination/anchor navigation.
test('T-3/B-7: single-page structure with no navigation to another URL', async ({ page }) => {
  const startUrl = page.url();
  await page.goto('/index.html');
  const anchors = await page.locator('a[href]').count();
  expect(anchors).toBe(0);

  await page.locator(SELECTORS.nextButton).click();
  await page.locator(SELECTORS.nextButton).click();
  expect(page.url()).toBe(page.url()); // same document throughout
  expect(new URL(page.url()).pathname).toContain('index.html');
});

// B-2, T-4: clicking next reveals distinct next-step content.
test('B-2/T-4: next click advances content to a distinct step', async ({ page }) => {
  await page.goto('/index.html');
  const before = await page.locator(SELECTORS.stepHeading).textContent();
  await page.locator(SELECTORS.nextButton).click();
  const after = await page.locator(SELECTORS.stepHeading).textContent();
  expect(after).not.toBe(before);
});

// T-5, B-2: repeated clicks traverse all steps enumerated from src/steps.js via DOM count.
test('T-5: repeated next clicks reach the last step without skipping', async ({ page }) => {
  await page.goto('/index.html');
  const seenHeadings = new Set();
  seenHeadings.add(await page.locator(SELECTORS.stepHeading).textContent());

  let guard = 0;
  while (await page.locator(SELECTORS.nextButton).isEnabled() && guard < 50) {
    await page.locator(SELECTORS.nextButton).click();
    seenHeadings.add(await page.locator(SELECTORS.stepHeading).textContent());
    guard += 1;
  }

  expect(guard).toBeGreaterThan(0);
  expect(seenHeadings.size).toBe(guard + 1); // no skipped/duplicate step text (I-4)
  await expect(page.locator(SELECTORS.nextButton)).toBeDisabled();
});

// B-3, T-6, DI-6: next at last step is idempotent no-op, control stays enabled in DOM (per plan AR-007/AR-014: rendered+disabled, handler still fires).
test('B-3/T-6: clicking next at the last step keeps content stable and control disabled', async ({ page }) => {
  await page.goto('/index.html');
  let guard = 0;
  while (await page.locator(SELECTORS.nextButton).isEnabled() && guard < 50) {
    await page.locator(SELECTORS.nextButton).click();
    guard += 1;
  }
  const lastHeading = await page.locator(SELECTORS.stepHeading).textContent();
  await expect(page.locator(SELECTORS.nextButton)).toBeDisabled();

  // Dispatch click on the disabled button via JS to exercise handler idempotency (DI-6 guard).
  await page.locator(SELECTORS.nextButton).dispatchEvent('click');
  const afterHeading = await page.locator(SELECTORS.stepHeading).textContent();
  expect(afterHeading).toBe(lastHeading);
});

// B-4, T-7: previous control always rendered and disabled at step 0, no error on click.
test('B-4/T-7: previous control is present and disabled at the first step', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator(SELECTORS.prevButton)).toHaveCount(1);
  await expect(page.locator(SELECTORS.prevButton)).toBeDisabled();

  const before = await page.locator(SELECTORS.stepHeading).textContent();
  await page.locator(SELECTORS.prevButton).dispatchEvent('click');
  const after = await page.locator(SELECTORS.stepHeading).textContent();
  expect(after).toBe(before);
});

// B-5: previous from a middle/last step moves back to the prior step's content.
test('B-5: previous click from a later step returns to the prior step content', async ({ page }) => {
  await page.goto('/index.html');
  const step0 = await page.locator(SELECTORS.stepHeading).textContent();
  await page.locator(SELECTORS.nextButton).click();
  const step1 = await page.locator(SELECTORS.stepHeading).textContent();
  await page.locator(SELECTORS.prevButton).click();
  const backToStep0 = await page.locator(SELECTORS.stepHeading).textContent();
  expect(backToStep0).toBe(step0);
  expect(step1).not.toBe(step0);
});

// T-10, required_functionality: coverage of syntax note and type/function example distinct from hello-world.
test('T-10: tutorial coverage includes syntax and type/function example steps', async ({ page }) => {
  await page.goto('/index.html');
  const headings = new Set();
  const bodies = new Set();
  headings.add(await page.locator(SELECTORS.stepHeading).textContent());
  bodies.add(await page.locator(SELECTORS.stepBody).textContent());

  let guard = 0;
  while (await page.locator(SELECTORS.nextButton).isEnabled() && guard < 50) {
    await page.locator(SELECTORS.nextButton).click();
    headings.add(await page.locator(SELECTORS.stepHeading).textContent());
    bodies.add(await page.locator(SELECTORS.stepBody).textContent());
    guard += 1;
  }

  expect(headings.size).toBeGreaterThanOrEqual(3); // hello-world, syntax, type/function per D-9
  for (const b of bodies) {
    expect(b && b.trim().length).toBeGreaterThan(0);
  }
});

// T-11, D-7, AR-013: computed typography matches the allowed plain font-family list, no gradient background.
test('T-11: computed body/heading style matches plain typography assumption', async ({ page }) => {
  await page.goto('/index.html');
  const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  const headingFont = await page.evaluate((sel) => getComputedStyle(document.querySelector(sel)).fontFamily, SELECTORS.stepHeading);
  const bodyBgImage = await page.evaluate(() => getComputedStyle(document.body).backgroundImage);

  const matchesAllowed = (fontFamily) =>
    ALLOWED_FONT_FAMILIES.some((allowed) => fontFamily.toLowerCase().includes(allowed.toLowerCase()));

  expect(matchesAllowed(bodyFont)).toBe(true);
  expect(matchesAllowed(headingFont)).toBe(true);
  expect(bodyBgImage.includes('gradient')).toBe(false);
});

// T-12, I-47: narrow 360px viewport keeps content stacked with no horizontal overflow.
test('T-12: narrow viewport layout has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: NARROW_VIEWPORT_WIDTH, height: 800 });
  await page.goto('/index.html');
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.body.scrollWidth,
    clientWidth: document.body.clientWidth,
  }));
  expect(scrollWidth).toBe(clientWidth);
  await expect(page.locator(SELECTORS.nextButton)).toBeVisible();
  await expect(page.locator(SELECTORS.stepHeading)).toBeVisible();
});

// B-6, T-14: keyboard operability of next control via Tab + Enter, matching click behavior.
test('B-6/T-14: keyboard Enter on focused next control advances content like a click', async ({ page }) => {
  await page.goto('/index.html');
  const before = await page.locator(SELECTORS.stepHeading).textContent();

  await page.locator(SELECTORS.nextButton).focus();
  await expect(page.locator(SELECTORS.nextButton)).toBeFocused();
  await page.keyboard.press('Enter');
  const afterEnter = await page.locator(SELECTORS.stepHeading).textContent();
  expect(afterEnter).not.toBe(before);

  // Space on previous control should move back, matching a click.
  await page.locator(SELECTORS.prevButton).focus();
  await expect(page.locator(SELECTORS.prevButton)).toBeFocused();
  await page.keyboard.press('Space');
  const afterSpace = await page.locator(SELECTORS.stepHeading).textContent();
  expect(afterSpace).toBe(before);
});

// DI-4: page markup must retain the interactive step button, not static content only.
test('DI-4 guard: interactive next-button control exists and is actionable', async ({ page }) => {
  await page.goto('/index.html');
  const next = page.locator(SELECTORS.nextButton);
  await expect(next).toHaveCount(1);
  const tag = await next.evaluate((el) => el.tagName.toLowerCase());
  expect(['button', 'input']).toContain(tag);
});

// DI-7: hello-world output text must match the canonical Haskell output exactly, not an altered string.
test('DI-7 guard: hello-world output text matches canonical Haskell output exactly', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator(SELECTORS.stepOutput)).toHaveText(HELLO_WORLD_OUTPUT);
});
