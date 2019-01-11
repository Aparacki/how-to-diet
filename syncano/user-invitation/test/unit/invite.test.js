import {run} from '@syncano/test'
import sinon from 'sinon'

describe('invite', () => {
  it('should create invitation', async () => {
    const args = {
      details: {name: "John"},
      email: "john@email.com",
      resource_id: 15,
      resource_type: "string",
    }

    require('@syncano/core').__setMocks({
      data: {
        invitations: {
          fields: () => {
            return {
              create: sinon.stub().onFirstCall().resolves(args)
            }
          },
        }
      }
    })

    const result = await run('invite', {args})
    console.log(result)
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('details', args.details)
    expect(result.data).toHaveProperty('email', args.email)
    expect(result.data).toHaveProperty('resource_id', args.resource_id)
    expect(result.data).toHaveProperty('resource_type', args.resource_type)
  })

  it('should fail', async () => {
    const args = {
      details: {name: "John"},
      email: "john@email.com",
      resource_id: 15,
      resource_type: "string",
    }

    require('@syncano/core').__setMocks({
      data: {
        invitations: {
          fields: () => {
            return {
              create: sinon.stub().onFirstCall().reject()
            }
          },
        }
      }
    })

    const result = await run('invite', {args})
    expect(result).toHaveProperty('code', 400)
  })
})
