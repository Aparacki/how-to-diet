import * as S from '@eyedea/syncano'
import {MODELS} from './constants'

class List extends S.Endpoint {
  async run(
    {response, data}: S.Core
  ) {

    if (!this.user) {
      response.json({message: 'Unauthorized.'}, 400)
    }

    try {
      const documents = await data.document
        .where('user', this.user.id)
        .fields(MODELS.document)
        .with('user')
        .orderBy('created_at', 'DESC')
        .list()

      let invitations = await data.invitations
        .where('email', this.user.username)
        .fields(MODELS.invitations)
        .list()

      invitations = await Promise.all(
        invitations.map(
          async ({resource_id}) => {
            const document = await data.document
              .where('id', resource_id)
              .fields(MODELS.document)
              .with('user')
              .first()

            if (document && document.author === this.user.username) {
              return null
            }

            return document
          }
        )
      )

      invitations = invitations.filter(item => item !== null)

      return response.json([...documents, ...invitations])
    } catch (err) {
      console.log(err)

      return response.json({message: err.response.data}, 400)
    }
  }

}

export default ctx => new List(ctx)
