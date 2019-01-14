import {syncano} from '@shared/utils/syncano'
import {flow, getRoot, types} from 'mobx-state-tree'

export const ProductModel = types
  .model('ProductStore', {
    id: types.maybeNull(types.optional(types.number, 0)),
    name: types.maybeNull(types.optional(types.string, '')),
    level: types.optional(types.number, 0),
    cat: types.maybeNull(types.optional(types.number, 0)),
  })

export const TimeModel = types
  .model('ProductStore', {
    id: types.optional(types.number, -1),
    date: types.optional(types.string, ''),
    product: types.optional(types.array(types.number), []),
  })
  .actions(self => ({
    getEatenProducts: () => {
      return self.product
    },
  }))

export const ProductStore = types
  .model('ProductsStore', {
    products: types.optional(types.array(ProductModel), []),
    eatenProducts: types.optional(types.array(ProductModel), []),
    times: types.optional(types.array(TimeModel), []),
  })
  .actions(self => ({
    getProductById: (id: number) => {
        return self.products.find(item => {
          return item.id === id})
      },
    }))
  .actions(self => ({
    fetchAll: flow(function * () {
      try {
        const response = yield syncano('product/get-all')
        self.products = response.products
        self.times = response.times
      } catch (err) {
        throw err
      }
    }),
    getEatenProductByDate: (date: string) => {
      const productIds = self.times.find(item => item.date === date)

      return productIds ?
      (productIds
      .getEatenProducts()
      .map(id => self.getProductById(id)))
      : []
    }
  }))

type ProductModelType = typeof ProductModel.Type
export interface ProductModel extends ProductModelType {}
type ProductStoreType = typeof ProductStore.Type
export interface ProductStore extends ProductStoreType {}
