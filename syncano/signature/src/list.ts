import * as S from '@eyedea/syncano'
import {SIGNATURE_MODEL} from './constants'
import DataHelper from './data-helper'

interface Args {
  key?: string
}

class Endpoint extends S.Endpoint {
  async run(
    {data, response, logger}: S.Core,
    {args}: S.Context<Args>
  ) {
    const {info, error, warn} = logger('signature/list')
    const key = args.key
    const dataHelper = new DataHelper(data)
    let invitation
    let keySignatures = []
    let userSignatures = []

    if (key) {
      invitation = await dataHelper.getInvitationByKey(key)

      if ((!this.user && !invitation) || !invitation) {
        warn('Unauthorized request.')

        return response.json({message: 'Unauthorized.'}, 401)
      }

      try {
        keySignatures = await data
          .signature
          .where('invitation', invitation.id)
          .fields(SIGNATURE_MODEL)
          .list()

        info(`Successfully got user's signatures for invitation ${invitation.id}`)

      } catch (err) {
        error(err)

        return response.fail({message: err.response.data}, 400)
     }
    }

    if (this.user) {
      try {
        userSignatures = await data
          .signature
          .where('user', this.user.id)
          .list()
        info(`Successfully got user's signatures`)

      } catch (err) {
        error(err)

        return response.fail({message: err.response.data}, 400)
      }
    }

    const signatures = [...keySignatures, ...userSignatures]

    return response.json(signatures)
  }
}

export default ctx => new Endpoint(ctx)
