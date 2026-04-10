// Intentionally empty.
//
// Since Storybook 10.3, `@storybook/addon-vitest` automatically wires up
// project annotations from the preview config and every addon listed in
// `.storybook/main.ts` (including `@storybook/addon-a11y`), so no manual
// setup is needed here. Leave this file empty unless you need custom
// Vitest setup that is unrelated to Storybook project annotations.
//
// NOTE: do not reference the function name used to register annotations
// in this file — `@storybook/addon-vitest` does a plain substring check
// on the file contents and will disable its automatic injection if it
// sees that identifier, which strips the framework renderer (and a11y
// rules) from the test runner.
