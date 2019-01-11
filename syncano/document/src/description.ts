import * as S from '@eyedea/syncano'

interface Args {
  id: number
  description: string
}

class Description extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {
    const {id} = args
    let {description} = args

    if (!this.user) {
      return response.json({message: 'Unauthorized.'}, 401)
    }

    try {
      if (!description) {description = ''}
      const document = await data.document.update(id, {description})

      return document
    } catch (err) {

      return response.json({message: err.response}, 400)
    }
}
}

export default ctx => new Description(ctx)
