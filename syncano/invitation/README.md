# Syncano Socket for Digitalsign invitations

[![Syncano Socket](https://img.shields.io/badge/syncano-socket-blue.svg)](https://syncano.io)
[![CircleCI branch](https://img.shields.io/circleci/project/github/eyedea-io/syncano-socket-invitation/master.svg)](https://circleci.com/gh/eyedea-io/syncano-socket-invitation/tree/master)
[![Codecov branch](https://img.shields.io/codecov/c/github/eyedea-io/syncano-socket-invitation/master.svg)](https://codecov.io/github/eyedea-io/syncano-socket-invitation/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/dw/@eyedea-sockets/invitation.svg)](https://www.npmjs.com/package/@eyedea-sockets/invitation)
![license](https://img.shields.io/github/license/eyedea-io/syncano-socket-invitation.svg)

Main Socket features:

* **invitation/list** — Endpoint to get a list of user's invitations

## Getting Started

Install package in your project:

```sh
cd my_project
npm install @syncano/cli --save-dev
npm install @eyedea-sockets/invitation --save
npx s deploy
```

Use it:

```js
import Syncano from '@syncano/client'

const s = new Syncano(<instanceName>)

// Get a list
const params = {
}
const suggestions = await s.get('invitation/list', params)

```
