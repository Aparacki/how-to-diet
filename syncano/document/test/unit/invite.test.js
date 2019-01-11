import {run} from '@syncano/test'
import sinon from 'sinon'

describe('list tests', () => {
  it('Unauthorized', async () => {
    const res = await run('invite')
    expect(res).toHaveProperty('code', 401)
    expect(res.data).toHaveProperty('message', 'Unauthorized.')
  })

  it('Missing invitation', async () => {
    const ctx = {
      args: {
        invitations: []
      },
      meta: {
        user: {}
      }
    }

    const res = await run('invite', ctx)
    expect(res).toHaveProperty('code', 400)
    expect(res.data).toHaveProperty('message', 'At least one invitation is required.')
  })

  it('Check error', async () => {
    require('@syncano/core').__setMocks({
      user: {
        fields: () => ({
          find: sinon.stub().onFirstCall().rejects()
        })
      }
    })

    const res = await run('invite', {args: {invitations: [{}]}, meta: {user: {}}})
    expect(res).toHaveProperty('code', 400)
  })

  it('All good', async () => {
    const invitations = [
      {
        username: 'abc@wrap.com',
        firstName: 'Daniel',
        lastName: 'Stek',
      }
    ]

    const user = {
      id: 1,
      username: 'abcdefg@wrap.com',
      firstName: 'abc',
      lastName: 'cba',
    }

    const document = {
      id: 1,
      username: 'Janusz',
      name: "doc1",
      created_at: 'yesterday',
      file: 'https://doc.com',
      status: 'Upload'
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
      },
      users: {
        fields: () => ({
          find: sinon.stub().onFirstCall().resolves(user),
          where: () => ({
            first: sinon.stub().onFirstCall().resolves(invitations[0])
          })
        })
      },
      endpoint: {
        get: sinon.stub().onFirstCall().resolves({}),
        post: sinon.stub().onFirstCall().resolves({})
      }
    })

    const res = await run('invite', {args: {invitations}, meta: {user}})
    expect(res).toHaveProperty('code', 200)
    expect(res.data).toHaveProperty('message', 'Invitations sent successfully')
  })
})
