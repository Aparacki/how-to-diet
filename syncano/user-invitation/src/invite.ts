import * as S from '@eyedea/syncano'
import * as crypto from 'crypto'
import {INVITATION_MODEL} from './constants'

interface Args {
  firstName: string
  lastName: string
  email: string,
  resource_id: number,
  resource_type: string,
  user: number,
  status: string
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data, logger}: S.Core,
    {args}: S.Context<Args>
  ) {
    const {error, info} = logger('user-invitation:invite')
    try {
      const invitation = await data
        .invitations
        .fields(INVITATION_MODEL)
        .create({
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          key: crypto.randomBytes(16).toString('hex'),
          resource_id: args.resource_id,
          resource_type: args.resource_type,
          user: args.user,
          status: args.status,
        })

      info('Sucessfuly created invitation')
      response.success(invitation)
    } catch (err) {
      error(err)
      response.fail({message: err.response}, 400)
    }
  }

}

export default ctx => new Endpoint(ctx)
