import {InviteForm} from './invite'

(InviteForm as any).displayName = 'InviteForm'

const DOCUMENT_ID = 1

export default {
  component: InviteForm,
  url: '/',
  wrap: true,
  props: {
    documentId: DOCUMENT_ID.toString(),
    form: {a: 'a'},
  },
}
