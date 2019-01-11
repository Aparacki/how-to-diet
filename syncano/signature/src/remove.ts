import * as S from '@eyedea/syncano'

interface Args {
  id: number
}

class Endpoint extends S.Endpoint {
  async run(
    {data, response, logger}: S.Core,
    {args}: S.Context<Args>
  ) {
    const {info, error, warn} = logger('signature/remove')
    const {id} = args

    if (!this.user || !id) {
      warn('Unauthorized request.')

      return response.json({
        message: !this.user ? 'Unauthorized.' : 'Please send signature id.',
      }, !this.user ? 401 : 400)
    }

    try {
      const result = await data
        .signature
        .where('id', id)
        .delete()

      info(`Successfully deleted signature: ${result}`)

      return response.json({message: `Successfully deleted signature with id: ${result}`}, 200)
    } catch (err) {
      error(err)

      return response.json({message: err.response.data}, 400)
    }}}

export default ctx => new Endpoint(ctx)
