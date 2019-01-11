import * as S from '@eyedea/syncano'
import {MODELS} from './constants'
import DataHelper from './data-helper'

interface Args {
  documentId: number,
  key?: string
}

class Info extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {
    const dataHelper = new DataHelper(data)
    const {documentId, key} = args
    let documentToInfoId = documentId
    let invitation

    if (key) {
      invitation = await dataHelper.getInvitationByKey(key)
      if (invitation) {
        documentToInfoId = invitation.resource_id
      }
    }

    if (!this.user && !invitation) {
      return response.json({message: 'Unauthorized.'}, 401)
    }

    if (!documentToInfoId) {
      return response.json({message: 'You must enter documentId or key'}, 400)
    }

    try {
      const document = await dataHelper.getDocumentById(documentToInfoId)

      const documentInvitations = await data
      .invitations
      .where('resource_id', documentToInfoId)
      .fields(MODELS.invitations)
      .list()

      const uniqueInvitations = [...new Set(documentInvitations
        .map(item => item.email))]

      const documentSignatures = await data
        .document_signature
        .where('document', documentToInfoId)
        .fields(MODELS.documentSignature)
        .with('invitation', 'signatory')
        .list()

      const guestSignatories = [...new Set(documentSignatures
        .filter(item => item.invitation)
        .map(item => item.invitation.email))]

      const authorizedSignatories = [...new Set(documentSignatures
        .filter(item => item.signatory)
        .map(item => item.signatory.username))]

      const allSignatories = [...guestSignatories, ...authorizedSignatories]

      let signedByMe = false

      if (this.user) {
        signedByMe = documentSignatures
          .filter(item => item.signatory)
          .some(item => item.signatory.id === this.user.id)
      }

      if (!signedByMe && invitation) {
        signedByMe = documentSignatures
        .filter(item => item.invitation)
        .some(item => item.invitation.key === invitation.key)
      }

      return response.json({
          id: document.id,
          name: document.name,
          invited: uniqueInvitations.length,
          signed: allSignatories.length,
          signedByMe,
        }, 200)
    } catch (err) {
      return response.json({message: err.response}, 400)
    }
  }

}

export default ctx => new Info(ctx)
