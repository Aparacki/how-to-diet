import * as S from '@eyedea/syncano'
import FormData from 'form-data'
import {USER} from './constants'

interface Args {
  username?: string,
  password?: string,
  firstName?: string,
  lastName?: string,
  image?: any,
  remove?: boolean,
}

class Endpoint extends S.Endpoint {
  async run(
    {response, users}: S.Core,
    {args}: S.Context<Args>
  ) {
    if (!this.user) {
      return response.json({message: 'Unauthorized!'}, 401)
    }

    try {
      if (args.image || args.remove) {
        await this.updateImage(args.image, args.remove)
      }

      const user = await users
        .fields(USER)
        .update(this.user.id, args)

      return response.json(user)
    } catch (err) {

      return response.fail(err)
    }
  }

   async updateImage (image: any, remove: boolean) {
    const avatar = new FormData()

    if (image) {
      avatar.append('avatar', image, {
        filename: image.filename,
        filetype: image.contentType,
      })
    }

    await this.syncano.users
      .update(this.user.id, !remove ? avatar : {avatar: null})
  }
}

export default ctx => new Endpoint(ctx)
