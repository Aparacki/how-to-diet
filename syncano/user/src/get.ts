import * as S from '@eyedea/syncano'
import {USER} from './constants'

interface Args {
  username: string,
}

class Endpoint extends S.Endpoint {
  async run(
    {response, users}: S.Core,
    {args}: S.Context<Args>
  ) {
    if (!this.user) {
      return response.json({message: 'Unauthorized!'}, 401)
    }

    const user = await users
      .fields(USER)
      .where('username', args.username)
      .first()

    return response.json(user)
  }
}

export default ctx => new Endpoint(ctx)
