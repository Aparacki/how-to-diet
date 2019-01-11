import * as S from '@eyedea/syncano'

interface Args {
  documentId: number,
  key: string
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {

    const RESOURCE_TYPE = 'document'
    const {documentId, key} = args
    console.log(args)
    if (key) {
      await data.invitations
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
      const invitations = await this.syncano.endpoint.get('user-invitation/list', {
        resource_type: RESOURCE_TYPE,
        resource_id: documentId,
      })

      return response.json(invitations, 200)
    } catch (err) {

      return response.json({message: err.message}, 400)
    }
  }

  endpointDidCatch(err: any) {
    this.syncano.response.json({message: err.message}, 400)
  }
}

export default ctx => new Endpoint(ctx)
