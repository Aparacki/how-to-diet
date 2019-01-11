import {run} from '@syncano/test'
import sinon from 'sinon'

describe('preview tests', () => {
  it('preview pages<images> for whole document (with key)', async () => {
    const args = {
      documentId: 1,
      key: 'asd'
    }

    const invitation = {
      id: 1,
      resource_id: 1,
      key: '123123',
      email: 'asd@asd.com',
      firstName: 'Janusz',
      lastName: 'Lucinski'
    }

    const document_version = {
      id: 1,
      document: 1,
      file: 'http://asd.com',
      status: 'processing'
    }

    let document_previews = []
    for (let i=0; i<5; i++) {
      document_previews[i] = {
        document_version: 1,
        pageNumber: i+1,
        file: `http://image.syncano.com?page=${i+1}`,
        width: 100,
        height: 200
      }
    }
    // console.log(document_previews);

    require('@syncano/core').__setMocks({
      data: {
        invitations: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().resolves(invitation)
            })
          })
        },
        document_version: {
          where: () => ({
            fields: () => ({
              orderBy: () => ({
                first: sinon.stub().onFirstCall().resolves(document_version)
              })
            })
          })
        },
        document_preview: {
          where: () => ({
            fields: () => ({
              orderBy: () => ({
                list: sinon.stub().onFirstCall().resolves(document_previews)
              })
            })
          })
        }
      }
    })
  
    const result = await run('preview', {args})
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('pages', [...document_previews])
    // console.log('MY RESULT!!!!: ', result)
  })

  it('preview pages<images> for whole document (without key)', async () => {
    const args = {
      documentId: 1
    }

    const document_version = {
      id: 1,
      document: 1,
      file: 'http://asd.com',
      status: 'processing'
    }

    let document_previews = []
    for (let i=0; i<5; i++) {
      document_previews[i] = {
        document_version: 1,
        pageNumber: i+1,
        file: `http://image.syncano.com?page=${i+1}`,
        width: 100,
        height: 200
      }
    }

    require('@syncano/core').__setMocks({
      data: {
        document_version: {
          where: () => ({
            fields: () => ({
              orderBy: () => ({
                first: sinon.stub().onFirstCall().resolves(document_version)
              })
            })
          })
        },
        document_preview: {
          where: () => ({
            fields: () => ({
              orderBy: () => ({
                list: sinon.stub().onFirstCall().resolves(document_previews)
              })
            })
          })
        }
      }
    })
  
    const result = await run('preview', {args})
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('pages', [...document_previews])
  })

  it('catch error', async () => {
    const args = {
      documentId: 1
    }

    let document_previews = []
    for (let i=0; i<5; i++) {
      document_previews[i] = {
        document_version: 1,
        pageNumber: i+1,
        file: `http://image.syncano.com?page=${i+1}`,
        width: 100,
        height: 200
      }
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
        },
        document_preview: {
          where: () => ({
            fields: () => ({
              orderBy: () => ({
                list: sinon.stub().onFirstCall().resolves(document_previews)
              })
            })
          })
        }
      }
    })

    const result = await run('preview', {args})
    expect(result).toHaveProperty('code', 400)
  })
})
