/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    // Warnings signal stuff that should not be deployed to production.
    // Errors signal stuff that should be immediately fixed even when developing.

    // All rules from eslint are documented at https://eslint.org/docs/rules

    // Possible Problems
    "array-callback-return": "error",
    "constructor-super": "off", // TypeScript checker catches this
    "for-direction": "error",
    "getter-return": "error",
    "no-async-promise-executor": "error",
    "no-await-in-loop": "off", // Await in loops are more often good than bad
    "no-class-assign": "off", // TypeScript checker catches this
    "no-compare-neg-zero": "error",
    "no-cond-assign": "off", // Prettier always formats this to use parens
    "no-const-assign": "off", // TypeScript checker catches this
    "no-constant-binary-expression": "error",
    "no-constant-condition": "error",
    "no-constructor-return": "error",
    "no-control-regex": "error",
    "no-debugger": "warn", // `debugger` is not allowed in production.
    "no-dupe-args": "error",
    "no-dupe-class-members": "error",
    "no-dupe-else-if": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-duplicate-imports": "off", // Prettier handles import organization.
    "no-empty-character-class": "error",
    "no-empty-pattern": "error",
    "no-ex-assign": "error",
    "no-fallthrough": "error",
    "no-func-assign": "off", // TypeScript checker catches this
    "no-import-assign": "off", // TypeScript checker catches this
    "no-inner-declarations": "error",
    "no-invalid-regexp": "error",
    "no-irregular-whitespace": "error", // Enabled just in case. Prettier should handle this.
    "no-loss-of-precision": "error",
    "no-misleading-character-class": "error",
    "no-new-symbol": "error",
    "no-obj-calls": "off", // TypeScript checker catches this
    "no-promise-executor-return": "error",
    "no-prototype-builtins": "error",
    "no-self-assign": "error", // TODO: Svelte files must have this off
    "no-self-compare": "error",
    "no-setter-return": "error",
    "no-sparse-arrays": "error",
    "no-template-curly-in-string": "off", // I prefer this off
    "no-this-before-super": "error",
    "no-undef": "off", // TypeScript checker catches this
    "no-unexpected-multiline": "off", // Prettier handles this
    "no-unmodified-loop-condition": "error",
    "no-unreachable": "error",
    "no-unreachable-loop": "error",
    "no-unsafe-finally": "error",
    "no-unsafe-negation": "error",
    "no-unsafe-optional-chaining": "error",
    "no-unused-private-class-members": "warn",
    "no-unused-vars": "warn",
    "no-use-before-define": "off", // TypeScript checker catches this
    "no-useless-backreference": "error",
    "require-atomic-updates": "error",
    "use-isnan": "error",
    "valid-typeof": "off", // TypeScript checker catches this

    // Suggestions
    "accessor-pairs": "error",
    "arrow-body-style": "error",
    "block-scoped-var": "off", // TypeScript checker catches this
    camelcase: "off", // There are no variable naming conventions yet.
    "capitalized-comments": "off", // Seems like a good idea, capitalizes commented code!
    "class-methods-use-this": "warn",
    complexity: "error",
    "consistent-return": "error",
    "consistent-this": ["error", "self"],
    curly: ["error", "multi-or-nest", "consistent"],
    "default-case": "error",
    "default-case-last": "error",
    "default-param-last": "error",
    "dot-location": "error",
    eqeqeq: ["error", "always", { null: "never" }],
    "func-name-matching": "off",
    "func-names": "off",
    "func-style": ["error", "declaration", { allowArrowFunctions: true }],
    "grouped-accessor-pairs": "off",
    "guard-for-in": "off",
    "id-denylist": "off",
    "id-length": "off",
    "id-match": "off",
    "init-declarations": "off",
    "max-classes-per-file": "off",
    "max-depth": "off",
    "max-lines": "off",
    "max-lines-per-function": "off",
    "max-nested-callbacks": "off",
    "max-params": ["warn", { max: 4 }], // This might be too strict, but you should be passing an object at this point.
    "max-statements": "off",
    "multiline-comment-style": "off",
    "new-cap": "error",
    "no-alert": "warn",
    "no-array-constructor": "error",
    "no-bitwise": "off",
    "no-caller": "error",
    "no-case-declarations": "error",
    "no-console": "warn",
    "no-continue": "off",
    "no-delete-var": "error",
    "no-div-regex": "error",
    "no-else-return": "error",
    "no-empty": "warn",
    "no-empty-function": "warn",
    "no-eq-null": "off", // Enabling this would contradict `eqeqeq`
    "no-eval": "warn",
    "no-extend-native": "off",
    "no-extra-bind": "error",
    "no-extra-boolean-cast": "error",
    "no-extra-label": "error",
  },
  // plugins: ["svelte3", "@typescript-eslint"],
  // ignorePatterns: ["*.cjs"],
  // overrides: [{ files: ["*.svelte"], processor: "svelte3/svelte3" }],
  // settings: {
  //   "svelte3/typescript": () => require("typescript"),
  // },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2022,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};

module.exports = config;
