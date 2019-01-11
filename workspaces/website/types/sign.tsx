import {syncano} from '@shared/utils/syncano'
import {flow} from 'mobx'
import {types} from 'mobx-state-tree'
import {DocumentPage} from './page'
import {SignatureModel} from './signature'

export const SignStore = types.
  model('SignStore', {
    completed: types.optional(types.boolean, false),
    documentId: types.maybeNull(types.number),
    invitationKey: types.maybeNull(types.string),
    pages: types.optional(types.array(DocumentPage), []),
    pending: types.optional(types.boolean, false),
    ready: types.optional(types.boolean, false),
    status: types.maybeNull(types.string),
    signatures: types.optional(types.array(SignatureModel), []),
    uploadingSignature: types.optional(types.boolean, false),
  })
  .actions( self => ({
    setPages: (pages: any) => {
      self.pages = pages
    },
    setCompleted: (status: any) => {
      self.completed = status
      self.pending = false
    },
    setStatus: (status: any) => {
      self.status = status
    },
    setUploadingSignature: (status: any) => {
      self.uploadingSignature = status
    },
  }))
  .actions( self => ({
    setDocumentId: (ID: number) => {
      self.setPages([])
      self.documentId = ID
    },
    setReady: (value: boolean) => {
      self.ready = value
    },
    setSignatures: (signatures: any) => {
      self.signatures.replace(signatures)
    },
    setInvitationKey: (key: string) => {
      self.setPages([])
      self.invitationKey = key
    },
  }))
  .actions( self => ({
    fetchSignatures: flow(function * () {
      try {
        const signatures = yield syncano('signature/list', {key: self.invitationKey})
        self.setSignatures(signatures)
      } catch (err) {
        throw err
      }
    }),
    fetch: flow(function * () {
      try {
        const document = yield syncano('document/preview', {documentId: self.documentId, key: self.invitationKey})
        self.setPages(document.pages)
        self.setStatus(document.status)
      } catch (err) {
        throw err
      }
    }),
    sign: async () => {
      try {
        const signaturesArray = []
        self.pages.map((page, index) => {
          self.pending = true
          page.signatures.map((signature, {}) => {
            const data = {
              documentId: self.documentId,
              signatureId: signature.id,
              positionX: signature.x,
              positionY: signature.y,
              pageNumber: index,
              width: signature.width,
              height: signature.height,
              key: self.invitationKey,
              pageWidth: signature.pageWidth,
              pageHeight: signature.pageHeight,
            }
            signaturesArray.push(data)
          })
        })
        const documentId = self.documentId
        const res = await syncano('document/sign', {signatures: signaturesArray, documentId})
        if (res.message === 'Success') {
          self.setCompleted(true)
          location.pathname = `./`
        }
      } catch (err) {
        throw err
      }
    },
  }))
  .views( self => ({
    isReady(): boolean {
      self.pages.map((item) => {
        if (item.signatures.length !== 0) {
          return true
        }
      })

      return false
    },
  }))

type SignStoreType = typeof SignStore.Type
export interface SignStore extends SignStoreType {}
