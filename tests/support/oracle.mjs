// Harness lane: shared oracle data, independently derived from the plan's
// Decision Record (D-3: hard-coded canonical Haskell hello-world source and
// output) rather than read back from src/steps.js at test time, per plan s10
// ("Tests avoid copying implementation logic into the oracle"). Both the
// unit lane and the e2e lane import these constants so the hello-world
// literal is defined exactly once and never drifts between suites.
//
// Exports:
//   HELLO_WORLD_SOURCE: string -- canonical Haskell hello-world source text
//     expected to appear verbatim (e.g. within a <pre>/<code> block) per R-1/D-3.
//   HELLO_WORLD_OUTPUT: string -- canonical expected stdout text for that
//     source, per D-3/I-6.
//   ALLOWED_FONT_FAMILIES: string[] -- the exact allowed list for T-11's
//     computed font-family check, per D-7 and AR-013.

export const HELLO_WORLD_SOURCE = 'main = putStrLn "Hello, World!"';

export const HELLO_WORLD_OUTPUT = 'Hello, World!';

export const ALLOWED_FONT_FAMILIES = Object.freeze([
  'system-ui',
  '-apple-system',
  'sans-serif',
]);

export const NARROW_VIEWPORT_WIDTH = 360;
