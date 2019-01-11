import {syncano} from '@shared/utils/syncano'
import {message} from 'antd'
import {flow} from 'mobx'
import {types} from 'mobx-state-tree'

export const Invitation = types
  .model('Invitation', {
    email: types.string,
    firstName: types.maybeNull(types.string),
    lastName: types.maybeNull(types.string),
    key: types.maybeNull(types.string),
    resource_id: types.maybeNull(types.number),
    // resourceType: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
  })
  .actions(self => ({
    sendReminder: flow(function * () {
      try {
        yield syncano('document/invite', {invitations: [self]})
        message.success(`Reminder have been send to ${self.firstName} ${self.lastName}`)
      } catch (err) {
        message.error(`Something went wrong, please try again`)
        throw err
      }
    }),
  }))

export const Field = types
  .model('Field', {
    key: types.optional(types.number, 0),
    name: types.string,
    value: types.string,
    valid: types.optional(types.boolean, false),
    validated: types.optional(types.boolean, false),
  })
  .views(self => ({
    isValid() {
      return self.valid
    },
    isValidated() {
      return self.validated
    },
    isInvalidAndValidated() {
      return self.validated && !self.valid
    },
  }))
  .actions(self => ({
    onChange(newValue: string) {
      self.value = newValue
    },
    validate(validateFunction: (value: string) => boolean) {
      self.valid = validateFunction(self.value)
      self.validated = true
    },
  }))

export const InviteInputsGroup = types
  .model('InviteInputsGroup', {
    index: types.identifierNumber,
    email: types.optional(Field, {name: 'email', value: ''}),
    firstName: types.optional(Field, {name: 'firstName', value: ''}),
    lastName: types.optional(Field, {name: 'lastName', value: ''}),
  })

// export const InvitationStore = types
//   .model('InvitationStore', {
//     uid: types.optional(types.number, 0),
//     documentId: types.maybeNull(types.string),
//     // invitationsInputs: types.optional(types.array(InviteInputsGroup), []),
//   })
//   .actions(self => ({
//     addSignatory() {
//       const input = InviteInputsGroup.create({
//         index: self.uid++,
//         email: Field.create({name: 'email', value: ''}),
//         firstName: Field.create({name: 'firstName', value: ''}),
//         lastName: Field.create({name: 'lastName', value: ''}),
//       })
//       self.invitationsInputs.push(input)
//     },
//     removeSignatory(inputNumber: number) {
//       const input = self.invitationsInputs.find(item => item.index === inputNumber)
//       if (input) {
//         self.invitationsInputs.remove(input)
//       }
//     },
//     getCurrentSignatory(inputNumber: number) {
//       return self.invitationsInputs.find(item => item.index === inputNumber)
//     },
//     validate() {
//       self.invitationsInputs.forEach( (input) => {
//         input.email.validate(validateEmail)
//         input.firstName.validate(validateIsNotEmpty)
//         input.lastName.validate(validateIsNotEmpty)
//       })

//       return !self.invitationsInputs.some((input) => {
//         return !input.email.valid || !input.firstName.valid  || !input.lastName.valid
//       })
//     },
//     clear() {
//       self.invitationsInputs.replace([])
//     },
//     setDocumentId(documentId: string) {
//       self.documentId = documentId
//     },
//   }))

type InvitationType = typeof Invitation.Type
export interface Invite extends InvitationType {}

type InvitationInputType = typeof InviteInputsGroup.Type
export interface InviteInput extends InvitationInputType {}

// type InvitationStoreType = typeof InvitationStore.Type
// export interface InviteStore extends InvitationStoreType {}
