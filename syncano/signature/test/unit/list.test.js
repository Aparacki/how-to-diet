/* global describe it */
import {run} from '@syncano/test'
import sinon from 'sinon'

describe('list', () => {
  it('check key', async () => {
    const args = {
      key: 'e71c01fe0dc3b7983f9b4515a47d553c684bd622', // example
    }
    const signature = {
      user: {
        id: 1,
        firstName: 'adam',
        lastName: 'nowak',
        username: 'adamnowak@fds.pl'
      },
      invitations: {
        id: 1,
        email: 'test@ssf.pl',
        firstName: 'test',
        lastName: 'test test'
      }
    }
    require('@syncano/core').__setMocks({
      data: {
        signature: {
          where: () => {
           return {
             fields: () => {
               return {
                 list: sinon.stub().onFirstCall().resolves(signature.invitations)
               }
             }
           }
          }
         },
        invitations: {
          where: () => {
            return {
              fields: () => {
                return {
                  first: sinon.stub().onFirstCall().resolves({
                    id: 1,
                    name: 'abc',
                    file: {},
                    user: {}
                  })
                }
              }
            }
          }
        }
      }
    })
    const result = await run('list', {args})
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('id', 1)
  })

  it('invitation and user fail', async () => {
    const args = {
      key: 'e71c01fe0dc3b7983f9b4515a47d553c684bd622', // example
    }
    require('@syncano/core').__setMocks({
      data: {
        invitations: {
          where: () => {
            return {
              fields: () => {
                return {
                  first: sinon.stub().onFirstCall().resolves(null)
                }
              }
            }
          }
        }
      }
    })
    const result = await run('list', {args, meta:{user:{}}})
    expect(result).toHaveProperty('code', 401)
    expect(result.data).toHaveProperty('message', 'Unauthorized.')
  })


  it('check user', async () => {
    const signature = {
      user: {
        id: 1,
        firstName: 'adam',
        lastName: 'nowak',
        username: 'adamnowak@fds.pl'
      }
    }
    require('@syncano/core').__setMocks({
      data: {
        signature: {
          list: sinon.stub().onFirstCall().resolves(signature.user)
        }
      }
    })
    const result = await run('list', {meta:{user: {}}})
    expect(result).toHaveProperty('code', 200)
  })

  it('check user fail', async () => {
    require('@syncano/core').__setMocks({
      data: {
        signature: {
          list: sinon.stub().onFirstCall().rejects()
        }
      }
    })
    const result = await run('list', {meta:{user: {}}})
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('id', 1)
  })
})
