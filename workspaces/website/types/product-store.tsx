import {syncano} from '@shared/utils/syncano'
import * as fns from 'date-fns'
import {flow, getRoot, types, getParent} from 'mobx-state-tree'

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
    existProduct: (id) => {
      return self.product.find(i => i === id)
    },
  }))
    .actions(self => ({
    toggleProduct: (id) => {
      !self.existProduct(id)
      ? self.product.push(id)
      : self.product = self.product.filter(i => i !== id) as IStateTreeNode<number[], number[]>
    },
  }))
  .views(self => ({

  }))

export const ProductViewStore = types
  .model('ProductViewModel', {
    prodctsEaten: types.optional(types.array(types.number), []),
    productsNotEaten: types.optional(types.array(ProductModel), []),
    date: types.optional(types.string, ''),
  })

export const ProductStore = types
  .model('ProductsStore', {
    products: types.optional(types.array(ProductModel), []),
    datesToUpdate: types.optional(types.array(types.string), []),
    times: types.optional(types.array(TimeModel), []),
    lookInDate: types.optional(types.Date, fns.startOfToday()),
  })
  .actions(self => ({
    getProductById: (id: number) => {
      return self.products.find(item => {
        return item.id === id})
    },
    stringifyLookInDate() {
      return fns.format(self.lookInDate, 'YYYY-MM-DD')
    },
    getTimes: () => {
      console.log('gettimes ',fns.format(self.lookInDate, 'YYYY-MM-DD'))
        return self.times.find(item => item.date === fns.format(self.lookInDate, 'YYYY-MM-DD'))
    },
  }))
  .actions(self => ({
    changeLookInDateByDay: (days: number) => {
      self.lookInDate = fns.addDays(self.lookInDate, days)

    },
    addDateToUpdate() {
      const exist = self.datesToUpdate.find(item => item === self.stringifyLookInDate())
      if (!exist) {self.datesToUpdate.push(self.stringifyLookInDate())}
    },
    fetchAll: flow(function * () {
      try {
        const response = yield syncano('product/get-all')
        self.products = response.products
        self.times = response.times
      } catch (err) {
        throw err
      }
    }),
    getProductParams: (id) => {
      const product = self.products.find(item => item.id === id)

      return {name: product.name, leve: product.level, cat: product.cat, id: product.id}
    },
    toggleProduct: (id) => {
      self.getTimes().toggleProduct(id)
    }
  }))
  .views(self => ({
    getLookInDate() {
      return self.stringifyLookInDate()
    },
  }))
type ProductModelType = typeof ProductModel.Type
export interface ProductModel extends ProductModelType {}
type ProductStoreType = typeof ProductStore.Type
export interface ProductStore extends ProductStoreType {}
type ProductViewStoreType = typeof ProductViewStore.Type
export interface ProductViewStore extends ProductViewStoreType {}
