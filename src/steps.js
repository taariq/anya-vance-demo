/**
 * @typedef {Object} TutorialStep
 * @property {number} id - 0-based stable index matching array position
 * @property {string} title
 * @property {string} body
 * @property {string} [codeSnippet]
 * @property {string} [outputText]
 */

/** @type {TutorialStep[]} */
const steps = [
  {
    id: 0,
    title: "Hello, Haskell!",
    body:
      "Welcome to this Haskell tutorial. Haskell is a purely functional programming language. Let's start with the classic hello-world program.",
    codeSnippet: 'main = putStrLn "Hello, World!"',
    outputText: "Hello, World!",
  },
  {
    id: 1,
    title: "Basic Syntax",
    body:
      "Haskell uses indentation-sensitive syntax and strong static typing. Values are bound with '=', not reassigned. Let bindings introduce local names.",
    codeSnippet: "let x = 5\n    y = 10\nin x + y",
    outputText: "15",
  },
  {
    id: 2,
    title: "Types and Functions",
    body:
      "Every expression has a type. Functions are declared with a type signature followed by the definition, and are applied by juxtaposition.",
    codeSnippet: "square :: Int -> Int\nsquare n = n * n\n\nmain = print (square 6)",
    outputText: "36",
  },
  {
    id: 3,
    title: "Lists and Pattern Matching",
    body:
      "Lists are a fundamental data structure in Haskell. Functions can be defined using pattern matching on list structure.",
    codeSnippet:
      "sumList :: [Int] -> Int\nsumList [] = 0\nsumList (x:xs) = x + sumList xs\n\nmain = print (sumList [1,2,3,4])",
    outputText: "10",
  },
];

export default steps;
