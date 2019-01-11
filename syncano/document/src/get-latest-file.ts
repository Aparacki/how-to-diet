import * as S from '@eyedea/syncano'
import axios from 'axios'
import DataHelper from './data-helper'

interface Args {
  documentId: string,
}

class GetLatestFile extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {
    const dataHelper = new DataHelper(data)
    const documentId = parseInt(args.documentId, 10)

    try {
      const documentVersion = await dataHelper.getLatestDocumentVersionById(documentId)
      const document = await dataHelper.getDocumentById(documentId)

      const result = await axios.request({
        responseType: 'arraybuffer',
        url: documentVersion.file,
        method: 'get',
        headers: {
          'Content-Type': 'application/pdf',
        },
      })

      return response(result.data, 200, 'application/pdf', {
        'Content-Disposition': `attachment;filename=${document.name}`,
        'Content-Type': 'application/pdf',
        'Content-Length': result.data.length,
      })
    } catch (err) {
      return response.fail({message: err.response}, 400)
    }
  }

}

export default ctx => new GetLatestFile(ctx)
