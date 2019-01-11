import {STATUS_INVITED, STATUS_SIGNED, STATUS_UPLOADED} from '@website/constants'
import {Badge} from 'antd'
import * as React from 'react'
import {Link} from './styled'

interface StatusProps {
  status: string,
 }

interface ActionsProps {
  isAuthor: boolean,
  status: string,
  file: string,
  id: number
}

export const Status: React.SFC<StatusProps> = ({status}) => (
  <span>
    <Badge status={
      status === STATUS_SIGNED ? 'success' : 'warning'
    }/>
    {status}
  </span>
)

export const Actions: React.SFC<ActionsProps> = ({status, id, isAuthor}) => (
  <React.Fragment>
    {status === STATUS_INVITED && (
      <Link to={`document/details/${id}`}>
        {isAuthor ? 'Edit' : 'Sign'}
      </Link>
    )}
    {status === STATUS_UPLOADED && (<Link to={`document/details/${id}`}>Invite to sign</Link>)}
    {status === STATUS_SIGNED && (<Link to={`document/details/${id}`}>See details</Link>)}
  </React.Fragment>
)
