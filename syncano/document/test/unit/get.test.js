import {run} from '@syncano/test'
import sinon from 'sinon'

describe('get tests', () => {
  it('no user', async () => {

    const result = await run('get')
    expect(result).toHaveProperty('code', 401)
    expect(result.data).toHaveProperty('message', 'Unauthorized.')
  })

  it('no documentId', async () => {

    const result = await run('get', {meta: {user: {id: 1}}})
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message', 'You must enter documentId')
  })

  it('get the document with specific documentId', async () => {
    const args = {
      documentId: 1
    }

    const document = {
      id: 1,
      name: "Asd",
      user: {
        id: 1,
        username: "Janusz"
      },
      created_at: new Date().toISOString(),
      file: 'https://doc.com',
      status: 'uploaded'
    }

    require('@syncano/core').__setMocks({
      data: {
        document: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().resolves(document)
            })
          })
        }
      }
    })

    const result = await run('get', {args, meta: {user: {id: 1}}})
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('name', 'Asd')
    expect(result.data).toHaveProperty('user', {id: 1, username: 'Janusz'})
  })

  it('user do not own this document', async () => {
    const args = {
      documentId: 1
    }

    const document = {
      id: 1,
      name: "Asd",
      user: {
        id: 2,
        username: "Janusz"
      },
      created_at: new Date().toISOString(),
      file: 'https://doc.com',
      status: 'uploaded'
    }

    require('@syncano/core').__setMocks({
      data: {
        document: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().resolves(document)
            })
          })
        }
      }
    })

    const result = await run('get', {args, meta: {user: {id: 1}}})
    expect(result).toHaveProperty('code', 402)
    expect(result.data).toHaveProperty('message', 'You do not own this file')
  })

  it('catch error for get document', async () => {
    const args = {
      documentId: 1
    }

    require('@syncano/core').__setMocks({
      data: {
        document: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().rejects()
            })
          })
        }
      }
    })

    const result = await run('get', {args, meta: {user: {id: 1}}})
    expect(result).toHaveProperty('code', 400)
  })
})
