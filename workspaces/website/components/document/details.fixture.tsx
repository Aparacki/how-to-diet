import {DocumentDetails} from './details'

(DocumentDetails as any).displayName = 'DocumentDetails'

const DOCUMENT_ID = 1

export default {
  component: DocumentDetails,
  url: '/',
  wrap: true,
  props: {
    documentId: DOCUMENT_ID.toString(),
  },
  xhr: [
    {
      url: new RegExp('/api/document/get'),
      method: 'post',
      response: (_req, res) =>
        res.status(200).body({
          id: DOCUMENT_ID,
          name: 'Document example',
          file: 'https://i.imgur.com/oSbcRF5.jpg',
        }),
    },
    {
      url: new RegExp('/api/document/unsigned-invitation-list'),
      method: 'post',
      response: (_req, res) =>
        res.status(200).body([
          {
            id: 3,
            details: {
              role: '',
              firstName: '',
              lastName: '',
            },
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            key: 'asdasd',
            resourceId: 1,
            resourceType: 'document',
            status: 'signed',
          },
        ]),
    },
    {
      url: new RegExp('/api/document/signature-list'),
      method: 'post',
      response: (_req, res) =>
        res.status(200).body([
          {
            id: 2,
            name: 'Primary Signature',
            file: 'https://i.imgur.com/oSbcRF5.jpg',
            user: 1,
            width: 100,
            height: 100,
            invitation: 3,
            date: new Date().toISOString(),
          },
        ]),
    },
  ],
}
