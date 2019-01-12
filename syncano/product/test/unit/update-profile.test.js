import {run} from '@syncano/test'
import sinon from 'sinon'
import FormData from 'form-data'
import fs from 'fs'

describe('update-profile', () => {
  it('update user profile', async () => {
    const user = {
      username: 'emailemail.com',
      password: 'somepassword',
      firstName: 'happyName',
      lastName: 'sadLastName'
    }

    const image = new FormData()
    image.append('image', fs.readFileSync('test/unit/assets/Test.png'), {
      filename: 'test.png',
      filetype: 'image/png'
    })

    const args = {
      ...user,
      image
    }

    require('@syncano/core').__setMocks({
      users: {
        fields: () => {
          return {
            where: () => {
              return {
                update: sinon.stub().onFirstCall().resolves(user)
              }
            }
          }
        },
      }
    })

    const result = await run('update-profile', {args, meta: {user}})
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('username', user.username)
  })

  it('Unauthorized', async () => {
    const result = await run('update-profile')
    expect(result).toHaveProperty('code', 401)
    expect(result.data).toHaveProperty('message', 'Unauthorized!')
  })
})
