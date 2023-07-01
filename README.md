<div align="right">

[![npm bundle size](https://img.shields.io/bundlephobia/minzip/haken?color=black&label=&style=flat-square)](https://bundlephobia.com/package/haken@latest)
![npm type definitions](https://img.shields.io/npm/types/haken?color=black&label=%20&style=flat-square)
[![version](https://img.shields.io/npm/v/haken?label=&color=black&style=flat-square)](https://www.npmjs.com/package/haken)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/loreanvictor/haken/coverage.yml?label=%20&style=flat-square)](https://github.com/loreanvictor/haken/actions/workflows/coverage.yml)

</div>

# 🪝HAKEN

Normally, running a function yields a single result. With [**HAKEN**](.), you can run a function in a specific context, allowing the function to  register some hooks, which you can then call in response to future events.

```js
// Setup:
import { buildHooksContext } from 'haken'

const { acceptHooks, hook } = buildHooksContext()

export const onMessage = hook('onMessage')
```
```js
// Use in functions:
export const createHistory = () => {
  const history = []
  onMessage(msg => history.push({ date: new Date(), msg }))

  return history
}
```
```js
// Use those functions in a hookable context:

const [history, {hooks}] = acceptHooks(() => createHistory())
hooks.onMessage && source.addListener('message', hooks.onMessage)
```

<br>

## Contents

- [Who is this for?](#who-is-this-for)
- [Why?](#why)
- [Installation](#installation)
- [Usage](#usage)
  - [Meta](#meta)
  - [Type Safety](#type-safety)
- [Contribution](#contribution)


<br>

## Who is this for?

If you are writing a framework, or providing some form of inversion of control, and want to allow _user functions_ (written by someone else) to be able to _hook_ into various aspects of your _host_ code / environment, [**HAKEN**](.) can come in handy.

<br>

## Why?

What [**HAKEN**](.) does can also be achieved by using classes instead of functions. A _user function_ can return an instance (perhaps it is a constructor), which provides methods that your _host code_ can then invoke in response to later events.

The main difference between OOP and the hooks pattern is flexibility and composability: with hooks, it is much easier to bundle repeating patterns of logic into custom hooks and easily re-use them, while in OOP, specifically in a single-inheritance model, this level of composition quickly turns into a headache.

```ts
export const useGreeter = () => {
  onMessage(msg => {
    if (msg.toLowerCase().startsWith('hello')) {
      console.log('Hellow to you sir!')
    }
  })
}
```

A custom hook is analogous to a custom base class you can inherit from, and registering a hook is equivalent to overriding a parent method. From this perspective, for example, with hooks you can:

- Inherit from different base classes, who override different methods
- Override a parent method multiple times
- Conditionally inherit from some base class

Which makes the hooks pattern even more flexible than OOP with multiple inheritance (this is in part due to the scope of hooks being more limited than generic methods: they are supposed to run some side-effect in response to some event, which means you can trivially combine them and disambiguate them).

<br>

## Installation

```js
import { buildHooksContext } from 'https://esm.sh/haken'
```
Or
```bash
npm i haken
```

<br>

## Usage

Step 1: build a hooks context and expose its functions to _user land_:

```js
import { buildHooksContext } from 'haken'

// build the context
const { acceptHooks, hook } = buildHooksContext() 

// expose the hooks
export const onMessage = hook('onMessage')
export const onClose = hook('onClose')
export const onError = hook('onError')
```

Step 2: use the exposed hooks in _user land_ (or allow your users to):

```js
export function setupLogger() {
  onMessage(msg => console.log('received: ' + msg))
  onClose(() => console.log('closed!')
}
```

Step 3: run _user land_ functions with `acceptHooks()` and hook their hooks.

```js
const [result, { hooks }] = acceptHooks(() => setupLogger())

hooks.onMessage && socket.addEventListener('msg', hooks.onMessage)
hooks.onClose && socket.addEventListener('close', hooks.onClose)
hooks.onError && socket.addEventListener('error', hooks.onError)
```

<br>

### Meta

Custom hooks might need some additional metadata about the _host context_. Provide such metadata as the second argument to `acceptHooks()`:

```js
const [result, { hooks }] = acceptHooks(
  () => setupLogger(),
  { socket }             // 👉 this is the metadata
)
```

For accessing this metadata, use the `hooksMeta()` function returned by `buildHooksContext()`. It is recommended to provide wrapper functions for such access instead of providing direct, uncontrolled access to the metadata.

```js
const { acceptHooks, hook, hooksMeta } = buildHooksContext()

export const onMessage = hook('onMessage')
export const onClose = hook('onClose')
export const onError = hook('onError')

// 👇 user functions and custom hooks can call this to access
//    the current socket.
export const currentSocket = () => hooksMeta().socket
```

User functions or custom hooks might also add some metadata of their own, which you can check by reading the `meta` key returned by `acceptHooks()` function:

```js
const [result, {
  hooks,
  meta     // 👉 metadata, possibly modified by custom hooks
}] = acceptHooks(() => setupLogger(), { socket })
```

<br>

### Type Safety

Provide the types of hooks you want for your hooks context as a type argument to `buildHooksContext()`:

```ts
type Hooks = {
  onMessage: (msg: string) => void,
  onClose: () => void,
  onError: (err: any, callsite: Callsite) => void,
}

const { acceptHooks, hook, hooksMeta } = buildHooksContext<Hooks>()
```

You can also enforce the type of the metadata, by passing a second type argument:

```ts
type Hooks = {
  onMessage: (msg: string) => void,
  onClose: () => void,
  onError: (err: any, callsite: Callsite) => void,
}

type Meta = {
  socket: WebSocket
}

const { acceptHooks, hook, hooksMeta } = buildHooksContext<Hooks, Meta>()
```

<br>

## Contribution

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






