import * as S from '@eyedea/syncano'
import buildURL from 'axios/lib/helpers/buildURL'
import {MODELS} from './constants'
import DataHelper, { endpointURL } from './data-helper'

interface Args {
  documentId: number,
  key?: string
}

class Preview extends S.Endpoint {
  async run(
    {response, data, endpoint}: S.Core,
    {args}: S.Context<Args>
  ) {
    const {documentId, key} = args
    const dataHelper = new DataHelper(data)
    let documentToPreviewId = documentId
    let invitation

    if (key) {
      invitation = await dataHelper.getInvitationByKey(key)
      if (invitation) {
        documentToPreviewId = invitation.resource_id
      }
    }

    try {
      const lastDocumentVersion = await data.document_version
        .where('document', documentToPreviewId)
        .fields(MODELS.documentVersion)
        .orderBy('created_at', 'DESC')
        .first()

      const documentPreviews = await data
        .document_preview
        .where('document_version', lastDocumentVersion.id)
        .fields('pageNumber', 'file', 'width', 'height')
        .orderBy('pageNumber', 'ASC')
        .list()

      documentPreviews.forEach(async documentPreview => {
        const file = endpointURL(this.ctx, 'document/preview-page', {
          versionId: lastDocumentVersion.id,
          pageNumber: documentPreview.pageNumber,
        })

        return {
          ...documentPreview,
          file,
        }
      })

      await Promise.all(documentPreviews)

      return response.json({pages: documentPreviews, status: lastDocumentVersion.status}, 200)
    } catch (err) {
      return response.json({message: err.response}, 400)
    }
  }
}

export default ctx => new Preview(ctx)
