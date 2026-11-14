// Unit lane: pure navigation-engine tests for C-4 (src/tutorial.js), run via
// Vitest/jsdom per vitest.config.js. Expected values are derived from the
// plan's domain model, observable behaviors and invariants (section 6/7),
// not read back from the implementation. Imports use only the names stated
// in MODULE_INTERFACES.json and the harness lane's selector/oracle helpers.
import { describe, it, expect, beforeEach } from 'vitest';
import { createTutorial, render } from '../src/tutorial.js';
import steps from '../src/steps.js';
import { SELECTORS, TEST_IDS } from './support/selectors.mjs';
import { HELLO_WORLD_SOURCE, HELLO_WORLD_OUTPUT } from './support/oracle.mjs';

describe('createTutorial navigation engine', () => {
  // I-3 / required_functionality: step data breadth must exist before any
  // navigation test is meaningful.
  it('I-3: steps array has at least 3 distinct entries covering hello-world, syntax, and type/function topics', () => {
    expect(Array.isArray(steps)).toBe(true);
    expect(steps.length).toBeGreaterThanOrEqual(3);
    const helloWorld = steps.find(
      (s) => s.codeSnippet === HELLO_WORLD_SOURCE && s.outputText === HELLO_WORLD_OUTPUT
    );
    expect(helloWorld).toBeTruthy();
    // no two steps render identical text
    const bodies = steps.map((s) => s.body);
    expect(new Set(bodies).size).toBe(bodies.length);
  });

  // Domain model s3: NavigationState initial value is 0.
  it('initial currentIndex() is 0 on creation (Rule: initial NavigationState)', () => {
    const t = createTutorial(steps);
    expect(t.currentIndex()).toBe(0);
    expect(t.current()).toEqual(steps[0]);
  });

  // T-9: engine's getCurrent()/current() matches step data at every index.
  it('T-9: current() returns the exact object at the current array position, for every index', () => {
    const t = createTutorial(steps);
    for (let i = 0; i < steps.length; i += 1) {
      expect(t.current()).toEqual(steps[i]);
      if (i < steps.length - 1) t.next();
    }
  });

  // T-8 / I-1 / I-41: next() beyond last index and prev() below 0 clamp, no-op.
  it('T-8: next() beyond the last index returns the unchanged last-step content, not undefined', () => {
    const t = createTutorial(steps);
    for (let i = 0; i < steps.length + 5; i += 1) t.next();
    expect(t.currentIndex()).toBe(steps.length - 1);
    expect(t.current()).toEqual(steps[steps.length - 1]);
  });

  it('T-8: prev() below index 0 returns the unchanged first-step content, not undefined', () => {
    const t = createTutorial(steps);
    for (let i = 0; i < 5; i += 1) t.prev();
    expect(t.currentIndex()).toBe(0);
    expect(t.current()).toEqual(steps[0]);
  });

  // T-5: repeated next() calls traverse all defined steps using an enumerated count.
  it('T-5: next() called (steps.length - 1) times reaches the last step content', () => {
    const t = createTutorial(steps);
    for (let i = 0; i < steps.length - 1; i += 1) t.next();
    expect(t.current()).toEqual(steps[steps.length - 1]);
    expect(t.atEnd()).toBe(true);
  });

  // I-4: forward navigation never skips an index.
  it('I-4: each next() call advances currentIndex by exactly min(prev+1, last)', () => {
    const t = createTutorial(steps);
    let prevIndex = t.currentIndex();
    for (let i = 0; i < steps.length + 2; i += 1) {
      t.next();
      const expected = Math.min(prevIndex + 1, steps.length - 1);
      expect(t.currentIndex()).toBe(expected);
      prevIndex = t.currentIndex();
    }
  });

  // I-5: at the last step, forward navigation is a no-op, content stays last step's, no wraparound.
  it('I-5: next() at the last step does not wrap to step 0 and leaves content unchanged', () => {
    const t = createTutorial(steps);
    for (let i = 0; i < steps.length - 1; i += 1) t.next();
    const lastContent = t.current();
    t.next();
    expect(t.current()).toEqual(lastContent);
    expect(t.currentIndex()).toBe(steps.length - 1);
    expect(t.currentIndex()).not.toBe(0);
  });

  // atStart/atEnd boundary flags used by render() per MODULE_INTERFACES.json.
  it('atStart() is true only at index 0 and atEnd() is true only at the last index', () => {
    const t = createTutorial(steps);
    expect(t.atStart()).toBe(true);
    expect(t.atEnd()).toBe(steps.length === 1);
    for (let i = 0; i < steps.length - 1; i += 1) t.next();
    expect(t.atEnd()).toBe(true);
    expect(t.atStart()).toBe(steps.length === 1);
  });

  // T-13 / F-3: rapid repeated activation (two synchronous next() calls in one
  // tick) advances the index by exactly one step beyond a single next() call,
  // i.e. two next() calls from index 0 land on index 2 (clamped), not index 1,
  // matching MODULE_INTERFACES.json's "each call moves at most one step"
  // semantics combined with F-3's idempotent-per-trigger rule applied once
  // per call (not merged into a single transition).
  it('T-13: two synchronous next() calls in one tick advance the index by exactly two single-steps (idempotent per-call, not duplicated)', () => {
    const t = createTutorial(steps);
    // simulate double-click firing the handler twice synchronously
    t.next();
    t.next();
    const expected = Math.min(2, steps.length - 1);
    expect(t.currentIndex()).toBe(expected);
  });

  // I-2: step data array itself must never be mutated by the engine.
  it('I-2: createTutorial/next/prev never mutate the original steps array', () => {
    const original = JSON.parse(JSON.stringify(steps));
    const t = createTutorial(steps);
    t.next();
    t.next();
    t.prev();
    expect(JSON.parse(JSON.stringify(steps))).toEqual(original);
  });
});

describe('render(tutorial, root) DOM writing', () => {
  let root;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="root">
        <h2 data-testid="${TEST_IDS.STEP_HEADING}"></h2>
        <p data-testid="${TEST_IDS.STEP_BODY}"></p>
        <pre data-testid="${TEST_IDS.STEP_CODE}"></pre>
        <pre data-testid="${TEST_IDS.STEP_OUTPUT}"></pre>
        <button data-testid="${TEST_IDS.PREV_BUTTON}">Prev</button>
        <button data-testid="${TEST_IDS.NEXT_BUTTON}">Next</button>
      </div>
    `;
    root = document.getElementById('root');
  });

  // B-1 / T-1 / T-2: initial render writes step-0 content, including the
  // literal hello-world source/output when step 0 is the hello-world step.
  it('B-1: initial render(tutorial, root) writes the current step text via textContent', () => {
    const t = createTutorial(steps);
    render(t, root);
    expect(root.querySelector(SELECTORS.stepHeading).textContent).toBe(steps[0].title);
    expect(root.querySelector(SELECTORS.stepBody).textContent).toBe(steps[0].body);
  });

  // I-7: step content is written via textContent, never innerHTML, so markup
  // characters in step data are not interpreted as HTML.
  it('I-7: render() writes step text using textContent, not innerHTML (no HTML injection)', () => {
    const t = createTutorial(steps);
    render(t, root);
    const headingEl = root.querySelector(SELECTORS.stepHeading);
    expect(headingEl.children.length).toBe(0);
    expect(headingEl.innerHTML).toBe(steps[0].title);
  });

  // I-42 / T-7: prev-button is disabled at the first step, always present.
  it('I-42/T-7: prev-button is present and disabled at step 0; next-button is enabled when more than one step exists', () => {
    const t = createTutorial(steps);
    render(t, root);
    const prevBtn = root.querySelector(SELECTORS.prevButton);
    expect(prevBtn).not.toBeNull();
    expect(prevBtn.disabled).toBe(true);
    if (steps.length > 1) {
      expect(root.querySelector(SELECTORS.nextButton).disabled).toBe(false);
    }
  });

  // I-42 / T-6: next-button is disabled at the last step, always present.
  it('I-42/T-6: next-button is present and disabled at the last step after traversal', () => {
    const t = createTutorial(steps);
    for (let i = 0; i < steps.length - 1; i += 1) t.next();
    render(t, root);
    const nextBtn = root.querySelector(SELECTORS.nextButton);
    expect(nextBtn).not.toBeNull();
    expect(nextBtn.disabled).toBe(true);
    expect(root.querySelector(SELECTORS.prevButton).disabled).toBe(false);
  });

  // B-2: re-render after next() replaces displayed content with the new step's text.
  it('B-2: render() after next() updates DOM text to the new step content, distinct from before', () => {
    const t = createTutorial(steps);
    render(t, root);
    const before = root.querySelector(SELECTORS.stepBody).textContent;
    t.next();
    render(t, root);
    const after = root.querySelector(SELECTORS.stepBody).textContent;
    expect(after).not.toBe(before);
    expect(after).toBe(steps[1].body);
  });
});
