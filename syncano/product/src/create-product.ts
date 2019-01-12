import * as S from '@eyedea/syncano'

interface Args {
  products: [object]
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {

    const {products} = args
    if (!products) {
      return response.json({message: 'No products'}, 400)
    }

    try {
      const convertProducts = await this.convertProducts(products)
      // const leftProducts = await this.productsExist(products)
      // if (!leftProducts.length) {
      //     return response.json({message: 'Product arleady exist'}, 400)
      //   }

      // await data.categories
      // .create(leftProducts)

      return response.json({message: 'Success, created categories'}, 200)
    } catch (err) {
        console.warn(err)

        return response.fail({message: err.message}, 400)
    }
  }
  async convertProducts(products) {
    console.table(Object.entries(products))
  }

  async productsExist(argsCategories: string[] | any) {
    let exist: object[] = await this.syncano.data.categories
    .fields('name')
    .list()
    exist = exist.map(item => {
      return Object.values(item)[0]
    })

    return argsCategories
    .filter(item => !exist.includes(item.toLowerCase()))
    .map(item => ({'name': item.toLowerCase()}))
  }
}

export default ctx => new Endpoint(ctx)
