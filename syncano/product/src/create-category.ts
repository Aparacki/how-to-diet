import * as S from '@eyedea/syncano'

interface Args {
  categories: [string]
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {

    const {categories} = args
    if (!categories) {
      return response.json({message: 'Should be at least one category'}, 400)
    }

    try {

      const leftCategories = await this.categoryExist(categories)
      if (!leftCategories.length) {
          return response.json({message: 'Category arleady exist'}, 200)
        }

      await data.categories
      .create(leftCategories)

      return response.json({message: 'Success, created categories', categories: leftCategories}, 200)
    } catch (err) {
        console.warn(err)

        return response.fail({message: err.message}, 400)
    }
  }

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
