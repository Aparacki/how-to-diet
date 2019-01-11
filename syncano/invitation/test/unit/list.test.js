import {run} from '@syncano/test'
import sinon from 'sinon'

describe('invite', () => {
  it('should authorize and get invitations', async () => {

    const invitation = {
      email: 'test@test.com',
      key: 'string',
      resource_id: 15,
      resource_type: 'string',
      status: 'string',
      details: {
        name: 'name'
      }
    }

    require('@syncano/core').__setMocks({
      data: {
        invitations: {
          where: () => ({
            orderBy: () => ({
              list: sinon.stub().onFirstCall().resolves([invitation,invitation])
            })
          })
        },
        document: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().resolves([])
            })
          })
        },
        document_signature: {
          where: () => ({
            fields: () => ({
              list: sinon.stub().onFirstCall().resolves([])
            })
          })
        },
        signature: {
          where: () => ({
            fields: () => ({
              list: sinon.stub().onFirstCall().resolves([])
            })
          })
        },
      },
      users: {
        where: () => ({
          first: sinon.stub().onFirstCall().resolves([])
        })
      }
    })

    const result = await run('list', {meta:{user:{id: 15}}})
    expect(result).toHaveProperty('code', 200)
  })

  it('should respond with unauthorized request', async () => {

    const result = await run('list')
    expect(result).toHaveProperty('code', 401)
  })
})
