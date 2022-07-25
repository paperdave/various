/** @type {import('eslint').Linter.RulesRecord} */
const rules = {
  // Warnings signal stuff that should not be deployed to production.
  // Errors signal stuff that should be immediately fixed even when developing.

  // All rules from eslint are documented at https://eslint.org/docs/rules

  // Possible Problems
  'array-callback-return': 'error',
  'constructor-super': 'off', // TypeScript checker catches this
  'for-direction': 'error',
  'getter-return': 'error',
  'no-async-promise-executor': 'error',
  'no-await-in-loop': 'off', // Await in loops are more often good than bad
  'no-class-assign': 'off', // TypeScript checker catches this
  'no-compare-neg-zero': 'error',
  'no-cond-assign': 'off', // Prettier always formats this to use parens
  'no-const-assign': 'off', // TypeScript checker catches this
  'no-constant-binary-expression': 'error',
  'no-constant-condition': 'error',
  'no-constructor-return': 'error',
  'no-control-regex': 'error',
  'no-debugger': 'warn', // `debugger` is not allowed in production.
  'no-dupe-args': 'error',
  'no-dupe-class-members': 'off', // Overridden by @typescript-eslint
  'no-dupe-else-if': 'error',
  'no-dupe-keys': 'error',
  'no-duplicate-case': 'error',
  'no-duplicate-imports': 'off', // Prettier handles import organization.
  'no-empty-character-class': 'error',
  'no-empty-pattern': 'error',
  'no-ex-assign': 'error',
  'no-fallthrough': 'error',
  'no-func-assign': 'off', // TypeScript checker catches this
  'no-import-assign': 'off', // TypeScript checker catches this
  'no-inner-declarations': 'error',
  'no-invalid-regexp': 'error',
  'no-irregular-whitespace': 'error', // Enabled just in case. Prettier should handle this.
  'no-loss-of-precision': 'off',
  'no-misleading-character-class': 'error',
  'no-new-symbol': 'error',
  'no-obj-calls': 'off', // TypeScript checker catches this
  'no-promise-executor-return': 'off', // Arrow functions
  'no-prototype-builtins': 'error',
  'no-self-assign': 'error', // TODO: Svelte files must have this off
  'no-self-compare': 'error',
  'no-setter-return': 'error',
  'no-sparse-arrays': 'error',
  'no-template-curly-in-string': 'off', // I prefer this off
  'no-this-before-super': 'error',
  'no-undef': 'off', // TypeScript checker catches this
  'no-unexpected-multiline': 'off', // Prettier handles this
  'no-unmodified-loop-condition': 'error',
  'no-unreachable': 'error',
  'no-unreachable-loop': 'error',
  'no-unsafe-finally': 'error',
  'no-unsafe-negation': 'error',
  'no-unsafe-optional-chaining': 'error',
  'no-unused-private-class-members': 'warn',
  'no-unused-vars': 'off', // Overridden by @typescript-eslint
  'no-use-before-define': 'off', // Overridden by @typescript-eslint
  'no-useless-backreference': 'error',
  'require-atomic-updates': 'error',
  'use-isnan': 'error',
  'valid-typeof': 'off', // TypeScript checker catches this

  // Suggestions
  'accessor-pairs': 'error',
  'arrow-body-style': 'error',
  'block-scoped-var': 'off', // TypeScript checker catches this
  camelcase: 'off', // There are no variable naming conventions yet.
  'capitalized-comments': 'off', // Seems like a good idea, capitalizes commented code!
  'class-methods-use-this': 'warn',
  complexity: 'error',
  'consistent-return': 'error',
  'consistent-this': ['error', 'self'],
  curly: ['error', 'all'],
  'default-case': 'off', // Overridden by @typescript-eslint's `switch-exhaustiveness-check`
  'default-case-last': 'error',
  'default-param-last': 'off', // Overridden by @typescript-eslint
  'dot-notation': 'off', // Overridden by @typescript-eslint
  eqeqeq: ['error', 'always', { null: 'never' }],
  'func-name-matching': 'off',
  'func-names': 'off',
  'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
  'grouped-accessor-pairs': 'off',
  'guard-for-in': 'off',
  'id-denylist': 'off',
  'id-length': 'off',
  'id-match': 'off',
  'init-declarations': 'off',
  'max-classes-per-file': 'off',
  'max-depth': 'off',
  'max-lines': 'off',
  'max-lines-per-function': 'off',
  'max-nested-callbacks': 'off',
  'max-params': ['warn', { max: 4 }], // This might be too strict, but you should be passing an object at this point.
  'max-statements': 'off',
  'multiline-comment-style': 'off',
  'new-cap': 'error',
  'no-alert': 'warn',
  'no-array-constructor': 'off', // Overridden by @typescript-eslint
  'no-bitwise': 'off',
  'no-caller': 'error',
  'no-case-declarations': 'error',
  'no-console': 'warn',
  'no-continue': 'off',
  'no-delete-var': 'error',
  'no-div-regex': 'error',
  'no-else-return': 'error',
  'no-empty': 'warn',
  'no-empty-function': 'off', // Eslint will count a filled function as ANYTHING, even a blank comment. For that reason, it's not worth having this rule.
  'no-eq-null': 'off', // Enabling this would contradict `eqeqeq`
  'no-eval': 'warn',
  'no-extend-native': 'off',
  'no-extra-bind': 'error',
  'no-extra-boolean-cast': 'error',
  'no-extra-label': 'error',
  'no-extra-semi': 'off', // Prettier handles this
  'no-floating-decimal': 'off', // Prettier handles this
  'no-global-assign': 'off', // TypeScript checker catches this
  'no-implicit-coercion': 'off', // TypeScript checker doesn't like these anyways
  'no-implicit-globals': 'off',
  'no-implied-eval': 'off', // Overridden by @typescript-eslint
  'no-inline-comments': 'off',
  'no-invalid-this': 'off', // TypeScript checker catches this
  'no-iterator': 'error',
  'no-label-var': 'off',
  'no-lone-blocks': 'error',
  'no-lonely-if': 'error',
  'no-loop-func': 'off', // Overridden by @typescript-eslint
  'no-magic-numbers': 'off', // Overridden by @typescript-eslint
  'no-mixed-operators': 'off', // Prettier handles this
  'no-multi-assign': 'off', // I personally find these really funny
  'no-multi-str': 'off',
  'no-negated-condition': 'off',
  'no-nested-ternary': 'off',
  'no-new': 'off',
  'no-new-func': 'error',
  'no-new-object': 'error',
  'no-new-wrappers': 'error',
  'no-nonoctal-decimal-escape': 'error',
  'no-octal': 'error',
  'no-octal-escape': 'error',
  'no-param-reassign': 'off',
  'no-plusplus': 'off', // who made this rule, i want to send them a angry letter
  'no-proto': 'off', // TypeScript checker catches this
  'no-redeclare': 'off', // Overridden by @typescript-eslint
  'no-regex-spaces': 'warn',
  'no-restricted-exports': 'off',
  'no-restricted-globals': 'off',
  'no-restricted-imports': 'off',
  'no-restricted-properties': 'off',
  'no-restricted-syntax': 'off',
  'no-return-assign': 'error',
  'no-return-await': 'off', // Overridden by @typescript-eslint
  'no-script-url': 'error',
  'no-sequences': 'off',
  'no-shadow': 'off', // Overridden by @typescript-eslint
  'no-shadow-restricted-names': 'error',
  'no-ternary': 'off',
  'no-throw-literal': 'off',
  'no-undefined': 'off',
  'no-underscore-dangle': 'off',
  'no-unneeded-ternary': 'error',
  'no-unused-expressions': 'off', // Overridden by @typescript-eslint
  'no-unused-labels': 'error',
  'no-useless-call': 'error',
  'no-useless-catch': 'off',
  'no-useless-computed-key': 'error',
  'no-useless-concat': 'off', // might mess up when newlines
  'no-useless-constructor': 'off', // Overridden by @typescript-eslint
  'no-useless-escape': 'error',
  'no-useless-rename': 'off', // Prettier handles this
  'no-useless-return': 'error',
  'no-var': 'error',
  'no-void': 'error',
  'no-warning-comments': 'off',
  'no-with': 'error',
  'object-shorthand': 'error',
  'one-var': 'off', // This creates very large error underlines when working.
  'one-var-declaration-per-line': 'off', // Prettier handles this
  'operator-assignment': 'error',
  'prefer-arrow-callback': 'error',
  'prefer-const': 'error',
  'prefer-destructuring': 'off',
  'prefer-exponentiation-operator': 'error',
  'prefer-named-capture-group': 'off', // I'll be honest I didn't even know this was a feature at all. I'm going to keep it off for now.
  'prefer-numeric-literals': 'off', // TypeScript checker catches this
  'prefer-object-has-own': 'error',
  'prefer-object-spread': 'error', // Spread is faster anyways
  'prefer-promise-reject-errors': 'off',
  'prefer-regex-literals': 'error',
  'prefer-rest-params': 'error',
  'prefer-spread': 'error',
  'prefer-template': 'off', // I would only turn this on if I could have the rule be at least two concatenations
  'quote-props': 'off', // Prettier handles this
  radix: 'error',
  'require-await': 'warn',
  'require-unicode-regexp': 'off',
  'require-yield': 'warn',
  'sort-imports': 'off', // Prettier handles this
  'sort-keys': 'off', // Prettier handles this
  'sort-vars': 'off', // Prettier handles this
  'spaced-comment': 'off', // Prettier handles this
  strict: 'off', // We are usually always developing in a framework that will compile with strict mode enabled for us.
  'symbol-description': 'error', // Ideally, I would modify the `Symbol` type data but nah lol.

  // Layout & Formatting rules are all disabled because Prettier handles them

  // @typescript-eslint rules. All are in alphabetical order, and style related rules are left out.
  '@typescript-eslint/adjacent-overload-signatures': 'error',
  '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/ban-ts-comment': [
    'warn',
    {
      // I allow these but only with proper descriptions, since there are useful cases I
      // use `@ts-ignore` in my code. If the usage is stupid and not required, it should
      // just fail the code review.
      minimumDescriptionLength: 1,
      'ts-expect-error': 'allow-with-description',
      'ts-ignore': 'allow-with-description',
      'ts-nocheck': 'allow-with-description',
    },
  ],
  // TODO: Add custom rules for this next one. Could consider having `{}` and `Object` tell user
  // about a nonexistant type alias in `@paperdave/types` for `NonNullish` or whatever.
  '@typescript-eslint/ban-types': 'error',
  '@typescript-eslint/class-literal-property-style': ['error', 'fields'],
  '@typescript-eslint/consistent-generic-constructors': 'error',
  '@typescript-eslint/consistent-indexed-object-style': 'error',
  '@typescript-eslint/consistent-type-assertions': 'error',
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/consistent-type-exports': [
    'error',
    { fixMixedExportsWithInlineTypeSpecifier: true },
  ],
  '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
  '@typescript-eslint/default-param-last': 'error',
  '@typescript-eslint/dot-notation': [
    'error',
    {
      allowIndexSignaturePropertyAccess: true,
      allowPrivateClassPropertyAccess: true,
      allowProtectedClassPropertyAccess: true,
    },
  ],
  '@typescript-eslint/explicit-function-return-type': 'off', // I dislike this, as I practically am married to inferred types, though I understand how that is nice.
  '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
  // With this one I foresee a lot of problems, but I think it's a good idea to have it on.
  // Setting to warn for now so it gets caught in code reviews.
  '@typescript-eslint/explicit-module-boundary-types': [
    'warn',
    {
      allowArgumentsExplicitlyTypedAsAny: true,
    },
  ],
  '@typescript-eslint/member-delimiter-style': 'off', // Handled by Prettier
  // This does not have an auto-fix, which is really anoying. I refuse to enable this until
  // https://github.com/typescript-eslint/typescript-eslint/issues/2296 happens, but its been
  // two years with no PR, maybe i'll do it myself lol
  // "@typescript-eslint/member-ordering": ["error", {}],
  '@typescript-eslint/method-signature-style': ['error', 'method'],
  '@typescript-eslint/naming-convention': 'off', // Code is too diverse; You'll run into a package that doesn't do
  '@typescript-eslint/no-array-constructor': 'error',
  '@typescript-eslint/no-base-to-string': 'error',
  '@typescript-eslint/no-confusing-non-null-assertion': 'error',
  '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
  '@typescript-eslint/no-dupe-class-members': 'error',
  '@typescript-eslint/no-duplicate-enum-values': 'error',
  '@typescript-eslint/no-dynamic-delete': 'error',
  '@typescript-eslint/no-empty-function': 'off', // Eslint will count a filled function as ANYTHING, even a blank comment. For that reason, it's not worth having this rule.
  '@typescript-eslint/no-empty-interface': 'error', // This is the stupidest rule ever invented.
  '@typescript-eslint/no-explicit-any': 'off', // This is a good rule, I just love my any. I'll promise to try and document what and why I use it
  '@typescript-eslint/no-extra-non-null-assertion': 'error', // I was not aware this was even valid code.
  '@typescript-eslint/no-extra-parens': 'off', // Prettier handles this
  '@typescript-eslint/no-extra-semi': 'off', // Prettier handles this
  '@typescript-eslint/no-extraneous-class': 'off',
  '@typescript-eslint/no-floating-promises': 'off', // This will lead to a bunch of .catch(() => {}), which is worse than just throwing them IMO.
  '@typescript-eslint/no-for-in-array': 'error',
  '@typescript-eslint/no-implied-eval': 'off',
  '@typescript-eslint/no-inferrable-types': 'error',
  '@typescript-eslint/no-invalid-this': 'off', // I thought the TypeScript compiler would catch this.
  '@typescript-eslint/no-invalid-void-type': 'error',
  '@typescript-eslint/no-loop-func': 'error',
  '@typescript-eslint/no-loss-of-precision': 'error',
  '@typescript-eslint/no-magic-numbers': 'off', // TODO: get the sanity to handle using this
  '@typescript-eslint/no-meaningless-void-operator': 'error',
  '@typescript-eslint/no-misused-new': 'error',
  '@typescript-eslint/no-misused-promises': 'error',
  '@typescript-eslint/no-namespace': 'error', // Namespaces are evil. Use ESM instead.
  '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
  '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
  // Same with no-any and ban-ts-comment, you'll just add eslint ignores everywhere instead of documenting why. But
  // also alot of these cases you can just infer based on usage that it's ok to use the assert.
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-redeclare': 'error',
  '@typescript-eslint/no-redundant-type-constituents': 'error',
  '@typescript-eslint/no-require-imports': 'off',
  '@typescript-eslint/no-restricted-imports': 'off', // We do not have any restricted imports.
  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-this-alias': 'off', // I never had to use a `const this`, but I still feel like it's fine to allow.
  '@typescript-eslint/no-throw-literal': 'error', // This should be enforced by the JS runtime tbh.
  '@typescript-eslint/no-type-alias': 'off', // No.
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
  '@typescript-eslint/no-unnecessary-condition': 'off',
  '@typescript-eslint/no-unnecessary-qualifier': 'error',
  '@typescript-eslint/no-unnecessary-type-arguments': 'error',
  '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  '@typescript-eslint/no-unnecessary-type-constraint': 'error',
  '@typescript-eslint/no-unsafe-argument': 'off', // any is supposed to just work, not be limited.
  '@typescript-eslint/no-unsafe-assignment': 'off', // any is supposed to just work, not be limited.
  '@typescript-eslint/no-unsafe-call': 'off', // any is supposed to just work, not be limited.
  '@typescript-eslint/no-unsafe-member-access': 'off', // any is supposed to just work, not be limited.
  '@typescript-eslint/no-unsafe-return': 'off', // any is supposed to just work, not be limited.
  '@typescript-eslint/no-unused-expressions': 'off', // This is turned off since every line of code will be red underlined as you type.
  '@typescript-eslint/no-unused-vars': 'warn',
  '@typescript-eslint/no-use-before-define': 'off', // TypeScript checker catches this
  '@typescript-eslint/no-useless-constructor': 'off',
  '@typescript-eslint/no-useless-empty-export': 'error',
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/non-nullable-type-assertion-style': 'error',
  '@typescript-eslint/parameter-properties': 'off', // While confusing, these properties are really useful.
  '@typescript-eslint/prefer-as-const': 'error',
  '@typescript-eslint/prefer-enum-initializers': 'off', // I don't think we need this.
  '@typescript-eslint/prefer-for-of': 'error',
  '@typescript-eslint/prefer-function-type': 'error',
  '@typescript-eslint/prefer-includes': 'error',
  '@typescript-eslint/prefer-literal-enum-member': 'error',
  '@typescript-eslint/prefer-namespace-keyword': 'off', // We do not use namespaces.
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/prefer-optional-chain': 'off', // TypeScript compiler handles this.
  '@typescript-eslint/prefer-readonly': 'off', // This will flag all things until you finish writing your code.
  '@typescript-eslint/prefer-readonly-parameter-types': 'off', // Kind of ugly ngl
  '@typescript-eslint/prefer-reduce-type-parameter': 'error',
  '@typescript-eslint/prefer-regexp-exec': 'error',
  '@typescript-eslint/prefer-return-this-type': 'error',
  '@typescript-eslint/prefer-string-starts-ends-with': 'error',
  '@typescript-eslint/prefer-ts-expect-error': 'error',
  '@typescript-eslint/promise-function-async': ['error', { checkArrowFunctions: false }],
  '@typescript-eslint/require-array-sort-compare': ['error', { ignoreStringArrays: true }],
  '@typescript-eslint/require-await': 'warn',
  '@typescript-eslint/restrict-plus-operands': 'off', // Doesn't work.
  '@typescript-eslint/restrict-template-expressions': 'off',
  '@typescript-eslint/return-await': ['error', 'always'], // Forcing await will add an extra line to the stack trace, to improve debugging of where the promise was actually created.
  '@typescript-eslint/sort-type-union-intersection-members': 'off', // Sometimes we want a custom order of a union.
  '@typescript-eslint/strict-boolean-expressions': 'off',
  '@typescript-eslint/switch-exhaustiveness-check': 'error',
  '@typescript-eslint/triple-slash-reference': 'off', // These have uses still
  '@typescript-eslint/typedef': 'error',
  '@typescript-eslint/unbound-method': 'off',
  '@typescript-eslint/unified-signatures': 'off', // Does not work right. see @paperdave/utils' range() function.
  // "@typescript-eslint/unified-signatures": ["error", { ignoreDifferentlyNamedParameters: true }],
};

module.exports = { rules };
