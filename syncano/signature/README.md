# Syncano signature Socket

Main Socket features:

* **signature/list** — list of sygnatures
* **signature/remove** — remove of sygnature
* **signature/upload** — upload of sygnature



Use it:

```js
import Syncano from '@syncano/client'

const s = new Syncano(<instaneName>)

// List of signatures
const params = {
  key
}
const listOfSignatures = await s.post('signature/list', params)
```
