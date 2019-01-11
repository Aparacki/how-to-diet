import {getParent, types} from 'mobx-state-tree'
import {DocumentPage} from './page'

export const SignatureModel = types
  .model('SignatureModel', {
    id: types.identifierNumber,
    name: types.optional(types.string, ''),
    createdAt: types.optional(types.string, ''),
    file: types.optional(types.string, ''),
    width: types.optional(types.number, 0),
    height: types.optional(types.number, 0),
    x: types.optional(types.number, 0),
    y: types.optional(types.number, 0),
    firstName: types.optional(types.string, ''),
    lastName: types.optional(types.string, ''),
    declined: types.optional(types.boolean, false),
    pageHeight: types.optional(types.number, 0),
    pageWidth: types.optional(types.number, 0),
  })
  .actions(self => ({
    remove: () => {
      getParent<DocumentPage>(self, 2).removeSignature(self as SignatureModel)
    },
    setPosition: (x: number, y: number) => {
      self.x =  Math.floor(x)
      self.y =  Math.floor(y)
    },
    setSize: (width: number, height: number) => {
      self.width = Math.floor(width)
      self.height = Math.floor(height)
    },
    setPageSize: (width: number, height: number) => {
      self.pageHeight = height
      self.pageWidth = width
    },
  }))
  .views(self => ({
    get coordinates() {
      return {
        x: self.x,
        y: self.y,
      }
    },
    get size() {
      return {
        width: self.width,
        height: self.height,
      }
    },
  }))

type SignatureModelType = typeof SignatureModel.Type
// tslint:disable-next-line:interface-name
export interface SignatureModel extends SignatureModelType {}
