import * as S from '@eyedea/syncano'

interface Args {
  documentId: any
}

class Remove extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {
    if (!this.user) {
      return response.json({message: 'Unauthorized.'}, 401)
    }
    if (!args.documentId) {
      return response.json({message: 'You must enter documentId'}, 400)
    }

    try {

      await data.document
        .where('user', this.user.id)
        .delete(parseInt(args.documentId, 10))

      await data.document_version
        .where('document', parseInt(args.documentId, 10))
        .delete()

      return response.json({message: `Removed document ${args.documentId}`})
    } catch (err) {
      return response.json({message: err.response.data}, 400)
    }

  }

}

export default ctx => new Remove(ctx)
