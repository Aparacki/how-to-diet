import {types} from 'mobx-state-tree'
import {Document} from '../types/document'

const Details = types
  .model('Details', {
    role: types.maybeNull(types.string),
    firstName: types.maybeNull(types.string),
    lastName: types.maybeNull(types.string),
  })

export const UserInvited = types
  .model('UserInvited', {
    details: types.maybeNull(Details),
    email: types.string,
    document: types.maybeNull(Document),
    key: types.maybeNull(types.string),
    status: types.optional(types.string, ''),
    inviter: types.optional(types.string, ''),
  })

type UserInvitedType = typeof UserInvited.Type
export interface UserInvited extends UserInvitedType {}
