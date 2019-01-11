import {syncano} from '@shared/utils/syncano'
import {flow, types} from 'mobx-state-tree'
import {UserStore as SharedUserStore} from '../../shared/types/user'
import {Document} from '../types/document'
import {SignatureModel} from '../types/signature'
import {UserInvited} from '../types/user-invited'

const ExtendedUserStore = types
  .model('ExtendedUserStore', {
    documents: types.optional(types.array(Document), []),
    signatures: types.optional(types.array(SignatureModel), []),
    invitations: types.optional(types.array(UserInvited), []),

    selected: types.maybe(types.number),
  })

export const UserStore = types
  .compose(SharedUserStore, ExtendedUserStore)
  .named('UserStore')
  .actions(self => ({
    removeSignature: flow(function * (id: number) {
      try {
        self.pending.set('remove-signature', '')
        yield syncano('signature/remove', {id})
      } catch (err) {
        throw err
      } finally {
        self.pending.delete('signature-remove')
      }
    }),
    addSignatureToStore: (signature: any) => {
      self.signatures.push(SignatureModel.create(
        {
          id: signature.id,
          name: signature.name,
        }))
    },
    mapSignaturesToFileList: () => {
      return self.signatures.map(item => ({
        uid: item.id,
        name: item.name,
        status: 'done',
        url: item.file,
      }))
    },
    getSignatures: flow(function *() {
      try {
        self.pending.set('list-signatures', '')
        const signatures = yield syncano('signature/list', {
          key: new URL(location.href).searchParams.get('key'),
        })
        const userSignatures = signatures.map((item) => {
          return SignatureModel.create({
            id: item.id,
            name: item.name,
            file: item.file,
            width: item.width,
            height: item.height,
          })
        })
        self.signatures.replace(userSignatures)
      } catch (err) {
        throw err
      } finally {
        self.pending.delete('list-signatures')
      }
    }),
    updateProfile: flow(function *(credentials: {
      image?: any,
      firstName?: string,
      lastName?: string,
      remove?: boolean
    } | FormData) {
      try {
        self.pending.set('profile-update', '')
        const profile = yield syncano('user/update-profile', credentials)
        self.profile.avatar = profile.avatar

        return profile
      } catch (err) {
        throw err
      } finally {
        self.pending.delete('profile-update')
      }
    }),
    getAllInvitations: flow(function * () {
      try {
        self.pending.set('list-invitations', '')
        const invitations = yield syncano('invitation/list')
        const userInvitations = invitations.map((item) => {
          return UserInvited.create({
            email: item.email,
            details: item.details,
            document:  Document.create({id: item.document.id, name: item.document.name}),
            key: item.key,
            status: item.status,
            inviter: item.inviter,
          })
        })
        self.invitations.replace(userInvitations)
      } catch (err) {
        throw err
      } finally {
        self.pending.delete('list-invitations')
      }
    }),
  }))

type UserStoreType = typeof UserStore.Type
export interface UserStore extends UserStoreType {}
