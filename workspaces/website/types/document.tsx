import {STATUS_DECLINED, STATUS_INVITED, STATUS_SIGNED, STATUS_UPLOADED} from '@website/constants'
import {getRoot, types} from 'mobx-state-tree'
import * as React from 'react'
import * as Router from 'react-router-dom'
import {SignatureModel} from './signature'

const uploadedIcon = require('@website/assets/images/uploaded.svg')
const signedIcon = require('@website/assets/images/signed.svg')
const declinedIcon = require('@website/assets/images/declined.svg')

export const Document = types
  .model('Document', {
    id: types.identifierNumber,
    name: types.optional(types.string, ''),
    createdAt: types.optional(types.string, ''),
    author: types.optional(types.string, ''),
    firstName: types.optional(types.string, ''),
    lastName: types.optional(types.string, ''),
    file: types.optional(types.string, ''),
    status: types.optional(types.string, STATUS_UPLOADED),
    signatures: types.optional(types.array(SignatureModel), []),
    description: types.optional(types.string, ''),
    isEditing: types.optional(types.boolean, false),
  })
  .actions(self => ({
    setDescription(text: string) {
      self.description = text
    },
    setEditing(state: boolean) {
      self.isEditing = state
    },
  }))
  .views(self => ({
    isAuthor(): boolean {
      const {userStore} = getRoot(self)

      if (!userStore.isLoggedIn) {
        return false
      }

      const user = userStore.profile.username

      return self.author === user
    },
    get statusAvatarSrc(): string {
      return {
        [STATUS_UPLOADED]: uploadedIcon,
        [STATUS_INVITED]: uploadedIcon,
        [STATUS_SIGNED]: signedIcon,
        [STATUS_DECLINED]: declinedIcon,
      }[self.status] || uploadedIcon
    },
    get statusDescription(): string {
      return {
        [STATUS_UPLOADED]: 'File uploaded. Invite to sign',
        [STATUS_INVITED]: 'Waiting for signatories',
        [STATUS_SIGNED]: 'Signed by all signatories',
        [STATUS_DECLINED]: 'One or more signatories declined to sign',
      }[self.status] || 'File is waiting for sign'
    },
    get displayStatusAction(): string {
      return {
        [STATUS_UPLOADED]:
        <Router.Link key="invite" to={`document/invite/${self.id}`}>Invite to Sign</Router.Link>,
        [STATUS_INVITED]:
        <Router.Link key="sign" to={`document/sign/${self.id}`}>Sign</Router.Link>,
        [STATUS_SIGNED]:
        <Router.Link key="view" to={`document/preview/${self.id}`}>View</Router.Link>,
        [STATUS_DECLINED]: <p>Declined</p>,
      }[self.status] || ''
    },
    get actionUrl(): string {
      return {
        [STATUS_UPLOADED]: 'document/invite/',
        [STATUS_INVITED]: 'document/sign/',
        [STATUS_SIGNED]: 'document/preview/',
        [STATUS_DECLINED]: 'document/preview/',
      }[self.status] || 'document/preview/'
    },
    get actionText(): string {
      return {
        [STATUS_UPLOADED]: 'Invite to Sign',
        [STATUS_INVITED]: 'Sign',
        [STATUS_SIGNED]: 'View',
        [STATUS_DECLINED]: 'Declined',
      }[self.status] || ''
    },
    get fullName() {
      return `${self.firstName} ${self.lastName}`
    },
  }))

type DocumentType = typeof Document.Type
export interface Document extends DocumentType {}
