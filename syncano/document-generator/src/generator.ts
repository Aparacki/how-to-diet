import * as S from '@eyedea/syncano'
import md from 'marked'
import * as Mustache from 'mustache'
import helpers from './helpers'

interface Args {
  template: string,
  data: object,
}

class Endpoint extends S.Endpoint {
  async run(
    {response}: S.Core,
    {args}: S.Context<Args>
  ) {

    let {template: t, data} = args

    try {
      t = md(t) // Parse markdown
      t = Mustache.render(t, {...data, ...helpers})

      return response(t, 200, 'text/html')
    } catch (err) {
      response.json({message: 'Failed to generate document.', details: err.toString()}, 400)
    }
  }
}

export default ctx => new Endpoint(ctx)
