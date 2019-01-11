import * as S from '@eyedea/syncano'
import {INVITATION_MODEL} from './constants'

interface Args {
  key: string,
  status: string,
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data, logger}: S.Core,
    {args}: S.Context<Args>
  ) {
    const {error, info} = logger('user-invitation:update')
    const {key, status} = args
    try {
      const invitation = await data.invitations
        .fields(INVITATION_MODEL)
        .where('key', key)
        .update({status})

      info('Sucessfuly updated invitation')
      response.success(invitation)
    } catch (err) {
      error(err)
      response.fail({message: err.response}, 400)
    }
  }

}

export default ctx => new Endpoint(ctx)
