import {run} from '@syncano/test'
import sinon from 'sinon'

describe('get-latest-file tests', () => {
  it('no document_version', async () => {
    const args = {
      documentId: 1
    }

    require('@syncano/core').__setMocks({
      data: {
        document_version: {
          where: () => ({
            fields: () => ({
              orderBy: () => ({
                first: sinon.stub().onFirstCall().rejects()
              })
            })
          })
        }
      }
    })
    
    const result = await run('get-latest-file', {args})
    expect(result).toHaveProperty('code', 400)
  })

  it('get latest .pdf file of the document', async () => {
    const args = {
      documentId: 1
    }

    const documentVersion = {
      id: 1,
      document: 1,
      file: 'https://doc.com',
      status: 'processing'
    }

    const document = {
      id: 1,
      name: "Asd",
      user: {
        username: "Janusz"
      },
      created_at: new Date().toISOString(),
      file: 'https://doc.com',
      status: 'uploaded'
    }

    require('@syncano/core').__setMocks({
      data: {
        document_version: {
          where: () => ({
            fields: () => ({
              orderBy: () => ({
                first: sinon.stub().onFirstCall().resolves(documentVersion)
              })
            })
          })
        },
        document: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().resolves(document)
            })
          })
        }
      }
    })
  
    const result = await run('get-latest-file', {args})
    expect(result).toHaveProperty('code', 200)
    expect(result).toHaveProperty('mimetype', 'application/pdf')
  })

  it('catch error for get request', async () => {
    const args = {
      documentId: 1
    }

    const documentVersion = {
      id: 1,
      document: 1,
      file: 'https://doc.com',
      status: 'processing'
    }

    require('@syncano/core').__setMocks({
      data: {
        document_version: {
          where: () => ({
            fields: () => ({
              orderBy: () => ({
                first: sinon.stub().onFirstCall().resolves(documentVersion)
              })
            })
          })
        },
        document: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().rejects()
            })
          })
        }
      }
    })
    
    const result = await run('get-latest-file', {args})
    expect(result).toHaveProperty('code', 400)
  })
})
