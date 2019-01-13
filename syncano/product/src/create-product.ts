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
      const cats: any = await data.categories
      .fields('id', 'name')
      .list()

      const convertProducts = await this.convertProducts(products, cats)
      const leftProducts = await this.productsExist(convertProducts)
      if (!leftProducts.length) {
          return response.json({message: 'Product arleady exist'}, 200)
        }

      const pro = await data.products
      .create(leftProducts)

      return response.json({message: 'Success, created products', pro}, 200)
    } catch (err) {
        console.warn(err)

        return response.fail({message: err.message}, 400)
    }
  }
  async convertProducts(products: object, categories: any) {
    const converted = []
    Object.entries(products).forEach((item) => {
      converted.push(...this.createProductObject(item, categories))
    })

    return converted
  }

createProductObject(arr, categories: any) {
  function splitString(stringToSplit: string, separator: string) {
    return stringToSplit.split(separator)
  }
  const cat = categories.filter(i => {
    console.log(i.name, ' = ', arr[0])
    return i.name === arr[0].toLowerCase()
  })
  console.log('kategoria', cat[0])

  const products = []

  arr[1].forEach((item, i) => {
    splitString(item, ',').forEach(ytem => {
     if (item) {
      products.push({cat: cat[0].id, 'level': i, 'name': ytem.toLowerCase()})
     }
    })
  })

  return products
}

  async productsExist(products: string[] | any) {
    let exist: object[] = await this.syncano.data.products
    .fields('name')
    .list()
    exist = exist.map(item => {
      return Object.values(item)[0]
    })

    return products
    .filter(item => !exist.includes(item.name.toLowerCase()))
    .map(item => ({'name': item.name, 'level': item.level, 'cat': item.cat}))
  }
}

export default ctx => new Endpoint(ctx)
