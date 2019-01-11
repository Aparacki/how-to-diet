import * as S from '@eyedea/syncano'
import axios from 'axios'

interface Args {
  versionId: number,
  pageNumber: number
}

class PreviewPage extends S.Endpoint {
  async run(
    {response, data}: S.Core,
    {args}: S.Context<Args>
  ) {
    const {versionId, pageNumber} = args

    try {
      const previewPage = await data
        .document_preview
        .where('document_version', versionId)
        .where('pageNumber', pageNumber)
        .fields('file')
        .first()

      const result = await axios.request({
        responseType: 'arraybuffer',
        url: previewPage.file,
        method: 'get',
        headers: {
          'Content-Type': 'image/png',
        },
      })

      return response(result.data, 200, 'image/png', {
        'Content-Type': 'image/png',
        'Content-Length': result.data.length,
      })
    } catch (err) {
      return response.json({message: err.response}, 400)
    }
  }

}

export default ctx => new PreviewPage(ctx)
