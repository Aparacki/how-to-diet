import {FormStore} from '@shared/types/form-store'
// import {InvitationStore} from '@website/types/invitation'
import {UserStore} from '@website/types/user'
import {types} from 'mobx-state-tree'
import {DocumentStore} from './document-store'
import {Modal} from './modal'
import {SignStore} from './sign'
import {ProductStore} from './product-store'

export const Store = types
  .model('Store', {
    modal: types.optional(Modal, {}),
    userStore: types.optional(UserStore, {}),
    documentStore: types.optional(DocumentStore, {}),
    formStore: types.optional(FormStore, {}),
    signStore: types.optional(SignStore, {}),
    productStore: types.optional(ProductStore, {}),
    // invitationStore: types.optional(InvitationStore, {}),
  })

type StoreType = typeof Store.Type
export interface Store extends StoreType {}
export {User, UserStore} from '@shared/types/user'
export {Form} from '@shared/types/form'
export {FormStore} from '@shared/types/form-store'
export {SignatureModel} from './signature'
export {Document} from './document'
export {DocumentPage} from './page'
export {Invitation} from '@website/types/invitation'
export {Modal} from './modal'
export {DocumentStore} from './document-store'
export {ProductStore} from './product-store'
