import {run} from '@syncano/test'
import sinon from 'sinon'

describe('list', () => {
  it('should get invitations', async () => {
    const args = {
      resource_id: 15,
      resource_type: 'string'
    }

    require('@syncano/core').__setMocks({
      data: {
        invitations: {
          where: () => ({
            where: () => ({
              fields: () => ({
                list: sinon.stub().onFirstCall().resolves(args)
              })
            })
          })
        }
      }
    })

    const result = await run('list', {args})
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('key', args.key)
  })

  it('should fail', async () => {
    const args = {
      resource_id: 15,
      resource_type: 'string'
    }

    require('@syncano/core').__setMocks({
      data: {
        invitations: {
          where: () => {
            return {
              fields: () => {
                return {
                  list: sinon.stub().onFirstCall().reject()
                }
              }
            }
          },
        }
      }
    })

    const result = await run('list', {args})
    expect(result).toHaveProperty('code', 400)
  })

})
