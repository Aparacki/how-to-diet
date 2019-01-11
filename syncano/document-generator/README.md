# Syncano generate html from Moustache or Markdown template

Main Socket features:

* **document-generator/generate** — Generate html using Moustache template 
* **document-generator/generator** — Generate html using Moustache and Markdown

Use it:

```js
import Syncano from '@syncano/client'

const s = new Syncano(<instaneName>)

// Generate html template
const data = {
  template:  '<p>{{name}}</p>'
  data: {name: 'John Doe'}
}
const htmlOutput = await s.post('document-generator/generate', data)
```


