# Datadog JavaScript Tracer with ESM Loader Example

This repository contains a minimal-ish example of using
[Datadog Javascript Tracer (a.k.a. `dd-trace`)][dd-trace-js]
with [`ts-node/esm`][ts-node] loader in a Node.js project.

## Motivation

Datadog tracer provides experimental support for ECMAScript modules via an [ESM loader][esm-loader] called [`import-in-the-middle`][iitm].

One of the other popular use-cases of ESM loaders is running TypeScript without precompiling. However, at this moment Node.js doesn't provide out-of-the-box support for chaining loaders and there's not much documentation on how to use `import-in-the-middle` in combination with an ESM loader. This repository contains a working example of using `dd-trace` with `ts-node/esm`.

## Getting started

1. Make sure you have Node 18 or newer
2. Install the dependencies (`npm i`)
3. Run the tests: `npm test`

## Caveats

As of now, IITM (`import-in-the-middle`), expects the specifier extension to be one of [`js`, `mjs`, or `cjs`][iitm-extensions]. In order to be able to chain IITM and `ts-node/esm` loaders, we need to [patch][patch] IITM to make it proxify specifiers with TypeScript extensions as well.

[dd-trace-js]: https://github.com/DataDog/dd-trace-js
[ts-node]: https://github.com/TypeStrong/ts-node
[esm-loader]: https://nodejs.org/api/esm.html#loaders
[iitm]: https://github.com/DataDog/import-in-the-middle
[iitm-extensions]: https://github.com/DataDog/import-in-the-middle/blob/63a7293844e60fb3df6802865f623a587d8c6ce9/hook.mjs#L7
[patch]: ./patches/import-in-the-middle%2B1.2.1.patch
