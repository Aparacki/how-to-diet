import {run} from '@syncano/test'
import sinon from 'sinon'

describe('info tests', () => {
  it('no user', async () => {
    const args = {
      documentId: 1
    }

    const result = await run('info', {args})
    expect(result).toHaveProperty('code', 401)
    expect(result.data).toHaveProperty('message', 'Unauthorized.')
  })

  it('should fail when user do not enter document id or key', async () => {

    const result = await run('info', {meta: {user: {id: 1}}})
    expect(result).toHaveProperty('code', 400)
    expect(result.data).toHaveProperty('message', 'You must enter documentId or key')
  })

  it('get info about document', async () => {
    const args = {
      documentId: 1,
      key: "123123"
    }

    const document = {
      id: 1,
      name: "Asd",
      user: {
        id: 1,
        username: "Janusz"
      },
      created_at: new Date().toISOString(),
      file: 'https://doc.com',
      status: 'uploaded'
    }

    const invitation = {
      id: 1,
      resource_id: 1,
      key: '123123',
      email: 'asd@asd.com',
      firstName: 'Janusz',
      lastName: 'Lucinski'
    }

    const invitations = [
      {
        id: 1,
        resource_id: 1,
        key: '123123',
        email: 'asd@asd.com',
        firstName: 'Janusz',
        lastName: 'Lucinski'
      },
      {
        id: 2,
        resource_id: 2,
        key: '123123',
        email: 'asd2@asd.com',
        firstName: 'Janusz2',
        lastName: 'Lucinski2'
      }
    ]

    const document_signatures =
    [ 
      {
        id: 1,
        document: 1,
        signature: 1,
        date: new Date().toISOString(),
        invitation: {
          id: 1,
          resource_id: 1,
          key: '123123',
          email: 'asd@asd.com',
          firstName: 'Janusz',
          lastName: 'Lucinski'
        },
        signatory: {
          id: 1,
          username: 'ala'
        },
        positionX: 100,
        positionY: 200,
        width: 120,
        height: 180,
        ipAddress: 185.90,
        userAgent: 'asdasd'
      },
      {
        id: 2,
        document: 2,
        signature: 2,
        date: new Date().toISOString(),
        invitation: {
          id: 2,
          resource_id: 2,
          key: '123123',
          email: 'asd2@asd.com',
          firstName: 'Janusz2',
          lastName: 'Lucinski2'
        },
        signatory: {
          id: 2,
          username: 'bola'
        },
        positionX: 100,
        positionY: 200,
        width: 120,
        height: 180,
        ipAddress: 185.90,
        userAgent: 'asdasd'
      }
    ]

    require('@syncano/core').__setMocks({
      data: {
        document: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().resolves(document)
            })
          })
        },
        invitations: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().resolves(invitation),
              list: sinon.stub().onFirstCall().resolves(invitations) 
            })
          })
        },
        document_signature: {
          where: () => ({
            fields: () => ({
              with: () => ({
                list: sinon.stub().onFirstCall().resolves(document_signatures)
              })
            })
          })
        }
      }
    })
  
    const result = await run('info', {args, meta: {user: {id: 1}}})
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('invited', 2)
    expect(result.data).toHaveProperty('signed', 4)
    expect(result.data).toHaveProperty('signedByMe', true)
  })

  it('get info about document without user access', async () => {
    const args = {
      documentId: 1,
      key: "123123"
    }

    const document = {
      id: 1,
      name: "Asd",
      user: {
        id: 1,
        username: "Janusz"
      },
      created_at: new Date().toISOString(),
      file: 'https://doc.com',
      status: 'uploaded'
    }

    const invitation = {
      id: 1,
      resource_id: 1,
      key: '123123',
      email: 'asd@asd.com',
      firstName: 'Janusz',
      lastName: 'Lucinski'
    }

    const invitations = [
      {
        id: 1,
        resource_id: 1,
        key: '123123',
        email: 'asd@asd.com',
        firstName: 'Janusz',
        lastName: 'Lucinski'
      },
      {
        id: 2,
        resource_id: 2,
        key: '123123',
        email: 'asd2@asd.com',
        firstName: 'Janusz2',
        lastName: 'Lucinski2'
      }
    ]

    const document_signatures =
    [ 
      {
        id: 1,
        document: 1,
        signature: 1,
        date: new Date().toISOString(),
        invitation: {
          id: 1,
          resource_id: 1,
          key: '123123',
          email: 'asd@asd.com',
          firstName: 'Janusz',
          lastName: 'Lucinski'
        },
        signatory: {
          id: 1,
          username: 'ala'
        },
        positionX: 100,
        positionY: 200,
        width: 120,
        height: 180,
        ipAddress: 185.90,
        userAgent: 'asdasd'
      },
      {
        id: 2,
        document: 2,
        signature: 2,
        date: new Date().toISOString(),
        invitation: {
          id: 2,
          resource_id: 2,
          key: '123123',
          email: 'asd2@asd.com',
          firstName: 'Janusz2',
          lastName: 'Lucinski2'
        },
        signatory: {
          id: 2,
          username: 'bola'
        },
        positionX: 100,
        positionY: 200,
        width: 120,
        height: 180,
        ipAddress: 185.90,
        userAgent: 'asdasd'
      }
    ]

    require('@syncano/core').__setMocks({
      data: {
        document: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().resolves(document)
            })
          })
        },
        invitations: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().resolves(invitation),
              list: sinon.stub().onFirstCall().resolves(invitations) 
            })
          })
        },
        document_signature: {
          where: () => ({
            fields: () => ({
              with: () => ({
                list: sinon.stub().onFirstCall().resolves(document_signatures)
              })
            })
          })
        }
      }
    })
  
    const result = await run('info', {args})
    expect(result).toHaveProperty('code', 200)
    expect(result.data).toHaveProperty('invited', 2)
    expect(result.data).toHaveProperty('signed', 4)
    expect(result.data).toHaveProperty('signedByMe', true)
  })

  it('catch error', async () => {
    const args = {
      documentId: 1,
      key: "123123"
    }

    const document = {
      id: 1,
      name: "Asd",
      user: {
        id: 1,
        username: "Janusz"
      },
      created_at: new Date().toISOString(),
      file: 'https://doc.com',
      status: 'uploaded'
    }

    const invitation = {
      id: 1,
      resource_id: 1,
      key: '123123',
      email: 'asd@asd.com',
      firstName: 'Janusz',
      lastName: 'Lucinski'
    }

    const document_signature = {
      id: 1,
      document: 1,
      signature: 1,
      date: new Date().toISOString(),
      invitation: {
        id: 1,
        resource_id: 1,
        key: '123123',
        email: 'asd@asd.com',
        firstName: 'Janusz',
        lastName: 'Lucinski'
      },
      signatory: {
        id: 1,
        username: 'ala'
      },
      positionX: 100,
      positionY: 200,
      width: 120,
      height: 180,
      ipAddress: 185.90,
      userAgent: 'asdasd'
    }

    require('@syncano/core').__setMocks({
      data: {
        document: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().resolves(document)
            })
          })
        },
        invitations: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().onFirstCall().resolves(invitation),
              list: sinon.stub().onFirstCall().resolves(invitation) 
            })
          })
        },
        document_signature: {
          where: () => ({
            fields: () => ({
              with: () => ({
                list: sinon.stub().onFirstCall().resolves(document_signature)
              })
            })
          })
        }
      }
    })
  
    const result = await run('info', {args, meta: {user: {id: 1}}})
    expect(result).toHaveProperty('code', 400)
  })
})
