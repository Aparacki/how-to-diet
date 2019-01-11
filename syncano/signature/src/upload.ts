import * as S from '@eyedea/syncano'
import FormData from 'form-data'
import sizeOf from 'image-size'
import {INVITATIONS_MODEL, SIGNATURE_MODEL} from './constants'

interface Args {
  key: string,
  file: any,
}

class Endpoint extends S.Endpoint {
  async run(
    {data, response, logger}: S.Core,
    {args}: S.Context<Args>
  ) {
    const {file, key} = args
    const {info, error, warn} = logger('signature/upload')
    const invitation = await data
      .invitations
      .where('key', key)
      .fields(INVITATIONS_MODEL)
      .first()

    if (!this.user && !invitation) {
      warn('Unauthorized request.')

      return response.json({message: 'Unauthorized.'}, 401)
    }

    if (!file) {
      return response.json({message: 'Upload failed'}, 400)
    }

    const {filename, contentType} = file

    try {
      const form =  new FormData({})

      form.append('name', filename)
      form.append('file', file, {filename, contentType})

      if (this.user) {
        form.append('user', this.user.id)
      } else {
        form.append('invitation', invitation.id)
      }

      const dimensions = sizeOf(file)
      form.append('width', dimensions.width)
      form.append('height', dimensions.height)

      const signature = await data
        .signature
        .fields(SIGNATURE_MODEL)
        .create(form)
      info('Successfully uploaded signature')

      return response.json({message: `Upload successful`, filename, status: 'done', signature}, 201)
    } catch (err) {
      error(err)

      return response.json({message: err.message}, 400)
    }
  }
}

export default ctx => new Endpoint(ctx)
