import {run} from '@syncano/test'
import sinon from 'sinon'

describe('list tests', () => {
  it('no user', async () => {

    const result = await run('list')
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message', 'Unauthorized.')
  })

  it('lists documents successfully for a user', async () => {
    const document = {
      id: 1,
      username: 'Janusz',
      name: "doc1",
      created_at: 'yesterday',
      file: 'https://doc.com',
      status: 'signed'
    }

    require('@syncano/core').__setMocks({
      data: {
        document: {
          where: () => ({
            fields: () => ({
              orderBy: () => ({
                list: sinon.stub().onFirstCall().resolves(document)
              })
            })
          })
        }
      }
    })
  
    const result = await run('list', {meta: {user: {id: 1}}})
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('id', document.id)
    expect(result.data).toHaveProperty('file', document.file)
    expect(result.data).toHaveProperty('status', document.status)
  })
})
