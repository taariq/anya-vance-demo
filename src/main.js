// Entry point (C-1 wiring): wires C-3 step data and C-4 navigation engine to
// the DOM per plan s1/s6. Attaches click handlers for next/prev buttons that
// re-render the current step after mutating navigation state.
import steps from './steps.js';
import { createTutorial, render } from './tutorial.js';

const root = document.querySelector('.app');
const tutorial = createTutorial(steps);

const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

prevButton.addEventListener('click', () => {
  tutorial.prev();
  render(tutorial, root);
});

nextButton.addEventListener('click', () => {
  tutorial.next();
  render(tutorial, root);
});

render(tutorial, root);
