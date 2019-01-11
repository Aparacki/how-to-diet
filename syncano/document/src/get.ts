import * as S from '@eyedea/syncano'
import {MODELS} from './constants'
import {endpointURL} from './data-helper'

interface Args {
  documentId: number,
  key: string
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {
    let invitation
    const {documentId, key} = args

    if (key) {
      invitation = await data.invitations
        .where('key', args.key)
        .where('resource_id', args.documentId)
        .firstOrFail()
    } else if (!this.user) {
      return response.json({message: 'Unauthorized.'}, 401)
    }

    if (!documentId) {
      return response.json({message: 'You must enter documentId'}, 400)
    }

    try {
      const document = await data.document
        .where('id', documentId)
        .with('user')
        .fields(MODELS.document)
        .first()

      if (!key && this.user.username !== document.author) {
        const invitaitons = await data.invitations
          .where('resource_id', documentId)
          .list()

        if (!invitaitons.find(item => item.email === this.user.username)) {
          throw new Error('You do not own this file')
        }
      }

      document.file = endpointURL(this.ctx, 'document/get-latest-file', {
        documentId: document.id,
      })

      return response.json(document, 200)
    } catch (err) {
      console.warn(err)

      return response.json({message: err.message}, 400)
    }
  }

  endpointDidCatch(err) {
    this.syncano.response.json({message: err.message}, 400)
  }
}

export default ctx => new Endpoint(ctx)
