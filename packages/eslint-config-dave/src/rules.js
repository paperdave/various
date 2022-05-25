/** @type {import('eslint').Linter.RulesRecord} */
const rules = {
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
  "dot-location": "off", // Prettier handles this
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
  "no-empty-function": "off", // Eslint will count a filled function as ANYTHING, even a blank comment. For that reason, it's not worth having this rule.
  "no-eq-null": "off", // Enabling this would contradict `eqeqeq`
  "no-eval": "warn",
  "no-extend-native": "off",
  "no-extra-bind": "error",
  "no-extra-boolean-cast": "error",
  "no-extra-label": "error",
  "no-extra-semi": "off", // Prettier handles this
  "no-floating-decimal": "off", // Prettier handles this
  "no-global-assign": "off", // TypeScript checker catches this
  "no-implicit-coercion": "off", // TypeScript checker doesn't like these anyways
  "no-implicit-globals": "off",
  "no-implied-eval": "error",
  "no-inline-comments": "off",
  "no-invalid-this": "off", // TypeScript checker catches this
  "no-iterator": "error",
  "no-label-var": "off",
  "no-lone-blocks": "error",
  "no-lonely-if": "error",
  "no-loop-func": "error",
  "no-magic-numbers": "off", // TODO: get the sanity to handle using this
  "no-mixed-operators": "off", // Prettier handles this
  "no-multi-assign": "off", // I personally find these really funny
  "no-multi-str": "off",
  "no-negated-condition": "off",
  "no-nested-ternary": "off",
  "no-new": "off",
  "no-new-func": "error",
  "no-new-object": "error",
  "no-new-wrappers": "error",
  "no-nonoctal-decimal-escape": "error",
  "no-octal": "error",
  "no-octal-escape": "error",
  "no-param-reassign": "off",
  "no-plusplus": "off", // who made this rule, i want to send them a angry letter
  "no-proto": "off", // TypeScript checker catches this
  "no-redeclare": "error",
  "no-regex-spaces": "warn",
  "no-restricted-exports": "off",
  "no-restricted-globals": "off",
  "no-restricted-imports": "off",
  "no-restricted-properties": "off",
  "no-restricted-syntax": "off",
  "no-return-assign": "error",
  "no-return-await": "error",
  "no-script-url": "error",
  "no-sequences": "off",
  "no-shadow": "error",
  "no-shadow-restricted-names": "error",
  "no-ternary": "off",
  "no-throw-literal": "off",
  "no-undefined": "off",
  "no-underscore-dangle": "off",
  "no-unneeded-ternary": "error",
  "no-unused-expressions": "off", // This is turned off since every line of code will be red underlined as you type.
  "no-unused-labels": "error",
  "no-useless-call": "error",
  "no-useless-catch": "off",
  "no-useless-computed-key": "error",
  "no-useless-concat": "off", // might mess up when newlines
  "no-useless-constructor": "off",
  "no-useless-escape": "error",
  "no-useless-rename": "off", // Prettier handles this
  "no-useless-return": "error",
  "no-var": "error",
  "no-void": "error",
  "no-warning-comments": "off",
  "no-with": "error",
  "object-shorthand": "error",
  "one-var": "off", // This creates very large error underlines when working.
  "one-var-declaration-per-line": "off", // Prettier handles this
  "operator-assignment": "error",
  "prefer-arrow-callback": "error",
  "prefer-const": "error",
  "prefer-destructuring": "off",
  "prefer-exponentiation-operator": "error",
  "prefer-named-capture-group": "off", // I'll be honest I didn't even know this was a feature at all. I'm going to keep it off for now.
  "prefer-numeric-literals": "off", // TypeScript checker catches this
  "prefer-object-has-own": "error",
  "prefer-object-spread": "error", // Spread is faster anyways
  "prefer-promise-reject-errors": "off",
  "prefer-regex-literals": "error",
  "prefer-rest-params": "error",
  "prefer-spread": "error",
  "prefer-template": "off", // I would only turn this on if I could have the rule be at least two concatenations
  "quote-props": "off", // Prettier handles this
  radix: "error",
  "require-await": "warn",
  "require-unicode-regexp": "off",
  "require-yield": "warn",
  "sort-imports": "off", // Prettier handles this
  "sort-keys": "off", // Prettier handles this
  "sort-vars": "off", // Prettier handles this
  "spaced-comment": "off", // Prettier handles this
  strict: "off", // We are usually always developing in a framework that will compile with strict mode enabled for us.
  "symbol-description": "error", // Ideally, I would modify the `Symbol` type data but nah lol.

  // Layout & Formatting rules are all disabled because Prettier handles them
};

module.exports = { rules };
