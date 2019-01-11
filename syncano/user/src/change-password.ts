import * as S from '@eyedea/syncano'

interface Args {
  token: string,
  password: string
}

class Endpoint extends S.Endpoint {
  async run(
    {response, data, users}: S.Core,
    {args}: S.Context<Args>
  ) {
    try {
      const {id, user_id, created_at} = await data.recoverPassword
        .where('token', args.token)
        .first()

      if (!this.checkDate(created_at)) {
        await data.recoverPassword.delete(id)
        throw new Error()
      }

      await users
        .where('id', user_id)
        .update({
          password: args.password,
        })

      await data.recoverPassword.delete(id)

      return users
      .where('id', user_id)
      .fields('user_key as token')
      .first()

    } catch (err) {
      return response.json({message: 'Unauthorized!'}, 401)
    }
  }

  checkDate(createdAt: string): boolean {
    const diff = Math.abs(new Date().valueOf() - new Date(createdAt).valueOf())
    const minutes = Math.floor((diff / 1000) / 60)

    return minutes < 60 ? true : false
  }
}

export default ctx => new Endpoint(ctx)
