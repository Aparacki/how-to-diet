import * as S from '@eyedea/syncano'

interface Args {
  product: [number],
  date: string,
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {

    const {product, date} = args
    // const startEndDayDate = getStartEndDayDate(date)
    try {
      const selectedDate = await data.dates
      .fields('id', 'product', 'date')
      .where('date', 'in', [date])
      .first()

      let msg
      if (selectedDate) {
        await data.dates.update(selectedDate.id, {product})
        msg = 'updated'
      } else {
        await data.dates.create({date, product})
        msg = 'created'
      }

      return response.json({message: `Success, ${msg} datestamp`, selectedDate}, 200)
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
