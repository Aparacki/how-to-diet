import * as S from '@eyedea/syncano'
import * as crypto from 'crypto'
import {INVITATION_FROM} from './constants'
import {isEmail} from './helper'

interface Args {
  username: string,
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data, users, endpoint}: S.Core,
    {args, config}: S.Context<Args>
  ) {

    try {
      if (!isEmail(args.username)) {
        return response.json({message: 'User not exist.'}, 400)
      }

      const {username, id} = await users
        .where('username', args.username)
        .first()

      const {token} = await data.recoverPassword
        .create({
          user_id: id,
          token: crypto.randomBytes(32).toString('hex'),
        })

      await endpoint.post('mailgun/send', {
        to: username,
        from: INVITATION_FROM,
        subject: 'DigitalSign - recover password',
        html: `
          <h1>Recover Password</h1>
          <a href='${config.RECOVER_PASSWORD_REDIRECT_URL}?token=${token}'>
            Click this link to recover password
          </a>
        `,
      })

      return response.json({message: `Message has been sent.`})
    } catch (err) {
      return response.json({message: 'User not exist.'}, 400)
    }
  }
}

export default ctx => new Endpoint(ctx)
