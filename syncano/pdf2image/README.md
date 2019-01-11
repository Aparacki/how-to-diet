# Syncano Socket for PDF to PNG conversion

[![Syncano Socket](https://img.shields.io/badge/syncano-socket-blue.svg)](https://syncano.io)
[![CircleCI branch](https://img.shields.io/circleci/project/github/eyedea-io/syncano-socket-pdf2image/master.svg)](https://circleci.com/gh/eyedea-io/syncano-socket-pdf2image/tree/master)
[![Codecov branch](https://img.shields.io/codecov/c/github/eyedea-io/syncano-socket-pdf2image/master.svg)](https://codecov.io/github/eyedea-io/syncano-socket-pdf2image/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/dw/@eyedea-sockets/pdf2image.svg)](https://www.npmjs.com/package/@eyedea-sockets/pdf2image)
![license](https://img.shields.io/github/license/eyedea-io/syncano-socket-pdf2image.svg)

Main Socket features:

* **pdf2image/convert** — convert PDF to PNG

## Getting Started

Install package in your project:

```sh
cd my_project
npm install @syncano/cli --save-dev
npm install @eyedea-sockets/pdf2image --save
npx s deploy
```

Use it:

```js
import Syncano from '@syncano/client'

const s = new Syncano(<instanceName>)

// Convert
const params = {
}
await s.get('pdf2image/convert', params)
```
