# eslint-config-dave

Extremely thorough, but opinionated [ESLint](https://eslint.org/) configuration used by myself. It has a goal of being a one-size-fits-all tool, which has a downside of installing a handful of packages that you may not expect (such as the `svelte` compiler for linting svelte code). Does not cover formatting, which is instead handled by my [prettier config](https://npmjs.com/prettier-config-dave).

To use, install `eslint-config-dave` and write your one-line `.eslintrc`

```json
{ "extends": "dave" }
```

## What's configured out of the box:

- TypeScript (if a `.tsconfig` exists)
- Code in Svelte files
- Code in Markdown files

What I would like to add

- Svelte markup
- React
- Vue
- Markdown content itself
