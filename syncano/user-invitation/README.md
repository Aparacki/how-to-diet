# Syncano Socket for user invitation

[![Syncano Socket](https://img.shields.io/badge/syncano-socket-blue.svg)](https://syncano.io)
[![CircleCI branch](https://img.shields.io/circleci/project/github/eyedea-io/syncano-socket-user-invitation/master.svg)](https://circleci.com/gh/eyedea-io/syncano-socket-user-invitation/tree/master)
[![Codecov branch](https://img.shields.io/codecov/c/github/eyedea-io/syncano-socket-user-invitation/master.svg)](https://codecov.io/github/eyedea-io/syncano-socket-user-invitation/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/dw/@eyedea-sockets/user-invitation.svg)](https://www.npmjs.com/package/@eyedea-sockets/user-invitation)
![license](https://img.shields.io/github/license/eyedea-io/syncano-socket-user-invitation.svg)

Main Socket features:

* **user-invitation/get** — Get invitation by invitation key
* **user-invitation/invite** — Create invitation for a given e-mail
* **user-invitation/list** — List invitation for given resource ID and type
* **user-invitation/update** — Update invitation

## Getting Started

Install package in your project:

```sh
cd my_project
npm install @syncano/cli --save-dev
npm install @eyedea-sockets/user-invitation --save
npx s deploy
```

Use it:

```js
import Syncano from '@syncano/client'

const s = new Syncano(<instanceName>)

// Get invitation
const params = {
}
const suggestions = await s.get('user-invitation/get', params)

```
