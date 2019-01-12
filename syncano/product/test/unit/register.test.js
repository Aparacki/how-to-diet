import sinon from 'sinon'
import {run} from '@syncano/test'

describe('register', () => {
  it('can register user with valid email', async () => {
    const args = {
      username: 'email@email.com',
      password: 'somepassword',
      firstName: 'john',
      lastName: 'Kowalski'
    }

    require('@syncano/core').__setMocks({
      users: {
        where: () => {
          return {
            first: sinon.stub().onFirstCall().resolves(null)
          }
        },
        create: sinon.stub().onFirstCall().resolves({
          id: 1,
          username: args.username,
          token: args.token
        })
      }
    })

    const result = await run('register', {args})
    console.log(result)
    expect(result).toHaveProperty('code', 200)
  })

  it('can\'t register existing user', async () => {
    const args = {
      username: 'email@email.com',
      password: 'somepassword',
      firstName: 'john',
      lastName: 'Kowalski'
    }

    require('@syncano/core').__setMocks({
      users: {
        where: () => {
          return {
            first: sinon.stub().onFirstCall().resolves({})
          }
        }
      }
    })

    const result = await run('register', {args})
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message', 'User already exists.')
  })

  it('can\'t register user with invalid email', async () => {
    const args = {
      username: 'emailemail.com',
      password: 'somepassword',
      firstName: 'happyName',
      lastName: 'sadLastName'
    }

    const result = await run('register', {args})
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('massage', 'Given email is invalid.')
  })
})
