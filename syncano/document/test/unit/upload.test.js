/* global describe it */
import {run} from '@syncano/test'
import sinon from 'sinon'
import fs from 'fs'

describe('upload tests', function () {
  it('no user authenticated', async () => {

    const result = await run('upload')
    expect(result).toHaveProperty('code', 401)
    expect(result.data).toHaveProperty('message', "Unauthorized.")
  })

  it('no file on args', async () => {
    
    const result = await run('upload', {meta: {user: {id: 1}}})
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message', "Upload failed")
  })

  it('upload a document', async () => {
    const testFile = fs.readFileSync('test/unit/assets/Test.pdf')
    testFile.filename = 'Test.pdf'
    testFile.contentType = 'application/pdf'

    const args = {
      file: testFile
    }

    const document = {
      id: 2,
      name: "Test",
      user: 1,
      status: "uploaded",
      url: "https://d3rij3t703q5l6.cloudfront.net/32136/4/53afb3d82e7a524a6317d073856dc2e63fc8fd24.pdf"
    }

    require('@syncano/core').__setMocks({
      data: {
        document: {
          fields: () => ({
            create: sinon.stub().onFirstCall().resolves(document)
          })
        },
        document_version: {
          fields: () => ({
            create: sinon.stub().onFirstCall().resolves({
              id: 1,
              document: 1,
              status: "processing",
              url: "https://d3rij3t703q5l6.cloudfront.net/32136/6/d2fcf27f8f3f0cab533b6e777addbca7cb188b27.pdf"
            })
          })
        }
      },
      endpoint: {
        post: sinon.stub().onFirstCall().resolves()
      }
    })

    const result = await run('upload', {args, meta: {user: {id: 1}}})
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('message', 'Upload successful')
    expect(result.data).toHaveProperty('filename', 'Test.pdf')
    expect(result.data).toHaveProperty('document', document)
  })

  it('upload a document failed', async () => {
    const testFile = fs.readFileSync('test/unit/assets/Test.pdf')
    testFile.filename = 'Test.pdf'
    testFile.contentType = 'application/pdf'

    const args = {
      file: testFile
    }

    require('@syncano/core').__setMocks({
      data: {
        document: {
          fields: () => ({
            create: sinon.stub().onFirstCall().rejects()
          })
        },
        document_version: {
          fields: () => ({
            create: sinon.stub().onFirstCall().resolves({
              id: 1,
              document: 1,
              status: "processing",
              url: "https://d3rij3t703q5l6.cloudfront.net/32136/6/d2fcf27f8f3f0cab533b6e777addbca7cb188b27.pdf"
            })
          })
        }
      }
    })

    const result = await run('upload', {args, meta: {user: {id: 1}}})
    expect(result).toHaveProperty('code', 400)
  })
})
