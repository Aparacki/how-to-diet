import {run} from '@syncano/test'
import sinon from 'sinon'

describe('get', () => {
  it('get user data', async () => {
    const user = {
      username: 'emailemail.com',
      password: 'somepassword',
      firstName: 'happyName',
      lastName: 'sadLastName'
    }

    require('@syncano/core').__setMocks({
      users: {
        fields: () => {
          return {
            where: () => {
              return {
                first: sinon.stub().onFirstCall().resolves(user)
              }
            }
          }
        },
      }
    })

    const result = await run('get', {args: {username: user.username}, meta: {user}})
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('username', user.username)
  })

  it('Unauthorized', async () => {
    const result = await run('get')
    expect(result).toHaveProperty('code', 401)
    expect(result.data).toHaveProperty('message', 'Unauthorized!')
  })
})
