import * as S from '@eyedea/syncano'
import {INVITATION_DEFAULT_ROLE, INVITATION_FROM,
  INVITATION_RESOURCE_TYPE, INVITATION_STATUS, INVITATION_SUBJECT, MODELS} from './constants'
import {doctype, template} from './template'

interface Args {
  invitations: Array<any>,
  documentId: number
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data, users}: S.Core,
    {args}: S.Context<Args>
  ) {
    if (!this.user) {
      return response.json({message: 'Unauthorized.'}, 401)
    }

    const {documentId, invitations} = args

    if (!invitations) {
      return response.json({message: 'At least one invitation is required.'}, 400)
    }

    try {
      const document = await this.getDocumentIfAuthor(documentId || invitations[0].resource_id)

      const user = await users
        .fields(MODELS.user)
        .find(this.user.id)

      await Promise.all(invitations.map(async item => {

        const invitedUser = await this.getUser(item)
        const invitationExist = await this.getInvitationIfExist(item, document)
        const {key} = invitationExist == null ? await this.saveInvitation(item, document, invitedUser) : invitationExist

        if (!invitedUser || invitedUser.username !== this.user.username) {
          if (invitationExist === null || invitationExist.status === INVITATION_STATUS) {
            this.sendEmail(item, key, document, user)
          }
        }

        if (invitationExist === null) {
          await data.document.update(documentId, {status: 'invited'})
        }
      }))

      response.json({message: 'Invitations sent successfully'})
    } catch (err) {
      return response.fail({message: err.message}, 400)
    }
  }

  async getDocumentIfAuthor (documentId: number) {
    return this.syncano.data.document
    .where('user', this.user.id)
    .findOrFail(documentId)
  }

  async getUser (invitation: any) {
    return this.syncano.users
      .fields(MODELS.user)
      .where('username', invitation.email)
      .first()
  }

  async getInvitationIfExist (invitation: any, document: any) {
    return this.syncano.data.invitations
    .where('email', invitation.email)
    .where('resource_id', document.id)
    .first()
  }

  async saveInvitation (invitation: any, document: any, invitedUser: any) {
    return this.syncano.endpoint.get('user-invitation/invite', {
      email: invitation.email,
      resource_id: document.id,
      resource_type: INVITATION_RESOURCE_TYPE,
      role: INVITATION_DEFAULT_ROLE,
      status: INVITATION_STATUS,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      user: invitedUser ? invitedUser.id : null,
    })
  }

  async generateTemplate (invitation: any, key: string, document: any, user: any) {
    return this.syncano.endpoint.post('document-generator/generate', {
      template,
      data: {
        firstName: user.firstName || user.username,
        lastName: user.lastName || '',
        documentName: document.name,
        invitedName: invitation.email,
        signUrl : `${this.ctx.meta.request.HTTP_ORIGIN}/document/details/${document.id}?key=${key}`,
      },
    })
  }

  async sendEmail  (invitation: any, key: string, document: any, user: any) {
    const htmlTemplate = await this.generateTemplate(invitation, key, document, user)

    return this.syncano.endpoint.post('mailgun/send', {
      from: INVITATION_FROM,
      subject: `${INVITATION_SUBJECT} ${user.firstName} ${user.lastName}`,
      to: invitation.email,
      html: doctype + htmlTemplate,
    }, {headers: {'x-user-key': this.user.user_key}})
  }
}

export default ctx => new Endpoint(ctx)
