import {run} from '@syncano/test'
import sinon from 'sinon'

describe('get', () => {
  it('Create password recovery request', async () => {
    const args = {
      username: 'email@email.com',
    }
    const config = {
      RECOVER_PASSWORD_REDIRECT_URL: 'localhost:8080'
    }

    require('@syncano/core').__setMocks({
      users: {
        where: () => ({
          first: sinon.stub().onFirstCall().resolves({
            id: 1,
            username: 'test@test.com',
          })
        })
      },
      data: {
        recoverPassword: {
          create: sinon.stub().onFirstCall().resolves({
            user_id: 1,
            token: 'HardToken',
          })
        }
      },
      endpoint: {
        post: sinon.stub().onFirstCall().resolves({
          message: 'send',
        })
      },
    })

    const result = await run('forgot-password', {args, config})
    expect(result).toHaveProperty('code', 200)
    console.log(result)
    expect(result.data).toHaveProperty('message', `Message has been sent.`)
  })

  it('Invalid email', async () => {
    const args = {
      username: 'emailemail.com',
    }

    const result = await run('forgot-password', {args})
    expect(result.data).toHaveProperty('message', 'User not exist.')
  })

  it('User not exist', async () => {
    const args = {
      username: 'email@email.com',
    }

    require('@syncano/core').__setMocks({
      users: {
        where: () => ({
          first: sinon.stub().onFirstCall().resolves(null)
        })
      },
    })

    const result = await run('forgot-password', {args})
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message', 'User not exist.')
  })

  it('Unauthorized', async () => {
    const result = await run('forgot-password')
    expect(result).toHaveProperty('code', 400)
  })
})
