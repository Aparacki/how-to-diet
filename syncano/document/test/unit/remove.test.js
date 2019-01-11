import {run} from '@syncano/test'
import sinon from 'sinon'

describe('Should remove document from database', () => {

  it('Should throw error when unauthorized', async () => {
    const res = await run('remove')
    expect(res).toHaveProperty('code', 401)
    expect(res.data).toHaveProperty('message', 'Unauthorized.')
  })

  it('Should throw error when no documentId provided', async () => {

    const result = await run('remove', {meta: {user: {id: 1}}})
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message', 'You must enter documentId')
  })

  it('Should delete document with gven id', async () => {

    const args = {
      documentId: 1
    }

    require('@syncano/core').Core.__setMocks({
      data: {
        document: {
          where: () => ({
              delete: sinon.stub().resolves({args}),
            })
        },
        document_version: {
          where: () => ({
            delete: sinon.stub().resolves({args}),
          })
        }
      }
    })

    const result = await run('remove', {meta: {user: {id: 1}}, args})
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('message', `Removed document ${args.documentId}`)
  })
})

