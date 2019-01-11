import * as S from '@eyedea/syncano'

class Endpoint extends S.Endpoint {
  async run(
    {users, response}: S.Core
  ) {
    if (!this.user) {
      return response.json({message: 'Unauthorized!'}, 401)
    }

    return users.find(this.user.id)
  }
}

export default ctx => new Endpoint(ctx)
