import {run} from '@syncano/test'
import sinon from 'sinon'

describe('get', () => {
  it('should get invitation', async () => {
    const args = {
      key: "string",
    }

    require('@syncano/core').__setMocks({
      data: {
        invitations: {
          where: () => {
            return {
              fields: () => {
                return {
                  first: sinon.stub().onFirstCall().resolves(args)
                }
              }
            }
          },
        }
      }
    })

    const result = await run('get', {args})
    console.log(result)
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('key', args.key)
  })

  it('should fail', async () => {
    const args = {
      key: "string",
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

    const result = await run('get', {args})
    console.log(result)
    expect(result).toHaveProperty('code', 400)
  })

})
