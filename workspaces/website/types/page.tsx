import {types} from 'mobx-state-tree'
import {SignatureModel} from './signature'

export const DocumentPage = types
  .model('DocumentPage', {
    pageNumber: types.identifierNumber,
    file: types.string,
    height: types.number,
    width: types.number,
    signatures: types.optional(types.array(SignatureModel), []),
  })
  .actions( self => ({
    addSignature(signature: SignatureModel) {
      self.signatures.push(signature)
    },
    removeSignature(signature: SignatureModel) {
      self.signatures.remove(signature)
    },
  }))

type DocumentPageType = typeof DocumentPage.Type
// tslint:disable-next-line:interface-name
export interface DocumentPage extends DocumentPageType {}
