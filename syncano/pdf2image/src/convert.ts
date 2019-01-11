import * as S from '@eyedea/syncano'
import axios from 'axios'
import FormData from 'form-data'
import * as fs from 'fs'
import * as gm from 'gm'
import * as path from 'path'
import {MODELS, STATUS_DONE, VARIABLES} from './constants'

interface Args {
  versionId: number,
}

process.env.PATH = `${process.env.PATH}:/app/env/node_modules/.bin/:/app/env/node_modules/bin/`
const binDir = '/app/env/node_modules/.bin/'
const MAGICK_CONFIGURE_PATH = '/app/code/config'

// tslint:disable-next-line:no-console
process.env[VARIABLES.MAGICK_CONFIGURE_PATH] = MAGICK_CONFIGURE_PATH

class Endpoint extends S.Endpoint {
  async run(
    {response, data, logger}: S.Core,
    {args}: S.Context<Args>
  ) {
    const {versionId} = args
    const {info, error} = logger('pdf2image/convert')

    if (!versionId) {
      return response.json({message: 'Version required'}, 400)
    }
    const documentVersion = await this.getDocumentVersionById(versionId)

    if (!documentVersion) {
      return response.json({message: 'Document not found'}, 400)
    }

    try {
      const documentOutputFilename = 'version.pdf'
      const res = await axios.request({
        responseType: 'arraybuffer',
        url: documentVersion.file,
        method: 'get',
        headers: {
          'Content-Type': 'application/pdf',
        },
      })

      fs.writeFileSync(documentOutputFilename, res.data)

      const myGm = gm.subClass({appPath: binDir})
      await myGm(documentOutputFilename)
        .density(300, 300)
        .identify('%p ', async (identifyError: any, value: any) => {
        if (identifyError) {
          error(identifyError.message)
          // tslint:disable-next-line
          console.log(identifyError)

          return response.fail({location: `identify`, message: identifyError.message}, 400)
        }

        const pageCount = String(value).split(' ')
        if (pageCount.length) {
          info(`Page count ${pageCount.length}`)
          for (let index = 0; index < pageCount.length; index++) {
            const outputFile = `preview_${index}.png`
            const inputFile = `${documentOutputFilename}[${index}]`

            info(`Generating preview for document ${documentVersion.id} page ${index + 1}`)

            await myGm(inputFile)
              .density(300, 300)
              .toBuffer('PNG', async (convertError: any, buffer: any) => {
                if (convertError) {
                  error(convertError.message)

                  return response.fail({location: `convert`, message: convertError.message}, 400)
                }

                await myGm(buffer).size(async (sizeError: any, size: any) => {
                  if (sizeError) {
                    error(sizeError.message)

                    return response.fail({location: `size`, message: sizeError.message}, 400)
                  }

                  if (value) {
                    const pageWidth = size.width
                    const pageHeight = size.height

                    info(`Page size ${pageWidth} ${pageHeight}`)

                    const form = new FormData()

                    info(`Version ${documentVersion.id}`)

                    form.append('document_version', documentVersion.id)
                    form.append('file', buffer, {filename: outputFile, contentType: 'image/png'})
                    form.append('pageNumber', index + 1)
                    form.append('width', pageWidth)
                    form.append('height', pageHeight)

                    await data.document_preview
                      .fields(MODELS.documentPreview)
                      .create(form)

                    info(`Document preview page ${index + 1} successfully generated`)
                  }
                })
              })
          }
          await this.updateDocumentVersionStatus(documentVersion.id)

          return response.json({message: 'Success'}, 200, 'application/json')
        }
      })
    } catch (err) {
      error(err.message)

      return response.fail({location: `general`, message: err.message}, 400)
    }
  }

  async updateDocumentVersionStatus (id: string) {
    return this.syncano.data
      .document_version
      .update(id, {status: STATUS_DONE})
  }

  async getDocumentVersionById (id: number) {
    return this.syncano.data
      .document_version
      .where('id', id)
      .fields('id', 'document', 'file')
      .first()
  }
}

export default ctx => new Endpoint(ctx)
