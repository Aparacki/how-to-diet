import * as S from '@eyedea/syncano'
import {INVITATION_MODEL} from './constants'

interface Args {
  key: string,
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data, logger}: S.Core,
    {args}: S.Context<Args>
  ) {
    const {error, info} = logger('user-invitation:get')
    const {key} = args
    try {
      const invitation = await data.invitations
        .where('key', key)
        .fields(INVITATION_MODEL)
        .first()

      info(`Invitation with key ${key} was found).`)
      response.success(invitation)
    } catch (err) {
      error(err)
      response.fail({message: err.response}, 400)
    }
  }

}

export default ctx => new Endpoint(ctx)
