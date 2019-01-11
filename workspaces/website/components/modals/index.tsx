import {Modal} from '@shared/components/modal'
import {loadable} from '@shared/utils/loadable'
import * as React from 'react'

const Profile = loadable(() => import('./profile').then(res => res.Profile || res))
const DocumentUpload = loadable(() => import('./upload').then(res => res.DocumentUpload || res))
const Description = loadable(() => import('./description').then(res => res.Description || res))
const Login = loadable(() => import('./login').then(res => res.Login || res))
const Register = loadable(() => import('./register').then(res => res.Register || res))
const DeleteDocument = loadable(() => import('./delete-document').then(res => res.DeleteDocument || res))

export const Modals = () => (
  <React.Fragment>
    <Modal name="profile" title="My profile" component={Profile} />
    <Modal name="upload" title="ADD NEW DOCUMENT" component={DocumentUpload} />
    <Modal name="description" title="Edit description" component={Description} />
    <Modal name="login" component={Login} />
    <Modal name="register" component={Register} />
    <Modal name="deleteDocument" component={DeleteDocument} />
  </React.Fragment>
)
