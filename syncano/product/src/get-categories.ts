import * as S from '@eyedea/syncano'

class Endpoint extends S.Endpoint {
  async run(
    {response, data}: S.Core
  ) {

    try {
      const categories = await data.categories
      .fields('name')
      .list()

      return response.json({message: 'Success', categories}, 200)
    } catch (err) {
        console.warn(err)

        return response.fail({message: err.message}, 400)
    }
  }
}
export default ctx => new Endpoint(ctx)
