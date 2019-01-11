import {run} from '@syncano/test'
import sinon from 'sinon'

describe('update', () => {
  it('should update invitations', async () => {
    const args = {
      key: 'string',
      status: 'string'
    }

    require('@syncano/core').__setMocks({
      data: {
        invitations: {
            where: () => ({
              update: sinon.stub().onFirstCall().resolves(args)
            })
        }
      }
    })

    const result = await run('update', {args})
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('key', args.key)
  })

  it('should fail', async () => {
    const args = {
      key: 'string',
      status: 'string'
    }

    require('@syncano/core').__setMocks({
      data: {
        invitations: {
          where: () => {
            return {
              fields: () => {
                return {
                  first: sinon.stub().onFirstCall().reject()
                }
              }
            }
          },
        }
      }
    })

    const result = await run('update', {args})
    expect(result).toHaveProperty('code', 400)
  })

})
