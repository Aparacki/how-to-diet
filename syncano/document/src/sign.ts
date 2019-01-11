import * as S from '@eyedea/syncano'
import axios from 'axios'
import FormData from 'form-data'
import * as fs from 'fs'
import hummus from 'hummus'
import {MODELS, STATUS_SIGNED} from './constants'
import DataHelper from './data-helper'

interface Args {
  signatures: any,
  documentId: number
}

class Sign extends S.Endpoint {
  async run(
    {response, data, endpoint}: S.Core,
    {args, meta}: S.Context<Args>
  ) {
    const {signatures, documentId} = args
    const dataHelper = new DataHelper(data)
    const key = signatures[0].key
    const invitation = await data.invitations
      .where('key', key)
      .fields(MODELS.invitations)
      .first()

    if (!this.user && !invitation) {
      return response.json({message: 'Unauthorized.'}, 401)
    }

    if (!signatures) {
      return response.json({message: 'Signatures required.'}, 400)
    }

    try {
      const document = await dataHelper.getDocumentById(documentId)
      const latestDocumentVersion = await dataHelper.getLatestDocumentVersionById(documentId)
      const documentOutputFilename = 'document.pdf'

      const file = await axios.request({
        responseType: 'arraybuffer',
        url: latestDocumentVersion.file,
        method: 'get',
        headers: {
          'Content-Type': 'application/pdf',
        },
      })

      fs.writeFileSync(documentOutputFilename, file.data)

      for (const postedSignature of signatures) {
        const signature = await dataHelper.getSignatureById(postedSignature.signatureId)
        const signatureOutputFilename = 'signature.png'
        const signatureImg = await axios.request({
          responseType: 'arraybuffer',
          url: signature.file,
          method: 'get',
          headers: {
            'Content-Type': 'image/png',
          },
        })

        fs.writeFileSync(signatureOutputFilename, signatureImg.data)

        const pdfReader = hummus.createReader(documentOutputFilename)
        const page = pdfReader.parsePage(postedSignature.pageNumber).getDictionary().toJSObject().MediaBox.toJSArray()

        // scaling
        postedSignature.positionX = Math.floor(postedSignature.positionX * (page[2].value / postedSignature.pageWidth))
        postedSignature.positionY = Math.floor(postedSignature.positionY * (page[3].value / postedSignature.pageHeight))
        postedSignature.width = Math.floor(postedSignature.width * (page[2].value / postedSignature.pageWidth))
        postedSignature.height = Math.floor(postedSignature.height * (page[3].value / postedSignature.pageHeight))

        const finalPositionY = await this.transformPositionY(
          documentOutputFilename,
          Number(postedSignature.pageNumber),
          Number(postedSignature.positionY),
          Number(postedSignature.height)
        )

        const imageOptions = {transformation: {
          width: postedSignature.width,
          height: postedSignature.height,
          proportional: true,
        }}

        const pdfWriter = await hummus.createWriterToModify(documentOutputFilename)
        const pageModifier = new hummus.PDFPageModifier(pdfWriter, Number(postedSignature.pageNumber))
        await pageModifier.startContext().getContext()
            .drawImage(Number(postedSignature.positionX), finalPositionY, signatureOutputFilename, imageOptions)
        await pageModifier.endContext().writePage()
        await pdfWriter.end()

        const form = new FormData()

        form.append('document', documentId)
        form.append('signature', postedSignature.signatureId)
        form.append('width', postedSignature.width)
        form.append('height', postedSignature.height)
        form.append('positionX', postedSignature.positionX)
        form.append('positionY', finalPositionY)
        form.append('date', new Date().toISOString())
        form.append('ipAddress', meta.request.REMOTE_ADDR)
        form.append('userAgent', meta.request.HTTP_USER_AGENT)

        if (invitation) {
          form.append('invitation', invitation.id)

          await data.invitations
            .update(invitation.id, {status: STATUS_SIGNED})
        }

        if (this.user) {
          form.append('signatory', this.user.id)

          await data.invitations
            .where('email', this.user.username)
            .update({status: STATUS_SIGNED})
        }

        await data.document_signature
          .fields(MODELS.documentSignature)
          .create(form)
      }

      const documentVersion = await dataHelper.saveDocumentVersion(document, fs.readFileSync(documentOutputFilename))
      this.updateDocumentStatus(document)

      endpoint.post('pdf2image/convert', {
        versionId: documentVersion.id,
      })

      return response.json({message: 'Success', version: documentVersion}, 200)
    } catch (err) {
      console.warn(err)

      return response.fail({message: err.message}, 400)
    }
  }

  async transformPositionY(documentFilename: string, page: number, y: number, signatureHeight: number) {
    const pdfReader = hummus.createReader(documentFilename)
    const pageHeight = pdfReader.parsePage(page).getDictionary().toJSObject().MediaBox.toJSArray()[3].value
    const newPositionY = pageHeight - y - signatureHeight

    return Math.trunc(newPositionY)
  }

  async updateDocumentStatus(documentToUpdate: any) {
    const allSigned = await this.checkSignatories(documentToUpdate)

    if (allSigned) {
      return this.syncano.data
        .document
        .update(documentToUpdate.id, {'status': STATUS_SIGNED})
    }
  }

  async checkSignatories(documentToUpdate: any) {
    const documentInvitations = await this.syncano.data
        .invitations
        .where('resource_id', documentToUpdate.id)
        .fields(MODELS.invitations)
        .list()

    const documentSignatures = await this.syncano.data
        .document_signature
        .where('document', documentToUpdate.id)
        .fields(MODELS.documentSignature)
        .with('invitation', 'signatory')
        .list()

    const guestSignatories = [...new Set(documentSignatures
        .filter(item => item.invitation)
        .map(item => item.invitation.email))]

    const authorizedSignatories = [...new Set(documentSignatures
        .filter(item => item.signatory)
        .map(item => item.signatory.username))]

    return documentInvitations.every(({email}) => (
      guestSignatories.includes(email) ||
      authorizedSignatories.includes(email)
    ))
  }
}

export default ctx => new Sign(ctx)
