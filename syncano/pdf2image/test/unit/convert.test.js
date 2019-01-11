import {run} from '@syncano/test'
import sinon from 'sinon'
import axios from 'axios'
import fs from 'fs'

describe('convert', () => {
  it('should fail when versionId was not passed', async () => {
    const result = await run('convert')
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message', 'Version required')
  })

  it('should fail when document for given version was not found', async () => {
    const testFile = fs.readFileSync('test/unit/assets/test.pdf');
    testFile.filename = 'test.pdf'
    testFile.contentType = 'application/pdf'

    axios.request = sinon.stub().onFirstCall().resolves(testFile)

    require('@syncano/core').__setMocks({
      data: {
        document_version: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().resolves(null)
            })
          }),
        }
      }
    })
    const result = await run('convert', {
      args: {
        versionId: 15
      }
    })
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message', 'Document not found')
  })

  it('should write version.pdf to disk', async () => {
    const documentVersion = {
      file: 'http://www.pdf995.com/samples/pdf.pdf',
      id: 15
    }
    require('@syncano/core').__setMocks({
      data: {
        document_preview: {
          fields: () => ({
            create: sinon.stub().resolves()
          })
        },
        document_version: {
          update: () => sinon.stub().resolves(),
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().resolves(documentVersion)
            })
          }),
        }
      }
    })
    const result = await run('convert', {
      args: {
        versionId: 15
      }
    })
    expect(result).toHaveProperty('code', 200)
  })
})
