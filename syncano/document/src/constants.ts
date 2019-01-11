export const MODELS = {
  user: ['id', 'firstName', 'lastName', 'username'],
  document: ['id', 'user.username as author', 'user.firstName as firstName', 'user.lastName as lastName',
   'name', 'created_at as createdAt', 'file', 'status', 'description'],
  invitations: ['id', 'resource_id', 'email', 'firstName', 'lastName', 'status'],
  signature: ['id', 'name', 'file', 'user', 'width', 'height', 'invitation'],
  documentSignature: ['id', 'document', 'signature', 'date', 'invitation', 'signatory',
  'positionX', 'positionY', 'width', 'height', 'ipAddress', 'userAgent'],
  documentVersion: ['id', 'document', 'file', 'status'],
}

export const STATUS_UPLOADED = 'uploaded'
export const STATUS_INVITED = 'invited'
export const STATUS_DECLINED = 'declined'
export const STATUS_SIGNED = 'signed'
export const STATUS_PROCESSING = 'processing'
export const STATUS_DONE = 'done'

export const INVITATION_FROM = 'DigitalSign <noreply@digitalsign.io>'
export const INVITATION_SUBJECT = 'You are invited to sign a document by '
export const INVITATION_DEFAULT_ROLE = 'signatory'
export const INVITATION_RESOURCE_TYPE = 'document'
export const INVITATION_STATUS = 'invited'
