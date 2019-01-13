import * as S from '@eyedea/syncano'

class Endpoint extends S.Endpoint {
  async run(
    {response, data}: S.Core
  ) {

    try {
      const products = await data.products
      .fields('id', 'name', 'level', 'cat')
      .list()

      const times = await data.dates
      .fields('id', 'date', 'product')
      .list()

      return response.json({message: 'Success', products, times}, 200)
    } catch (err) {
        console.warn(err)

        return response.fail({message: err.message}, 400)
    }
  }
}
export default ctx => new Endpoint(ctx)
