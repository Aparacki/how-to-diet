import {run} from '@syncano/test'
import sinon from 'sinon'

describe('change-password', () => {
  it('Should change password', async () => {
    const recover = {
      user_id: 1,
      created_at: new Date().toString()
    }
    const args = {
      token: 'token',
      password: 'password'
    }

    require('@syncano/core').__setMocks({
      data: {
        recoverPassword: {
          delete: sinon.stub().onFirstCall().resolves({}),
          where: () => ({
            first: sinon.stub().onFirstCall().resolves(recover)
          })
        }
      },
      users: {
        where: () => ({
          update: sinon.stub().onFirstCall().resolves({})
        })
      }
    })

    const res = await run('change-password', {args})
    expect(res).toHaveProperty('code', 200)
    expect(res.data).toHaveProperty('message', 'Success.')
  })

  it('Request timed out', async () => {
    const recover = {
      user_id: 1,
      created_at: '2018-11-21T11:54:32.232055Z'
    }
    const args = {
      token: 'token',
      password: 'password'
    }

    require('@syncano/core').__setMocks({
      data: {
        recoverPassword: {
          delete: sinon.stub().onFirstCall().resolves({}),
          where: () => ({
            first: sinon.stub().onFirstCall().resolves(recover)
          })
        }
      },
    })

    const res = await run('change-password', {args})
    expect(res).toHaveProperty('code', 401)
    expect(res.data).toHaveProperty('message', 'Unauthorized!')
  })
})
