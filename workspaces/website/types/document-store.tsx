import {syncano} from '@shared/utils/syncano'
import {validateEmail, validateIsNotEmpty} from '@website/utils/validators'
import {flow, getRoot, types} from 'mobx-state-tree'
import {Document} from './document'
import {Field, Invitation, InviteInput, InviteInputsGroup} from './invitation'
import {SignatureModel} from './signature'

export const DocumentStore = types
  .model('DocumentStore', {
    documents: types.optional(types.array(Document), []),
    signatures: types.optional(types.array(SignatureModel), []),
    invitations: types.optional(types.array(Invitation), []),
    sendInvitations: types.optional(types.array(Invitation), []),
    invitationsInputs: types.optional(types.array(InviteInputsGroup), []),
    uid: types.optional(types.number, 0),
    selected: types.maybe(types.number),
    documentFilter: types.optional(types.string, 'all'),
  })
  .views(self => ({
    documentExists(documentId: string) {
      return !!self.documents.find(item => item.id.toString() === documentId)
    },
    get document() {
      const id = self.selected

      return id ? self.documents.find(item => item.id === id) : null
    },
  }))
  .actions(self => ({
    isInvitationExist(invitationInput: InviteInput) {
      const existingInvitation = self.invitations.find(item =>
        item.email === invitationInput.email.value
        && item.firstName === invitationInput.firstName.value
        && item.lastName === invitationInput.lastName.value)

      return existingInvitation ? true : false
    },
  }))
  .actions(self => ({
    setSignatures: (signatures: any) => {
      self.signatures.replace(signatures)
    },
    pushInvitations: (invitations: any) => {
      if (invitations) {
        self.invitations.push(...invitations)
      }
    },
    setInvitations: (invitations: any) => {
      if (invitations) {
        self.invitations.replace(invitations)
      }
    },
  }))
  .actions(self => ({
    setDocumnetFilter: (filter: string) => {
      self.documentFilter = filter
    },
    getAllDocuments: flow(function * () {
      try {
        self.documents = yield syncano('document/list')
      } catch (err) {
        throw err
      }
    }),
    createCategories: flow(function * (categories: string[]) {
      try {
        console.log(categories)
        yield syncano('product/create-category', {categories})
      } catch (err) {
        throw err
      }
    }),
    createProducts: flow(function * (products: object) {
      try {
        console.log(products)
        yield syncano('product/create-product', {products})
      } catch (err) {
        throw err
      }
    }),
    getDocument: flow(function * (id: string, key: string) {
      const documentId = parseInt(id, 10)

      try {
        const document = yield syncano('document/get', {documentId, key})
        self.documents.replace([document])
        self.selected = document.id === documentId ? documentId : null
      } catch (err) {
        console.warn(err)

        return false
      }
    }),
    setDescription: flow(function * (id: number, description: string) {
      try {
        const document = yield syncano('document/description', {id, description})
        self.documents.replace([document])
      } catch (err) {
        throw err
      }
    }),
    removeDocument: flow(function * (documentId: number) {
      try {
        const res = yield syncano('document/remove', {documentId})
        if (res) {
          return res
        }
      } catch (err) {
        throw err
      }
    }),
    uploadDocument: flow(function * ({file, description = ''}: any) {
      const form = new FormData()
      form.append('file', file)
      form.append('description', description)

      try {
        const {document} = yield syncano('document/upload', form)
        self.documents.replace([Document.create(document), ...self.documents])
        location.pathname = `/document/details/${document.id}`
      } catch (err) {
        throw err
      }
    }),
    // isSigner(documentId: number) {
    //   const document = self.documents.find(item => item.id === documentId)
    //   if (self.profile) {
    //     const invitation = document.invitations.find(item => item.email === self.profile.username)

    //     return !!invitation
    //   }
    // },
    createInvitations: flow(function * (invitationInputs: Array<InviteInput>) {
      try {
        invitationInputs.map((invitationInput) => {
          if (!self.isInvitationExist(invitationInput)) {
            self.invitations.push(Invitation.create({
              email: invitationInput.email.value,
              firstName: invitationInput.firstName.value,
              lastName: invitationInput.lastName.value,
            }))
          }
        })

        const invitations = self.invitations.map((item) => {
          return {email: item.email, firstName: item.firstName, lastName: item.lastName}
        })

        yield syncano('document/invite', {invitations, documentId: self.selected})
      } catch (err) {
        throw err
      } finally {
        self.invitations.replace([])
      }
    }),
    getInvitations: flow(function *(key: string) {
      try {
        self.sendInvitations = yield syncano('document/get-invitations', {documentId: self.selected, key})
      } catch (err) {
        throw err
      }
    }),
    updateStatus: flow(function *(status: string) {
      const id = self.selected
      const document = self.documents.find(item => item.id === id)
      document.status = status
    }),
    getDocumentSignatures: flow(function *() {
      try {
        const signatures = yield syncano('signature/list', {documentId: self.selected})
        self.signatures.push(signatures)
      } catch (err) {
        throw err
      }
    }),
    addCurrentUser() {
      const {userStore} = getRoot(self)
      const user = userStore.profile
      const input = InviteInputsGroup.create({
        index: self.uid++,
        email: Field.create({name: 'email', value: user.username}),
        firstName: Field.create({name: 'firstName', value: user.firstName}),
        lastName: Field.create({name: 'lastName', value: user.lastName}),
      })
      self.invitationsInputs.push(input)
    },
    addSignatory() {
      const input = InviteInputsGroup.create({
        index: self.uid++,
        email: Field.create({name: 'email', value: ''}),
        firstName: Field.create({name: 'firstName', value: ''}),
        lastName: Field.create({name: 'lastName', value: ''}),
      })
      self.invitationsInputs.push(input)
    },
    removeSignatory(inputNumber: number) {
      const input = self.invitationsInputs.find(item => item.index === inputNumber)
      if (input) {
        self.invitationsInputs.remove(input)
      }
    },
    getCurrentSignatory(inputNumber: number) {

      return self.invitationsInputs.find(item => item.index === inputNumber)
    },
    validate() {
      self.invitationsInputs.forEach( (input) => {
        input.email.validate(validateEmail)
        input.firstName.validate(validateIsNotEmpty)
        input.lastName.validate(validateIsNotEmpty)
      })

      return !self.invitationsInputs.some((input) => {
        return !input.email.valid || !input.firstName.valid  || !input.lastName.valid
      })
    },
    clear() {
      self.invitationsInputs.replace([])
    },
  })).views(self => ({
    get documentsList() {
      const {userStore} = getRoot(self)
      const {username} = userStore.profile
      let documentList: any = self.documents

      if (self.documentFilter === 'my') {
        documentList = self.documents.filter(({author}) => author === username)
      } else if (self.documentFilter !== 'all') {

        documentList = self.documents.filter(({status}) => status === self.documentFilter)
      }

      return documentList.map(document => ({
        ...document,
        key: document.id,
        fullName: document.fullName,
        createdAt: new Date(document.createdAt).toLocaleString(),
        actions: {
          status: document.status,
          file: document.file,
          id: document.id,
          isAuthor: document.author === username,
        },
      }))
    },
  }))

type DocumentStoreType = typeof DocumentStore.Type
export interface DocumentStore extends DocumentStoreType {}
