<div align="right">

[![npm bundle size](https://img.shields.io/bundlephobia/minzip/haken?color=black&label=&style=flat-square)](https://bundlephobia.com/package/haken@latest)
![npm type definitions](https://img.shields.io/npm/types/haken?color=black&label=%20&style=flat-square)
[![version](https://img.shields.io/npm/v/haken?label=&color=black&style=flat-square)](https://www.npmjs.com/package/haken)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/loreanvictor/haken/coverage.yml?label=%20&style=flat-square)](https://github.com/loreanvictor/haken/actions/workflows/coverage.yml)

</div>

# 🪝HAKEN

Normally, running a function yields a single result. With [**HAKEN**](.), you can run a function in a specific context, allowing the function to also register some hooks, which you can then call in response to future events.

```ts
// Setup:
import { buildHooksContext } from 'haken'

const { acceptHooks, hook } = buildHooksContext<{ onMessage: (msg: string) => void}>()

export const onMessage = hook('onMessage')
```
```ts
// Use in functions:
export const createHistory = () => {
  const history = []
  onMessage(msg => history.push({ date: new Date(), msg }))

  return history
}
```
```ts
// Use those functions in a hookable context:

const [history, {hooks}] = acceptHooks(() => createHistory())
hooks.onMessage && source.addListener('message', hooks.onMessage)
```

<br>

## Who is this for?

[**HAKEN**](.) is useful for when you want to allow someone else write the functions that might benefit using the hooks. If you are writing a framework, or providing some form of inversion of control, and want to allow user functions to be able to _hook_ into various aspects of your _host_ code / environment, perhaps [**HAKEN**](.) is useful for you.

<br>

## Why?

The same thing can be effectively achieved with classes: the _user function_ (perhaps a constructor) can return an instance with some methods, and the _host_ code can later on call those methods.

The main difference is composability: _user functions_ can use custom hooks, which can arbitrarily invoke the original hooks:

```ts
export const useGreeter = () => {
  onMessage(msg => {
    if (msg.toLowerCase().startsWith('hello')) {
      console.log('Hellow to you sir!')
    }
  })
}
```

To achieve the same composability with classes and methods, you either need to inherit classes, which are pretty limiting due to single-inheritance, or use mixins, which are way more complicated to make.

<br>

# Contribution

You need [node](https://nodejs.org/en/), [NPM](https://www.npmjs.com) to start and [git](https://git-scm.com) to start.

```bash
# clone the code
git clone git@github.com:loreanvictor/haken.git
```
```bash
# install stuff
npm i
```

Make sure all checks are successful on your PRs. This includes all tests passing, high code coverage, correct typings and abiding all [the linting rules](https://github.com/loreanvictor/haken/blob/main/.eslintrc). The code is typed with [TypeScript](https://www.typescriptlang.org), [Jest](https://jestjs.io) is used for testing and coverage reports, [ESLint](https://eslint.org) and [TypeScript ESLint](https://typescript-eslint.io) are used for linting. Subsequently, IDE integrations for TypeScript and ESLint would make your life much easier (for example, [VSCode](https://code.visualstudio.com) supports TypeScript out of the box and has [this nice ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)), but you could also use the following commands:

```bash
# run tests
npm test
```
```bash
# check code coverage
npm run coverage
```
```bash
# run linter
npm run lint
```
```bash
# run type checker
npm run typecheck
```






