import * as S from '@eyedea/syncano'
import {STATUS_DECLINED, STATUS_INVITED, STATUS_SIGNED} from './constants'

class Endpoint extends S.Endpoint {
  async run(
    {response, data, users, logger}: S.Core
  ) {
    const {info, error, warn} = logger('api:invitation/list')
    if (!this.user) {
      warn('Unauthorized request.')

      return response.json({message: 'Unauthorized.'}, 401)
    }
    try {
      const invitations = await data
        .invitations
        .where('email', this.user.username)
        .orderBy('created_at', 'DESC')
        .list()
      info(`Successfully got user's invitations`)

      const uniqueDocuments = [...new Set(invitations
        .map(item => item.resource_id))]

      const invitationDetails = await Promise.all(uniqueDocuments.map(async (item) => {
        const document = await getDocumentById(item)
        const inviter = await getInviter(document)
        const documentStatus = await documentStatusForUser(this.user.id, document)

        return {
          email: '',
          inviter: getInviterName(inviter),
          document: {...document},
          status: documentStatus,
          details: {},
          key: '',
        }
      }))

      return response.json(invitationDetails)
    } catch (err) {
      error(err)

      return response.json({message: err.response.data}, 400)
    }

    async function getDocumentById(id: any) {
      return data
        .document
        .where('id', id)
        .fields('id', 'name', 'user')
        .first()
    }

    function getInviterName(inviter: any) {
      if (inviter.firstName && inviter.lastName) {
        return `${inviter.firstName} ${inviter.lastName}`
      }

      return inviter.email
    }

    async function getInviter(document: any) {
      return users
          .where('id', document.user)
          .first()
    }

    async function documentStatusForUser(id: number, document: any) {
        let documentSignatures
        let userSigned
        if (document.status !== STATUS_DECLINED) {
          documentSignatures = await getDocumentSignatures(document.id)
          const userSignatures = await getUserSignatures()
          userSigned  = documentSignatures
            .some(documentSignature => userSignatures
              .find(item => item.id === documentSignature.signature)
            )
        }

        return documentSignatures ?
          userSigned ? STATUS_SIGNED : STATUS_INVITED
          :
          STATUS_DECLINED
    }

    async function getDocumentSignatures(id: number) {
      return data
        .document_signature
        .where('document', id)
        .fields('signature')
        .list()
    }

    async function getUserSignatures() {
      return data
        .signature
        .where('user', this.user.id)
        .fields('id')
        .list()
    }
  }
}

export default ctx => new Endpoint(ctx)
