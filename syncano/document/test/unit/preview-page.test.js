import {run} from '@syncano/test'
import sinon from 'sinon'

describe('preview-page tests', () => {
  it('preview of a page not found', async () => {
    const args = {
      versionId: 2,
      pageNumber: 1
    }

    const document_preview = {
      document_version: 1,
      file: 'https://image.com',
      pageNumber: 1,
    }

    require('@syncano/core').__setMocks({
      data: {
        document_preview: {
          where: () => ({
            where: () => ({
              fields: () => ({
                first: sinon.stub().onSecondCall().rejects()
              })
            })
          })
        }
      }
    })

    const result = await run('preview-page', {args})
    expect(result).toHaveProperty('code', 400)
  })

  it('get image of a specified pageNumber in document', async () => {
    const args = {
      versionId: 1,
      pageNumber: 3
    }

    const document_preview = {
      document_version: 1,
      file: 'https://image.com',
      pageNumber: 3,
    }

    require('@syncano/core').__setMocks({
      data: {
        document_preview: {
          where: () => ({
            where: () => ({
              fields: () => ({
                first: sinon.stub().onFirstCall().resolves(document_preview)
              })
            })
          })
        }
      }
    })

    const result = await run('preview-page', {args})
    expect(result).toHaveProperty('code', 200)
    expect(result).toHaveProperty('mimetype', 'image/png')
  })

  it('catch error', async () => {
    const args = {
      versionId: 2,
      pageNumber: 1
    }

    require('@syncano/core').__setMocks({
      data: {
        document_preview: {
          where: () => ({
            where: () => ({
              fields: () => ({
                first: sinon.stub().onFirstCall().rejects()
              })
            })
          })
        }
      }
    })

    const result = await run('preview-page', {args})
    expect(result).toHaveProperty('code', 400)
  })
})
