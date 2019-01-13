import * as S from '@eyedea/syncano'
import buildURL from 'axios/lib/helpers/buildURL'
import FormData from 'form-data'
import {MODELS, STATUS_PROCESSING} from './constants'

class DataHelper {
  data: any
  constructor (data: any) {
    this.data = data
  }

  async getDocumentById (id: number) {
    return this.data
    .document
    .where('id', id)
    .fields(MODELS.document)
    .first()
  }

  async getSignatureById (id: string) {
    return this.data
      .signature
      .where('id', id)
      .fields(MODELS.signature)
      .first()
  }

  async getLatestDocumentVersionById (id: number) {
    return this.data
      .document_version
      .where('document', id)
      .fields(MODELS.documentVersion)
      .orderBy('created_at', 'DESC')
      .first()
  }

  async saveDocumentVersion (document: any, file: any) {
    const form =  new FormData()
    form.append('document', document.id)
    form.append('status', STATUS_PROCESSING)
    form.append('file', file, {filename: document.name, filetype: 'application/pdf'})

    return this.data
      .document_version
      .fields(MODELS.documentVersion)
      .create(form)
  }

  async getInvitationByKey (invitationKey: string) {
    return this.data
      .invitations
      .where('key', invitationKey)
      .fields(MODELS.invitations)
      .first()
  }
}

export const isEmail = (str: string) => {
  // tslint:disable-next-line:max-line-length
  const regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i

  return regex.test(str)
}

export const endpointURL = (ctx: S.Context, endpoint: string, args: Record<string, string | number> ) => {
  const meta = ctx.meta
  const url = `https://${meta.api_host}/v3/instances/${meta.instance}/endpoints/sockets/${endpoint}/`

  return buildURL(url, args)
}

export default DataHelper
