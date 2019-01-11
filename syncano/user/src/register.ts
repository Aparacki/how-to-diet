import * as S from '@eyedea/syncano'
import {isEmail} from './helper'

interface Args {
  username: string,
  password: string,
  firstName: string,
  lastName: string,
}

class Endpoint extends S.Endpoint {
  async run(
    {response, users}: S.Core,
    {args}: S.Context<Args>
  ) {
    if (!isEmail(args.username)) {
      return response.json({message: 'Given email is invalid.'}, 400)
    }

    let user = await users.where('username', 'eq', args.username).first()

    if (user) {
      return response.json({message: 'User already exists.'}, 400)
    }

    user = await users
      .fields('user_key as token')
      .create(args)

    return response.json(user)
  }
}

export default ctx => new Endpoint(ctx)
