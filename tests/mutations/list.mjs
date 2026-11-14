// Mutation/defect-injection list for mutation-testing acceptance evidence.
// Schema per workflow mutation-lane instructions: id, breaks, mutation, target, spec,
// expected_failing_tests, file, find, replace.
//
// Derived from UPDATED_PROJECT_PLAN.md s10.3 (DI-1..DI-7) and s7/s10.2 (I-*, T-*).

const defects = [
  {
    id: "DI-1",
    breaks: ["I-4", "T-8"],
    mutation:
      "createTutorial's next() never increments currentStepIndex (always returns the same step), breaking forward navigation entirely.",
    target: "src/tutorial.js",
    spec: "tests/tutorial.test.js",
    expected_failing_tests: [
      "T-8 navigation engine unit: index bounds",
      "T-9 navigation engine unit: content lookup matches step data",
    ],
    file: "src/tutorial.js",
    find:
      "    next() {\n      if (currentStepIndex < lastIndex) currentStepIndex += 1;\n      return steps[currentStepIndex];\n    },",
    replace:
      "    next() {\n      return steps[currentStepIndex];\n    },",
  },
  {
    id: "DI-2",
    breaks: ["I-1", "I-5", "T-8"],
    mutation:
      "createTutorial's next() increments currentStepIndex past steps.length-1 without clamping, so current()/getCurrent() returns undefined content past the last step.",
    target: "src/tutorial.js",
    spec: "tests/tutorial.test.js",
    expected_failing_tests: ["T-8 navigation engine unit: index bounds"],
    file: "src/tutorial.js",
    find:
      "    next() {\n      if (currentStepIndex < lastIndex) currentStepIndex += 1;\n      return steps[currentStepIndex];\n    },",
    replace:
      "    next() {\n      currentStepIndex += 1;\n      return steps[currentStepIndex];\n    },",
  },
  {
    id: "DI-3",
    breaks: ["I-3", "T-10"],
    mutation:
      "src/steps.js's exported step array omits the hello-world step (no entry with a codeSnippet/outputText matching the canonical Haskell hello-world example).",
    target: "src/steps.js",
    spec: "tests/tutorial.test.js",
    expected_failing_tests: [
      "T-1 page loads and shows initial tutorial content",
      "T-2 hello-world output displayed",
      "T-10 tutorial coverage content check",
    ],
    file: "src/steps.js",
    find:
      "  {\n    id: 0,\n    title: \"Hello, Haskell!\",\n    body:\n      \"Welcome to this Haskell tutorial. Haskell is a purely functional programming language. Let's start with the classic hello-world program.\",\n    codeSnippet: 'main :: IO ()\\nmain = putStrLn \"Hello, World!\"',\n    outputText: \"Hello, World!\",\n  },",
    replace:
      "  {\n    id: 0,\n    title: \"Basic Syntax\",\n    body:\n      \"Haskell uses indentation-sensitive syntax and strong static typing. Values are bound with '=', not reassigned. Let bindings introduce local names.\",\n    codeSnippet: \"let x = 5\\n    y = 10\\nin x + y\",\n    outputText: \"15\",\n  },",
  },
  {
    id: "DI-4",
    breaks: ["B-2", "T-4"],
    mutation:
      "index.html removes the next-button control entirely, leaving only static non-interactive content.",
    target: "index.html",
    spec: "tests/e2e/tutorial.spec.js",
    expected_failing_tests: [
      "T-4 step click advances content (B-2 happy path)",
      "T-5 repeated clicks traverse all defined steps",
    ],
    file: "index.html",
    find:
      "      <nav class=\"controls\">\n        <button id=\"prev-button\" data-testid=\"prev-button\" type=\"button\">\n          Previous\n        </button>\n        <button id=\"next-button\" data-testid=\"next-button\" type=\"button\">\n          Next\n        </button>\n      </nav>",
    replace:
      "      <nav class=\"controls\">\n        <button id=\"prev-button\" data-testid=\"prev-button\" type=\"button\">\n          Previous\n        </button>\n      </nav>",
  },
  {
    id: "DI-5",
    breaks: ["B-7", "T-3"],
    mutation:
      "index.html splits tutorial steps across multiple anchor-linked pages/sections instead of toggling visibility within a single document.",
    target: "index.html",
    spec: "tests/e2e/tutorial.spec.js",
    expected_failing_tests: ["T-3 single-page structure"],
    file: "index.html",
    find:
      "      <nav class=\"controls\">\n        <button id=\"prev-button\" data-testid=\"prev-button\" type=\"button\">\n          Previous\n        </button>\n        <button id=\"next-button\" data-testid=\"next-button\" type=\"button\">\n          Next\n        </button>\n      </nav>",
    replace:
      "      <nav class=\"controls\">\n        <a href=\"page-prev.html\" id=\"prev-button\" data-testid=\"prev-button\">Previous</a>\n        <a href=\"page-next.html\" id=\"next-button\" data-testid=\"next-button\">Next</a>\n      </nav>",
  },
  {
    id: "DI-6",
    breaks: ["I-7", "T-6"],
    mutation:
      "src/tutorial.js's render()/click handler is detached after the first render, so clicking next-button no longer updates step-heading/step-body text content.",
    target: "src/tutorial.js",
    spec: "tests/e2e/tutorial.spec.js",
    expected_failing_tests: [
      "T-4 step click advances content (B-2 happy path)",
      "T-6 advance control at last step is a no-op or disabled",
    ],
    file: "src/tutorial.js",
    find:
      "export function render(tutorial, root) {\n  const step = tutorial.current();",
    replace:
      "let __rendered = false;\nexport function render(tutorial, root) {\n  if (__rendered) return;\n  __rendered = true;\n  const step = tutorial.current();",
  },
  {
    id: "DI-7",
    breaks: ["I-6", "T-2"],
    mutation:
      "src/steps.js's hello-world step outputText is altered to a string that does not match the canonical Haskell hello-world program output (e.g. 'Hello!' instead of 'Hello, world!').",
    target: "src/steps.js",
    spec: "tests/e2e/tutorial.spec.js",
    expected_failing_tests: ["T-2 hello-world output displayed"],
    file: "src/steps.js",
    find: "    outputText: \"Hello, World!\",",
    replace: "    outputText: \"Hello!\",",
  },
];

export { defects };
export default defects;
