import * as S from '@eyedea/syncano'
import FormData from 'form-data'
import {MODELS, STATUS_PROCESSING, STATUS_UPLOADED} from './constants'

interface Args {
  file: any,
  description: string,
}

class Upload extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {
    const {file, description} = args

    if (!this.user) {
      return response.json({message: 'Unauthorized.'}, 401)
    }

    if (!file) {
      return response.json({message: 'Upload failed'}, 400)
    }

    const {filename, contentType} = file

    try {
      const form = new FormData()
      form.append('name', filename)
      form.append('user', this.user.id)
      form.append('status', STATUS_UPLOADED)
      form.append('file', file, {filename, filetype: contentType})
      form.append('description', description || '')

      const document = await data
        .document
        .fields(MODELS.document)
        .create(form)

      await this.saveDocumentVersion(document.id, file, filename, contentType)

      return response.json({message: `Upload successful`, document}, 200)
    } catch (err) {
      console.warn(err)

      return response.json({message: err.response}, 400)
    }
  }

  async saveDocumentVersion(documentId: number, documentFile: any, name: string, type: string) {
    const form =  new FormData()
    form.append('document', documentId)
    form.append('status', STATUS_PROCESSING)
    form.append('file', documentFile, {filename: name, filetype: type})
    const documentVersion = await this.syncano.data
      .document_version
      .fields(MODELS.documentVersion)
      .create(form)

    return this.syncano.endpoint.post('pdf2image/convert', {
      versionId: documentVersion.id,
    })
  }
}

export default ctx => new Upload(ctx)
