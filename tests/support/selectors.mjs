// Harness lane: shared selector helper built from the ui_contract in
// MODULE_INTERFACES.json. Both the unit lane (jsdom) and the e2e lane
// (Playwright) import this to avoid duplicating the data-testid strings.
//
// Exports:
//   TEST_IDS: { STEP_HEADING, STEP_BODY, STEP_CODE, STEP_OUTPUT, NEXT_BUTTON, PREV_BUTTON }
//     -- the raw data-testid attribute values from ui_contract.
//   testIdSelector(name: string): string
//     -- returns a CSS attribute selector string `[data-testid="<name>"]` for
//        use with document.querySelector / page.locator alike.
//   SELECTORS: { stepHeading, stepBody, stepCode, stepOutput, nextButton, prevButton }
//     -- pre-built CSS selector strings, one per ui_contract data-testid entry.

export const TEST_IDS = Object.freeze({
  STEP_HEADING: 'step-heading',
  STEP_BODY: 'step-body',
  STEP_CODE: 'step-code',
  STEP_OUTPUT: 'step-output',
  NEXT_BUTTON: 'next-button',
  PREV_BUTTON: 'prev-button',
});

export function testIdSelector(name) {
  return `[data-testid="${name}"]`;
}

export const SELECTORS = Object.freeze({
  stepHeading: testIdSelector(TEST_IDS.STEP_HEADING),
  stepBody: testIdSelector(TEST_IDS.STEP_BODY),
  stepCode: testIdSelector(TEST_IDS.STEP_CODE),
  stepOutput: testIdSelector(TEST_IDS.STEP_OUTPUT),
  nextButton: testIdSelector(TEST_IDS.NEXT_BUTTON),
  prevButton: testIdSelector(TEST_IDS.PREV_BUTTON),
});
