/* global describe it */
import {run} from '@syncano/test'
import sinon from 'sinon'

describe('remove', () => {
  it('should fail when user is not logged in', async () => {
    const result = await run('remove')
    expect(result).toHaveProperty('code', 401)
    expect(result.data).toHaveProperty('message', 'Unauthorized.')
  })

  it('should fail when id is not passed', async () => {
    const result = await run('remove', {meta: {user: {}}})
    console.log(result)
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message', 'Please send signature id.')
  })

  it('should pass when user is logged in', async () => {
    require('@syncano/core').__setMocks({
      data: {
        signature: {
          where: () => {
            return {
              delete: sinon.stub().onFirstCall().resolves(5)
            }
          }
        }
      }
    })

    const result = await run('remove', {
      args: {
        id: 5
      },
      meta: {
        user: {
          id: 1,
          username: 'adamnowak@fds.pl'
        }
      }
    })
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('message', 'Successfully deleted signature with id: 5')

  })
})
