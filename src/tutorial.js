// Navigation engine for the tutorial (D-5: numeric index state)

export function createTutorial(steps) {
  let currentStepIndex = 0;
  const lastIndex = steps.length - 1;

  return {
    current() {
      return steps[currentStepIndex];
    },
    next() {
      if (currentStepIndex < lastIndex) currentStepIndex += 1;
      return steps[currentStepIndex];
    },
    prev() {
      if (currentStepIndex > 0) currentStepIndex -= 1;
      return steps[currentStepIndex];
    },
    atEnd() {
      return currentStepIndex === lastIndex;
    },
    atStart() {
      return currentStepIndex === 0;
    },
    currentIndex() {
      return currentStepIndex;
    },
  };
}

export function render(tutorial, root) {
  const step = tutorial.current();

  const heading = root.querySelector('[data-testid="step-heading"]');
  const body = root.querySelector('[data-testid="step-body"]');
  const code = root.querySelector('[data-testid="step-code"]');
  const output = root.querySelector('[data-testid="step-output"]');
  const prevButton = root.querySelector('[data-testid="prev-button"]');
  const nextButton = root.querySelector('[data-testid="next-button"]');

  if (heading) heading.textContent = step.title;
  if (body) body.textContent = step.body;
  if (code) code.textContent = step.codeSnippet || '';
  if (output) output.textContent = step.outputText || '';

  if (prevButton) {
    if (tutorial.atStart()) prevButton.setAttribute('disabled', '');
    else prevButton.removeAttribute('disabled');
  }

  if (nextButton) {
    if (tutorial.atEnd()) nextButton.setAttribute('disabled', '');
    else nextButton.removeAttribute('disabled');
  }
}
