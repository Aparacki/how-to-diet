/* global describe it */
import {run} from '@syncano/test'
import sinon from 'sinon'
import fs from 'fs'

describe('upload', () => {
  it('should fail if the user is not logged in and there is no invitation', async () => {
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
    const result = await run('upload')
    expect(result).toHaveProperty('code', 401)
    expect(result.data).toHaveProperty('message', 'Unauthorized.')
  })

  it('should fail when invitation exist and there is no file', async () => {
    const args = {
      key: 'e71c01fe0dc3b7983f9b4515a47d553c684bd622'
    }
    require('@syncano/core').__setMocks({
      data: {
        invitations: {
          where: () => {
            return {
              fields: () => {
                return {
                  first: sinon.stub().onFirstCall().resolves({
                    email: 'example@gmail.com',
                    firstName: 'jonh',
                    lastName: 'smith'
                  })
                }
              }
            }
          }
        }
      }
    })
    const result = await run('upload', {args})
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message', 'Upload failed')
  })

  it('should pass when invitation and files exsist', async () => {
    const testFile = fs.readFileSync('test/unit/assets/Test.png');
    testFile.filename = 'test.png'
    testFile.contentType = 'image/png'
    const args = {
      file: testFile,
      key: 'e71c01fe0dc3b7983f9b4515a47d553c684bd622'
    }
    require('@syncano/core').__setMocks({
      data: {
        signature: {
          fields: () => ({
            create: sinon.stub().onFirstCall().resolves({
              id: 1,
              name: 'aaaa',
              file: 'http://dgdgfdf.png'
            })
          })
        },
        invitations: {
          where: () => {
            return {
              fields: () => {
                return {
                  first: sinon.stub().onFirstCall().resolves({
                    id: 1,
                    name: 'aaaa',
                    file: 'http://dgdgfdf.png'
                  })
                  }
                }
              }
          }
        }
      }
    })
    const result = await run('upload', {args})
    expect(result).toHaveProperty('code', 201)
    expect(result.data).toHaveProperty('message', 'Upload successful')
  })
})
