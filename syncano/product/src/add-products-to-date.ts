import * as S from '@eyedea/syncano'

interface Args {
  date_data: Array,
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {

    const {date_data} = args

    try {


      let msg
      await Promise.all(date_data.map(async item => {
      const date = item.date
      const products = item.product
      const productId = products.map(i => {
        return i.id
      })

      const selectedDate = await data.dates
      .fields('id', 'product', 'date')
      .where('date', 'in', [date])
      .first()

      if (selectedDate) {
        await data.dates.update(selectedDate.id, {product: productId})
        msg = 'updated'
      } else {
        await data.dates.create({date, product: productId})
        msg = 'created'
      }
    }))

      return response.json({message: `Success, ${msg} datestamp`}, 200)
    } catch (err) {
        console.warn(err)

        return response.fail({message: err.message}, 400)
    }
  }

  // async getStartEndDayDate(date: number) {

  // }
  async categoryExist(argsCategories: string[] | any) {
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
