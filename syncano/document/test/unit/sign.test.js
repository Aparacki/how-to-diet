/* global describe it */
import {run} from '@syncano/test'
import sinon from 'sinon'
import axios from 'axios'
import fs from 'fs'

describe('sign tests', function () {
  it('Unauthorized', async () => {
    const res = await run('sign' , )
    expect(res).toHaveProperty('code', 401)
    expect(res.data).toHaveProperty('message', 'Unauthorized.')
  })

  it('Misssing signatures', async () => {
    const res = await run('sign', {meta: {user: {}}})
    expect(res).toHaveProperty('code', 400)
    expect(res.data).toHaveProperty('message', 'Signatures required.')
  })

  it('Catch error', async () => {
    const signatures = [
      {
        key: '123',
        signatureId: 1,
        pageNumber: 0,
        positionX: 1,
        positionY: 1,
        height: 40,
        width: 40,
      }
    ]

    const res = await run('sign', {args: {signatures}, meta: {user: {}}})
    expect(res).toHaveProperty('code', 400)
  })

  it('Sign document', async () => {
    const PDF = fs.readFileSync('test/unit/assets/Test.pdf')
    const PNG = fs.readFileSync('test/unit/assets/abc.png')

    const user = {
      id: 1,
      username: 'ok@fail.com',
      firstName: 'Albert',
      lastName: 'Camus',
    }

    const signatures = [
      {
        key: '123',
        signatureId: 1,
        pageNumber: 0,
        positionX: 1,
        positionY: 1,
        height: 40,
        width: 40,
      }
    ]

    const invitation = {
      id: 1,
      resource_id: 1,
      email: 'ok@fail.com',
      firstName: 'Janko',
      lastName: 'Muzykant'
    }

    const document = {
      id: 1,
      username: 'ok@fail.com',
      name: 'AwesomeName',
      created_at: new Date().toISOString(),
      file: 'www.pdf.com',
      statis: 'uploaded',
    }

    const signature = {
      signature: 1,
      name: 'abc',
      file: 'www.png.com',
      user,
      width: '10px',
      height: '10px',
      invitation,
    }

    const documentVersion = {
      id: 1,
      file: 'www.pdf.com',
    }

    const documentSignature = {
      invitation,
      signatory: {
        username: invitation.username
      }
    }

    const ctx = {
      args: {
        signatures
      },
      meta: {
        request: {
          REMOTE_ADDR: 'ABC',
          HTTP_USER_AGENT: 'bookmac'
        },
        user,
      }
    }



    axios.request = sinon
      .stub()
      .onFirstCall()
      .resolves({data: PDF})
      .onSecondCall()
      .resolves({data: PNG})

    require('@syncano/core').__setMocks({
      data: {
        invitations: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().resolves(invitation),
              list: sinon.stub().resolves([invitation])
            })
          })
        },
        document: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().resolves(document)
            })
          }),
          update: sinon.stub().resolves({})
        },
        document_signature: {
          where: () => ({
            fields: () => ({
              with: () => ({
                list: sinon.stub().resolves([documentSignature])
              })
            })
          }),
          fields: () => ({
            create: sinon.stub().resolves(documentSignature)
          })
        },
        document_version: {
          where: () => ({
            fields: () => ({
              with: () => ({
                list: sinon.stub().resolves(documentVersion)
              }),
              orderBy: () => ({
                first: sinon.stub().resolves(documentVersion)
              }),
              create: sinon.stub().resolves(documentVersion)
            }),
          }),
          fields: () => ({
            create: sinon.stub().resolves(documentVersion)
          })
        },
        signature: {
          where: () => ({
            fields: () => ({
              first: sinon.stub().resolves(signature)
            })
          })
        }
      },
      users: {
        fields: () => ({
          first: sinon.stub().resolves(user)
        })
      },
      endpoint: {
        post: sinon.stub().resolves({})
      }
    })

    const res = await run('sign', ctx)
    expect(res).toHaveProperty('code', 200)
    expect(res.data).toHaveProperty('message', 'Success')
    expect(res.data).toHaveProperty('version')
    expect(res.data.version).toHaveProperty('id')
    expect(res.data.version).toHaveProperty('file')
  })
})
