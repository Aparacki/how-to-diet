import * as S from '@eyedea/syncano'
import {INVITATION_MODEL} from './constants'

interface Args {
  resource_id: number,
  resource_type: string,
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data, logger}: S.Core,
    {args}: S.Context<Args>
  ) {
    const {error, info} = logger('user-invitation:list')
    const {resource_id} = args
    try {
      const invitations = await data.invitations
        .where('resource_id', resource_id)
        .fields(INVITATION_MODEL)
        .list()

      info(`Successfuly loaded invitations(${invitations.length}).`)
      response.success(invitations)
    } catch (err) {
      error(err)
      response.fail({message: err.response}, 400)
    }
  }
}

export default ctx => new Endpoint(ctx)
